import React, { useState } from "react";
import Button from "../components/Button";

const drivers = [
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
  const race = {
    name: "Australian Grand Prix",
    date: "March 24, 2026 • 2:00 PM IST",
    status: "OPEN", // Change to "LOCKED" to test lock state
  };

  const [prediction, setPrediction] = useState({
    first: "",
    second: "",
    third: "",
    dotd: "",
  });

  const [error, setError] = useState("");

  const handleChange = (position, value) => {
    setPrediction({ ...prediction, [position]: value });
    setError("");
  };

  const validatePrediction = () => {
    const { first, second, third } = prediction;

    if (!first || !second || !third || !prediction.dotd) {
      return "All fields must be selected.";
    }

    const podium = [first, second, third];
    const uniqueDrivers = new Set(podium);

    if (uniqueDrivers.size !== 3) {
      return "Podium drivers must be unique.";
    }

    return null;
  };

  const handleSubmit = () => {
    const validationError = validatePrediction();

    if (validationError) {
      setError(validationError);
      return;
    }

    console.log("Submitted Prediction:", prediction);
    alert("Prediction submitted successfully!");
  };

  const isLocked = race.status === "LOCKED";

  return (
    <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full">
      <div className="max-w-4xl mx-auto">

        {/* Race Header */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-3xl font-bold">{race.name}</h1>
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                isLocked
                  ? "bg-red-600"
                  : "bg-green-600"
              }`}
            >
              {race.status}
            </span>
          </div>
          <p className="text-zinc-400">{race.date}</p>
        </div>

        {/* Prediction Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-xl font-semibold mb-6">
            Select Your Podium
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 1st */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                1st Place
              </label>
              <select
                disabled={isLocked}
                value={prediction.first}
                onChange={(e) =>
                  handleChange("first", e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver} value={driver}>
                    {driver}
                  </option>
                ))}
              </select>
            </div>

            {/* 2nd */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                2nd Place
              </label>
              <select
                disabled={isLocked}
                value={prediction.second}
                onChange={(e) =>
                  handleChange("second", e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver} value={driver}>
                    {driver}
                  </option>
                ))}
              </select>
            </div>

            {/* 3rd */}
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                3rd Place
              </label>
              <select
                disabled={isLocked}
                value={prediction.third}
                onChange={(e) =>
                  handleChange("third", e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
              >
                <option value="">Select Driver</option>
                {drivers.map((driver) => (
                  <option key={driver} value={driver}>
                    {driver}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Driver of the Day */}
          <div className="mb-8">
            <label className="block text-sm text-zinc-400 mb-2">
              Driver of the Day
            </label>
            <select
              disabled={isLocked}
              value={prediction.dotd}
              onChange={(e) =>
                handleChange("dotd", e.target.value)
              }
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#c1a362]"
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          {!isLocked ? (
            <Button onClick={handleSubmit}>
              Submit Prediction
            </Button>
          ) : (
            <div className="text-red-500 font-medium">
              Predictions are locked. Race has started.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Prediction;
