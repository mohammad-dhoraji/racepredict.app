import { useEffect, useMemo, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { animate, createMotionPath, svg } from "animejs";
import Countdown from "../../components/Countdown";
import Skeleton from "../../components/Skeleton";
import { tracks } from "../../data/trackPaths";
import { useNextRace } from "../../hooks/useNextRace";
import { LandingButton } from "./LandingButton";

const DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

const toDateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDate = (value) => {
  const date = toDateValue(value);
  return date ? DATE_FORMATTER.format(date) : "TBD";
};

const formatTime = (value) => {
  const date = toDateValue(value);
  return date ? TIME_FORMATTER.format(date) : "TBD";
};

const UpcomingRaceShell = ({ children }) => (
  <section className="px-6 py-28">
    <div className="mx-auto max-w-4xl">
      <div className="mb-16">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">Next Race</p>
        <h2 className="text-2xl font-f1 font-bold text-foreground md:text-3xl">UPCOMING RACE</h2>
      </div>
      <div className="border-t border-border pt-10">{children}</div>
    </div>
  </section>
);

const UpcomingRaceSkeleton = () => (
  <UpcomingRaceShell>
    <div className="space-y-6">
      <Skeleton lines={4} lineClass="h-4 rounded bg-zinc-700/40" />
      <div className="mx-auto h-44 w-full max-w-md rounded-lg border border-zinc-800/80 bg-zinc-900/40" />
    </div>
  </UpcomingRaceShell>
);

const TrackUnavailable = ({ message = "Track preview unavailable" }) => (
  <UpcomingRaceShell>
    <p className="font-mono text-sm text-muted-foreground">{message}</p>
  </UpcomingRaceShell>
);

const UpcomingRace = () => {
  const motionPathRef = useRef(null);
  const drawablePathRef = useRef(null);
  const carRef = useRef(null);
  const { data: race, isLoading, isError } = useNextRace();

  const round = Number(race?.round);
  const track = useMemo(() => tracks[round] ?? null, [round]);
  const trackPath = track?.path;
  const trackViewBox = track?.viewBox;

  useEffect(() => {
    if (!trackPath) return undefined;

    const motionPathEl = motionPathRef.current;
    const drawablePathEl = drawablePathRef.current;
    const carEl = carRef.current;
    if (!motionPathEl || !drawablePathEl || !carEl) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const [drawable] = svg.createDrawable(drawablePathEl);
    const carAnimation = animate(carEl, {
      ease: "linear",
      duration: 6000,
      loop: true,
      ...createMotionPath(motionPathEl),
    });
    const drawAnimation = animate(drawable, {
      draw: "0 1",
      ease: "linear",
      duration: 6000,
      loop: true,
    });

    return () => {
      carAnimation.cancel();
      drawAnimation.cancel();
      carEl.style.removeProperty("transform");
      drawablePathEl.removeAttribute("stroke-dashoffset");
      drawablePathEl.removeAttribute("stroke-dasharray");
    };
  }, [trackPath]);

  if (isLoading && !race) {
    return <UpcomingRaceSkeleton />;
  }

  if (isError) {
    return <TrackUnavailable />;
  }

  if (!race) {
    return <TrackUnavailable message="No upcoming races scheduled." />;
  }

  if (!trackPath || !trackViewBox) {
    return <TrackUnavailable />;
  }

  const raceAt = race.race_at || race.race_date;
  const lockAt = race.lock_at || raceAt;

  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <Motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">Next Race</p>
          <h2 className="text-2xl font-f1 font-bold text-foreground md:text-3xl">UPCOMING RACE</h2>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="border-t border-border pt-10"
        >
          <div className="mb-4">
            <h3 className="mb-3 text-xl font-f1 font-bold text-foreground md:text-2xl">
              {String(race.name || "Upcoming Race").toUpperCase()}
            </h3>
            <div className="space-y-1">
              <p className="font-mono text-sm text-muted-foreground">
                Circuit Name: <span className="font-semibold text-foreground">{race.circuit_name || "TBD"}</span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Race Name: <span className="font-semibold text-foreground">{race.name || "TBD"}</span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Country: <span className="font-semibold text-foreground">{race.country || "TBD"}</span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Race Date: <span className="font-semibold text-foreground">{formatDate(raceAt)}</span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Race Start Time: <span className="font-semibold text-foreground">{formatTime(raceAt)}</span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Prediction Lock Time: <span className="font-semibold text-foreground">{formatTime(lockAt)}</span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Prediction Lock In:{" "}
                <span className="font-semibold text-foreground">
                  <Countdown target={lockAt} />
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-center py-4">
            <div className="relative mx-auto w-full max-w-[420px]" aria-hidden="true">
              <svg viewBox={trackViewBox} className="h-auto w-full overflow-visible text-foreground/70">
                <path d={trackPath} fill="none" stroke="currentColor" strokeWidth="2" className="opacity-25" />
                <path
                  ref={drawablePathRef}
                  d={trackPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="track-path opacity-70"
                />
                <path ref={motionPathRef} d={trackPath} fill="none" stroke="transparent" strokeWidth="12" />
              </svg>
              <div
                ref={carRef}
                className="car absolute left-0 top-0 h-2.5 w-5 origin-center rounded-sm bg-primary/90 shadow-none"
                style={{ marginLeft: "-10px", marginTop: "-5px" }}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center md:justify-end">
            <a href="/login">
              <LandingButton variant="racing" size="lg">
                Make Predictions
              </LandingButton>
            </a>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default UpcomingRace;
