import React, { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import ApiMessage from "../components/ApiMessage";
import { apiPost } from "../lib/api";

const MIN_GROUP_NAME_LENGTH = 3;
const MAX_GROUP_NAME_LENGTH = 40;

const mapCreateGroupError = (error) => {
  if (error?.status === 400) {
    return "Group name must be between 3 and 40 characters.";
  }

  if (error?.status === 401) {
    return "Please sign in to create a group.";
  }

  if (error?.isTimeout) {
    return "The request took too long. Please try again.";
  }

  if (error?.isNetworkError) {
    return "Network issue. Please check your connection and try again.";
  }

  return "Unable to create group right now. Please try again.";
};

function LoadingSpinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
  );
}

export default function CreateGroup() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  const trimmedName = useMemo(() => name.trim(), [name]);

  const validateName = () => {
    if (
      trimmedName.length < MIN_GROUP_NAME_LENGTH ||
      trimmedName.length > MAX_GROUP_NAME_LENGTH
    ) {
      return "Group name must be between 3 and 40 characters.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    const validationMessage = validateName();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      setInviteLink("");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setInviteLink("");

    try {
      const data = await apiPost("/api/groups", { name: trimmedName });
      const inviteToken = data?.inviteToken;
      const inviteUrl = inviteToken ? `${window.location.origin}/join/${inviteToken}` : "";
      setInviteLink(inviteUrl);
      await queryClient.invalidateQueries({ queryKey: ["groups", "my"] });
      setName("");
    } catch (error) {
      setErrorMessage(mapCreateGroupError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black px-6 py-10 text-white">
        <div className="mx-auto w-full max-w-3xl">
          <div className="relative rounded-b-3xl border border-zinc-800 bg-zinc-900/70 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="absolute -top-1 left-0 h-0.75 w-full rounded-t-3xl bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362]" />

            <h1 className="text-3xl font-extrabold tracking-tight">Create Group</h1>
            <p className="mt-2 text-zinc-400">
              Create a private group and share the invite link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block text-sm text-zinc-300" htmlFor="group-name">
                Group Name
              </label>
              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={MAX_GROUP_NAME_LENGTH}
                placeholder="Enter group name"
                disabled={loading}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#c1a362] disabled:cursor-not-allowed disabled:opacity-70"
              />

              <p className="text-xs text-zinc-500">
                {MIN_GROUP_NAME_LENGTH}-{MAX_GROUP_NAME_LENGTH} characters.
              </p>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    Creating...
                  </span>
                ) : (
                  "Create Group"
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <ApiMessage variant="error" message={errorMessage} />
              <ApiMessage
                variant="success"
                message={inviteLink ? "Group created successfully." : ""}
              />

              {inviteLink ? (
                <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
                  <p className="mb-2 text-xs uppercase tracking-wider text-zinc-400">
                    Invite Link
                  </p>
                  <p className="break-all text-sm text-[#c1a362]">{inviteLink}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
