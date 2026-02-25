import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../../lib/api";

export default function useTopFive() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTop = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("/api/leaderboard/top5");
      setItems(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTop();
  }, [fetchTop]);

  return { items, loading, error, refetch: fetchTop };
}
