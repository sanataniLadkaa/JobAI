from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from db import load_db, save_db, get_next_id
from schemas import JobCreate, JobUpdate

router = APIRouter()

# 1. Get All Jobs
@router.get("/jobs")
def get_jobs():
    db = load_db()
    return db["jobs"]

# 2. Create New Job
@router.post("/jobs")
def create_job(job_data: JobCreate):
    db = load_db()
    
    # Create new job object
    new_job = {
        "id": get_next_id(db["jobs"]),
        "title": job_data.title,
        "company": job_data.company,
        "description": job_data.description,
        "required_skills": job_data.required_skills,
        "recruiter_id": 1 # Mocked Recruiter ID (from token in real app)
    }
    
    db["jobs"].append(new_job)
    save_db(db)
    return new_job

# 3. Update Job
@router.put("/jobs/{job_id}")
def update_job(job_id: int, job_data: JobUpdate):
    db = load_db()
    
    # Find the job
    job = next((j for j in db["jobs"] if j["id"] == job_id), None)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Update fields
    job["title"] = job_data.title
    job["company"] = job_data.company
    job["description"] = job_data.description
    job["required_skills"] = job_data.required_skills
    
    save_db(db)
    return job

# 4. Delete Job
@router.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    db = load_db()
    
    # Find and remove
    job_index = next((i for i, j in enumerate(db["jobs"]) if j["id"] == job_id), None)
    if job_index is None:
        raise HTTPException(status_code=404, detail="Job not found")
        
    del db["jobs"][job_index]
    save_db(db)
    return {"message": "Job deleted successfully"}