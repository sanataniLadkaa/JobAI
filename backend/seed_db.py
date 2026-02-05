import os
from supabase import create_client, Client
from dotenv import load_dotenv

# 1. Load Config
load_dotenv()
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

if not url or not key:
    print("❌ Error: SUPABASE_URL or SUPABASE_KEY not found in .env file")
    exit()

supabase: Client = create_client(url, key)

# 2. Define Data (Same as your provided code)
users = [
    # --- RECRUITERS ---
    {"id": 1, "email": "alex@techcorp.com", "password": "123", "role": "recruiter", "name": "Alex Recruiter", "skills": [], "experience_years": 0},
    {"id": 3, "email": "jane@fingroup.com", "password": "123", "role": "recruiter", "name": "Jane HR", "skills": [], "experience_years": 0},
    # --- CANDIDATES ---
    {"id": 2, "email": "sarah@dev.com", "password": "123", "role": "candidate", "name": "Sarah Frontend", "skills": ["React", "CSS", "Tailwind"], "experience_years": 3},
    {"id": 4, "email": "mike@data.com", "password": "123", "role": "candidate", "name": "Mike Backend", "skills": ["Python", "SQL", "Django"], "experience_years": 5},
    {"id": 5, "email": "emily@design.com", "password": "123", "role": "candidate", "name": "Emily Designer", "skills": ["Figma", "UI/UX", "Adobe XD"], "experience_years": 2},
    # --- NEW CANDIDATES ---
    {"id": 6, "email": "david@fullstack.com", "password": "123", "role": "candidate", "name": "David Fullstack", "skills": ["React", "Node", "PostgreSQL"], "experience_years": 4},
    {"id": 7, "email": "lisa@ai.com", "password": "123", "role": "candidate", "name": "Lisa AI", "skills": ["Python", "TensorFlow", "PyTorch"], "experience_years": 6},
    {"id": 8, "email": "mark@mobile.com", "password": "123", "role": "candidate", "name": "Mark Mobile", "skills": ["React Native", "Swift", "Java"], "experience_years": 5},
    {"id": 9, "email": "jane@web.com", "password": "123", "role": "candidate", "name": "Jane Web", "skills": ["HTML", "CSS", "JavaScript", "Angular"], "experience_years": 2},
    {"id": 10, "email": "tom@devops.com", "password": "123", "role": "candidate", "name": "Tom DevOps", "skills": ["Docker", "Kubernetes", "AWS"], "experience_years": 7}
]

jobs = [
    {"id": 101, "title": "Senior React Developer", "company": "TechCorp", "description": "Need an expert in React and Redux.", "required_skills": ["React", "Redux", "Node"], "recruiter_id": 1},
    {"id": 102, "title": "Python Data Scientist", "company": "FinGroup", "description": "Looking for strong Python and SQL skills.", "required_skills": ["Python", "SQL", "Machine Learning"], "recruiter_id": 3}
]

# 3. Insert into Supabase
print("🌐 Connecting to Supabase...")
print("📝 Seeding Users...")

for u in users:
    try:
        # Check if user exists to avoid duplicate error
        check = supabase.table("users").select("*").eq("email", u["email"]).execute()
        if not check.data:
            supabase.table("users").insert(u).execute()
            print(f"  ✅ Added {u['name']}")
        else:
            print(f"  ⏭️ Skipped {u['name']} (Already exists)")
    except Exception as e:
        print(f"  ❌ Error adding {u['name']}: {e}")

print("📝 Seeding Jobs...")
for j in jobs:
    try:
        check = supabase.table("jobs").select("*").eq("id", j["id"]).execute()
        if not check.data:
            supabase.table("jobs").insert(j).execute()
            print(f"  ✅ Added Job: {j['title']}")
        else:
            print(f"  ⏭️ Skipped Job (Already exists)")
    except Exception as e:
        print(f"  ❌ Error adding Job: {e}")

print("🚀 Seeding Complete! Refresh your app to see new candidates.")