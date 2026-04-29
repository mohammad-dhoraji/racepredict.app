import React, { useCallback, useMemo, useState } from "react";
import { Skeleton } from "boneyard-js/react";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import DriverSelect from "../components/DriverSelect";
import Modal from "../components/Modal";
import { usePredictions } from "../hooks/usePredictions";
import { isBoneyardCapture } from "../lib/isBoneyardCapture";

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

const PREDICTION_FIXTURE = {
  race: {
    id: "__boneyard-race__",
    name: "Japanese Grand Prix",
    race_date: "2026-10-11T05:00:00.000Z",
  },
  drivers: [
    "Max Verstappen",
    "Lando Norris",
    "Charles Leclerc",
    "Oscar Piastri",
    "Lewis Hamilton",
    "George Russell",
  ],
  prediction: {
    p1: "Max Verstappen",
    p2: "Lando Norris",
    p3: "Charles Leclerc",
    dotd: "Oscar Piastri",
  },
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

const toPredictionDraft = (payload) => ({
  p1: payload?.p1 || "",
  p2: payload?.p2 || "",
  p3: payload?.p3 || "",
  dotd: payload?.dotd || "",
});

function PredictionFormContent({
  drivers,
  getAvailableDrivers,
  handleChange,
  handleSubmit,
  hasExistingPrediction,
  isLocked,
  prediction,
  race,
  raceDateLabel,
  submitting,
}) {
  return (
    <div className="min-h-screen w-full px-6 text-foreground overflow-x-hidden bg-linear-to-b from-neutral-800 via-neutral-950 to-black py-10">
      <section className="max-w-4xl mx-auto py-10 border-b border-border">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 sm:gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-f1 font-black uppercase bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              {race?.name}
            </h1>
            <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground mt-2">
              {raceDateLabel}
            </p>
          </div>

          <span className="px-4 py-1.5 text-xs tracking-widest rounded-full font-bold uppercase bg-background/50 border border-border/50 text-muted-foreground">
            {isLocked ? "Predictions Locked" : "Predictions Open"}
          </span>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-10 border-t border-border">
        <div className="bg-background/80 backdrop-blur-xl border border-border rounded-3xl p-4 sm:p-10 shadow-xl">
          <h2 className="font-f1 font-black text-2xl sm:text-3xl uppercase tracking-[0.15em] mb-6 sm:mb-8">
            Select Your Podium
          </h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <DriverSelect
              label="1st Place"
              value={prediction.p1}
              onChange={(val) => handleChange("p1", val)}
              drivers={getAvailableDrivers("p1")}
              disabled={isLocked || submitting}
              highlight="ring-chart-4/40"
            />

            <DriverSelect
              label="2nd Place"
              value={prediction.p2}
              onChange={(val) => handleChange("p2", val)}
              drivers={getAvailableDrivers("p2")}
              disabled={isLocked || submitting}
              highlight="ring-primary/30"
            />

            <DriverSelect
              label="3rd Place"
              value={prediction.p3}
              onChange={(val) => handleChange("p3", val)}
              drivers={getAvailableDrivers("p3")}
              disabled={isLocked || submitting}
              highlight="ring-accent/40"
            />
          </div>

          <div className="mb-10">
            <DriverSelect
              label="Driver of the Day"
              value={prediction.dotd}
              onChange={(val) => handleChange("dotd", val)}
              drivers={drivers}
              disabled={isLocked || submitting}
              highlight="ring-chart-5/50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
            {!isLocked ? (
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                loading={submitting}
                className="font-f1 text-xs font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground hover:bg-primary/85 w-full sm:w-auto"
              >
                {hasExistingPrediction
                  ? "Update Prediction"
                  : "Submit Prediction"}
              </Button>
            ) : (
              <div className="text-destructive font-bold text-center uppercase tracking-wide">
                Predictions locked at lights out
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const Prediction = () => {
  const {
    race,
    raceStatus,
    drivers,
    isLockedByTime,
    savedPrediction,
    hasExistingPrediction,
    isLoading,
    error,
    refetch,
    submitPrediction,
    submitting,
  } = usePredictions();
  const captureMode = isBoneyardCapture();

  const [draftByRaceId, setDraftByRaceId] = useState({});
  const [modal, setModal] = useState(CLOSED_MODAL);

  const openModal = useCallback((type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  }, []);

  const closeModal = useCallback(() => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const prediction = useMemo(() => {
    if (!race?.id) return EMPTY_PREDICTION;

    const draft = draftByRaceId[race.id];
    if (draft) return draft;

    return savedPrediction
      ? toPredictionDraft(savedPrediction)
      : EMPTY_PREDICTION;
  }, [draftByRaceId, race?.id, savedPrediction]);

  const isLocked =
    Boolean(raceStatus?.is_locked) ||
    isLockedByTime ||
    !["upcoming"].includes(
      String(raceStatus?.race_state || race?.race_state || ""),
    );

  const getAvailableDrivers = useCallback(
    (fieldName) => {
      if (fieldName === "dotd") {
        return drivers;
      }

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

  const handleChange = (position, value) => {
    if (!race?.id) return;

    setDraftByRaceId((previousDrafts) => {
      const previousDraft =
        previousDrafts[race.id] ||
        (savedPrediction
          ? toPredictionDraft(savedPrediction)
          : EMPTY_PREDICTION);

      return {
        ...previousDrafts,
        [race.id]: {
          ...previousDraft,
          [position]: value,
        },
      };
    });
  };

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

    try {
      const saved = await submitPrediction({
        raceId: race.id,
        p1: prediction.p1,
        p2: prediction.p2,
        p3: prediction.p3,
        dotd: prediction.dotd,
      });

      setDraftByRaceId((previousDrafts) => ({
        ...previousDrafts,
        [race.id]: toPredictionDraft(saved),
      }));

      openModal(
        "success",
        hasExistingPrediction ? "Prediction Updated" : "Prediction Submitted",
        "Your prediction has been saved successfully.",
      );
    } catch (submissionError) {
      openModal("error", "Prediction Save Failed", mapApiError(submissionError));
    }
  };

  if (!captureMode && error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center py-28">
        <p className="text-muted-foreground text-sm">{mapApiError(error)}</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!captureMode && !isLoading && !race) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-28 px-6">
        <p className="text-muted-foreground text-sm">
          No upcoming race is available.
        </p>
      </div>
    );
  }

  const displayRace = race ?? PREDICTION_FIXTURE.race;
  const displayDrivers = drivers.length ? drivers : PREDICTION_FIXTURE.drivers;
  const displayPrediction =
    race?.id ? prediction : toPredictionDraft(PREDICTION_FIXTURE.prediction);
  const displayHasExistingPrediction =
    race?.id ? hasExistingPrediction : true;
  const displayLocked = race?.id ? isLocked : false;
  const raceDateLabel = formatRaceDate(displayRace);

  const fixtureGetAvailableDrivers = (fieldName) => {
    if (fieldName === "dotd") {
      return PREDICTION_FIXTURE.drivers;
    }

    const podiumDrivers = [
      PREDICTION_FIXTURE.prediction.p1,
      PREDICTION_FIXTURE.prediction.p2,
      PREDICTION_FIXTURE.prediction.p3,
    ];

    return PREDICTION_FIXTURE.drivers.filter((driverName) => {
      if (PREDICTION_FIXTURE.prediction[fieldName] === driverName) return true;

      return !podiumDrivers.some(
        (driver) =>
          driver === driverName &&
          driver !== PREDICTION_FIXTURE.prediction[fieldName],
      );
    });
  };

  return (
    <PageWrapper>
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      <Skeleton
        name="prediction-form"
        loading={isLoading}
        animate="pulse"
        transition={300}
        fixture={
          <PredictionFormContent
            drivers={PREDICTION_FIXTURE.drivers}
            getAvailableDrivers={fixtureGetAvailableDrivers}
            handleChange={() => {}}
            handleSubmit={() => {}}
            hasExistingPrediction={true}
            isLocked={false}
            prediction={PREDICTION_FIXTURE.prediction}
            race={PREDICTION_FIXTURE.race}
            raceDateLabel={formatRaceDate(PREDICTION_FIXTURE.race)}
            submitting={false}
          />
        }
      >
        <PredictionFormContent
          drivers={displayDrivers}
          getAvailableDrivers={getAvailableDrivers}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          hasExistingPrediction={displayHasExistingPrediction}
          isLocked={displayLocked}
          prediction={displayPrediction}
          race={displayRace}
          raceDateLabel={raceDateLabel}
          submitting={submitting}
        />
      </Skeleton>
    </PageWrapper>
  );
};

export default Prediction;
