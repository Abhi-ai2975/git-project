from typing import List, Dict, Any

def assess_skill_level(total_contributions: int, top_languages: List[str]) -> Dict[str, Any]:
    """
    Deterministically assesses the user's skill level based on their GitHub profile metrics.
    """
    if total_contributions < 100:
        level = "Beginner"
        labels = ["good first issue", "good-first-issue", "documentation", "easy"]
    elif total_contributions <= 500:
        level = "Intermediate"
        labels = ["help wanted", "bug", "enhancement"]
    else:
        level = "Advanced"
        labels = ["feature", "performance", "refactor"]

    # Default to Python if no languages found, or take the user's top language
    primary_language = top_languages[0] if top_languages else "Python"

    return {
        "level": level,
        "primary_language": primary_language,
        "labels": labels
    }
