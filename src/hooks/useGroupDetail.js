import { useQuery } from "@tanstack/react-query";
import { getGroupDetail } from "../services/groupsService";

export const useGroupDetail = (groupId) =>
  useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupDetail(groupId),
    enabled: typeof groupId === "string" && groupId.length > 0,
    staleTime: 15000,
    gcTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      const status = error?.response?.status ?? error?.status;
      return status == null || status >= 500;
    },
  });
