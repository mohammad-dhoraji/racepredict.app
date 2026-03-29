import React from "react";
import Button from "../../components/Button";
import Countdown from "../../components/Countdown";
import NextRaceSkeleton from "../../components/ui/NextRaceSkeleton";
import ErrorMessage from "../../components/ErrorMessage";
import { tracks } from "../../data/trackPaths.js";

const getFlagSrc = (countryCode) => {
  if (!countryCode) return null;
  return new URL(
    `../../assets/flags/${countryCode.toLowerCase()}.svg`,
    import.meta.url,
  ).href;
};

export default function NextRaceCard({
  race,
  loading = false,
  error,
  onEdit,
  onRetry,
}) {
  const round = Number(race?.round) || 0;
  const trackData = tracks[round] || null;

  const raceTitle = race?.name || "Next Race";

  const raceNameLines = raceTitle
    .split("Grand Prix")
    .map((s) => s.trim())
    .filter(Boolean);

  if (raceNameLines.length === 1 && raceTitle.includes("Grand Prix")) {
    raceNameLines.push("Grand Prix");
  }

  return (
    <section className="max-w-5xl mx-auto mb-10">
      <div className="relative bg-linear-to-br bg-[linear-gradient(135deg,#3f3a33_0%,#655e54_50%,#8a8175_100%)] backdrop-blur-xl border border-zinc-700/50 rounded-2xl px-6 py-6 md:px-8 md:py-7 shadow-xl shadow-black/40">

        {loading ? (
          <NextRaceSkeleton />
        ) : error ? (
          <ErrorMessage
            message={error.message || "Failed to load next race."}
            onRetry={onRetry}
          />
        ) : !race ? (
          <div className="text-center text-zinc-400 py-6">
            No upcoming race available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] items-center gap-y-6 md:gap-x-12">

            {/* Track SVG */}
            <div className="flex items-center justify-center">
              {trackData && (
                <div className="w-full max-w-152.5">
                  <svg
                    viewBox={expandViewBox(trackData.viewBox, 10)} 
                    className="w-full h-auto"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d={trackData.path}
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between ">

              {/* Title */}
              <div>
                <div className="flex items-center mb-4">
                  {getFlagSrc(race.country_code) && (
                    <img
                      src={getFlagSrc(race.country_code)}
                      alt=""
                      className="w-10 h-10 mr-5 object-contain"
                    />
                  )}

                  <div>
                    <h1 className="text-2xl md:text-3xl font-black uppercase text-white leading-tight">
                      {raceNameLines[0] || "NEXT"}
                    </h1>
                    <h2 className="text-lg md:text-xl font-semibold uppercase text-zinc-400">
                      {raceNameLines[1] || "RACE"}
                    </h2>
                  </div>
                </div>

                <p className="text-sm md:text-base text-zinc-400 mb-6">
                  {race.circuit_name || "—"}
                </p>

                {/* Countdown */}
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest text-white mb-2">
                    Race starts in
                  </p>
                  <div className="text-2xl md:text-5xl font-f1 font-bold text-white ">
                    <Countdown target={race.race_date} />
                  </div>
                </div>
              </div>

              {/* Button */}
              {race?.status === "upcoming" && (
                <div className="md:text-right">
                  <Button
                    className="px-5 py-2 text-sm"
                    onClick={onEdit}
                  >
                    Make Prediction
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Expands SVG viewBox to prevent clipping
 */
function expandViewBox(viewBox, padding = 10) {
  if (!viewBox) return "0 0 100 100";

  const [x, y, w, h] = viewBox.split(" ").map(Number);

  return [
    x - padding,
    y - padding,
    w + padding * 3,
    h + padding * 3,
  ].join(" ");
}