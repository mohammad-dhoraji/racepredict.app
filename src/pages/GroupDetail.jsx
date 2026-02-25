import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import Button from "../components/Button";
import ApiMessage from "../components/ApiMessage";
import { useGroupDetail } from "../hooks/useGroupDetail";

const mapGroupDetailError = (error) => {
  if (error?.status === 401) {
    return "Please sign in to view this group.";
  }

  if (error?.status === 403) {
    return "You are not a member of this group.";
  }

  if (error?.status === 404) {
    return "Group not found.";
  }

  if (error?.isTimeout) {
    return "Loading group details took too long. Please try again.";
  }

  if (error?.isNetworkError) {
    return "Network issue. Please check your connection and try again.";
  }

  return "Unable to load group details right now. Please try again.";
};

const GroupDetailSkeleton = () => (
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

const GroupDetail = () => {
  const { groupId } = useParams();
  const exportRef = useRef(null);

  const { data: group, isLoading, isFetching, isError, error, refetch } =
    useGroupDetail(groupId);

  const downloadLeaderboard = async () => {
      if (!exportRef.current || !group) return;

    try {
        const dataUrl = await htmlToImage.toPng(exportRef.current, {
        backgroundColor: "#18181b",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${group.name}-leaderboard.png`;
      link.href = dataUrl;
      link.click();
    } catch (downloadError) {
      // Keep this local to avoid blocking page interaction on export failure.
      console.error("Error generating leaderboard image:", downloadError);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
          <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          {isLoading ? <GroupDetailSkeleton /> : null}

          {isError ? (
            <div className="space-y-4">
              <ApiMessage variant="error" message={mapGroupDetailError(error)} />
              <Button type="button" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          ) : null}

          {!isLoading && !isError && group ? (
            <div className="flex justify-between items-center flex-wrap gap-6">
              <div>
                <h1 className="text-4xl font-extrabold">{group.name}</h1>
                <p className="text-zinc-400 text-sm mt-2">
                  {group.memberCount} Members
                  {isFetching ? " | Refreshing..." : ""}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {group.inviteToken ? (
                  <div className="text-sm bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700">
                    Invite Code:{" "}
                    <span className="text-[#c1a362] font-semibold">
                      {group.inviteToken}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {!isLoading && !isError && group ? (
          <>
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold tracking-wide">Group Leaderboard</h2>
                <Button onClick={downloadLeaderboard}>Download Leaderboard</Button>
              </div>

              <div>
                <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden p-10 shadow-2xl shadow-black/40">
                  <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#c1a362]">{group.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1">Official Leaderboard</p>
                  </div>

                  <div className="hidden sm:grid grid-cols-4 px-2 py-3 text-sm text-zinc-400 border-b border-zinc-800">
                    <span>Rank</span>
                    <span>Username</span>
                    <span>Total Points</span>
                    <span>Last Race</span>
                  </div>
                  {(group.leaderboard || []).map((member) => (
                    <div
                      key={member.userId}
                      className="hidden sm:grid grid-cols-4 px-2 py-3 text-sm border-b border-zinc-800 last:border-none"
                    >
                      <span className="font-semibold">#{member.rank}</span>
                      <span>{member.username}</span>
                      <span>{member.totalPoints} pts</span>
                      <span className="text-[#c1a362]">+{member.lastRacePoints}</span>
                    </div>
                  ))}

                  {/* Mobile stacked cards */}
                  <div className="sm:hidden space-y-4">
                    {(group.leaderboard || []).map((member) => (
                      <div
                        key={member.userId}
                        className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700"
                      >
                        <div className="flex justify-between">
                          <span className="font-semibold">#{member.rank}</span>
                          <span className="text-[#c1a362]">+{member.lastRacePoints}</span>
                        </div>

                        <div className="mt-2 font-medium">{member.username}</div>

                        <div className="text-sm text-zinc-400">{member.totalPoints} pts</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 text-center text-xs text-zinc-500">f1predict.app</div>
                </div>
              </div>

              {/* Export-only off-screen leaderboard (always desktop layout) */}
              <div className="absolute -left-2499.75 top-0">
                <div ref={exportRef} className="w-225 mx-auto">
                  <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden p-10 shadow-2xl shadow-black/40">
                    <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-[#c1a362]">{group.name}</h3>
                      <p className="text-sm text-zinc-400 mt-1">Official Leaderboard</p>
                    </div>

                    <div className="grid grid-cols-4 px-2 py-3 text-sm text-zinc-400 border-b border-zinc-800">
                      <span>Rank</span>
                      <span>Username</span>
                      <span>Total Points</span>
                      <span>Last Race</span>
                    </div>

                    {(group.leaderboard || []).map((member) => (
                      <div
                        key={member.userId}
                        className="grid grid-cols-4 px-2 py-3 text-sm border-b border-zinc-800 last:border-none"
                      >
                        <span className="font-semibold">#{member.rank}</span>
                        <span>{member.username}</span>
                        <span>{member.totalPoints} pts</span>
                        <span className="text-[#c1a362]">+{member.lastRacePoints}</span>
                      </div>
                    ))}

                    <div className="mt-6 text-center text-xs text-zinc-500">f1predict.app</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 tracking-wide">
                Current Race - Prediction Status
              </h2>

              <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40 space-y-3">
                <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

                    {group.currentRace ? (
                  <>
                    <p className="text-zinc-300 text-sm mb-4">
                      {group.currentRace.name} ({group.currentRace.status})
                    </p>

                    {(group.currentRace.submissions || []).map((user) => (
                      <div key={user.userId} className="flex justify-between text-sm">
                        <span>{user.username}</span>
                        <span className={user.submitted ? "text-green-400" : "text-red-400"}>
                          {user.submitted ? "Submitted" : "Not Submitted"}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-zinc-400 text-sm">No race is currently available.</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8 tracking-wide">Past Race Results</h2>

              {(group.raceHistory || []).length === 0 ? (
                <p className="text-zinc-500">No completed races yet.</p>
              ) : (
                <div className="space-y-6">
                  {(group.raceHistory || []).map((race) => (
                    <div
                      key={race.raceId}
                      className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-8 shadow-2xl shadow-black/40"
                    >
                      <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
                      <h3 className="font-bold mb-6 text-lg">{race.name}</h3>

                      <div className="space-y-2 text-sm">
                        {(race.results || []).map((result, idx) => (
                          <div key={result.userId || idx} className="flex justify-between">
                            <span>{result.username}</span>
                            <span className="text-[#c1a362]">{result.points} pts</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default GroupDetail;
