from fastapi import APIRouter, HTTPException, Header
from db import load_db, save_db, get_next_id
from pydantic import BaseModel
from datetime import datetime
from typing import List
router = APIRouter()

# --- Pydantic Models ---

class ApplicationCreate(BaseModel):
    candidate_id: int
    candidate_name: str
    job_id: int
    job_title: str

class StatusUpdate(BaseModel):
    status: str

# --- Endpoints ---

# 1. Apply for a Job (Candidate)
@router.post("/apply")
def apply_job(data: ApplicationCreate):
    db = load_db()
    
    # Check if already applied
    existing = next((a for a in db["applications"] if a["candidate_id"] == data.candidate_id and a["job_id"] == data.job_id), None)
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this job")
    
    new_app = {
        "id": get_next_id(db["applications"]),
        "candidate_id": data.candidate_id,
        "candidate_name": data.candidate_name,
        "job_id": data.job_id,
        "job_title": data.job_title,
        "status": "Pending",
        "applied_at": datetime.utcnow().isoformat()
    }
    
    db["applications"].append(new_app)
    save_db(db)
    return {"message": "Application submitted successfully"}

# 2. Get All Applications (Recruiter)
@router.get("/applications")
def get_applications():
    db = load_db()
    # Sort by newest first
    return sorted(db["applications"], key=lambda x: x["applied_at"], reverse=True)

# 3. Update Application Status (Recruiter)
@router.put("/applications/{app_id}/status")
def update_status(app_id: int, data: StatusUpdate):
    db = load_db()
    
    # Find application
    app_index = next((i for i, a in enumerate(db["applications"]) if a["id"] == app_id), None)
    if app_index is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update status
    db["applications"][app_index]["status"] = data.status
    
    # Save to file (CRITICAL STEP)
    save_db(db)
    
    return {"message": "Status updated successfully"}

# 4. Get My Applications (Candidate)
@router.get("/applications/mine")
def get_my_applications(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    db = load_db()
    
    # Find user from token
    session = next((s for s in db["sessions"] if s["token"] == token), None)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = session["user_id"]
    
    # Filter applications for this user
    my_apps = [a for a in db["applications"] if a["candidate_id"] == user_id]
    # Sort by newest
    return sorted(my_apps, key=lambda x: x["applied_at"], reverse=True)