import React, { useRef } from "react";
import * as htmlToImage from "html-to-image";
import Button from "../components/Button";

const GroupDetail = () => {
  const leaderboardRef = useRef(null);

  // TODO  Replace with real API later
  const group = {
    id: 1,
    name: "Ferrari Fans",
    inviteCode: "FERRARI24",
    members: [
      { id: 1, username: "SpeedKing", totalPoints: 210, lastRace: 25 },
      { id: 2, username: "Mohammad", totalPoints: 185, lastRace: 15 },
      { id: 3, username: "Leclerc44", totalPoints: 170, lastRace: 10 },
    ],
    currentRace: {
      name: "Australian GP",
      status: "open",
      submissions: [
        { username: "SpeedKing", submitted: true },
        { username: "Mohammad", submitted: true },
        { username: "Leclerc44", submitted: false },
      ],
    },
    raceHistory: [
      {
        name: "Bahrain GP",
        results: [
          { username: "SpeedKing", points: 25 },
          { username: "Mohammad", points: 15 },
          { username: "Leclerc44", points: 10 },
        ],
      },
      {
        name: "Saudi Arabian GP",
        results: [
          { username: "SpeedKing", points: 20 },
          { username: "Mohammad", points: 10 },
          { username: "Leclerc44", points: 5 },
        ],
      },
    ],
  };

  const sortedLeaderboard = [...group.members].sort(
    (a, b) => b.totalPoints - a.totalPoints
  );

  // 🔥 Download Leaderboard as Image
  const downloadLeaderboard = async () => {
    if (!leaderboardRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(leaderboardRef.current, {
        backgroundColor: "#18181b",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${group.name}-leaderboard.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* ================= HEADER ================= */}
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
          <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          <div className="flex justify-between items-center flex-wrap gap-6">
            <div>
              <h1 className="text-4xl font-extrabold">{group.name}</h1>
              <p className="text-zinc-400 text-sm mt-2">
                {group.members.length} Members
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm bg-zinc-800/50 px-4 py-2 rounded-xl border border-zinc-700">
                Invite Code:{" "}
                <span className="text-[#c1a362] font-semibold">
                  {group.inviteCode}
                </span>
              </div>
              <Button>Leave Group</Button>
            </div>
          </div>
        </div>

        {/* ================= LEADERBOARD ================= */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold tracking-wide">Group Leaderboard</h2>
            <Button onClick={downloadLeaderboard}>
              Download Leaderboard
            </Button>
          </div>

          <div ref={leaderboardRef}>
            <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl overflow-hidden p-10 shadow-2xl shadow-black/40">
              <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
              
              {/* Share Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#c1a362]">
                  {group.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">
                  Official Leaderboard
                </p>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-4 px-2 py-3 text-sm text-zinc-400 border-b border-zinc-800">
                <span>Rank</span>
                <span>Username</span>
                <span>Total Points</span>
                <span>Last Race</span>
              </div>

              {/* Members */}
              {sortedLeaderboard.map((member, index) => (
                <div
                  key={member.id}
                  className="grid grid-cols-4 px-2 py-3 text-sm border-b border-zinc-800 last:border-none"
                >
                  <span className="font-semibold">#{index + 1}</span>
                  <span>{member.username}</span>
                  <span>{member.totalPoints} pts</span>
                  <span className="text-[#c1a362]">
                    +{member.lastRace}
                  </span>
                </div>
              ))}

              {/* Branding */}
              <div className="mt-6 text-center text-xs text-zinc-500">
                f1predict.app
              </div>
            </div>
          </div>
        </div>

        {/* ================= CURRENT RACE STATUS ================= */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 tracking-wide">
            {group.currentRace.name} – Prediction Status
          </h2>

          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40 space-y-3">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            {group.currentRace.submissions.map((user, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{user.username}</span>
                <span
                  className={
                    user.submitted
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {user.submitted ? "Submitted" : "Not Submitted"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= RACE HISTORY ================= */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 tracking-wide">
            Past Race Results
          </h2>

          <div className="space-y-6">
            {group.raceHistory.map((race, index) => (
              <div
                key={index}
                className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-8 shadow-2xl shadow-black/40"
              >
                <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
                <h3 className="font-bold mb-6 text-lg">{race.name}</h3>

                <div className="space-y-2 text-sm">
                  {race.results.map((result, i) => (
                    <div
                      key={i}
                      className="flex justify-between"
                    >
                      <span>{result.username}</span>
                      <span className="text-[#c1a362]">
                        {result.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GroupDetail;
