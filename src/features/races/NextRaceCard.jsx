import React from "react";
import Button from "../../components/Button";
import Countdown from "../../components/Countdown";
import Skeleton from "../../components/Skeleton";
import ErrorMessage from "../../components/ErrorMessage";

const getFlagSrc = (countryCode) => {
  if (!countryCode) return null;
  return new URL(
    `../../assets/flags/${countryCode.toLowerCase()}.svg`,
    import.meta.url,
  ).href;
};
export default function NextRaceCard({
  race,
  error,
  onEdit,
  onRetry,
}) {
  return (
    <section className="max-w-5xl mx-auto mb-14">
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
        <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold tracking-wide">Next Race</h2>
          {race?.status === "upcoming" ? (
            <span className="px-4 py-1.5 text-xs tracking-widest rounded-full font-bold bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              Predictions Open
            </span>
          ) : race?.status === "locked" ? (
            <span className="px-4 py-1.5 text-xs tracking-widest rounded-full font-bold bg-red-600/20 text-red-400 border border-red-500/30">
              🔒 Predictions Locked
            </span>
          ) : null}
        </div>

        {error ? (
          <ErrorMessage
            message={error.message || "Failed to load next race."}
            onRetry={onRetry}
          />
        ) : !race ? (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 bg-zinc-700/40 rounded" />
            <div className="flex-1 text-center md:text-left">
              <Skeleton
                lines={1}
                lineClass="h-6 w-48 rounded bg-zinc-700/40 mb-3"
              />
              <Skeleton
                lines={1}
                lineClass="h-4 w-40 rounded bg-zinc-700/40 mb-2"
              />
              <Skeleton lines={1} lineClass="h-5 w-32 rounded bg-zinc-700/40" />
            </div>
            <div>
              <Skeleton lines={1} lineClass="h-8 w-24 rounded bg-zinc-700/40" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={getFlagSrc(race?.country_code)}
              alt={race?.country || "Flag"}
              className="w-24 h-24 object-contain"
            />

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-3">{race.name}</h3>
              <p className="text-zinc-400 mb-2">
                {new Date(race.race_date).toLocaleString("en-IN", {
                  timeZone: "Asia/Kolkata",
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p className="text-[#c1a362] font-semibold">
                Closes in: <Countdown target={race.race_date} />
              </p>
            </div>

            {race?.status === "upcoming" && (
              <div>
                <Button className="px-5 py-2" onClick={onEdit}>
                  Make Prediction
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
