import React from "react";
import AusFlag from "../assets/flags/au.svg";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function Home() {
  const navigate = useNavigate();

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
          Pick the Top 3 finishers and Driver of the Day before race start. Earn
          points based on accuracy.
        </p>
        <Button
          className="px-6 py-3 text-lg"
          onClick={() => navigate("/predict")}
        >
          Make Prediction
        </Button>
      </section>

      {/* Upcoming Race Section */}
      <section className="max-w-5xl mx-auto mb-14">
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
          <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold tracking-wide">Next Race</h2>
            <span className="px-4 py-1.5 text-xs tracking-widest rounded-full font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              OPEN
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={AusFlag}
              alt="Australian GP"
              className="w-24 h-24 object-contain"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-3">Australian Grand Prix</h3>
              <p className="text-zinc-400 mb-2">March 8, 2026 • 2:00 PM IST</p>
              <p className="text-[#c1a362] font-semibold">
                Closes in: 2 Days 4 Hours
              </p>
            </div>

            <div>
              <Button className="px-5 py-2">Edit Prediction</Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Snapshot + Leaderboard */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* User Snapshot */}
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
          <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          <h3 className="text-2xl font-semibold mb-8 tracking-wide">Your Stats</h3>
          <div className="space-y-4 text-zinc-300">
            <div className="flex justify-between items-center">
              <span>Total Points</span>
              <span className="text-white font-bold text-lg">185</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Global Rank</span>
              <span className="text-white font-bold text-lg">#42</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Last Race</span>
              <span className="text-emerald-400 font-bold text-lg">+15 pts</span>
            </div>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
          <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-semibold tracking-wide">Top 5 Leaderboard</h3>
            <span className="text-sm text-zinc-400 cursor-pointer hover:text-[#c1a362] transition">
              View Full →
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
              <span className="font-medium">#1 SpeedKing</span>
              <span className="font-bold text-[#c1a362]">210 pts</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
              <span className="font-medium">#2 PodiumPro</span>
              <span className="font-bold">198 pts</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
              <span className="font-medium">#3 FastF1</span>
              <span className="font-bold">190 pts</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">  
              <span className="font-medium">#4 RaceMaster</span>
              <span className="font-bold">187 pts</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
              <span className="font-medium">#5 You</span>
              <span className="font-bold">185 pts</span>
            </div>
          </div>
        </div>
      </section>
    </div>
    {/* <Footer/> */}
    </PageWrapper>
  );
}

export default Home;
