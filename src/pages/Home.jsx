import React from "react";
import AusFlag from "../assets/flags/au.svg";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

function Home() {
  const navigate = useNavigate();

  return (
     <PageWrapper>
    <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Predict the Podium.
          <br />
          Climb the Leaderboard.
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-6">
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Next Race</h2>
            <span className="bg-green-600 text-xs px-3 py-1 rounded-full">
              OPEN
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={AusFlag}
              alt="Australian GP"
              className="w-20 h-20 object-contain"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Australian Grand Prix</h3>
              <p className="text-zinc-400 mb-2">March 8, 2026 • 2:00 PM IST</p>
              <p className="text-red-500 font-medium">
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
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Your Stats</h3>
          <div className="space-y-2 text-zinc-300">
            <p>
              Total Points: <span className="text-white font-bold">185</span>
            </p>
            <p>
              Global Rank: <span className="text-white font-bold">#42</span>
            </p>
            <p>
              Last Race:{" "}
              <span className="text-green-500 font-bold">+15 pts</span>
            </p>
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Top 5 Leaderboard</h3>
            <span className="text-sm text-zinc-400 cursor-pointer hover:text-white transition">
              View Full →
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>#1 SpeedKing</span>
              <span>210 pts</span>
            </div>
            <div className="flex justify-between">
              <span>#2 PodiumPro</span>
              <span>198 pts</span>
            </div>
            <div className="flex justify-between">
              <span>#3 FastF1</span>
              <span>190 pts</span>
            </div>
            <div className="flex justify-between">  
              <span>#4 RaceMaster</span>
              <span>187 pts</span>
            </div>
            <div className="flex justify-between">
              <span>#5 You</span>
              <span>185 pts</span>
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
