import { useQuery } from "@tanstack/react-query";
import {
  getProfileSummary,
  getUserPredictions,
} from "../services/profileService";

const PROFILE_STALE_TIME = 1000 * 60 * 5;
const PROFILE_GC_TIME = 1000 * 60 * 30;

export function useProfile({ includePredictions = true } = {}) {
  const summaryQuery = useQuery({
    queryKey: ["profile", "summary"],
    queryFn: getProfileSummary,
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const predictionsQuery = useQuery({
    queryKey: ["profile", "predictions"],
    queryFn: getUserPredictions,
    enabled: includePredictions,
    staleTime: PROFILE_STALE_TIME,
    gcTime: PROFILE_GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const loading =
    summaryQuery.isPending || (includePredictions && predictionsQuery.isPending);
  const error = summaryQuery.error || predictionsQuery.error;

  const refetch = async () => {
    if (includePredictions) {
      await Promise.all([summaryQuery.refetch(), predictionsQuery.refetch()]);
      return;
    }

    await summaryQuery.refetch();
  };

  return {
    summary: summaryQuery.data ?? null,
    predictions: includePredictions ? predictionsQuery.data ?? null : [],
    loading,
    error: error || null,
    errorMessage: error?.message || null,
    refetch,
    refetchSummary: summaryQuery.refetch,
    refetchPredictions: predictionsQuery.refetch,
  };
}
