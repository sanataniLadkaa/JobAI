from db import load_db, save_db, get_next_id
from schemas import CandidateResponse, CallResponse
from datetime import datetime, timedelta
import json

class VoiceService:
    @staticmethod
    def schedule_call(recruiter_id: int, candidate_id: int):
        db = load_db()
        
        # Find candidate
        candidate = next((u for u in db["users"] if u["id"] == candidate_id), None)
        if not candidate:
            return None

        now = datetime.utcnow()
        schedule_time = now + timedelta(minutes=5) 
        
        # MOCK: Simulating missed call logic for demo purposes
        is_missed_scenario = True 

        if is_missed_scenario:
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

        # Create Log Record
        new_call = {
            "id": get_next_id(db["calls"]),
            "recruiter_id": recruiter_id,
            "candidate_id": candidate_id,
            "status": status,
            "scheduled_time": schedule_time.isoformat(),
            "retry_count": 1 if is_missed_scenario else 0
        }

        db["calls"].append(new_call)
        save_db(db)
        
        return CallResponse(
            message=f"Call {status}",
            scheduled_time=schedule_time,
            status=status
        )

class AIService:
    @staticmethod
    def semantic_search(query: str):
        """
        Simulates RAG search by filtering the JSON list of users.
        """
        db = load_db()
        
        # 1. Parse Query
        keywords = [k.lower() for k in query.split()]
        target_exp = 0
        for k in keywords:
            if k.isdigit():
                target_exp = int(k)

        # Filter candidates
        results = []
        for c in db["users"]:
            if c["role"] != "candidate":
                continue
                
            score = 0
            c_skills = c.get("skills", [])
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
            
            # Random Semantic Factor
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

class DeviceAuthService:
    @staticmethod
    def handle_device_limit(user_id: int, device_id: str):
        db = load_db()
        
        # Filter sessions for this user
        user_sessions = [s for s in db["sessions"] if s["user_id"] == user_id]
        
        # Sort by last_active (oldest first)
        user_sessions.sort(key=lambda x: x["last_active"])

        if len(user_sessions) >= 3:
            # Delete oldest session
            oldest_id = user_sessions[0]["id"]
            db["sessions"] = [s for s in db["sessions"] if s["id"] != oldest_id]
        
        # Add new session
        new_session = {
            "id": get_next_id(db["sessions"]),
            "user_id": user_id,
            "device_id": device_id,
            "token": f"token_{device_id}",
            "last_active": datetime.utcnow().isoformat()
        }
        
        db["sessions"].append(new_session)
        save_db(db)
        return new_session["token"]