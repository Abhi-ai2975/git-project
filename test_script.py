import asyncio
from backend.services.issue_scanner import fetch_recommended_issues

async def main():
    try:
        issues = await fetch_recommended_issues("fake_token", "Python", ["good first issue"])
        print("Success:", issues)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
