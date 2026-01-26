from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from datetime import datetime
from db import supabase

router = APIRouter()

class InterviewCreate(BaseModel):
    application_id: int
    scheduled_at: str # ISO datetime string
    interview_type: str
    recruiter_notes: str

class FeedbackUpdate(BaseModel):
    rating: int
    text: str

# 1. Schedule Interview
@router.post("/interviews")
def schedule_interview(data: InterviewCreate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authorized")
    
    # Verify application exists
    check = supabase.table("applications").select("*").eq("id", data.application_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Application not found")

    supabase.table("interviews").insert({
        "application_id": data.application_id,
        "scheduled_at": data.scheduled_at,
        "interview_type": data.interview_type,
        "recruiter_notes": data.recruiter_notes,
        "feedback_rating": None, # No rating yet
        "feedback_text": None
    }).execute()

    return {"message": "Interview scheduled successfully"}

# 2. Submit Feedback & Rating
@router.put("/interviews/{app_id}/feedback")
def update_feedback(app_id: int, data: FeedbackUpdate):
    # Find interview linked to this application
    res = supabase.table("interviews").select("*").eq("application_id", app_id).execute()
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Interview not found")

    supabase.table("interviews").update({
        "feedback_rating": data.rating,
        "feedback_text": data.text
    }).eq("id", res.data[0]["id"]).execute()

    return {"message": "Feedback saved"}

@router.get("/interviews")
def get_interviews():
    # Nested select: Get interview + related application data (candidate_name, job_title)
    response = supabase.table("interviews").select("*, applications(candidate_name, job_title)").execute()
    
    # Sort by date
    return sorted(response.data, key=lambda x: x["scheduled_at"], reverse=False)
