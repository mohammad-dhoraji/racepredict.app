import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, Share2 } from "lucide-react";
import AppSkeleton from "../components/AppSkeleton";
import ApiMessage from "../components/ApiMessage";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import ShareModal from "../components/ShareModal";
import { useMyGroups } from "../hooks/useMyGroups";

const GROUPS_FIXTURE = [
  {
    id: "fixture-group-1",
    name: "Paddock Club",
    role: "admin",
    memberCount: 8,
    inviteToken: "PADDOCK26",
  },
  {
    id: "fixture-group-2",
    name: "Late Brakers",
    role: "member",
    memberCount: 14,
    inviteToken: "LATE26",
  },
];

const mapGroupsLoadError = (error) => {
  const status = error?.status ?? error?.response?.status;

  if (status === 401) return "Please sign in to view your groups.";
  if (error?.isTimeout) {
    return "Loading groups took too long. Please try again.";
  }
  if (error?.isNetworkError) {
    return "Network issue. Please check your connection and try again.";
  }

  return "Unable to load your groups right now. Please try again.";
};

function GroupsContent({
  error,
  groups,
  interactive,
  isError,
  joinToken,
  onCreateGroup,
  onJoinGroup,
  onJoinTokenChange,
  onOpenGroup,
  onOpenShare,
  onRetry,
}) {
  const hasGroups = groups.length > 0;
  const normalizedJoinToken = joinToken.trim();

  return (
    <div className="bg-linear-to-b from-neutral-800 via-neutral-950 to-black px-6 py-28">
      <div className="max-w-4xl mx-auto space-y-16">
        <div>
          <h1 className="font-f1 text-4xl md:text-6xl font-black tracking-tight uppercase leading-none mb-6 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Your Groups
          </h1>
          <p className="text-lg text-muted-foreground">
            Compete privately with friends
          </p>
        </div>

        <div className="bg-background/80 backdrop-blur-sm border border-border/80 rounded-2xl p-8 animate-gridlockFadeIn">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-2">
                Your Groups
              </p>
              <h2 className="font-f1 text-2xl md:text-3xl font-bold uppercase tracking-[0.15em] text-foreground mb-8">
                Groups List
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={interactive ? onRetry : undefined}
                disabled={!interactive}
                aria-label="Refresh groups"
              >
                <RefreshCw size={16} />
              </Button>
            </div>
          </div>

          {isError && (
            <div className="space-y-4">
              <ApiMessage
                variant="error"
                message={mapGroupsLoadError(error)}
              />
              <Button onClick={interactive ? onRetry : undefined} disabled={!interactive}>
                Retry
              </Button>
            </div>
          )}

          {!isError && !hasGroups && (
            <p className="text-muted-foreground py-12 text-center">
              No groups yet. Create your first group.
            </p>
          )}

          {!isError && hasGroups && (
            <div className="space-y-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border border-border/50 hover:border-primary/50 bg-secondary/30 backdrop-blur-sm rounded-xl p-6 transition-all duration-200 animate-gridlockFadeIn"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-f1 text-lg font-bold text-foreground mb-1">
                        {group.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Role:{" "}
                        <span className="font-semibold">
                          {group.role ?? "-"}
                        </span>{" "}
                        | Members: {group.memberCount ?? 0}
                      </p>
                    </div>

                    <Button
                      onClick={interactive ? () => onOpenGroup(group.id) : undefined}
                      disabled={!interactive}
                    >
                      Open
                    </Button>
                  </div>

                  {group.inviteToken && (
                    <div className="mt-3">
                      <Button
                        onClick={
                          interactive ? () => onOpenShare(group) : undefined
                        }
                        disabled={!interactive}
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

        <div className="bg-background/80 backdrop-blur-sm border border-border/80 rounded-2xl p-8 animate-gridlockFadeIn">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-2">
              Quick Actions
            </p>
            <h2 className="font-f1 text-2xl md:text-2xl font-bold uppercase tracking-[0.15em] text-foreground mb-8">
              Create or Join Group
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <Button
              onClick={interactive ? onCreateGroup : undefined}
              disabled={!interactive}
            >
              <span className="flex items-center gap-2">
                <Plus size={16} />
                Create Group
              </span>
            </Button>

            <div className="flex flex-col sm:flex-row w-full gap-3 md:w-auto min-w-0">
              <input
                type="text"
                placeholder="Enter invite token"
                value={joinToken}
                onChange={
                  interactive ? (event) => onJoinTokenChange(event.target.value) : undefined
                }
                readOnly={!interactive}
                className="min-w-0 flex-1 bg-secondary/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground transition-colors"
              />

              <Button
                onClick={interactive ? onJoinGroup : undefined}
                disabled={!interactive || !normalizedJoinToken}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Groups = () => {
  const [joinToken, setJoinToken] = useState("");
  const [activeShare, setActiveShare] = useState(null);

  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useMyGroups();

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    console.debug("[stability] Groups mounted");
    return () => {
      console.debug("[stability] Groups unmounted");
    };
  }, []);

  const groups = useMemo(() => data?.groups || [], [data]);

  const handleJoinGroup = () => {
    const normalizedJoinToken = joinToken.trim();
    if (!normalizedJoinToken) return;
    navigate(`/join/${encodeURIComponent(normalizedJoinToken)}`);
  };

  return (
    <PageWrapper>
      <AppSkeleton
        name="groups-page"
        loading={isLoading && !data}
        placeholder={
          <GroupsContent
            error={null}
            groups={GROUPS_FIXTURE}
            interactive={false}
            isError={false}
            joinToken="PADDOCK26"
            onCreateGroup={() => {}}
            onJoinGroup={() => {}}
            onJoinTokenChange={() => {}}
            onOpenGroup={() => {}}
            onOpenShare={() => {}}
            onRetry={() => {}}
          />
        }
      >
        <GroupsContent
          error={error}
          groups={groups}
          interactive={true}
          isError={isError}
          joinToken={joinToken}
          onCreateGroup={() => navigate("/home/groups/create")}
          onJoinGroup={handleJoinGroup}
          onJoinTokenChange={setJoinToken}
          onOpenGroup={(groupId) => navigate(`/home/groups/${groupId}`)}
          onOpenShare={(group) => {
            const link = `${window.location.origin}/join/${encodeURIComponent(
              group.inviteToken,
            )}`;
            setActiveShare({
              link,
              name: group.name,
            });
          }}
          onRetry={() => refetch()}
        />
      </AppSkeleton>

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
