from fastapi import APIRouter, Depends, HTTPException, Header, status
from services.github_service import fetch_github_profile

router = APIRouter(
    prefix="/api/profile",
    tags=["profile"],
)

async def get_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header. Expected 'Bearer <token>'.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return authorization.split("Bearer ")[1]

@router.get("/")
async def get_profile(token: str = Depends(get_token)):
    """
    Fetches the user's GitHub profile data using their provided OAuth Access Token.
    Returns username, pinned repositories, top languages, and total contributions.
    """
    try:
        profile_data = await fetch_github_profile(token)
        return profile_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while fetching the GitHub profile: {str(e)}"
        )
