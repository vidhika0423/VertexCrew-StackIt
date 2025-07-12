from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import questions, answers, comments, auth, users
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StackIt API",
    description="A Q&A platform API built with FastAPI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(answers.router, prefix="/api/answers", tags=["Answers"])
app.include_router(comments.router, prefix="/api/comments", tags=["Comments"])

@app.get("/")
async def root():
    return {"message": "Welcome to StackIt API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}