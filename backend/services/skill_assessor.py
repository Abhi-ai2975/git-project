from typing import List, Dict, Any
from pydantic import BaseModel

class SkillProfile(BaseModel):
    level: str
    primary_language: str
    labels: List[str]

def assess_skill_level(profile_data: Dict[str, Any]) -> SkillProfile:
    """
    Deterministically assesses the user's skill level based on their GitHub profile metrics.
    """
    username = profile_data.get("username", "")
    commit_contributions = profile_data.get("commit_contributions", [])
    pull_requests = profile_data.get("pull_requests", [])
    top_languages = profile_data.get("top_languages", [])
    
    total_score = 0.0

    # Score Commit Contributions
    for repo_contrib in commit_contributions:
        repo = repo_contrib.get("repository") or {}
        contribs = repo_contrib.get("contributions") or {}
        
        count = contribs.get("totalCount", 0)
        stars = repo.get("stargazerCount", 0)
        owner = (repo.get("owner") or {}).get("login", "")
        
        # Determine internal vs external
        is_personal = bool(owner and username and owner.lower() == username.lower())
        base_points = 1 if is_personal else 5
        
        # Add points
        total_score += count * base_points
        # Add star multiplier
        total_score += count * (0.1 * stars)

    # Score Pull Requests
    for pr in pull_requests:
        if not pr:
            continue
        repo = pr.get("repository") or {}
        stars = repo.get("stargazerCount", 0)
        owner = (repo.get("owner") or {}).get("login", "")
        
        is_personal = bool(owner and username and owner.lower() == username.lower())
        
        # Merged PR (External Repo): 25 Points
        base_points = 0 if is_personal else 25
        
        # Check files for doc penalty
        files = (pr.get("files") or {}).get("nodes", [])
        is_doc_only = False
        if files:
            is_doc_only = all(f and f.get("path", "").endswith((".md", ".txt", ".html")) for f in files)
        
        if is_doc_only:
            # Cap doc-only PRs to 0 points for the PR base
            base_points = 0
            
        pr_score = base_points
        
        # Add star multiplier (applies to each PR)
        pr_score += (0.1 * stars)
        
        # Check for linked issues
        linked_issues = (pr.get("closingIssuesReferences") or {}).get("totalCount", 0)
        if linked_issues > 0:
            pr_score *= 1.5
            
        total_score += pr_score

    # Determine Tier based on thresholds
    if total_score <= 150:
        level = "Beginner"
        labels = ["good first issue", "good-first-issue", "documentation", "easy"]
    elif total_score <= 600:
        level = "Intermediate"
        labels = ["help wanted", "bug", "enhancement"]
    else:
        level = "Advanced"
        labels = ["feature", "performance", "refactor"]

    # Default to Python if no languages found, or take the user's top language
    primary_language = top_languages[0] if top_languages else "Python"

    return SkillProfile(
        level=level,
        primary_language=primary_language,
        labels=labels
    )
