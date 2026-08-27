from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from services.github_service import fetch_github_profile

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

@router.get("", response_model=UserProfileResponse)
async def get_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Fetches the user's GitHub profile data using their provided OAuth Access Token.
    Returns structured data protected by strict schema validation.
    """
    token = credentials.credentials
    try:
        profile_data = await fetch_github_profile(token)
        return UserProfileResponse(**profile_data)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching the GitHub profile"
        )
