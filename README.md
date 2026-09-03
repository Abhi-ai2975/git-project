# git-project
# 🚀 AI Open-Source Mentor

## ⚠️ The Problem
Navigating large repositories and finding beginner-friendly tasks is overwhelming for almost every student starting out[cite: 1]. When trying to build a consistent GitHub presence, new developers face major roadblocks:
* **High friction to start:** Beginners often don't know where to start or which issues are actually approachable[cite: 1].
* **Information overload:** Reading long `README.md` and `CONTRIBUTING.md` files just to understand the local setup takes too much time[cite: 1].
* **Matching mismatch:** Repositories are frequently either dead (abandoned by maintainers) or far too complex for newcomers[cite: 1].

## 💡 The Solution
Open-Source Mentor bridges discovery and real learning without spoon-feeding solutions[cite: 1]. 

If you simply use AI to write your code, you miss out on understanding the codebase and cannot explain your work later[cite: 1]. Instead of generating code fixes, this platform acts as an intelligent mentor[cite: 1]. It assesses your current skills, finds a targeted issue, and points you in the right direction so you can fix it yourself and build a verifiable track record for hiring managers[cite: 1].

## ⚙️ Core Workflow
1. **User Profile Analysis:** Analyzes your GitHub page to determine your tech stack and current capability (beginner, intermediate, or expert)[cite: 1].
2. **Repository & Issue Filtering:** Scans active open-source projects to find bugs or `README.md` updates that match your specific skill level[cite: 1].
3. **Problem Briefing (Not Solving):** Briefly explains why the issue exists and where to look in the codebase, without fixing the code itself[cite: 1].
4. **Learning & Contribution:** You investigate, understand the bug, write the fix, and open your Pull Request[cite: 1]. 

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, NextAuth.js
* **Backend:** FastAPI, Python, Pydantic, HTTPX
* **Integrations:** GitHub REST & GraphQL APIs

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- A GitHub OAuth Application (to get your Client ID and Secret)

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file and add your GitHub credentials and NextAuth URL:
   ```env
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_secret_string
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload
   ```

Once both servers are running, visit `http://localhost:3000` to access the Open-Source Mentor platform!