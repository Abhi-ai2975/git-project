from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import profile, recommendations, users
from dotenv import load_dotenv
import models
from database import engine

# Create the database tables
models.Base.metadata.create_all(bind=engine)

# Load environment variables (e.g. from .env file if it exists)
load_dotenv()

app = FastAPI(
    title="Git Project",
    description="Backend API for the Open-Source Mentor platform",
    version="1.0.0"
)

# Configure CORS to allow requests from the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# Include API routers
app.include_router(profile.router)
app.include_router(recommendations.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Open-Source Mentor API"}
