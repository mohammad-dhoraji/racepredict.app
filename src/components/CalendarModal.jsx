import React, { useEffect } from "react";

const optionClassName = `
  block w-full rounded-xl border border-[#c1a362]/40 bg-zinc-900 px-5 py-4 text-center
  text-sm font-semibold tracking-wider uppercase text-[#c1a362]
  transition-all duration-300 ease-out
  hover:bg-[#c1a362] hover:text-black hover:shadow-[0_0_20px_rgba(193,163,98,0.25)]
  active:scale-[0.98]
`;


export default function CalendarModal({
  isOpen,
  onClose,
  race,
}) {
  const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
  ).replace(/\/+$/, "");

  const isSingleRace = !!race;
  const predictionsIcsUrl = `${API_BASE_URL}/api/calendar/predictions.ics`;
  const icsUrl = isSingleRace 
    ? `${API_BASE_URL}/api/calendar/${race.id}.ics`
    : predictionsIcsUrl;
  const appleUrl = icsUrl.replace(/^https?:\/\//i, "webcal://");

  let googleUrl;
  if (isSingleRace && race.race_time) {
    const start = new Date(race.race_time);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const formatDate = (date) => {
      const year = date.getUTCFullYear();
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const day = String(date.getUTCDate()).padStart(2, '0');
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${year}${month}${day}T${hours}${minutes}00Z`;
    };
    const startStr = formatDate(start);
    const endStr = formatDate(end);
    const title = encodeURIComponent(`${race.name} Prediction Lock`);
    const details = encodeURIComponent([
      "Submit your F1 prediction before the race starts.",
      "",
      race.predictionUrl || `${API_BASE_URL}/predict/${race.id}`
    ].join("\\n"));
    googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startStr}/${endStr}&text=${title}&details=${details}&location=${encodeURIComponent(API_BASE_URL)}/predict/${race.id}`;
  } else {
    googleUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(predictionsIcsUrl)}`;
  }

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        aria-label="Close calendar options"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-950 p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-white text-center">
          Add Prediction Deadlines to Calendar
        </h2>
        <p className="mt-2 mb-6 text-center text-zinc-400">
          Never miss a race prediction.
        </p>

        <div className="space-y-3">
          <a
            href={googleUrl}
            target="_blank"
            rel="noreferrer"
            className={optionClassName}
            onClick={onClose}
          >
            Add to Google Calendar
          </a>

          <a href={appleUrl} className={optionClassName} onClick={onClose}>
            Add to Apple Calendar
          </a>

          <a
            href={icsUrl}
            target="_blank"
            rel="noreferrer"
            className={optionClassName}
            onClick={onClose}
          >
            Other Calendars (.ICS)
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-3 text-sm font-semibold tracking-wide text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
