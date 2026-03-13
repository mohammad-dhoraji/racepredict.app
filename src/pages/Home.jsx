import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import CalendarModal from "../components/CalendarModal";

import useNextRace from "../features/races/useNextRace";
import NextRaceCard from "../features/races/NextRaceCard";

import useTopFive from "../features/leaderboard/useTopFive";
import TopFivePreview from "../features/leaderboard/TopFivePreview";

import useUserStats from "../features/user/useUserStats";
import UserSnapshot from "../features/user/UserSnapshot";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");




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

  const { race, loading: raceLoading, error: raceError, refetch: refetchRace } = useNextRace();
  const { items: topItems, loading: topLoading, error: topError, refetch: refetchTop } = useTopFive();
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useUserStats();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Predict the Podium.
            <br />
            Climb the Leaderboard.
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-8">
            Pick the Top 3 finishers and Driver of the Day before race start.
            Earn points based on accuracy.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button className="px-6 py-3 text-lg" onClick={() => navigate("/home/predict")}>
              Make Prediction
            </Button>
            <Button
              className="px-6 py-3 text-lg"
              onClick={() => setIsCalendarModalOpen(true)}
            >
              Add to Calendar
            </Button>
          </div>
        </section>

        {/* Upcoming Race Section  */}
        <NextRaceCard race={race} loading={raceLoading} error={raceError} onEdit={() => navigate("/home/predict")} onRetry={refetchRace} />

        {/* User Snapshot + Leaderboard */}
        <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <UserSnapshot stats={stats} loading={statsLoading} error={statsError} onRetry={refetchStats} />
          <TopFivePreview items={topItems} loading={topLoading} error={topError} onViewFull={() => navigate("/home/leaderboard")} onRetry={refetchTop} />
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
