import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "boneyard-js/react";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import CalendarModal from "../components/CalendarModal";
import ErrorMessage from "../components/ErrorMessage";
import RacePredictionHeroAnimation from "../components/RacePredictionHeroAnimation";

import { useNextRace } from "../hooks/useNextRace";
import NextRaceCard from "../features/races/NextRaceCard";

import { useLeaderboard } from "../hooks/useLeaderboard";
import { useProfile } from "../hooks/useProfile";

const HOME_LEADERBOARD_FIXTURE = [
  { rank: 1, name: "VerstappenVision", points: 214 },
  { rank: 2, name: "ApexHunter", points: 201 },
  { rank: 3, name: "LateBraker", points: 198 },
  { rank: 4, name: "MonzaMode", points: 191 },
  { rank: 5, name: "SlipstreamSam", points: 186 },
];

const HOME_STATS_FIXTURE = {
  totalPoints: 184,
  globalRank: 12,
  lastRaceScore: 18,
};

function formatLastRaceScore(score) {
  if (score == null) return "-";
  return score > 0 ? `+${score}` : `${score}`;
}

function LeaderboardPreview({ items }) {
  return (
    <div className="space-y-2.5">
      {items.map((entry, index) => (
        <div
          key={entry.rank || index}
          className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/40 px-3 py-2.5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`w-8 text-sm font-semibold ${
                entry.rank === 1 ? "text-[#c1a362]" : "text-zinc-500"
              }`}
            >
              #{entry.rank}
            </span>
            <span className="truncate text-sm font-medium text-zinc-200">
              {entry.name}
            </span>
          </div>
          <span className="text-sm font-semibold text-zinc-100">
            {entry.points} pts
          </span>
        </div>
      ))}
    </div>
  );
}

function PerformanceSummary({ totalPoints, rank, lastRace }) {
  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Total Points
        </p>
        <p className="mt-1 text-2xl font-semibold text-zinc-100">{totalPoints}</p>
      </div>
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Global Rank
        </p>
        <p className="mt-1 text-2xl font-semibold text-zinc-100">{rank}</p>
      </div>
      <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/35 px-4 py-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          Last Race
        </p>
        <p className="mt-1 text-2xl font-semibold text-emerald-400">{lastRace}</p>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    console.debug("[stability] Home mounted");
    return () => {
      console.debug("[stability] Home unmounted");
    };
  }, []);

  const { data: race, isLoading: raceLoading, error: raceError, refetch: refetchRace } =
    useNextRace();
  const {
    data: topItems = [],
    isLoading: topLoading,
    error: topError,
    refetch: refetchTop,
  } = useLeaderboard({ mode: "preview", pageSize: 5 });
  const {
    summary: stats,
    loading: statsLoading,
    error: statsError,
    refetchSummary: refetchStats,
  } = useProfile({ includePredictions: false });

  const totalPoints = stats?.totalPoints ?? 0;
  const rank = stats?.globalRank == null ? "-" : `#${stats.globalRank}`;
  const lastRace = formatLastRaceScore(stats?.lastRaceScore);

  const fixtureRank = `#${HOME_STATS_FIXTURE.globalRank}`;
  const fixtureLastRace = formatLastRaceScore(HOME_STATS_FIXTURE.lastRaceScore);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white w-full px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="max-w-6xl mx-auto mb-12 overflow-hidden">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            <div>
              <p className="mb-5 text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
                Weekend Prediction Hub
              </p>
              <h1 className="text-4xl font-extrabold leading-[0.95] tracking-tight text-zinc-100 sm:text-5xl lg:text-6xl">
                Predict the Podium.
                <span className="mt-2 block text-zinc-300">Climb the Leaderboard.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                Lock in your top 3 and Driver of the Day before lights out. Every accurate
                call pushes you closer to the front.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-lg border-[#b2132d] bg-[#b2132d] hover:bg-[#8b0e23] px-7 py-2.5 text-[15px] tracking-[0.18em] text-white hover:text-white hover:shadow-none"
                  onClick={() => navigate("/home/predict")}
                >
                  Make Prediction
                </Button>
              </div>
            </div>

            <RacePredictionHeroAnimation
              trackName={race?.name || "this weekend"}
            />
          </div>
        </section>

        <div className="[&_section]:max-w-6xl [&_section]:mb-10 [&_section>div]:rounded-2xl [&_section>div]:border-zinc-800/70 [&_section>div]:bg-zinc-900/55 [&_section>div]:shadow-none">
          <NextRaceCard
            race={race}
            loading={raceLoading}
            error={raceError}
            onEdit={() => navigate("/home/predict")}
            onRetry={refetchRace}
          />
        </div>

        <section className="max-w-6xl mx-auto grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/55 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-wide text-zinc-100">
                Top 5 Leaderboard
              </h2>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-zinc-200"
                onClick={() => navigate("/home/leaderboard")}
              >
                View Full
              </button>
            </div>

            <Skeleton
              name="home-leaderboard-preview"
              loading={topLoading}
              animate="pulse"
              transition={300}
              fixture={<LeaderboardPreview items={HOME_LEADERBOARD_FIXTURE} />}
            >
              {topError ? (
                <ErrorMessage
                  message={topError.message || "Failed to load leaderboard."}
                  onRetry={refetchTop}
                />
              ) : topItems?.length ? (
                <LeaderboardPreview items={topItems} />
              ) : (
                <p className="py-6 text-sm text-zinc-400">
                  Leaderboard data is not available yet.
                </p>
              )}
            </Skeleton>
          </article>

          <article className="rounded-2xl border border-zinc-800/80 bg-zinc-900/45 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-wide text-zinc-100">
                Your Performance
              </h2>
              <button
                type="button"
                className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 transition-colors hover:text-zinc-200"
                onClick={() => navigate("/home/profile")}
              >
                Full Stats
              </button>
            </div>

            <Skeleton
              name="home-performance-stats"
              loading={statsLoading}
              animate="pulse"
              transition={300}
              fixture={
                <PerformanceSummary
                  totalPoints={HOME_STATS_FIXTURE.totalPoints}
                  rank={fixtureRank}
                  lastRace={fixtureLastRace}
                />
              }
            >
              {statsError ? (
                <ErrorMessage
                  message={statsError.message || "Failed to load stats."}
                  onRetry={refetchStats}
                />
              ) : !stats ? (
                <p className="py-6 text-sm text-zinc-400">Stats are not available yet.</p>
              ) : (
                <PerformanceSummary
                  totalPoints={totalPoints}
                  rank={rank}
                  lastRace={lastRace}
                />
              )}
            </Skeleton>
          </article>
        </section>
      </div>

      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        race={race}
      />
    </PageWrapper>
  );
}

export default Home;
