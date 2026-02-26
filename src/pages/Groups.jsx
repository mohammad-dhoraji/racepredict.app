import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import ApiMessage from "../components/ApiMessage";
import { useMyGroups } from "../hooks/useMyGroups";
import { Share2, Plus, RefreshCw } from "lucide-react";
import ShareModal from "../components/ShareModal";

const mapGroupsLoadError = (error) => {
  const status = error?.status ?? error?.response?.status;

  if (status === 401) return "Please sign in to view your groups.";
  if (error?.isTimeout)
    return "Loading groups took too long. Please try again.";
  if (error?.isNetworkError)
    return "Network issue. Please check your connection and try again.";

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
  const [activeShare, setActiveShare] = useState(null);

  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } =
    useMyGroups();

  const normalizedJoinToken = useMemo(() => joinToken.trim(), [joinToken]);
  const groups = useMemo(() => data?.groups || [], [data]);
  const hasGroups = groups.length > 0;

  const handleJoinGroup = () => {
    if (!normalizedJoinToken) return;
    navigate(`/join/${encodeURIComponent(normalizedJoinToken)}`);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen w-full overflow-x-hidden bg-linear-to-b from-neutral-800 via-neutral-950 to-black px-6 py-10 text-white">
          <div className="max-w-5xl mx-auto space-y-10 w-full">
          {/* HEADER */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Your Groups
            </h1>
            <p className="text-zinc-400">Compete privately with friends.</p>
          </div>

          {/* GROUPS CARD */}
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-8 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Groups</h2>

              <div className="flex items-center gap-3">
                {isFetching && !isLoading && (
                  <span className="text-xs text-zinc-500 uppercase tracking-wide">
                    Refreshing...
                  </span>
                )}
                <Button onClick={() => refetch()}>
                  <RefreshCw size={16} />
                </Button>
              </div>
            </div>

            {isLoading && <GroupsSkeleton />}

            {isError && (
              <div className="space-y-4">
                <ApiMessage
                  variant="error"
                  message={mapGroupsLoadError(error)}
                />
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            )}

            {!isLoading && !isError && !hasGroups && (
              <p className="text-zinc-500">You are not in any groups yet.</p>
            )}

            {!isLoading && !isError && hasGroups && (
              <div className="space-y-4">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{group.name}</h3>
                        <p className="text-sm text-zinc-400">
                          Role: {group.role ?? "—"} | Members:{" "}
                          {group.memberCount ?? 0}
                        </p>
                      </div>

                      <Button onClick={() => navigate(`/groups/${group.id}`)}>
                        Open
                      </Button>
                    </div>

                    {group.inviteToken && (
                      <div className="mt-3">
                        <Button
                          onClick={() => {
                            const link = `${window.location.origin}/join/${encodeURIComponent(
                              group.inviteToken,
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
            )}
          </div>

          {/* ACTIONS CARD */}
          <div className="relative bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6">Create or Join</h2>

              <div className="flex flex-col md:flex-row gap-6">
              <Button onClick={() => navigate("/groups/create")}>
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  Create Group
                </span>
              </Button>

              <div className="flex flex-col sm:flex-row w-full gap-3 md:w-auto min-w-0">
                <input
                  type="text"
                  placeholder="Invite token"
                  value={joinToken}
                  onChange={(e) => setJoinToken(e.target.value)}
                  className="min-w-0 flex-1 bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
                />
                <Button
                  onClick={handleJoinGroup}
                  disabled={!normalizedJoinToken}
                >
                  Join
                </Button>
              </div>
            </div>
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
