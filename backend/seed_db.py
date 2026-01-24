import json

users = [
    {
        "id": 1,
        "email": "recruiter@test.com",
        "password": "password",  # Plain text
        "role": "recruiter",
        "name": "Alex Recruiter",
        "skills": [],
        "experience_years": 0
    },
    {
        "id": 2,
        "email": "sarah@test.com",
        "password": "password",  # Plain text
        "role": "candidate",
        "name": "Sarah Dev",
        "skills": ["React", "Node.js", "Python"],
        "experience_years": 3
    }
]

data = {
    "users": users,
    "jobs": [],
    "applications": [],
    "calls": [],
    "sessions": []
}

with open("data.json", "w") as f:
    json.dump(data, f, indent=4)

print("Database seeded successfully!")