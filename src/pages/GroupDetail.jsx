import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import { Copy, Check } from "lucide-react";
import { Skeleton } from "boneyard-js/react";
import Button from "../components/Button";
import ApiMessage from "../components/ApiMessage";
import Modal from "../components/Modal";
import { useGroupDetail } from "../hooks/useGroupDetail";
import { deleteGroup, leaveGroup } from "../services/groupsService";
import { queryClient } from "../lib/queryClient";
import { isBoneyardCapture } from "../lib/isBoneyardCapture";

const GROUP_DETAIL_FIXTURE = {
  name: "Paddock Masters",
  role: "admin",
  memberCount: 12,
  inviteToken: "GRIDLOCK26",
  leaderboard: [
    { userId: "fixture-1", rank: 1, username: "PoleRunner", totalPoints: 214, lastRacePoints: 21 },
    { userId: "fixture-2", rank: 2, username: "RacePace", totalPoints: 205, lastRacePoints: 18 },
    { userId: "fixture-3", rank: 3, username: "ApexAce", totalPoints: 197, lastRacePoints: 15 },
  ],
  currentRace: {
    name: "Japanese Grand Prix",
    status: "upcoming",
    submissions: [
      { userId: "fixture-1", username: "PoleRunner", submitted: true },
      { userId: "fixture-2", username: "RacePace", submitted: true },
      { userId: "fixture-3", username: "ApexAce", submitted: false },
    ],
  },
  raceHistory: [
    {
      raceId: "fixture-race-1",
      name: "Australian Grand Prix",
      results: [
        { userId: "fixture-1", username: "PoleRunner", points: 25 },
        { userId: "fixture-2", username: "RacePace", points: 18 },
      ],
    },
  ],
};

const mapGroupDetailError = (error) => {
  if (error?.status === 401) return "Please sign in to view this group.";
  if (error?.status === 403) return "You are not a member of this group.";
  if (error?.status === 404) return "Group not found.";
  if (error?.isTimeout)
    return "Loading group details took too long. Please try again.";
  if (error?.isNetworkError)
    return "Network issue. Please check your connection and try again.";
  return "Unable to load group details right now. Please try again.";
};

const GroupDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const exportRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const captureMode = isBoneyardCapture();

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    console.debug("[stability] GroupDetail mounted", { groupId });
    return () => {
      console.debug("[stability] GroupDetail unmounted", { groupId });
    };
  }, [groupId]);

  const {
    data: group,
    isError,
    isLoading,
    error,
    refetch,
  } = useGroupDetail(groupId);

  const displayGroup = captureMode ? group ?? GROUP_DETAIL_FIXTURE : group;
  const displayIsError = captureMode ? false : isError;
  const displayError = captureMode ? null : error;
  const isCreator = displayGroup?.role === "admin";

  const downloadLeaderboard = async () => {
    if (!exportRef.current || !displayGroup) return;

    try {
      const dataUrl = await htmlToImage.toPng(exportRef.current, {
        backgroundColor: "#18181b",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${displayGroup.name}-leaderboard.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating leaderboard image:", err);
    }
  };

  const handleCopyInvite = async () => {
    if (!displayGroup?.inviteToken) return;
    try {
      await navigator.clipboard.writeText(displayGroup.inviteToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDeleteGroup = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      await deleteGroup(groupId);
      setActionMessage({ type: "success", text: "Group deleted successfully" });
      // Invalidate groups cache and redirect
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.removeQueries({ queryKey: ["group", groupId] });

      navigate("/home/groups");
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err?.message || "Failed to delete group",
      });
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleLeaveGroup = async () => {
    setActionLoading(true);
    setActionMessage(null);
    try {
      await leaveGroup(groupId);
      setActionMessage({
        type: "success",
        text: "You left the group successfully",
      });
      // Invalidate groups cache and redirect
      await queryClient.invalidateQueries({ queryKey: ["groups"] });
      await queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      navigate("/home/groups");
    } catch (err) {
      setActionMessage({
        type: "error",
        text: err?.message || "Failed to leave group",
      });
    } finally {
      setActionLoading(false);
      setShowLeaveModal(false);
    }
  };
  useEffect(() => {
    if (!captureMode && isError && error?.status === 403) {
      navigate("/home/groups", { replace: true });
    }
  }, [captureMode, isError, error, navigate]);
  return (
    <Skeleton
      name="group-detail-page"
      loading={isLoading}
      animate="pulse"
      transition={300}
    >
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-4 sm:px-6 py-8 sm:py-10 w-full">
      <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
        {/* HEADER */}
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-6 sm:p-10 shadow-2xl shadow-black/40">
          <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />



          {displayIsError && (
            <div className="space-y-4">
              <ApiMessage
                variant="error"
                message={mapGroupDetailError(displayError)}
              />
              <Button
                type="button"
                onClick={refetch}
                className="w-full sm:w-auto"
              >
                Retry
              </Button>
            </div>
          )}

          {displayGroup && !displayIsError && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-4xl font-extrabold wrap-break-word">
                  {displayGroup.name}
                </h1>
                <p className="text-zinc-400 text-sm mt-2">
                  {displayGroup.memberCount} Members
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {displayGroup.inviteToken && (
                  <div className="flex items-center gap-3 text-sm bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="truncate">
                      <span>Invite Code: </span>
                      <span className="pl-5 text-[#c1a362] font-semibold">
                        {displayGroup.inviteToken}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyInvite}
                      className="flex items-center justify-center w-8 h-8 rounded-md border border-zinc-600 bg-zinc-700 hover:bg-zinc-600 transition"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                )}

                {/* Leave Group Button - visible for members but NOT creator */}
                {!isCreator && (
                  <Button
                    disabled={actionLoading}
                    onClick={() => setShowLeaveModal(true)}
                    className="w-full sm:w-auto"
                  >
                    Leave Group
                  </Button>
                )}

                {/* Delete Group Button - visible ONLY for creator */}
                {isCreator && (
                  <Button
                    disabled={actionLoading}
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-auto bg-red-900/30 border-red-700/40 text-red-400 hover:bg-red-900 hover:text-red-200"
                  >
                    Delete Group
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* LEADERBOARD SECTION */}
        {displayGroup && !displayIsError && (
          <>
            <div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold tracking-wide">
                  Group Leaderboard
                </h2>

                <Button
                  onClick={downloadLeaderboard}
                  className="w-full sm:w-auto"
                >
                  Download Leaderboard
                </Button>
              </div>

              <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden p-6 sm:p-10 shadow-2xl shadow-black/40">
                <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#c1a362] wrap-break-word">
                    {displayGroup.name}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Official Leaderboard
                  </p>
                </div>

                <div className="hidden sm:grid grid-cols-4 px-2 py-3 text-sm text-zinc-400 border-b border-zinc-800">
                  <span>Rank</span>
                  <span>Username</span>
                  <span>Total Points</span>
                  <span>Last Race</span>
                </div>

                {(displayGroup.leaderboard || []).map((member) => (
                  <div
                    key={member.userId}
                    className="hidden sm:grid grid-cols-4 px-2 py-3 text-sm border-b border-zinc-800 last:border-none"
                  >
                    <span className="font-semibold">#{member.rank}</span>
                    <span className="truncate">{member.username}</span>
                    <span>{member.totalPoints} pts</span>
                    <span className="text-[#c1a362]">
                      +{member.lastRacePoints}
                    </span>
                  </div>
                ))}

                {/* MOBILE */}
                <div className="sm:hidden space-y-4">
                  {(displayGroup.leaderboard || []).map((member) => (
                    <div
                      key={member.userId}
                      className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">#{member.rank}</span>
                        <span className="text-[#c1a362]">
                          +{member.lastRacePoints}
                        </span>
                      </div>

                      <div className="mt-2 font-medium wrap-break-word">
                        {member.username}
                      </div>

                      <div className="text-sm text-zinc-400">
                        {member.totalPoints} pts
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center text-xs text-zinc-500">
                  GridLock-app
                </div>
              </div>
            </div>

            {/* EXPORT SECTION (FIXED POSITIONING) */}
            <div className="fixed -left-2499.75 top-0" data-no-skeleton>
              <div ref={exportRef} className="w-225 mx-auto">
                <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden p-10 shadow-2xl shadow-black/40">
                  <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-[#c1a362]">
                      {displayGroup.name}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      Official Leaderboard
                    </p>
                  </div>

                  <div className="grid grid-cols-4 px-2 py-3 text-sm text-zinc-400 border-b border-zinc-800">
                    <span>Rank</span>
                    <span>Username</span>
                    <span>Total Points</span>
                    <span>Last Race</span>
                  </div>

                  {(displayGroup.leaderboard || []).map((member) => (
                    <div
                      key={member.userId}
                      className="grid grid-cols-4 px-2 py-3 text-sm border-b border-zinc-800 last:border-none"
                    >
                      <span className="font-semibold">#{member.rank}</span>
                      <span>{member.username}</span>
                      <span>{member.totalPoints} pts</span>
                      <span className="text-[#c1a362]">
                        +{member.lastRacePoints}
                      </span>
                    </div>
                  ))}

                  <div className="mt-6 text-center text-xs text-zinc-500">
                   GridLock.app
                  </div>
                </div>
              </div>
            </div>

            {/* CURRENT RACE SECTION */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 tracking-wide">
                Current Race - Prediction Status
              </h2>

              <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-6 sm:p-10 shadow-2xl shadow-black/40 space-y-3">
                <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

                {displayGroup.currentRace ? (
                  <>
                    <p className="text-zinc-300 text-sm mb-4 wrap-break-word">
                      {displayGroup.currentRace.name} ({displayGroup.currentRace.status})
                    </p>

                    {(displayGroup.currentRace.submissions || []).map((user) => (
                      <div
                        key={user.userId}
                        className="flex justify-between text-sm"
                      >
                        <span className="truncate">{user.username}</span>
                        <span
                          className={
                            user.submitted ? "text-green-400" : "text-red-400"
                          }
                        >
                          {user.submitted ? "Submitted" : "Not Submitted"}
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-zinc-400 text-sm">
                    No race is currently available.
                  </p>
                )}
              </div>
            </div>

            {/* PAST RACES SECTION */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 tracking-wide">
                Past Race Results
              </h2>

              {(displayGroup.raceHistory || []).length === 0 ? (
                <p className="text-zinc-500">No completed races yet.</p>
              ) : (
                <div className="space-y-6">
                  {(displayGroup.raceHistory || []).map((race) => (
                    <div
                      key={race.raceId}
                      className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-6 sm:p-8 shadow-2xl shadow-black/40"
                    >
                      <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
                      <h3 className="font-bold mb-6 text-lg wrap-break-word">
                        {race.name}
                      </h3>

                      <div className="space-y-2 text-sm">
                        {(race.results || []).map((result, idx) => (
                          <div
                            key={result.userId || idx}
                            className="flex justify-between"
                          >
                            <span className="truncate">{result.username}</span>
                            <span className="text-[#c1a362]">
                              {result.points} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Delete Group Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          type="error"
          title="Delete Group"
          message={`Are you sure you want to delete "${displayGroup?.name}"? This action cannot be undone and all members will be removed.`}
          confirmLabel={actionLoading ? "Deleting..." : "Delete Group"}
          onConfirm={handleDeleteGroup}
        />

        {/* Leave Group Modal */}
        <Modal
          isOpen={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          type="info"
          title="Leave Group"
          message={`Are you sure you want to leave "${displayGroup?.name}"? You will need to rejoin to participate again.`}
          confirmLabel={actionLoading ? "Leaving..." : "Leave Group"}
          onConfirm={handleLeaveGroup}
        />

        {/* Action Result Message */}
        {actionMessage && (
          <div className="fixed bottom-4 right-4 z-50">
            <ApiMessage
              variant={actionMessage.type}
              message={actionMessage.text}
            />
          </div>
        )}
      </div>
      </div>
    </Skeleton>
  );
};

export default GroupDetail;
