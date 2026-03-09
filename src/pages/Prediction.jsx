import React, { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import DriverSelect from "../components/DriverSelect";
import Modal from "../components/Modal";
import { apiPost, apiRequest } from "../lib/api";

const EMPTY_PREDICTION = {
  p1: "",
  p2: "",
  p3: "",
  dotd: "",
};

const CLOSED_MODAL = {
  isOpen: false,
  type: "success",
  title: "",
  message: "",
};

const formatRaceDate = (race) => {
  const rawDate = race?.race_at || race?.race_date || race?.lock_at;
  if (!rawDate) return "TBA";

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "TBA";

  return date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

const mapApiError = (error) => {
  if (error?.status === 403 || error?.status === 409) {
    return "Predictions are locked for this race.";
  }

  if (error?.status === 400) {
    return "Invalid prediction. Please review your selections.";
  }

  if (error?.status === 401) {
    return "Please sign in again to submit your prediction.";
  }

  if (error?.isNetworkError || error?.isTimeout) {
    return "Network issue while contacting the API. Please try again.";
  }

  return "Something went wrong. Please try again.";
};

const Prediction = () => {
  const [race, setRace] = useState(null);
  const [raceStatus, setRaceStatus] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prediction, setPrediction] = useState(EMPTY_PREDICTION);
  const [hasExistingPrediction, setHasExistingPrediction] = useState(false);
  const [modal, setModal] = useState(CLOSED_MODAL);

  const openModal = useCallback((type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const hydratePrediction = useCallback((payload) => {
    if (!payload) return;

    setPrediction({
      p1: payload.p1 || "",
      p2: payload.p2 || "",
      p3: payload.p3 || "",
      dotd: payload.dotd || "",
    });
  }, []);

  const loadPageData = useCallback(async () => {
    setLoading(true);

    try {
      const [nextRace, driverPayload] = await Promise.all([
        apiRequest("/api/races/next"),
        apiRequest("/api/predictions/drivers"),
      ]);

      setRace(nextRace || null);
      setDrivers(
        (driverPayload?.drivers || [])
          .map((entry) => entry.name)
          .filter(Boolean),
      );

      if (!nextRace?.id) {
        setRaceStatus(null);
        setPrediction(EMPTY_PREDICTION);
        setHasExistingPrediction(false);
        return;
      }

      const [statusPayload, savedPrediction] = await Promise.all([
        apiRequest(`/v1/races/${nextRace.id}/status`).catch(() => null),
        apiRequest(`/api/predictions/${nextRace.id}`).catch((error) => {
          if (error?.status === 404) return null;
          throw error;
        }),
      ]);

      setRaceStatus(statusPayload);
      if (savedPrediction) {
        hydratePrediction(savedPrediction);
        setHasExistingPrediction(true);
      } else {
        setPrediction(EMPTY_PREDICTION);
        setHasExistingPrediction(false);
      }
    } catch (error) {
      if (error?.status === 404) {
        setRace(null);
        setRaceStatus(null);
        setPrediction(EMPTY_PREDICTION);
        setHasExistingPrediction(false);
      } else {
        openModal(
          "error",
          "Failed to Load Prediction Data",
          mapApiError(error),
        );
      }
    } finally {
      setLoading(false);
    }
  }, [hydratePrediction, openModal]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const lockAt =
    raceStatus?.lock_at || race?.lock_at || race?.race_at || race?.race_date;
  const isLockedByTime = lockAt
    ? Date.now() >= new Date(lockAt).getTime()
    : false;
  const isLocked =
    Boolean(raceStatus?.is_locked) ||
    isLockedByTime ||
    !["upcoming", "scheduled"].includes(
      String(raceStatus?.status || race?.status || ""),
    );

  const getAvailableDrivers = useCallback(
    (fieldName) => {
      // DOTD should allow all drivers
      if (fieldName === "dotd") {
        return drivers;
      }

      // Prevent duplicate podium drivers only
      const podiumDrivers = [prediction.p1, prediction.p2, prediction.p3];

      return drivers.filter((driverName) => {
        if (prediction[fieldName] === driverName) return true;

        return !podiumDrivers.some(
          (driver) => driver === driverName && driver !== prediction[fieldName],
        );
      });
    },
    [drivers, prediction],
  );

  const handleChange = useCallback((position, value) => {
    setPrediction((prev) => ({
      ...prev,
      [position]: value,
    }));
  }, []);

  const validatePrediction = useMemo(() => {
    const { p1, p2, p3, dotd } = prediction;
    if (!p1 || !p2 || !p3 || !dotd) {
      return "All fields must be selected before submitting.";
    }

    if (new Set([p1, p2, p3]).size !== 3) {
      return "P1, P2 and P3 must be different drivers.";
    }

    return null;
  }, [prediction]);

  const handleSubmit = async () => {
    if (!race?.id || submitting || isLocked) return;

    if (validatePrediction) {
      openModal("error", "Invalid Prediction", validatePrediction);
      return;
    }

    setSubmitting(true);

    try {
      const saved = await apiPost("/api/predictions", {
        raceId: race.id,
        p1: prediction.p1,
        p2: prediction.p2,
        p3: prediction.p3,
        dotd: prediction.dotd,
      });

      hydratePrediction(saved);
      setHasExistingPrediction(true);

      openModal(
        "success",
        hasExistingPrediction ? "Prediction Updated" : "Prediction Submitted",
        "Your prediction has been saved successfully.",
      );
    } catch (error) {
      openModal("error", "Prediction Save Failed", mapApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-800 via-neutral-950 to-black flex items-center justify-center">
        <p className="text-zinc-400 text-sm tracking-widest uppercase animate-pulse">
          Loading prediction data...
        </p>
      </div>
    );
  }

  if (!race) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-800 via-neutral-950 to-black flex items-center justify-center">
        <p className="text-zinc-400 text-sm">No upcoming race is available.</p>
      </div>
    );
  }

  const raceDateLabel = formatRaceDate(race);
  const currentStatus = String(raceStatus?.status || race.status || "unknown");

  const statusColor = !isLocked
    ? "bg-green-600/20 text-green-400 border border-green-500/30"
    : currentStatus === "locked"
      ? "bg-yellow-600/20 text-yellow-400 border border-yellow-500/30"
      : "bg-red-600/20 text-red-400 border border-red-500/30";

  return (
    <>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <div className="min-h-screen bg-gradient-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-12 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {race.name}
              </h1>

              <span
                className={`px-4 py-1.5 text-xs tracking-widest rounded-full font-bold uppercase ${statusColor}`}
              >
                {isLocked ? "locked" : "upcoming"}
              </span>
            </div>

            <p className="text-zinc-500 text-sm uppercase tracking-wide">
              {raceDateLabel}
            </p>

            <div className="mt-6 h-[2px] w-full bg-gradient-to-r from-[#c1a362] via-zinc-700 to-transparent rounded-full" />
          </div>

          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
            <div className="absolute -top-[2px] left-0 w-full h-[3px] bg-gradient-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />

            <h2 className="text-2xl font-semibold mb-10 tracking-wide">
              Select Your Podium
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <DriverSelect
                label="1st Place"
                value={prediction.p1}
                onChange={(val) => handleChange("p1", val)}
                drivers={getAvailableDrivers("p1")}
                disabled={isLocked || submitting}
                highlight="ring-yellow-500/40"
              />

              <DriverSelect
                label="2nd Place"
                value={prediction.p2}
                onChange={(val) => handleChange("p2", val)}
                drivers={getAvailableDrivers("p2")}
                disabled={isLocked || submitting}
                highlight="ring-zinc-400/30"
              />

              <DriverSelect
                label="3rd Place"
                value={prediction.p3}
                onChange={(val) => handleChange("p3", val)}
                drivers={getAvailableDrivers("p3")}
                disabled={isLocked || submitting}
                highlight="ring-amber-700/40"
              />
            </div>

            <div className="mb-10">
              <DriverSelect
                label="Driver of the Day"
                value={prediction.dotd}
                onChange={(val) => handleChange("dotd", val)}
                drivers={getAvailableDrivers("dotd")}
                disabled={isLocked || submitting}
                highlight="ring-[#c1a362]/50"
              />
            </div>

            {!isLocked ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                loading={submitting}
                className="w-full md:w-auto mx-auto block"
              >
                {submitting
                  ? "Saving..."
                  : hasExistingPrediction
                    ? "Update Prediction"
                    : "Submit Prediction"}
              </Button>
            ) : (
              <div className="text-red-400 font-medium text-center">
                Predictions locked
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Prediction;
