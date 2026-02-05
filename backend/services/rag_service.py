import os
import io
import fitz  # PyMuPDF
import docx
import faiss
import numpy as np
import json
import hashlib
import shutil
from sentence_splitter import SentenceSplitter
from sentence_transformers import SentenceTransformer, CrossEncoder
from pdf2image import convert_from_path
from PIL import Image
import pytesseract
from dotenv import load_dotenv
from google.generativeai import configure, GenerativeModel

load_dotenv()

# --- Configuration ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if GOOGLE_API_KEY:
    configure(api_key=GOOGLE_API_KEY)
else:
    print("WARNING: GOOGLE_API_KEY not found. Summarization will fail.")

# --- File Paths ---
INDEX_FILE = "resume_index.faiss"
METADATA_FILE = "resume_metadata.json"
UPLOAD_DIR = "resumes"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# --- Models ---
# Note: Loading these might take time on first run
try:
    print("Loading Embedding Model (E5-Base)...")
    embed_model = SentenceTransformer("intfloat/e5-base-v2")
    print("Loading Reranker...")
    reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
except Exception as e:
    print(f"ERROR loading models: {e}")
    embed_model = None
    reranker = None

# --- Helpers ---
def load_txt(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        return f.read()

def load_pdf(file_path):
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        
        # OCR Fallback
        if len(text.strip()) < 50:
            try:
                images = convert_from_path(file_path, dpi=200)
                ocr_text = ""
                for img in images:
                    ocr_text += pytesseract.image_to_string(img)
                text += "\n" + ocr_text
            except Exception:
                print("Tesseract not found or failed for OCR.")
        return text
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

def load_docx(file_path):
    try:
        doc = docx.Document(file_path)
        text = "\n".join([p.text for p in doc.paragraphs])
        return text
    except Exception as e:
        return ""

def parse_document(file_path):
    ext = os.path.splitext(file_path)[-1].lower()
    if ext == ".pdf": return load_pdf(file_path)
    elif ext == ".txt": return load_txt(file_path)
    elif ext == ".docx": return load_docx(file_path)
    return ""

def smart_chunk_text(text, max_words=150):
    splitter = SentenceSplitter(language="en")
    sentences = splitter.split(text)
    chunks = []
    current_chunk = ""
    current_words = 0

    for sent in sentences:
        sent_words = len(sent.split())
        if current_words + sent_words <= max_words:
            current_chunk += " " + sent
            current_words += sent_words
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sent
            current_words = sent_words

    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

# --- RAG Class ---
class RagService:
    def __init__(self):
        self.index = None
        self.chunks_metadata = []
        self._load_index()

    def _load_index(self):
        if os.path.exists(INDEX_FILE) and embed_model:
            self.index = faiss.read_index(INDEX_FILE)
            with open(METADATA_FILE, "r") as f:
                self.chunks_metadata = json.load(f)
            print("RAG: Loaded existing FAISS index.")
        else:
            if embed_model:
                self.index = faiss.IndexFlatL2(768)
            else:
                self.index = None
            self.chunks_metadata = []
            print("RAG: Created new index or model missing.")

    def _save_index(self):
        if self.index and embed_model:
            faiss.write_index(self.index, INDEX_FILE)
            with open(METADATA_FILE, "w") as f:
                json.dump(self.chunks_metadata, f)

    def add_resume(self, file_path, user_id, user_name):
        if not embed_model: return False
        
        text = parse_document(file_path)
        if not text: return False

        chunks = smart_chunk_text(text)
        if not chunks: return False

        formatted_chunks = ["passage: " + chunk for chunk in chunks]
        embeddings = embed_model.encode(formatted_chunks, convert_to_numpy=True)

        start_idx = len(self.chunks_metadata)
        for chunk in chunks:
            self.chunks_metadata.append({
                "text": chunk,
                "user_id": user_id,
                "name": user_name
            })

        self.index.add(embeddings)
        self._save_index()
        return True

    def search_and_summarize(self, query):
        if not self.index or self.index.ntotal == 0:
            return "No resumes indexed yet. Please upload resumes first."

        formatted_query = "query: " + query
        query_vec = embed_model.encode([formatted_query], convert_to_numpy=True)
        
        D, I = self.index.search(np.array(query_vec), k=20)
        candidate_chunks = []

        for idx in I[0]:
            if idx < len(self.chunks_metadata):
                candidate_chunks.append(self.chunks_metadata[idx]["text"])

        if not candidate_chunks: return "No relevant chunks found."

        # Rerank
        pairs = [[query, chunk] for chunk in candidate_chunks]
        scores = reranker.predict(pairs)
        ranked = sorted(zip(candidate_chunks, scores), key=lambda x: x[1], reverse=True)
        top_chunks = [chunk for chunk, _ in ranked[:5]]

        # Summarize
        context = "\n\n".join([f"- {c}" for c in top_chunks])
        
        if not GOOGLE_API_KEY:
            return "Top 5 chunks retrieved (Summary unavailable without API Key)."

        prompt = f"""
        You are a helpful assistant for a recruiter. 
        Based on the resume snippets below, provide a concise summary of the top 5 candidates suitable for this query: "{query}".
        Format: 
        1. [Name/ID] - [Key Skill 1], [Key Skill 2] - [Summary]
        Resume Snippets:
        {context}
        """

        try:
            model = GenerativeModel("gemini-flash-latest")
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            return f"Summary generation failed: {str(e)}"

rag_service = RagService()