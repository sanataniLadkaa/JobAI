from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # 1. Import this
from routers import auth, candidates, jobs, applications,interviews , salary,slots
# 2. Initialize the app

app = FastAPI(title="NexHire API")

# 3. Add the CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React's default port
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],  # Allows all headers
)
# ,"https://jobai-eight.vercel.app"
# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(candidates.router, prefix="/api", tags=["Recruiter"])
app.include_router(jobs.router, prefix="/api", tags=["Jobs"])
app.include_router(applications.router, prefix="/api", tags=["Applications"]) # <--- ADD THIS
app.include_router(interviews.router, prefix="/api", tags=["Interviews"]) # <--- ADD
app.include_router(salary.router, prefix="/api", tags=["Salary"])
app.include_router(slots.router, prefix="/api", tags=["Interview Slots"])
app.include_router(candidates.router, prefix="/candidates", tags=["Candidates"])
@app.get("/")
def read_root():
    return {"message": "NexHire Backend Running"}