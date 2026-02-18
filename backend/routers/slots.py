from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from datetime import datetime, timedelta
from db import supabase

router = APIRouter()

# ------------------ MODELS ------------------

class SlotCreate(BaseModel):
    job_id: int
    start_time: str
    duration_minutes: int

class SlotBook(BaseModel):
    id: int

class SlotUpdate(BaseModel):
    status: str  # completed | cancelled


# ------------------ HELPERS ------------------

def get_session_user(authorization: str):
    if not authorization:
        raise HTTPException(401, "Not authorized")

    token = authorization.replace("Bearer ", "")
    res = supabase.table("sessions").select("*").eq("token", token).execute()
    if not res.data:
        raise HTTPException(401, "Invalid token")

    return res.data[0]  # must contain user_auth_id (UUID)


# ------------------ ROUTES ------------------

# 1️⃣ Create Slot (Recruiter)
@router.post("/slots")
def create_slot(data: SlotCreate, authorization: str = Header(None)):
    session = get_session_user(authorization)

    start_dt = datetime.fromisoformat(data.start_time)
    end_dt = start_dt + timedelta(minutes=data.duration_minutes)

    try:
        supabase.table("interview_slots").insert({
            "recruiter_auth_id": session["user_auth_id"],
            "job_id": data.job_id,
            "start_time": start_dt.isoformat(),
            "end_time": end_dt.isoformat(),
            "status": "available"
        }).execute()

        return {"message": "Slot created successfully"}

    except Exception as e:
        if "overlaps" in str(e):
            raise HTTPException(400, "Time slot overlaps with an existing slot")
        raise HTTPException(500, str(e))


# 2️⃣ Get Available Slots (Candidate)
@router.get("/slots/available")
def get_available_slots(authorization: str = Header(None)):
    get_session_user(authorization)

    res = supabase.table("interview_slots").select(
        "id, start_time, end_time, status, jobs(title)"
    ).eq("status", "available").execute()

    return res.data


# 3️⃣ Book Slot (Candidate)
@router.put("/slots/book")
def book_slot(data: SlotBook, authorization: str = Header(None)):
    session = get_session_user(authorization)

    update = supabase.table("interview_slots").update({
        "status": "booked",
        "candidate_auth_id": session["user_auth_id"],
        "booked_at": datetime.utcnow().isoformat()
    }).eq("id", data.id).eq("status", "available").execute()

    if not update.data:
        raise HTTPException(400, "Slot not available")

    return {"message": "Interview scheduled successfully"}


# 4️⃣ Update Slot Status (Recruiter)
@router.put("/slots/{slot_id}/status")
def update_slot_status(slot_id: int, data: SlotUpdate, authorization: str = Header(None)):
    session = get_session_user(authorization)

    slot = supabase.table("interview_slots").select("*") \
        .eq("id", slot_id) \
        .eq("recruiter_auth_id", session["user_auth_id"]) \
        .execute()

    if not slot.data:
        raise HTTPException(403, "Not authorized")

    update_data = {"status": data.status}

    if data.status == "cancelled":
        update_data["candidate_auth_id"] = None
        update_data["booked_at"] = None

    supabase.table("interview_slots").update(update_data).eq("id", slot_id).execute()

    return {"message": f"Slot marked as {data.status}"}


# 5️⃣ Get My Slots (Recruiter)
@router.get("/slots/my")
def get_my_slots(authorization: str = Header(None)):
    session = get_session_user(authorization)

    res = supabase.table("interview_slots").select("*") \
        .eq("recruiter_auth_id", session["user_auth_id"]) \
        .execute()

    return res.data
