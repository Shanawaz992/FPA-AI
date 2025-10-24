from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, sports, skills, submissions, analyses, upload

app = FastAPI(
    title="FormPerfect AI API",
    description="Sports form analysis API with AI-powered feedback",
    version="1.0.0"
)

# Configure CORS - Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow any origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(sports.router, prefix="/api/sports", tags=["sports"])
app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(analyses.router, prefix="/api/analyses", tags=["analyses"])
app.include_router(upload.router, prefix="/api/upload", tags=["upload"])

@app.get("/")
async def root():
    return {"message": "FormPerfect AI API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}