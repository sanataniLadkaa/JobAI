from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from db import supabase
from datetime import datetime, timedelta, timezone

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

@router.post("/ai-search")
def search_candidates(query: str):
    # 1. Fetch all candidates from Supabase
    response = supabase.table("users").select("*").eq("role", "candidate").execute()
    candidates = response.data
    
    # 2. Python-side Semantic Search Logic (RAG Simulation)
    # We do the scoring in Python, Supabase just delivers the raw data
    keywords = [k.lower() for k in query.split()]
    target_exp = 0
    for k in keywords:
        if k.isdigit():
            target_exp = int(k)

    results = []
    for c in candidates:
        score = 0
        # Ensure skills exist and is a list
        c_skills = c.get("skills", [])
        if isinstance(c_skills, str): c_skills = [] # Handle edge case
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
        
        # Random Semantic Factor (Mocking AI nuance)
        score += hash(c["name"]) % 10 

        results.append(CandidateResponse(
            id=c["id"],
            name=c["name"],
            skills=c_skills,
            experience_years=c.get("experience_years", 0),
            match_score=min(score, 99),
            matches_found=matches
        ))
    
    return sorted(results, key=lambda x: x.match_score, reverse=True)

# --- Voice Call Scheduling Endpoint ---

@router.post("/schedule-call")
def schedule_call(req: CallRequest):
    # 1. Verify Candidate Exists
    cand_res = supabase.table("users").select("*").eq("id", req.candidate_id).execute()
    candidate = cand_res.data[0] if cand_res.data else None
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # 2. Business Logic: Time & Retry Rules
    now = datetime.now(timezone.utc)
    
    # Initial Schedule (Immediate for demo)
    schedule_time = now + timedelta(minutes=5) 
    
    # MOCK: Simulating a "Missed Call" scenario to demonstrate the rules
    is_missed_scenario = True 

    if is_missed_scenario:
        # Rule: Retry after 4 hours
        retry_time = now + timedelta(hours=4)
        
        # Rule: If retry time >= 7 PM (19:00), schedule next day 10 AM
        if retry_time.hour >= 19 or retry_time.hour < 6: 
            next_day = retry_time + timedelta(days=1)
            schedule_time = next_day.replace(hour=10, minute=0, second=0, microsecond=0)
            status = "Rescheduled (Next Day)"
        else:
            schedule_time = retry_time
            status = "Rescheduled (4 Hours Later)"
    else:
        status = "Initiated"

    # 3. Save to Supabase `call_logs` table
    supabase.table("call_logs").insert({
        "recruiter_id": 1, # Mocked Recruiter ID (get from token in real app)
        "candidate_id": req.candidate_id,
        "status": status,
        "scheduled_time": schedule_time.isoformat(),
        "retry_count": 1 if is_missed_scenario else 0
    }).execute()
        
    return CallResponse(
        message=f"Call {status}",
        scheduled_time=schedule_time,
        status=status
    )