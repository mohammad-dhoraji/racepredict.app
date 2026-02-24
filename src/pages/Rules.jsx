import React from "react";
import PageWrapper from "../components/PageWrapper";

function Rules() {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
        
        {/* Header */}
        <section className="max-w-5xl mx-auto mb-14 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Official Game Rules
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Predict the podium and Driver of the Day before lights out.
            Earn points based on accuracy. Climb the leaderboard.
            No luck. Just race IQ.
          </p>
        </section>

        {/* Scoring Rules */}
        <section className="max-w-5xl mx-auto mb-10">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <h2 className="text-2xl font-semibold mb-8 tracking-wide text-emerald-400">
              Scoring Rules
            </h2>

            <div className="space-y-5 text-zinc-300">
              <div>
                <h3 className="font-semibold text-white mb-1">
                  🥇 Exact Position Match
                </h3>
                <p>
                  Correct driver in the exact finishing position →
                  <span className="text-green-400 font-bold"> +25 points</span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">
                  🔁 Correct Driver, Wrong Position
                </h3>
                <p>
                  Driver finishes on podium but not in predicted position →
                  <span className="text-yellow-400 font-bold"> +10 points</span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">
                  ⭐ Driver of the Day
                </h3>
                <p>
                  Correct Driver of the Day prediction →
                  <span className="text-green-400 font-bold"> +15 points</span>
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">
                  ❌ Incorrect Prediction
                </h3>
                <p>
                  Driver does not finish on podium →
                  <span className="text-red-400 font-bold"> 0 points</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Calculation */}
        <section className="max-w-5xl mx-auto mb-10">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <h2 className="text-2xl font-semibold mb-8 tracking-wide text-cyan-400">
              Example: How Points Are Calculated
            </h2>

            <div className="space-y-4 text-zinc-300">
              <p>You predict:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>P1: Verstappen</li>
                <li>P2: Leclerc</li>
                <li>P3: Norris</li>
                <li>Driver of the Day: Leclerc</li>
              </ul>

              <p className="mt-4">Actual Result:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>P1: Verstappen</li>
                <li>P2: Norris</li>
                <li>P3: Leclerc</li>
                <li>Driver of the Day: Leclerc</li>
              </ul>

              <div className="bg-neutral-800 rounded-xl p-4 mt-6 border border-zinc-800">
                <p className="mb-2 text-white font-semibold">Points Breakdown:</p>
                <ul className="space-y-1 text-zinc-300">
                  <li>Verstappen exact match → +25 pts</li>
                  <li>Norris wrong position but podium → +10 pts</li>
                  <li>Leclerc wrong position but podium → +10 pts</li>
                  <li>Driver of the Day correct → +15 pts</li>
                </ul>
                <p className="mt-3 text-lg font-bold text-green-400">
                  Total: 60 Points
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prediction Rules */}
        <section className="max-w-5xl mx-auto mb-10">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <h2 className="text-2xl font-semibold mb-8 tracking-wide text-blue-400">
              Prediction Rules
            </h2>

            <ul className="space-y-3 text-zinc-300 list-disc list-inside">
              <li>Predictions must be submitted before race start time.</li>
              <li>Predictions automatically lock at official lights-out.</li>
              <li>You may edit predictions anytime before locking.</li>
              <li>Only one active prediction per race is allowed.</li>
              <li>Late submissions are not accepted under any circumstance.</li>
            </ul>
          </div>
        </section>

        {/* Leaderboard & Rankings */}
        <section className="max-w-5xl mx-auto mb-10">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <h2 className="text-2xl font-semibold mb-8 tracking-wide text-purple-500">
              Leaderboard & Rankings
            </h2>

            <ul className="space-y-3 text-zinc-300 list-disc list-inside">
              <li>Rankings are based on total accumulated points.</li>
              <li>Tie-breaker 1: More exact position matches.</li>
              <li>Tie-breaker 2: Earlier prediction submission time.</li>
              <li>Leaderboard updates after official FIA results confirmation.</li>
            </ul>
          </div>
        </section>

        {/* Fair Play Policy */}
        <section className="max-w-5xl mx-auto mb-12">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
            <h2 className="text-2xl font-semibold mb-8 tracking-wide text-red-400">
              Fair Play Policy
            </h2>

            <ul className="space-y-3 text-zinc-300 list-disc list-inside">
              <li>Multiple accounts to manipulate rankings are prohibited.</li>
              <li>Exploiting bugs or loopholes will result in disqualification.</li>
              <li>Points may be adjusted if official race results are revised.</li>
              <li>Admin decisions are final in dispute scenarios.</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <section className="max-w-5xl mx-auto text-center text-zinc-500 text-sm mb-12">
          <p>Rulebook Version 1.0 • Subject to future updates</p>
        </section>

      </div>
    </PageWrapper>
  );
};

export default Rules;