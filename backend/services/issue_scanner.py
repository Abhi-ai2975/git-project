import httpx
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from typing import List, Dict, Any

GITHUB_SEARCH_URL = "https://api.github.com/search/issues"

async def fetch_recommended_issues(token: str, primary_language: str, labels: List[str]) -> List[Dict[str, Any]]:
    """
    Queries the GitHub Search API for active open-source issues matching the user's skill profile.
    """
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github.v3+json"
    }

    # Calculate date 10 days ago
    Ten_days_ago = (datetime.utcnow() - timedelta(days=10)).strftime('%Y-%m-%d')

    # GitHub Search doesn't easily support OR across multiple labels in a single query parameter safely without risking syntax errors,
    # so we'll prioritize the first (most significant) label from our mapped array.
    primary_label = labels[0] if labels else "help wanted"

    # Construct robust query: open issues, specific language, specific label, active repo
    query = f'is:issue is:open language:"{primary_language}" label:"{primary_label}" archived:false updated:>={Ten_days_ago}'

    params = {
        "q": query,
        "sort": "updated",
        "order": "desc",
        "per_page": 10
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            GITHUB_SEARCH_URL,
            params=params,
            headers=headers
        )

        if response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="GitHub token is expired or invalid."
            )
        elif response.status_code == 403 or response.status_code == 429:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="GitHub API rate limit exceeded."
            )
        elif response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Failed to fetch issues from GitHub: {response.text}"
            )

        data = response.json()
        items = data.get("items", [])

        # Map to structured dictionary
        recommended_issues = []
        for item in items:
            repo_url = item.get("repository_url", "")
            repo_name = repo_url.split("repos/")[-1] if "repos/" in repo_url else "Unknown Repository"
            
            issue_labels = [lbl.get("name") for lbl in item.get("labels", []) if lbl.get("name")]

            recommended_issues.append({
                "title": item.get("title"),
                "url": item.get("html_url"),
                "repository": repo_name,
                "labels": issue_labels[:3], # Take up to 3 labels for UI cleanliness
                "created_at": item.get("created_at")
            })

        return recommended_issues
