from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String) # "recruiter" or "candidate"
    name = Column(String)
    skills = Column(String) # Stored as JSON string for simplicity
    experience_years = Column(Integer, default=0)
    
    applications = relationship("Application", back_populates="candidate")
    sent_calls = relationship("CallLog", foreign_keys="[CallLog.recruiter_id]", back_populates="recruiter")
    received_calls = relationship("CallLog", foreign_keys="[CallLog.candidate_id]", back_populates="candidate")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    company = Column(String)
    description = Column(Text)
    required_skills = Column(String) # JSON string
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="Applied")
    match_score = Column(Float)
    recruiter_remarks = Column(Text, nullable=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    
    job = relationship("Job", back_populates="applications")
    candidate = relationship("User", back_populates="applications")

class CallLog(Base):
    __tablename__ = "call_logs"
    id = Column(Integer, primary_key=True, index=True)
    status = Column(String) # Initiated, Picked, Missed, Retried, Completed
    scheduled_time = Column(DateTime)
    retry_count = Column(Integer, default=0)
    recruiter_id = Column(Integer, ForeignKey("users.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    
    recruiter = relationship("User", foreign_keys=[recruiter_id], back_populates="sent_calls")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="received_calls")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(String) # Browser fingerprint or ID
    token = Column(String)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)