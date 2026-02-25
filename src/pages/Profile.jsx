import PageWrapper from "../components/PageWrapper";
import { useProfile } from "../hooks/useProfile";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../components/ProfileHeader";
import PerformanceSnapshot from "../components/PerformanceSnapshot";
import RecentRaces from "../components/RecentRaces";
import Achievements from "../components/Achievements";
import { supabase } from "../lib/supabaseClient";

function Profile() {
  const { profile, predictions, stats, loading, error } = useProfile();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };
  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10">
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-24 bg-zinc-900 rounded-2xl" />
            <div className="h-32 bg-zinc-900 rounded-2xl" />
            <div className="h-40 bg-zinc-900 rounded-2xl" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
          <div className="max-w-5xl mx-auto">
            <div className="bg-red-900/20 border border-red-700 rounded-xl p-6">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full space-y-10">
        <ProfileHeader profile={profile} stats={stats} />
        <PerformanceSnapshot stats={stats} />
        <RecentRaces predictions={predictions} />
        <Achievements />
        <section className="max-w-5xl mx-auto">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40 flex justify-between items-center">
            <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <div>
              <h2 className="text-2xl font-semibold tracking-wide">Account</h2>
              <p className="text-zinc-400 text-sm mt-1">Manage your session</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:scale-[0.99] transition-all rounded-xl font-semibold shadow-lg shadow-red-600/20"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default Profile;
