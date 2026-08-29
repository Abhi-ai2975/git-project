from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from services.github_service import fetch_github_profile

from sqlalchemy.orm import Session
from database import get_db
from models import User

router = APIRouter(
    prefix="/api/profile",
    tags=["profile"],
)

security = HTTPBearer()

# Pydantic Response Models for structured validation
class RepoSummary(BaseModel):
    name: str
    description: Optional[str]
    url: str
    stars: int
    language: Optional[str]

class UserProfileResponse(BaseModel):
    username: str
    name: Optional[str]
    pinned_repositories: List[RepoSummary]
    total_contributions: int
    top_languages: List[str]
    is_onboarded: bool

@router.get("", response_model=UserProfileResponse)
async def get_profile(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Fetches the user's GitHub profile data using their provided OAuth Access Token.
    Returns structured data protected by strict schema validation.
    """
    token = credentials.credentials
    try:
        profile_data = await fetch_github_profile(token)
        github_username = profile_data.get("username")
        
        user = db.query(User).filter(User.github_username == github_username).first()
        is_onboarded = user.is_onboarded if user else False
        
        profile_data["is_onboarded"] = is_onboarded
        return UserProfileResponse(**profile_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching the GitHub profile"
        )
