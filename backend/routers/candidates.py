from fastapi import APIRouter, HTTPException,Header, File, UploadFile
from pydantic import BaseModel
from typing import List
from db import supabase
from datetime import datetime, timedelta, timezone
from services.rag_service import rag_service

router = APIRouter()

# --- Schemas ---

class CandidateResponse(BaseModel):
    id: int
    name: str
    skills: List[str]
    experience_years: int
    match_score: float
    matches_found: List[str]

class CallRequest(BaseModel):
    candidate_id: int

class CallResponse(BaseModel):
    message: str
    scheduled_time: datetime
    status: str

# --- AI Search Endpoint ---
from fastapi import APIRouter, Header, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
from db import supabase
from datetime import datetime, timedelta, timezone
import shutil
import os
from services.rag_service import rag_service

router = APIRouter()

# --- AI Search Endpoint ---

@router.post("/ai-search")
def search_candidates(query: str):
    # Fetch all candidates from Supabase
    response = supabase.table("users").select("*").eq("role", "candidate").execute()
    candidates = response.data
    
    # Python-side Semantic Search Logic (RAG Simulation)
    keywords = [k.lower() for k in query.split()]
    target_exp = 0
    for k in keywords:
        if k.isdigit():
            target_exp = int(k)

    results = []
    for c in candidates:
        score = 0
        c_skills = c.get("skills", [])
        if isinstance(c_skills, str): c_skills = [] 
        matches = []

        # Skill Matching
        for skill in c_skills:
            for kw in keywords:
                if kw in skill.lower():
                    score += 20
                    if skill not in matches: matches.append(skill)
        
        # Experience Matching
        if target_exp > 0 and c.get("experience_years", 0) >= target_exp:
            score += 15
        
        # Random Semantic Factor
        score += hash(c["name"]) % 10 

        results.append({
            "id": c["id"],
            "name": c["name"],
            "skills": c_skills,
            "experience_years": c.get("experience_years", 0),
            "match_score": min(score, 99),
            "matches_found": matches
        })
    
    return sorted(results, key=lambda x: x["match_score"], reverse=True)

# --- Voice Call Scheduling Endpoint ---

@router.post("/schedule-call")
def schedule_call(req: dict):
    candidate_id = req.get("candidate_id")
    cand_res = supabase.table("users").select("*").eq("id", candidate_id).execute()
    candidate = cand_res.data[0] if cand_res.data else None
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Business Logic: Time & Retry Rules
    now = datetime.now(timezone.utc)
    schedule_time = now + timedelta(minutes=5) 
    
    # MOCK: Simulating a "Missed Call" scenario
    is_missed_scenario = True 

    if is_missed_scenario:
        retry_time = now + timedelta(hours=4)
        if retry_time.hour >= 19 or retry_time.hour < 6: 
            next_day = retry_time + timedelta(days=1)
            schedule_time = next_day.replace(hour=10, minute=0, second=0, microsecond=0)
            status = "Rescheduled (Next Day)"
        else:
            schedule_time = retry_time
            status = "Rescheduled (4 Hours Later)"
    else:
        status = "Initiated"

    # Save to Supabase
    supabase.table("call_logs").insert({
        "recruiter_id": 1,
        "candidate_id": req.get("candidate_id"),
        "status": status,
        "scheduled_time": schedule_time.isoformat(),
        "retry_count": 1 if is_missed_scenario else 0
    }).execute()
        
    return {
        "message": f"Call {status}",
        "scheduled_time": schedule_time,
        "status": status
    }

# --- Upload Resume Endpoint (NEW) ---

@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), authorization: str = Header(None)):
    if not authorization: raise HTTPException(401, "Not authorized")
    
    # Verify User
    token = authorization.replace("Bearer ", "")
    sess_res = supabase.table("sessions").select("*").eq("token", token).execute()
    session = sess_res.data[0] if sess_res.data else None
    if not session: raise HTTPException(401, "Invalid token")

    # Get User Info
    user_res = supabase.table("users").select("*").eq("id", session["user_id"]).execute()
    user = user_res.data[0]

    # Define Save Path
    safe_filename = f"{session['user_id']}_{file.filename}"
    file_location = os.path.join("resumes", safe_filename)
    
    # Save File
    try:
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Process with RAG
        success = rag_service.add_resume(file_location, user["id"], user["name"])

        if success:
            # Update DB
            supabase.table("users").update({"resume_path": file_location}).eq("id", user["id"]).execute()
            return {"message": "Resume uploaded and indexed successfully"}
        else:
            return {"message": "Resume uploaded but indexing failed (empty or unsupported format)"}
            
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail="Upload failed")

# --- RAG Search Endpoint (NEW) ---

@router.post("/rag-search")
def rag_search(query: str):
    summary = rag_service.search_and_summarize(query)
    return {"summary": summary}