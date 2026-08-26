from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
from services.github_service import fetch_github_profile
from services.skill_assessor import assess_skill_level
from services.issue_scanner import fetch_recommended_issues

router = APIRouter(
    prefix="/api/recommendations",
    tags=["recommendations"],
)

security = HTTPBearer()

class IssueModel(BaseModel):
    title: str
    url: str
    repository: str
    labels: List[str]
    created_at: str

class RecommendationResponse(BaseModel):
    skill_level: str
    primary_language: str
    issues: List[IssueModel]

@router.get("/", response_model=RecommendationResponse)
async def get_recommendations(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Assesses the user's skill level and returns recommended active open-source issues.
    """
    token = credentials.credentials
    try:
        # 1. Fetch user's basic profile metrics
        profile_data = await fetch_github_profile(token)
        
        total_contributions = profile_data.get("total_contributions", 0)
        top_languages = profile_data.get("top_languages", [])
        
        # 2. Assess skill level and determine query parameters
        assessment = assess_skill_level(total_contributions, top_languages)
        
        primary_language = assessment["primary_language"]
        skill_level = assessment["level"]
        target_labels = assessment["labels"]
        
        # 3. Query the GitHub Search API for active open-source issues
        issues_data = await fetch_recommended_issues(token, primary_language, target_labels)
        
        return RecommendationResponse(
            skill_level=skill_level,
            primary_language=primary_language,
            issues=issues_data
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while generating recommendations: {str(e)}"
        )
