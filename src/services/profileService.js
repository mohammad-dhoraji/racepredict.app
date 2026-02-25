import { apiRequest } from "../lib/api";

export async function getCurrentUser() {
  // We'll keep session management via supabase if still needed for Auth
  // but for data, we use the API.
  try {
    const response = await apiRequest("/api/profile/stats");
    return response;
  } catch (err) {
    return null;
  }
}

export async function getProfile(userId) {
  // If userId is provided, we still check stats. 
  // In our current backend, /stats is for the logged-in user.
  return apiRequest("/api/profile/stats");
}

export async function getUserPredictions(userId) {
  return apiRequest("/api/profile/predictions");
}

