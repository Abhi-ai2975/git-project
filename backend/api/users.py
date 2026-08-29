from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
from models import User
from services.github_service import fetch_github_profile

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
)

security = HTTPBearer()

class OnboardingRequest(BaseModel):
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None

class UserResponse(BaseModel):
    is_onboarded: bool
    github_username: str

@router.post("/onboard", response_model=UserResponse)
async def onboard_user(
    request: OnboardingRequest, 
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Onboards a user, saving their details to the database and marking them as onboarded.
    """
    token = credentials.credentials
    try:
        # Fetch basic profile to get the definitive GitHub username
        profile_data = await fetch_github_profile(token)
        github_username = profile_data.get("username")
        
        if not github_username:
            raise HTTPException(status_code=400, detail="Could not determine GitHub username from token.")

        # Find or create user
        user = db.query(User).filter(User.github_username == github_username).first()
        if not user:
            # We don't have the numeric github ID from this specific service call, so we'll use username as the unique identifier
            user = User(
                github_id=github_username, # Fallback to username for unique identifier if id is absent
                github_username=github_username
            )
            db.add(user)
            
        user.linkedin_url = request.linkedin_url
        user.portfolio_url = request.portfolio_url
        user.is_onboarded = True
        
        db.commit()
        db.refresh(user)
        
        return UserResponse(
            is_onboarded=user.is_onboarded,
            github_username=user.github_username
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during onboarding: {str(e)}"
        )
