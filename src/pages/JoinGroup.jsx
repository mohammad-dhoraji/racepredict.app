import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ApiMessage from "../components/ApiMessage";
import Button from "../components/Button";
import { apiPost } from "../lib/api";

const INVITE_TOKEN_REGEX = /^[A-Za-z0-9]{8,12}$/;

const mapJoinError = (error) => {
  if (error?.status === 400) return "Invalid invite link.";
  if (error?.status === 404) return "Group not found.";
  if (error?.status === 409) return "Already in group.";
  if (error?.isTimeout) return "The request took too long. Please try again.";
  if (error?.isNetworkError) {
    return "Network issue. Please check your connection and try again.";
  }

  return "Could not join group right now. Please try again.";
};

const buildLoginRedirectPath = (inviteToken) =>
  `/login?redirect=${encodeURIComponent(`/join/${inviteToken}`)}`;

function LoadingSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
  );
}

export default function JoinGroup() {
  const queryClient = useQueryClient();
  const { inviteToken = "" } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("Preparing invite...");

  const hasAttemptedRef = useRef(false);

  const normalizedToken = useMemo(() => inviteToken.trim(), [inviteToken]);
  const isValidToken = useMemo(
    () => INVITE_TOKEN_REGEX.test(normalizedToken),
    [normalizedToken],
  );

  const tryJoinGroup = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("Joining group...");

    try {
        await apiPost(`/api/groups/join/${normalizedToken}`);
        setInfoMessage("Joined successfully. Redirecting...");
        try {
          await queryClient.invalidateQueries({ queryKey: ["groups", "my"] });
        } catch (err) {
          console.error("Failed to refresh groups after join:", err);
        }
        navigate("/groups", { replace: true });
    } catch (error) {
        // If unauthorized, redirect to login flow instead of showing a retry message
        if (error?.status === 401) {
          setLoading(false);
          navigate(buildLoginRedirectPath(normalizedToken), { replace: true });
          return;
        }

        setInfoMessage("");
        setErrorMessage(mapJoinError(error));
    } finally {
      setLoading(false);
    }
  }, [loading, normalizedToken, navigate, queryClient]);

  useEffect(() => {
    if (authLoading) {
      setInfoMessage("Checking session...");
      return;
    }

    if (!user) {
      navigate(buildLoginRedirectPath(normalizedToken), { replace: true });
      return;
    }

    if (!isValidToken) {
      setInfoMessage("");
      setErrorMessage("Invalid invite link.");
      return;
    }

    if (hasAttemptedRef.current || loading) {
      return;
    }

    hasAttemptedRef.current = true;
    tryJoinGroup();
  }, [authLoading, user, isValidToken, loading, normalizedToken, navigate, tryJoinGroup]);

  const canRetry = !loading && !!user && isValidToken;

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black px-6 py-10 text-white">
      <div className="mx-auto w-full max-w-2xl">
        <div className="relative rounded-b-3xl border border-zinc-800 bg-zinc-900/70 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="absolute -top-1 left-0 h-0.75 w-full rounded-t-3xl bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362]" />

          <h1 className="text-3xl font-extrabold tracking-tight">Join Group</h1>
          <p className="mt-2 text-zinc-400">Invite token: {normalizedToken || "N/A"}</p>

          <div className="mt-8 space-y-4">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-zinc-200">
                <LoadingSpinner />
                Joining group...
              </div>
            ) : null}

            {!loading && <ApiMessage variant="info" message={infoMessage} />}
            <ApiMessage variant="error" message={errorMessage} />

            <Button
              type="button"
              disabled={!canRetry}
              onClick={() => {
                hasAttemptedRef.current = true;
                tryJoinGroup();
              }}
              className="w-full"
            >
              {loading ? "Joining..." : "Retry Join"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
