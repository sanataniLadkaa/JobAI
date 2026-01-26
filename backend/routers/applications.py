from fastapi import APIRouter, HTTPException, Header,Query
from pydantic import BaseModel
from db import supabase
from datetime import datetime

router = APIRouter()

class ApplicationCreate(BaseModel):
    candidate_id: int
    candidate_name: str
    job_id: int
    job_title: str

# 1. Apply for a Job
@router.post("/apply")
def apply_job(data: ApplicationCreate):
    # Check if already applied
    response = supabase.table("applications").select("*").eq("candidate_id", data.candidate_id).eq("job_id", data.job_id).execute()
    if response.data:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    supabase.table("applications").insert({
        "candidate_id": data.candidate_id,
        "candidate_name": data.candidate_name,
        "job_id": data.job_id,
        "job_title": data.job_title,
        "status": "Pending",
        "applied_at": datetime.utcnow().isoformat()
    }).execute()
    
    return {"message": "Application submitted successfully"}

# 2. Get All Applications (Recruiter)
@router.get("/applications")
def get_applications():
    response = supabase.table("applications").select("*").execute()
    return sorted(response.data, key=lambda x: x["applied_at"], reverse=True)

# 3. Update Application Status (Recruiter)
class StatusUpdate(BaseModel):
    status: str

# Replace get_applications function
@router.get("/applications")
def get_applications(status: str = Query(None)): # <--- NEW: Filter by status
    db = supabase.table("applications").select("*, users!inner(name, skills)").execute() # Join with users to get skills
    
    # Filter logic in Python (easier for simple MVP)
    apps = db.data
    
    if status:
        apps = [a for a in apps if a.get("status") == status]
    else:
        # If no status, return only Shortlisted for this specific page? 
        # No, let's default to Shortlisted for the new page
        apps = [a for a in apps if a.get("status") == "Shortlisted"]
        
    return sorted(apps, key=lambda x: x["applied_at"], reverse=True)

# 4. Get My Applications (Candidate)
@router.get("/applications/mine")
def get_my_applications(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    sess_response = supabase.table("sessions").select("*").eq("token", token).execute()
    session = sess_response.data[0] if sess_response.data else None
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = session["user_id"]
    
    response = supabase.table("applications").select("*").eq("candidate_id", user_id).execute()
    return sorted(response.data, key=lambda x: x["applied_at"], reverse=True)