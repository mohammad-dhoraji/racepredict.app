import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import ApiMessage from "../components/ApiMessage";
import { useMyGroups } from "../hooks/useMyGroups";
import { Share2 } from "lucide-react";
import ShareModal from "../components/ShareModal";

const mapGroupsLoadError = (error) => {
  const status = error?.status ?? error?.response?.status;

  if (status === 401) {
    return "Please sign in to view your groups.";
  }

  if (error?.isTimeout) {
    return "Loading groups took too long. Please try again.";
  }

  if (error?.isNetworkError) {
    return "Network issue. Please check your connection and try again.";
  }

  return "Unable to load your groups right now. Please try again.";
};

const GroupsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
      >
        <div className="h-4 w-48 rounded bg-zinc-700/70" />
        <div className="mt-3 h-3 w-36 rounded bg-zinc-700/50" />
      </div>
    ))}
  </div>
);

const Groups = () => {
  const [joinToken, setJoinToken] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useMyGroups();
  const [activeShare, setActiveShare] = useState(null);
  const normalizedJoinToken = useMemo(() => joinToken.trim(), [joinToken]);
  const groups = useMemo(() => data?.groups || [], [data]);

  const handleCreateGroup = () => {
    navigate("/groups/create");
  };

  const handleJoinGroup = () => {
    if (!normalizedJoinToken) return;

    navigate(`/join/${encodeURIComponent(normalizedJoinToken)}`);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black px-6 py-10 text-white w-full">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Groups
            </h1>
            <p className="text-zinc-400">
              Compete privately with friends. Create or join a group.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-14">
            <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
              <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
              <h2 className="text-2xl font-semibold mb-8 tracking-wide">
                Create Group
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                Start a new private group and share an invite link.
              </p>
              <Button onClick={handleCreateGroup}>Create Group</Button>
            </div>

            <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
              <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
              <h2 className="text-2xl font-semibold mb-8 tracking-wide">
                Join Group
              </h2>
              <label htmlFor="join-token" className="sr-only">
                Enter invite token
              </label>
              <input
                id="join-token"
                type="text"
                placeholder="Enter invite token"
                aria-label="Join token"
                value={joinToken}
                onChange={(event) => setJoinToken(event.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 mb-6 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              />
              <Button onClick={handleJoinGroup} disabled={!normalizedJoinToken}>
                Join Group
              </Button>
            </div>
          </div>

          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold tracking-wide">
                Your Groups
              </h2>
              <div className="flex items-center gap-3">
                {isFetching && !isLoading ? (
                  <span className="text-xs uppercase tracking-wider text-zinc-500">
                    Refreshing...
                  </span>
                ) : null}
                <Button type="button" onClick={() => refetch()}>
                  Refresh
                </Button>
              </div>
            </div>

            {isLoading ? <GroupsSkeleton /> : null}

            {isError ? (
              <div className="space-y-4">
                <ApiMessage
                  variant="error"
                  message={mapGroupsLoadError(error)}
                />
                <Button type="button" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError && groups.length === 0 ? (
              <p className="text-zinc-500">
                You are not in any groups yet. Create one or join with an invite
                token.
              </p>
            ) : null}

            {!isLoading && !isError && groups.length > 0 ? (
              <div className="space-y-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {group.name}
                        </h3>
                        <p className="text-sm text-zinc-400">
                          Role: {group.role ?? "—"} | Members:{" "}
                          {group.memberCount ?? 0}
                        </p>
                      </div>

                      <Button
                        type="button"
                        onClick={() => navigate(`/groups/${group.id}`)}
                      >
                        Open Group
                      </Button>
                    </div>

                    {group.inviteToken && (
                      <div className="mt-3">
                        <Button
                          type="button"
                          onClick={() => {
                            const link = `${window.location.origin}/join/${encodeURIComponent(
                              group.inviteToken
                            )}`;
                            setActiveShare({
                              link,
                              name: group.name,
                            });
                          }}
                        >
                          <span className="flex items-center gap-2">
                            <Share2 size={16} />
                            Invite Friends
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={!!activeShare}
        inviteLink={activeShare?.link}
        groupName={activeShare?.name}
        onClose={() => setActiveShare(null)}
      />
    </PageWrapper>
  );
};

export default Groups;
