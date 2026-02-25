import { apiRequest } from "../lib/api";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const clampLimit = (value) => {
  if (!Number.isFinite(value)) return DEFAULT_LIMIT;
  return Math.min(Math.max(Math.trunc(value), 1), MAX_LIMIT);
};

export const getMyGroups = async ({
  limit = DEFAULT_LIMIT,
  cursorCreatedAt,
  cursorId,
} = {}) => {
  const queryParams = new URLSearchParams();
  queryParams.set("limit", String(clampLimit(limit)));

  const hasCursorCreatedAt = typeof cursorCreatedAt === "string" && cursorCreatedAt.length > 0;
  const hasCursorId = typeof cursorId === "string" && cursorId.length > 0;

  if (hasCursorCreatedAt || hasCursorId) {
    if (!hasCursorCreatedAt || !hasCursorId) {
      throw new Error("cursorCreatedAt and cursorId must be provided together");
    }

    queryParams.set("cursorCreatedAt", cursorCreatedAt);
    queryParams.set("cursorId", cursorId);
  }

  return apiRequest(`/api/groups/my?${queryParams.toString()}`);
};

export const getGroupDetail = async (groupId) => {
  if (typeof groupId !== "string" || !UUID_REGEX.test(groupId)) {
    throw new Error("Invalid group id");
  }

  return apiRequest(`/api/groups/${groupId}`);
};
