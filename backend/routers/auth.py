from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from db import load_db
from schemas import UserLogin
from services import DeviceAuthService
from typing import List
router = APIRouter()

# 1. Login Endpoint (Shared by Recruiter & Candidate)
@router.post("/login")
def login(credentials: UserLogin):
    input_email = credentials.email.strip().lower().rstrip("`").rstrip("'")
    
    db = load_db()
    
    user = next(
        (u for u in db["users"] if u["email"].strip().lower() == input_email), 
        None
    )
    
    if not user or credentials.password != user["password"]:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    token = DeviceAuthService.handle_device_limit(user["id"], credentials.device_id)
    
    user_response = {k: v for k, v in user.items() if k != "password"}
    
    return {"access_token": token, "token_type": "bearer", "user": user_response}

# 2. Get Current User Endpoint (For Refresh)
@router.get("/me")
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    db = load_db()
    
    session = next((s for s in db["sessions"] if s["token"] == token), None)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = next((u for u in db["users"] if u["id"] == session["user_id"]), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_response = {k: v for k, v in user.items() if k != "password"}
    return user_response


class UserUpdate(BaseModel):
    name: str
    skills: List[str] # Expects array like ["React", "Node"]
    experience_years: int

@router.put("/profile")
def update_profile(data: UserUpdate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    db = load_db()
    
    # 1. Validate Token
    session = next((s for s in db["sessions"] if s["token"] == token), None)
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # 2. Find User
    user_index = next((i for i, u in enumerate(db["users"]) if u["id"] == session["user_id"]), None)
    if user_index is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # 3. Update Data
    db["users"][user_index]["name"] = data.name
    db["users"][user_index]["skills"] = data.skills
    db["users"][user_index]["experience_years"] = data.experience_years
    
    # 4. Save
    save_db(db)
    
    # 5. Return Updated User (without password)
    user_response = {k: v for k, v in db["users"][user_index].items() if k != "password"}
    return {"message": "Profile updated", "user": user_response}