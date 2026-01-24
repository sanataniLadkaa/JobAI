from fastapi import APIRouter, HTTPException
from db import load_db
from schemas import CallRequest, CallResponse
from services import VoiceService, AIService

router = APIRouter()

@router.post("/ai-search")
def search_candidates(query: str):
    # In real app, add token verification here
    return AIService.semantic_search(query)

@router.post("/schedule-call", response_model=CallResponse)
def schedule_call(req: CallRequest):
    # Mock Recruiter ID from token (hardcoded 1 for demo)
    recruiter_id = 1 
    
    result = VoiceService.schedule_call(recruiter_id, req.candidate_id)
    if not result:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    return result