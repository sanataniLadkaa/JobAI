from fastapi import APIRouter, HTTPException, Header, Query
from pydantic import BaseModel
from db import supabase
from datetime import datetime

router = APIRouter()

# -----------------------------
# MODELS
# -----------------------------

class ApplicationCreate(BaseModel):
    candidate_name: str
    job_id: int
    job_title: str
    status: str


class StatusUpdate(BaseModel):
    status: str

class ApplyRequest(BaseModel):
    job_id: int

# -----------------------------
# HELPER: Resolve auth user
# -----------------------------

def get_auth_user(authorization: str):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.replace("Bearer ", "")
    sess = supabase.table("sessions").select("*").eq("token", token).execute()

    if not sess.data:
        raise HTTPException(status_code=401, detail="Invalid token")

    # ✅ FIX: sessions.user_id == users.auth_id
    return sess.data[0]["user_id"]



# -----------------------------
# 1. DIRECT UPSERT (Recruiter booking flow)
# -----------------------------

@router.post("/applications/direct")
def upsert_application(
    data: ApplicationCreate,
    authorization: str = Header(None)
):
    try:
        auth_id = get_auth_user(authorization)

        supabase.table("applications").upsert(
            {
                "candidate_auth_id": auth_id,   # ✅ FIXED
                "candidate_name": data.candidate_name,
                "job_id": data.job_id,
                "job_title": data.job_title,
                "status": data.status,
                "applied_at": datetime.utcnow().isoformat()
            },
            on_conflict="candidate_auth_id,job_id"  # ✅ FIXED
        ).execute()

        return {"message": "Application upserted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# -----------------------------
# 2. APPLY FOR A JOB (Candidate)
# -----------------------------

@router.post("/apply")
def apply_job(
    data: ApplyRequest,
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(401, "Not authenticated")

    token = authorization.replace("Bearer ", "")
    sess = supabase.table("sessions").select("*").eq("token", token).execute()

    if not sess.data:
        raise HTTPException(401, "Invalid token")

    candidate_id = sess.data[0]["user_id"]

    candidate = supabase.table("users") \
        .select("name") \
        .eq("id", candidate_id) \
        .single() \
        .execute()

    job = supabase.table("jobs") \
        .select("title") \
        .eq("id", data.job_id) \
        .single() \
        .execute()

    if not candidate.data or not job.data:
        raise HTTPException(400, "Invalid job or user")

    # Prevent duplicates
    existing = supabase.table("applications") \
        .select("id") \
        .eq("candidate_id", candidate_id) \
        .eq("job_id", data.job_id) \
        .execute()

    if existing.data:
        raise HTTPException(400, "Already applied")

    supabase.table("applications").insert({
        "candidate_id": candidate_id,
        "candidate_name": candidate.data["name"],
        "job_id": data.job_id,
        "job_title": job.data["title"],
        "status": "Pending",
        "applied_at": datetime.utcnow().isoformat()
    }).execute()

    return {"message": "Application submitted successfully"}




# -----------------------------
# 3. GET APPLICATIONS (Recruiter)
# -----------------------------

@router.get("/applications")
def get_applications(
    status: str = Query(None),
    authorization: str = Header(None)
):
    get_auth_user(authorization)

    db = supabase.table("applications") \
        .select("*, users!inner(name, skills)") \
        .execute()

    apps = db.data or []

    if status:
        apps = [a for a in apps if a.get("status") == status]
    else:
        # Default behavior preserved
        apps = [a for a in apps if a.get("status") == "Shortlisted"]

    return sorted(apps, key=lambda x: x["applied_at"], reverse=True)


# -----------------------------
# 4. GET MY APPLICATIONS (Candidate)
# -----------------------------

@router.get("/applications/mine")
def get_my_applications(authorization: str = Header(None)):
    auth_id = get_auth_user(authorization)

    response = supabase.table("applications") \
        .select("*") \
        .eq("candidate_auth_id", auth_id) \
        .execute()

    return sorted(response.data or [], key=lambda x: x["applied_at"], reverse=True)


# -----------------------------
# 5. UPDATE APPLICATION STATUS (Recruiter)
# -----------------------------

@router.put("/applications/{app_id}/status")
def update_application_status(
    app_id: int,
    data: StatusUpdate,
    authorization: str = Header(None)
):
    get_auth_user(authorization)

    supabase.table("applications") \
        .update({"status": data.status}) \
        .eq("id", app_id) \
        .execute()

    return {"message": "Application status updated"}
