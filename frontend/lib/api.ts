const API_BASE_URL = "http://localhost:8000/api";

export async function fetchUserProfile(token: string) {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired or is invalid. Please sign in again.");
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error("We've hit a GitHub API rate limit. Please try again later.");
    }
    throw new Error(`Failed to fetch user profile (Status: ${response.status}).`);
  }

  return response.json();
}

export async function fetchRecommendations(token: string) {
  const response = await fetch(`${API_BASE_URL}/recommendations`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired or is invalid. Please sign in again.");
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error("We've hit a GitHub API rate limit. Please try again later.");
    }
    throw new Error(`Failed to fetch recommendations (Status: ${response.status}).`);
  }

  return response.json();
}

export async function submitOnboarding(token: string, data: { linkedin_url: string; portfolio_url: string }) {
  const response = await fetch(`${API_BASE_URL}/users/onboard`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Your session has expired or is invalid. Please sign in again.");
    }
    throw new Error(`Failed to submit onboarding (Status: ${response.status}).`);
  }

  return response.json();
}
