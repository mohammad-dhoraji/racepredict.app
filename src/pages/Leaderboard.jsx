import React, { useCallback, useEffect, useMemo, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../lib/api";

const PAGE_SIZE = 20;

const mapLeaderboardError = (error) => {
  if (error?.status === 401) return "Please sign in to view leaderboard.";
  if (error?.isTimeout) return "Leaderboard request timed out. Please retry.";
  if (error?.isNetworkError) {
    return "Network issue while loading leaderboard. Please retry.";
  }
  return "Failed to load leaderboard.";
};

const toRows = (payloadRows) =>
  (payloadRows || []).map((row, index) => ({
    rank: Number(row.global_rank ?? index + 1),
    username: row.display_name || "Unknown",
    totalPoints: Number(row.total_points || 0),
  }));

const Leaderboard = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const season = useMemo(() => new Date().getUTCFullYear(), []);

  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest(
        `/v1/leaderboards/global?season=${season}&page=${page}&page_size=${PAGE_SIZE}`,
      );
      setRows(toRows(response?.data));
    } catch (err) {
      setRows([]);
      setError(mapLeaderboardError(err));
    } finally {
      setLoading(false);
    }
  }, [page, season]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  const topThree = rows.slice(0, 3);
  const hasNextPage = rows.length === PAGE_SIZE;

  return (
    <PageWrapper>
      <div className="min-h-screen w-full bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 overflow-x-hidden">
        <section className="max-w-5xl mx-auto mb-14">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Global Leaderboard
              </h1>
              <p className="text-zinc-400 mt-3">
                Season {season} standings
              </p>
            </div>

            <Button
              className="px-5 py-2"
              onClick={() => navigate("/home/predict")}
            >
              Make Prediction
            </Button>
          </div>
        </section>

        {loading ? (
          <section className="max-w-5xl mx-auto">
            <div className="text-zinc-400">Loading leaderboard...</div>
          </section>
        ) : error ? (
          <section className="max-w-5xl mx-auto">
            <div className="rounded-xl border border-red-500/40 bg-red-900/20 p-4 text-red-300">
              {error}
            </div>
            <div className="mt-4">
              <Button onClick={loadLeaderboard}>Retry</Button>
            </div>
          </section>
        ) : (
          <>
            <section className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mb-14">
              {topThree.map((user) => (
                <div
                  key={user.rank}
                  className={`relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-8 text-center shadow-2xl shadow-black/40 ${
                    user.rank === 1
                      ? "ring-2 ring-yellow-500/50"
                      : user.rank === 2
                        ? "ring-2 ring-gray-400/50"
                        : "ring-2 ring-orange-500/50"
                  }`}
                >
                  <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
                  <h2 className="text-3xl font-extrabold mb-3">#{user.rank}</h2>
                  <p className="text-xl font-semibold">{user.username}</p>
                  <p className="text-zinc-400 mt-3">
                    {user.totalPoints} pts
                  </p>
                </div>
              ))}
            </section>

            <section className="max-w-5xl mx-auto">
              <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
                <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
                <h3 className="text-2xl font-semibold mb-8 tracking-wide">
                  Full Rankings
                </h3>

                <div className="space-y-3">
                  {rows.map((user) => (
                    <div
                      key={`${user.rank}-${user.username}`}
                      className="flex justify-between items-center px-4 py-3 rounded-xl transition hover:bg-zinc-800"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-zinc-400">
                          #{user.rank}
                        </span>
                        <span className="font-medium">
                          {user.username}
                        </span>
                      </div>

                      <span className="font-bold">
                        {user.totalPoints} pts
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>

                  <span className="text-sm text-zinc-400">Page {page}</span>

                  <Button
                    onClick={() => setPage((current) => current + 1)}
                    disabled={!hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default Leaderboard;
