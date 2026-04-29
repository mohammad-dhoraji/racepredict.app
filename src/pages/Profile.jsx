import { useNavigate } from "react-router-dom";
import AppSkeleton from "../components/AppSkeleton";
import Achievements from "../components/Achievements";
import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import PerformanceSnapshot from "../components/PerformanceSnapshot";
import ProfileHeader from "../components/ProfileHeader";
import RecentRaces from "../components/RecentRaces";
import { useProfile } from "../hooks/useProfile";
import { supabase } from "../lib/supabaseClient";

const PROFILE_FIXTURE = {
  summary: {
    username: "PolePosition",
    totalPoints: 214,
    accuracy: 68.4,
    correctPredictions: 19,
    totalPredictions: 28,
    lastRaceScore: 18,
    globalRank: 12,
  },
  predictions: [
    {
      raceId: "fixture-race-1",
      raceName: "Japanese Grand Prix",
      predicted: {
        p1: "Max Verstappen",
        p2: "Lando Norris",
        p3: "Charles Leclerc",
        dotd: "Oscar Piastri",
      },
      actual: {
        p1: "Max Verstappen",
        p2: "Lando Norris",
        p3: "George Russell",
        dotd: "Oscar Piastri",
      },
      points: 18,
    },
    {
      raceId: "fixture-race-2",
      raceName: "Australian Grand Prix",
      predicted: {
        p1: "Charles Leclerc",
        p2: "Lewis Hamilton",
        p3: "George Russell",
        dotd: "Lando Norris",
      },
      actual: {
        p1: "Charles Leclerc",
        p2: "Oscar Piastri",
        p3: "George Russell",
        dotd: "Lando Norris",
      },
      points: 14,
    },
  ],
};

function ProfileContent({ onLogout, predictions, summary }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full space-y-10">
      <ProfileHeader summary={summary} />
      <PerformanceSnapshot summary={summary} />
      <RecentRaces predictions={predictions} />
      <Achievements />
      <section className="max-w-5xl mx-auto">
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40 flex justify-between items-center gap-4">
          <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          <div>
            <h2 className="text-2xl font-semibold tracking-wide">Account</h2>
            <p className="text-zinc-400 text-sm mt-1">Manage your session</p>
          </div>

          <Button
            onClick={onLogout}
            className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-[0.99] transition-all rounded-xl font-semibold shadow-lg shadow-red-600/20"
          >
            Logout
          </Button>
        </div>
      </section>
    </div>
  );
}

function Profile() {
  const {
    summary,
    predictions,
    loading,
    errorMessage,
    refetch,
  } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (errorMessage) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
              <p className="text-red-400">{errorMessage}</p>
              <div className="mt-4">
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <AppSkeleton
        name="profile-page"
        loading={loading}
        placeholder={
          <ProfileContent
            onLogout={() => {}}
            predictions={PROFILE_FIXTURE.predictions}
            summary={PROFILE_FIXTURE.summary}
          />
        }
      >
        <ProfileContent
          onLogout={handleLogout}
          predictions={predictions}
          summary={summary}
        />
      </AppSkeleton>
    </PageWrapper>
  );
}

export default Profile;
