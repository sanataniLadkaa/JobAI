from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from db import supabase

router = APIRouter()

class JobCreate(BaseModel):
    title: str
    company: str
    description: str
    required_skills: List[str]

class JobUpdate(BaseModel):
    title: str
    company: str
    description: str
    required_skills: List[str]

# 1. Get All Jobs
@router.get("/jobs")
def get_jobs():
    response = supabase.table("jobs").select("*").execute()
    return response.data

# 2. Create New Job
@router.post("/jobs")
def create_job(job_data: JobCreate):
    # Note: You would pass user_id from auth token here in real app
    response = supabase.table("jobs").insert({
        "title": job_data.title,
        "company": job_data.company,
        "description": job_data.description,
        "required_skills": job_data.required_skills,
        "recruiter_id": 1 # Mocked ID
    }).execute()
    return response.data[0]

# 3. Update Job
@router.put("/jobs/{job_id}")
def update_job(job_id: int, job_data: JobUpdate):
    check = supabase.table("jobs").select("*").eq("id", job_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    supabase.table("jobs").update({
        "title": job_data.title,
        "company": job_data.company,
        "description": job_data.description,
        "required_skills": job_data.required_skills
    }).eq("id", job_id).execute()
    
    return {"message": "Job updated"}

# 4. Delete Job
@router.delete("/jobs/{job_id}")
def delete_job(job_id: int):
    check = supabase.table("jobs").select("*").eq("id", job_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Job not found")
        
    supabase.table("jobs").delete().eq("id", job_id).execute()
    return {"message": "Job deleted successfully"}