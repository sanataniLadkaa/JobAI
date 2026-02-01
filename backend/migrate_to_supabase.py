import json
from supabase import create_client, Client
import os
from datetime import datetime, timezone 

# --- CONFIGURATION ---
# Go to Supabase Settings -> API -> Find "Project URL" and "Anon Public Key"



supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Load Local JSON
with open("data.json", "r") as f:
    data = json.load(f)

def migrate_users():
    print("Migrating Users...")
    users = data.get("users", [])
    id_map = {} 
    
    for u in users:
        res = supabase.table("users").insert({
            "email": u.get("email"),
            "password": u.get("password"),
            "role": u.get("role"),
            "name": u.get("name"),
            "skills": u.get("skills", []),
            "experience_years": u.get("experience_years", 0)
        }).execute()
        
        new_id = res.data[0]['id']
        id_map[u['id']] = new_id 
        
    print(f"✅ {len(users)} Users migrated.")
    return id_map

def migrate_jobs():
    print("Migrating Jobs...")
    jobs = data.get("jobs", [])
    id_map = {} 
    
    for j in jobs:
        res = supabase.table("jobs").insert({
            "title": j.get("title"),
            "company": j.get("company"),
            "description": j.get("description"),
            "required_skills": j.get("required_skills", []),
            "recruiter_id": j.get("recruiter_id")
        }).execute()
        
        new_id = res.data[0]['id']
        id_map[j['id']] = new_id 
        
    print(f"✅ {len(jobs)} Jobs migrated.")
    return id_map

def migrate_applications(user_map, job_map):
    print("Migrating Applications...")
    apps = data.get("applications", [])
    
    for a in apps:
        # 1. Translate old IDs to NEW Supabase IDs
        new_candidate_id = user_map.get(a.get("candidate_id"))
        new_job_id = job_map.get(a.get("job_id"))
        
        # Fallback if mapping fails
        if not new_candidate_id or not new_job_id:
            print(f"⚠ Skipping app {a['id']}: Mapping missing")
            continue

        # 2. Insert with Correct IDs
        supabase.table("applications").insert({
            "candidate_id": new_candidate_id,
            "candidate_name": a.get("candidate_name"),
            "job_id": new_job_id,
            "job_title": a.get("job_title"),
            "status": a.get("status", "Pending"),
            "applied_at": a.get("applied_at", datetime.now(timezone.utc).isoformat())
        }).execute()
        
    print(f"✅ Applications migrated.")

# We skip sessions because they are temporary and cause duplicate errors
# def migrate_sessions(user_map):
#     print("Migrating Sessions...")
#     ...

if __name__ == "__main__":
    print("Starting Migration...")
    
    # Variable names must match the return of functions
    user_id_map = migrate_users()
    job_id_map = migrate_jobs()
    
    migrate_applications(user_id_map, job_id_map)
    
    # migrate_sessions(user_id_map) # Skipping sessions to avoid duplicate key errors
    
    print("🚀 Migration Complete!")