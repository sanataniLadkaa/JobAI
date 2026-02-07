from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import List
from db import supabase
from schemas import UserLogin

router = APIRouter()

# Add this Pydantic model near UserLogin
class UserSignup(BaseModel):
    name: str
    email: str
    password: str
    role: str # "recruiter" or "candidate"

@router.post("/signup")
def signup(data: UserSignup):
    db = supabase.table("users").select("*").eq("email", data.email.strip().lower()).execute()
    
    if db.data:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create new user dictionary
    new_user = {
        "name": data.name,
        "email": data.email.strip().lower(),
        "password": data.password,
        "role": data.role,
        "skills": [],
        "experience_years": 0
    }

    # CRITICAL FIX: Remove 'id' if it exists, to let DB auto-generate it
    # This prevents the "duplicate key value violates unique constraint users_pkey" error
    new_user.pop('id', None) 
    
    # Insert into Supabase
    insert_res = supabase.table("users").insert(new_user).execute()
    user = insert_res.data[0]
    
    # Auto-Login: Create Session
    token = f"token_dev_{hash(data.email)}"
    supabase.table("sessions").upsert({
        "user_id": user["id"],
        "device_id": "signup_device", 
        "token": token,
        "last_active": "now()"
    }, on_conflict="token").execute()
    
    # Remove password before returning
    user_response = {k: v for k, v in user.items() if k != "password"}
    
    return {"access_token": token, "token_type": "bearer", "user": user_response}

# 1. Login Endpoint (PERMANENT FIX)
@router.post("/login")
def login(credentials: UserLogin):
    # 1. Find User
    response = supabase.table("users").select("*").eq("email", credentials.email.strip().lower()).execute()
    user = response.data[0] if response.data else None
    
    if not user or credentials.password != user["password"]:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    # 2. Define Token
    token = f"token_{credentials.device_id}"
    
    # 3. Check Device Limit (Max 3) Before Upsert
    sess_response = supabase.table("sessions").select("*").eq("user_id", user["id"]).execute()
    all_sessions = sess_response.data
    
    if len(all_sessions) >= 3:
        # Sort by last_active (oldest first)
        all_sessions.sort(key=lambda x: x.get("last_active", ""))
        oldest = all_sessions[0]
        supabase.table("sessions").delete().eq("id", oldest["id"]).execute()
    
    # 4. Upsert (Insert OR Update)
    # This automatically handles if the token already exists (fixes your error permanently)
    supabase.table("sessions").upsert({
        "user_id": user["id"],
        "device_id": credentials.device_id,
        "token": token,
        "last_active": "now()" # Supabase standard 'now'
    }, on_conflict="token").execute() # If token exists, just update last_active
    
    # Remove password before returning
    user_response = {k: v for k, v in user.items() if k != "password"}
    
    return {"access_token": token, "token_type": "bearer", "user": user_response}

# 2. Get Current User Endpoint
@router.get("/me")
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    sess_response = supabase.table("sessions").select("*").eq("token", token).execute()
    session = sess_response.data[0] if sess_response.data else None
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_response = supabase.table("users").select("*").eq("id", session["user_id"]).execute()
    user = user_response.data[0] if user_response.data else None
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_clean = {k: v for k, v in user.items() if k != "password"}
    return user_clean

# 3. Update Profile Endpoint
class UserUpdate(BaseModel):
    name: str
    skills: List[str]
    experience_years: int

@router.put("/profile")
def update_profile(data: UserUpdate, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    sess_response = supabase.table("sessions").select("*").eq("token", token).execute()
    session = sess_response.data[0] if sess_response.data else None
    
    if not session:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Update User in Supabase
    supabase.table("users").update({
        "name": data.name,
        "skills": data.skills,
        "experience_years": data.experience_years
    }).eq("id", session["user_id"]).execute()
    
    return {"message": "Profile updated"}