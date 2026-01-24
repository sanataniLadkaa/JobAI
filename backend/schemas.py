from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    email: str
    name: str
    role: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str
    device_id: str

class User(UserBase):
    id: int # <--- ID is included here
    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    company: str
    description: str
    required_skills: List[str]

class Job(JobBase):
    id: int
    recruiter_id: int
    class Config:
        from_attributes = True

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