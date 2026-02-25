import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import DriverSelect from "../components/DriverSelect";
import { apiRequest, apiPost } from "../lib/api";

const PRESET_DRIVERS = [
  "Max Verstappen",
  "Charles Leclerc",
  "Lewis Hamilton",
  "Lando Norris",
  "Carlos Sainz",
  "George Russell",
  "Oscar Piastri",
  "Fernando Alonso",
];

const Prediction = () => {
  const [race, setRace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState({
    p1: "",
    p2: "",
    p3: "",
    dotd: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchNextRace = async () => {
      try {
        const data = await apiRequest("/api/races/next");
        setRace(data);
      } catch (err) {
        console.error("Failed to fetch next race:", err);
        setError("Could not load upcoming race.");
      } finally {
        setLoading(false);
      }
    };

    fetchNextRace();
  }, []);

  const handleChange = (position, value) => {
    setPrediction((prev) => ({
      ...prev,
      [position]: value,
    }));
    setError("");
    setSuccess(false);
  };

  const validatePrediction = () => {
    const { p1, p2, p3, dotd } = prediction;

    if (!p1 || !p2 || !p3 || !dotd) {
      return "All fields must be selected.";
    }

    const podium = [p1, p2, p3];
    const uniqueDrivers = new Set(podium);

    if (uniqueDrivers.size !== 3) {
      return "Podium drivers must be unique.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validatePrediction();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");
      await apiPost("/api/predictions", {
        race_id: race.id,
        ...prediction
      });
      setSuccess(true);
      alert("Prediction submitted successfully!");
    } catch (err) {
      setError(err.message || "Failed to submit prediction.");
    }
  };

  if (loading) return <div className="text-white p-10">Loading upcoming race...</div>;
  if (!race) return <div className="text-white p-10">No upcoming races found.</div>;

  const isLocked = race.status !== "upcoming";
  const raceDate = new Date(race.race_date).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  });

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-12 w-full">
      <div className="max-w-5xl mx-auto">
        {/* ================= Header ================= */}
        <div className="mb-14">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {race.name}
            </h1>

            <span
              className={`px-4 py-1.5 text-xs tracking-widest rounded-full font-bold ${
                isLocked
                  ? "bg-red-600/20 text-red-400 border border-red-500/30"
                  : "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
              }`}
            >
              {race.status.toUpperCase()}
            </span>
          </div>

          <p className="text-zinc-500 text-sm uppercase tracking-wide">
            {raceDate}
          </p>

          <div className="mt-6 h-0.5 w-full bg-linear-to-r from-[#c1a362] via-zinc-700 to-transparent rounded-full" />
        </div>

        {/* ================= Card ================= */}
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">

          <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

          <h2 className="text-2xl font-semibold mb-10 tracking-wide">
            Select Your Podium
          </h2>

          {/* ===== Podium Grid ===== */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">

            <DriverSelect
              label="1st Place"
              value={prediction.p1}
              onChange={(val) => handleChange("p1", val)}
              drivers={PRESET_DRIVERS}
              disabled={isLocked}
              highlight="ring-yellow-500/40"
            />

            <DriverSelect
              label="2nd Place"
              value={prediction.p2}
              onChange={(val) => handleChange("p2", val)}
              drivers={PRESET_DRIVERS}
              disabled={isLocked}
              highlight="ring-zinc-400/30"
            />

            <DriverSelect
              label="3rd Place"
              value={prediction.p3}
              onChange={(val) => handleChange("p3", val)}
              drivers={PRESET_DRIVERS}
              disabled={isLocked}
              highlight="ring-amber-700/40"
            />
          </div>

          {/* ===== Driver of the Day ===== */}
          <div className="mb-10">
            <DriverSelect
              label="Driver of the Day"
              value={prediction.dotd}
              onChange={(val) => handleChange("dotd", val)}
              drivers={PRESET_DRIVERS}
              disabled={isLocked}
              highlight="ring-[#c1a362]/50"
            />
          </div>

          {/* ===== Error ===== */}
          {error && (
            <div className="mb-6 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* ===== Success ===== */}
          {success && (
            <div className="mb-6 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              Prediction submitted successfully!
            </div>
          )}

          {/* ===== Submit ===== */}
          {!isLocked ? (
            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto mx-auto block"
            >
              Submit Prediction
            </Button>
          ) : (
            <div className="text-red-400 font-medium text-center">
              Predictions are locked. Race has started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
