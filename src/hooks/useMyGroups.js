import { useQuery } from "@tanstack/react-query";
import { getMyGroups } from "../services/groupsService";

const DEFAULT_LIMIT = 20;

export const useMyGroups = ({
  limit = DEFAULT_LIMIT,
  cursorCreatedAt,
  cursorId,
} = {}) =>
  useQuery({
    queryKey: ["groups", "my", { limit, cursorCreatedAt, cursorId }],
    queryFn: () => getMyGroups({ limit, cursorCreatedAt, cursorId }),
    staleTime: 30000,
    retry: 1,
  });
