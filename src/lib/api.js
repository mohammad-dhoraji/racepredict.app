import { supabase } from "./supabaseClient";

const DEFAULT_TIMEOUT_MS = 10000;
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

const STATUS_CODE_MAP = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
};

const toApiError = ({
  status,
  code,
  message,
  isNetworkError = false,
  isTimeout = false,
}) => ({
  status,
  code,
  message,
  isNetworkError,
  isTimeout,
});

const isSafeRedirectPath = (path) => {
  if (typeof path !== "string" || path.length === 0) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  return true;
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;

  const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const safeCurrentPath = isSafeRedirectPath(currentPath) ? currentPath : "/";

  if (window.location.pathname === "/login") return;

  const nextLocation = `/login?redirect=${encodeURIComponent(safeCurrentPath)}`;
  window.location.assign(nextLocation);
};

const buildUrl = (path) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const readJsonSafely = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return await response.json();
  } catch {
    return null;
  }
};

const getAccessToken = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.access_token || null;
  } catch {
    return null;
  }
};

export const apiRequest = async (
  path,
  { method = "GET", body, headers = {}, timeoutMs = DEFAULT_TIMEOUT_MS } = {},
) => {
  const controller = new AbortController();

  const token = await getAccessToken();

  const requestHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Only attach Authorization when the request is to our API base origin
  const url = buildUrl(path);
  try {
    const requestOrigin = new URL(url).origin;
    const apiOrigin = new URL(API_BASE_URL).origin;
    if (token && requestOrigin === apiOrigin) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  } catch {
    // if URL parsing fails, avoid attaching token
  }

  let response;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    clearTimeout(timeoutId);

    if (error?.name === "AbortError") {
      throw toApiError({
        status: 0,
        code: "TIMEOUT",
        message: "Request timed out. Please try again.",
        isTimeout: true,
      });
    }

    throw toApiError({
      status: 0,
      code: "NETWORK_ERROR",
      message: "Network error. Please check your connection and try again.",
      isNetworkError: true,
    });
  }

  clearTimeout(timeoutId);

  const payload = await readJsonSafely(response);

  if (response.ok) {
    return payload ?? {};
  }

  if (response.status === 401) {
    redirectToLogin();

    throw toApiError({
      status: 401,
      code: "UNAUTHORIZED",
      message: "Please sign in to continue.",
    });
  }

  throw toApiError({
    status: response.status,
    code: STATUS_CODE_MAP[response.status] || "REQUEST_FAILED",
    message: "Request failed. Please try again.",
  });
};

export const apiPost = async (path, body, options = {}) =>
  apiRequest(path, {
    ...options,
    method: "POST",
    body,
  });

export { toApiError };
