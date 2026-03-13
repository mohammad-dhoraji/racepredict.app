import { useQuery } from "@tanstack/react-query";
import { fetchNextRace } from "../services/racesService";

export function useNextRace() {
  return useQuery({
    queryKey: ["nextRace"],
    queryFn: fetchNextRace,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}
