import React from "react";
import { Skeleton } from "boneyard-js/react";
import Button from "../../components/Button";
import Countdown from "../../components/Countdown";
import ErrorMessage from "../../components/ErrorMessage";
import { tracks } from "../../data/trackPaths.js";

const NEXT_RACE_FIXTURE = {
  round: 4,
  name: "Japanese Grand Prix",
  country_code: "jp",
  circuit_name: "Suzuka Circuit",
  race_date: "2026-10-11T05:00:00.000Z",
  status: "upcoming",
};

const getFlagSrc = (countryCode) => {
  if (!countryCode) return null;
  return new URL(
    `../../assets/flags/${countryCode.toLowerCase()}.svg`,
    import.meta.url,
  ).href;
};

function NextRaceCardContent({ race, error, onEdit, onRetry }) {
  const round = Number(race?.round) || 0;
  const trackData = tracks[round] || null;

  const raceTitle =
    typeof race?.name === "string" ? race.name : "Next Race";

  const raceNameLines = raceTitle
    ? raceTitle
        .split("Grand Prix")
        .map((segment) => segment.trim())
        .filter(Boolean)
    : [];

  if (raceNameLines.length === 1 && raceTitle.includes("Grand Prix")) {
    raceNameLines.push("Grand Prix");
  }

  return (
    <div className="relative bg-linear-to-br bg-[linear-gradient(135deg,#3f3a33_0%,#655e54_50%,#8a8175_100%)] backdrop-blur-xl border border-zinc-700/50 rounded-2xl px-6 py-6 md:px-8 md:py-7 shadow-xl shadow-black/40">
      {error ? (
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

          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center mb-4">
                {getFlagSrc(race?.country_code) && (
                  <img
                    src={getFlagSrc(race?.country_code)}
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
                {race?.circuit_name || "-"}
              </p>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-white mb-2">
                  Race starts in
                </p>
                <div className="text-2xl md:text-5xl font-f1 font-bold text-white">
                  <Countdown target={race?.race_date} />
                </div>
              </div>
            </div>

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
  );
}

export default function NextRaceCard({
  race,
  loading = false,
  error,
  onEdit,
  onRetry,
}) {
  return (
    <section className="max-w-5xl mx-auto mb-10">
      <Skeleton
        name="next-race-card"
        loading={loading}
        animate="pulse"
        transition={300}
        fixture={
          <NextRaceCardContent
            race={NEXT_RACE_FIXTURE}
            error={null}
            onEdit={onEdit}
            onRetry={onRetry}
          />
        }
      >
        <NextRaceCardContent
          race={race}
          error={error}
          onEdit={onEdit}
          onRetry={onRetry}
        />
      </Skeleton>
    </section>
  );
}

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
