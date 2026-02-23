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
        <div className="min-h-screen bg-neutral-800 text-white px-6 py-10">
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
        <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full">
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
      <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full space-y-10">
        <ProfileHeader profile={profile} stats={stats} />
        <PerformanceSnapshot stats={stats} />
        <RecentRaces predictions={predictions} />
        <Achievements />
        <section className="max-w-5xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Account</h2>
              <p className="text-zinc-400 text-sm">Manage your session</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition"
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
