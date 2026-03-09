import { supabase } from "../lib/supabaseClient";
import { apiRequest } from "../lib/api";

/**
 * Get the currently authenticated user from Supabase
 * This is used to check authentication state before making API calls
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return null;
    }
    return data.user;
  } catch (err) {
    console.error("Error getting current user:", err);
    return null;
  }
}

/**
 * Get profile stats for the logged-in user
 * Calls GET /api/profile/stats
 * Note: userId is not needed as backend uses authenticated user from JWT
 */
export async function getProfile(_userId) {
  return apiRequest("/api/profile/stats");
}

/**
 * Get predictions for the logged-in user
 * Calls GET /api/profile/predictions
 * Note: userId is not needed as backend uses authenticated user from JWT
 */
export async function getUserPredictions(_userId) {
  return apiRequest("/api/profile/predictions");
}

