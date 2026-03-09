import { useEffect, useState } from "react";
import { getCurrentUser, getProfile, getUserPredictions } from "../services/profileService";

const MAX_RECENT_RACES = 10;

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    lastRaceScore: 0,
    racesPredicted: 0,
    accuracy: 0,
    globalRank: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        // First check if user is authenticated
        const user = await getCurrentUser();
        if (!user) {
          if (isMounted) {
            setError("User not authenticated");
            setLoading(false);
          }
          return;
        }

        // Fetch profile stats from backend
        const profileData = await getProfile(user.id);
        
        // Fetch predictions from backend
        const predictionData = await getUserPredictions(user.id);

        if (!isMounted) return;

        // Set profile data
        setProfile({
          username: profileData?.username || "Guest",
          avatar_url: null, // Backend doesn't provide avatar currently
        });

        // Process predictions - limit to recent races for performance
        const processedPredictions = (predictionData || []).slice(0, MAX_RECENT_RACES);
        setPredictions(processedPredictions);

        // Calculate derived stats from predictions
        let lastRaceScore = 0;
        let racesPredicted = 0;

        if (processedPredictions && processedPredictions.length > 0) {
          // Sort by created_at to get most recent
          const sorted = [...processedPredictions].sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );

          // Get last race score (most recent prediction)
          lastRaceScore = sorted[0]?.points || 0;

          // Count unique races predicted
          const uniqueRaces = new Set(
            sorted
              .map(p => p.race_id)
              .filter(Boolean)
          );
          racesPredicted = uniqueRaces.size || sorted.length;
        }

        // Set stats - using backend-provided values plus derived ones
        setStats({
          totalPoints: profileData?.totalPoints ?? 0,
          totalPredictions: profileData?.totalPredictions ?? 0,
          globalRank: profileData?.globalRank ?? null,
          lastRaceScore,
          racesPredicted,
          // Backend provides accuracy as 0 (placeholder), so we use that
          accuracy: profileData?.accuracy ?? 0,
        });

      } catch (err) {
        if (isMounted) {
          console.error("Error fetching profile:", err);
          setError(err.message || "Failed to load profile");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, predictions, stats, loading, error };
}

