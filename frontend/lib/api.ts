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
      throw new Error("Unauthorized. Token may be expired.");
    }
    if (response.status === 403) {
      throw new Error("Rate limit exceeded from GitHub API.");
    }
    throw new Error("Failed to fetch user profile from the backend.");
  }

  return response.json();
}
