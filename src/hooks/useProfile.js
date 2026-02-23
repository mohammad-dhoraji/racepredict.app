import { useEffect, useState } from "react";
import {
  getCurrentUser,
  getProfile,
  getUserPredictions,
} from "../services/profileService";

const POSITIONS_PER_RACE = 4;

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState({
    totalPoints: 0,
    lastRaceScore: 0,
    racesPredicted: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProfile() {
      try {
        const user = await getCurrentUser();
        if (!user) throw new Error("User not authenticated");

        const profileData = await getProfile(user.id);
        const predictionData = await getUserPredictions(user.id);

        if (!isMounted) return;

        setProfile(profileData);
        setPredictions(predictionData || []);

        if (predictionData && predictionData.length > 0) {
          // Sort by race date (prefer race_date, fall back to created_at)
          const sorted = [...predictionData].sort(
            (a, b) =>
              new Date(b.race_date ?? b.created_at) - new Date(a.race_date ?? a.created_at)
          );

          const totalPoints = sorted.reduce(
            (sum, p) => sum + (p.points || 0),
            0
          );

          const lastRaceScore = sorted[0]?.points || 0;

          // Count unique races by race_id to avoid overcounting
          const uniqueRaces = new Set(sorted.map(p => p.race_id).filter(Boolean));
          const racesPredicted = uniqueRaces.size > 0 ? uniqueRaces.size : sorted.length;

          // If you DON'T have correct_positions in DB, remove this
          const correctPositions = sorted.reduce(
            (sum, p) => sum + (p.correct_positions || 0),
            0
          );

          const totalPossible = racesPredicted * POSITIONS_PER_RACE;

          const accuracy =
            totalPossible > 0
              ? Math.min(100, Math.round((correctPositions / totalPossible) * 100))
              : 0;

          setStats({
            totalPoints,
            lastRaceScore,
            racesPredicted,
            accuracy,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Something went wrong");
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