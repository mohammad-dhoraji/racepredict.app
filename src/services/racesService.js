import { apiRequest } from "../lib/api";

export async function fetchNextRace() {
  try {
    return await apiRequest("/api/races/current");
  } catch (error) {
    if (error?.status === 404) {
      return null;
    }
    throw error;
  }
}

