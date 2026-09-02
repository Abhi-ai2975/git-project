import httpx
from fastapi import HTTPException, status

GITHUB_GRAPHQL_URL = "https://api.github.com/graphql"

GRAPHQL_QUERY = """
query($pinnedCount: Int!, $repoCount: Int!) {
  viewer {
    login
    name
    pinnedItems(first: $pinnedCount, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          primaryLanguage {
            name
          }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
      }
      commitContributionsByRepository(maxRepositories: 100) {
        repository {
          name
          stargazerCount
          owner {
            login
          }
        }
        contributions {
          totalCount
        }
      }
    }
    repositories(first: $repoCount, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        primaryLanguage {
          name
        }
      }
    }
    pullRequests(first: 100, states: MERGED, orderBy: {field: CREATED_AT, direction: DESC}) {
      nodes {
        repository {
          name
          stargazerCount
          owner {
            login
          }
        }
        closingIssuesReferences(first: 10) {
          totalCount
        }
        files(first: 100) {
          nodes {
            path
          }
        }
      }
    }
  }
}
"""

async def fetch_github_profile(token: str):
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "query": GRAPHQL_QUERY,
        "variables": {
            "pinnedCount": 6,
            "repoCount": 100
        }
    }
    
    # Restrict connection and read timeouts to prevent backend thread exhaustion
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            GITHUB_GRAPHQL_URL,
            json=payload,
            headers=headers
        )
        
        if response.status_code == 401:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="GitHub token is expired or invalid."
            )
        
        if response.status_code == 403:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="GitHub API rate limit exceeded."
            )
            
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"GitHub API error: {response.text}"
            )
            
        data = response.json()
        
        if "errors" in data:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"GitHub GraphQL error: {data['errors']}"
            )
            
        viewer = data.get("data", {}).get("viewer", {})
        
        # Calculate top languages from recent 100 repos
        languages = {}
        repos = viewer.get("repositories", {}).get("nodes", [])
        for repo in repos:
            if repo and repo.get("primaryLanguage"):
                lang = repo["primaryLanguage"]["name"]
                languages[lang] = languages.get(lang, 0) + 1
                
        sorted_languages = sorted(languages.items(), key=lambda x: x[1], reverse=True)
        top_languages = [lang[0] for lang in sorted_languages[:5]]

        return {
            "username": viewer.get("login"),
            "name": viewer.get("name"),
            "pinned_repositories": [
                {
                    "name": repo.get("name"),
                    "description": repo.get("description"),
                    "url": repo.get("url"),
                    "stars": repo.get("stargazerCount"),
                    "language": repo.get("primaryLanguage", {}).get("name") if repo.get("primaryLanguage") else None
                }
                for repo in viewer.get("pinnedItems", {}).get("nodes", [])
                if repo
            ],
            "total_contributions": viewer.get("contributionsCollection", {}).get("contributionCalendar", {}).get("totalContributions", 0),
            "top_languages": top_languages,
            "commit_contributions": viewer.get("contributionsCollection", {}).get("commitContributionsByRepository", []),
            "pull_requests": viewer.get("pullRequests", {}).get("nodes", [])
        }
