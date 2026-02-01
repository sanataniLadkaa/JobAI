from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from db import supabase

router = APIRouter()

# --- SCHEMAS ---
class SalaryRequest(BaseModel):
    role: str
    experience: int # Years
    skills: List[str]
    location_type: str # "Remote", "Tier-1", "Tier-2", "Tier-3"

class ExpectationUpdate(BaseModel):
    expected_salary: float

# --- RULE ENGINE DATA ---

BASE_SALARIES = {
    "Software Engineer": 600000,
    "Backend Engineer": 700000,
    "Frontend Engineer": 650000,
    "Full Stack Developer": 650000,
    "Data Scientist": 800000,
    "ML Engineer": 900000,
    "DevOps Engineer": 750000,
    "Product Manager": 900000,
    "UI/UX Designer": 550000
}

EXP_MULTIPLIERS = {
    (0, 1): 0.7,
    (1, 3): 1.0,
    (3, 5): 1.3,
    (5, 8): 1.6,
    (8, 100): 2.0 # Cap at 8+ years
}

SKILL_BONUSES = {
    "React": 0.05, "Node": 0.05,
    "Python": 0.07, "Django": 0.07, "FastAPI": 0.07, "Flask": 0.07,
    "AWS": 0.10, "GCP": 0.10, "Azure": 0.10,
    "ML": 0.15, "AI": 0.15, "LLM": 0.15,
    "DevOps": 0.12, "Kubernetes": 0.12, "Docker": 0.12,
    "Java": 0.05, "Spring": 0.05,
    "C++": 0.08, "Go": 0.08
}

LOCATION_FACTORS = {
    "Remote": 1.0,
    "Tier-1": 1.15,  # High cost of living
    "Tier-2": 1.0,   # Standard
    "Tier-3": 0.85   # Lower cost of living
}

@router.post("/estimate")
def estimate_salary(req: SalaryRequest):
    reasoning = []
    confidence_score = 0 # 0=Low, 1=Med, 2=High

    # 1. Base Salary
    role_key = req.role.strip()
    # Fuzzy match for role (contains check)
    base_salary = next((v for k, v in BASE_SALARIES.items() if k.lower() in role_key.lower()), 600000)
    
    if base_salary == 600000 and "Software Engineer" not in role_key:
        reasoning.append("Used generic base salary for generic role.")
    else:
        reasoning.append(f"Base salary for {req.role}: ₹{base_salary/100000:.1f}L")
        if base_salary > 700000: confidence_score += 1

    # 2. Experience Multiplier
    exp = req.experience
    if exp < 0: exp = 0
    
    mult = 0.7
    for (min_y, max_y), factor in EXP_MULTIPLIERS.items():
        if min_y <= exp <= max_y:
            mult = factor
            break
            
    current_salary = base_salary * mult
    
    reasoning.append(f"Experience {exp} years: x{mult} multiplier applied.")
    if exp >= 5: confidence_score += 1
    elif exp < 2: confidence_score = 0 # Low confidence for 0-1 yrs

    # 3. Skill Bonuses
    bonus_pct = 0.0
    matched_skills = []
    for skill in req.skills:
        for skill_key, bonus in SKILL_BONUSES.items():
            if skill_key.lower() in skill.lower():
                bonus_pct += bonus
                matched_skills.append(skill)
    
    # Cap at 30%
    bonus_pct = min(bonus_pct, 0.3)
    bonus_amount = current_salary * bonus_pct
    current_salary += bonus_amount

    if matched_skills:
        reasoning.append(f"High-demand skills: {', '.join(set(matched_skills))} (+{int(bonus_pct*100)}%)")
        if bonus_pct >= 0.15: confidence_score += 1

    # 4. Location Adjustment
    loc_factor = LOCATION_FACTORS.get(req.location_type, 1.0)
    current_salary = current_salary * loc_factor
    reasoning.append(f"Location factor: {req.location_type} (x{loc_factor})")

    # Final Calculations
    min_salary = current_salary * 0.9
    max_salary = current_salary * 1.15

    # Determine Confidence Label
    if confidence_score >= 2: conf_label = "High"
    elif confidence_score == 1: conf_label = "Medium"
    else: conf_label = "Low"

    return {
        "suggested_range": f"₹{min_salary/100000:.1f}L – ₹{max_salary/100000:.1f}L",
        "confidence": conf_label,
        "reasoning": reasoning,
        "estimated_mid": current_salary
    }

# Save Candidate's Expectation
@router.put("/candidate/expectation")
def save_expectation(data: ExpectationUpdate, authorization: str = Header(None)):
    if not authorization: raise HTTPException(401, "Not authorized")
    
    token = authorization.replace("Bearer ", "")
    sess_res = supabase.table("sessions").select("*").eq("token", token).execute()
    session = sess_res.data[0] if sess_res.data else None
    
    if not session: raise HTTPException(401, "Invalid token")

    # Update user
    supabase.table("users").update({
        "expected_salary": data.expected_salary
    }).eq("id", session["user_id"]).execute()
    
    return {"message": "Expectation saved"}