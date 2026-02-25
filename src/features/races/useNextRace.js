import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../lib/api";

export default function useNextRace() {
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("/api/races/next");
      setRace(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRace();
  }, [fetchRace]);

  return { race, loading, error, refetch: fetchRace };
}
