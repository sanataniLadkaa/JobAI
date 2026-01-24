import json
from datetime import datetime

# 1. Define Multiple Users
users = [
    # --- RECRUITERS ---
    {
        "id": 1,
        "email": "alex@techcorp.com",
        "password": "123",
        "role": "recruiter",
        "name": "Alex Recruiter",
        "skills": [],
        "experience_years": 0
    },
    {
        "id": 3, # New ID
        "email": "jane@fingroup.com",
        "password": "123",
        "role": "recruiter",
        "name": "Jane HR",
        "skills": [],
        "experience_years": 0
    },
    
    # --- CANDIDATES ---
    {
        "id": 2,
        "email": "sarah@dev.com",
        "password": "123",
        "role": "candidate",
        "name": "Sarah Frontend",
        "skills": ["React", "CSS", "Tailwind"],
        "experience_years": 3
    },
    {
        "id": 4, # New ID
        "email": "mike@data.com",
        "password": "123",
        "role": "candidate",
        "name": "Mike Backend",
        "skills": ["Python", "SQL", "Django"],
        "experience_years": 5
    },
    {
        "id": 5, # New ID
        "email": "emily@design.com",
        "password": "123",
        "role": "candidate",
        "name": "Emily Designer",
        "skills": ["Figma", "UI/UX", "Adobe XD"],
        "experience_years": 2
    }
]

# 2. Define Jobs (Linked to specific Recruiters)
jobs = [
    {
        "id": 101,
        "title": "Senior React Developer",
        "company": "TechCorp",
        "description": "Need an expert in React and Redux.",
        "required_skills": ["React", "Redux", "Node"],
        "recruiter_id": 1 # Posted by Alex
    },
    {
        "id": 102,
        "title": "Python Data Scientist",
        "company": "FinGroup",
        "description": "Looking for strong Python and SQL skills.",
        "required_skills": ["Python", "SQL", "Machine Learning"],
        "recruiter_id": 3 # Posted by Jane
    }
]

# 3. Define Applications (Initial data to test)
applications = [
    {
        "id": 201,
        "candidate_id": 2, # Sarah applied
        "candidate_name": "Sarah Frontend",
        "job_id": 101, # To React Job
        "job_title": "Senior React Developer",
        "status": "Pending",
        "applied_at": datetime.utcnow().isoformat()
    }
]

# 4. Construct Full Database Object
data = {
    "users": users,
    "jobs": jobs,
    "applications": applications,
    "calls": [],
    "sessions": []
}

# 5. Save to file
with open("data.json", "w") as f:
    json.dump(data, f, indent=4)

print("✅ Multi-user Database Seeded Successfully!")
print("------------------------------------------------")
print("🧑‍💼 RECRUITERS:")
print(" 1. alex@techcorp.com (Pass: 123)")
print(" 2. jane@fingroup.com  (Pass: 123)")
print("")
print("👨‍💻 CANDIDATES:")
print(" 1. sarah@dev.com    (Pass: 123)")
print(" 2. mike@data.com     (Pass: 123)")
print(" 3. emily@design.com  (Pass: 123)")
print("------------------------------------------------")