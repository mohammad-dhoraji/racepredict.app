import React from "react";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const Leaderboard = () => {
  const navigate = useNavigate();

  // 🔥 Replace with API later
  const leaderboard = [
    { rank: 1, username: "SpeedKing", totalPoints: 210, lastRace: 20 },
    { rank: 2, username: "PodiumPro", totalPoints: 198, lastRace: 15 },
    { rank: 3, username: "FastF1", totalPoints: 190, lastRace: 10 },
    { rank: 4, username: "RaceMaster", totalPoints: 187, lastRace: 12 },
    { rank: 5, username: "You", totalPoints: 185, lastRace: 15 },
    { rank: 6, username: "TurboMax", totalPoints: 170, lastRace: 5 },
    { rank: 7, username: "ApexHunter", totalPoints: 162, lastRace: 8 },
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full">
        
        {/* Header */}
        <section className="max-w-5xl mx-auto mb-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Global Leaderboard
              </h1>
              <p className="text-zinc-400 mt-2">
                Compete. Predict. Dominate.
              </p>
            </div>

            <Button
              className="px-5 py-2"
              onClick={() => navigate("/predict")}
            >
              Make Prediction
            </Button>
          </div>
        </section>

        {/* Top 3 Highlight */}
        <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
          {leaderboard.slice(0, 3).map((user) => (
            <div
              key={user.rank}
              className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center shadow-xl ${
                user.rank === 1
                  ? "ring-2 ring-yellow-500"
                  : user.rank === 2
                  ? "ring-2 ring-gray-400"
                  : "ring-2 ring-orange-500"
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">#{user.rank}</h2>
              <p className="text-lg font-semibold">{user.username}</p>
              <p className="text-zinc-400 mt-2">
                {user.totalPoints} pts
              </p>
              <p className="text-green-500 text-sm mt-1">
                +{user.lastRace} last race
              </p>
            </div>
          ))}
        </section>

        {/* Full Leaderboard Table */}
        <section className="max-w-5xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-semibold mb-6">
              Full Rankings
            </h3>

            <div className="space-y-3">
              {leaderboard.map((user) => (
                <div
                  key={user.rank}
                  className={`flex justify-between items-center px-4 py-3 rounded-xl transition ${
                    user.username === "You"
                      ? "bg-red-600/20 border border-red-500"
                      : "hover:bg-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-zinc-400">
                      #{user.rank}
                    </span>
                    <span className="font-medium">
                      {user.username}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-green-500 font-semibold">
                      +{user.lastRace}
                    </span>
                    <span className="font-bold">
                      {user.totalPoints} pts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Leaderboard;
