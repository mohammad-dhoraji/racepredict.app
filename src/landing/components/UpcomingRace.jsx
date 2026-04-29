import { useEffect, useMemo, useRef } from "react";
import { motion as Motion } from "framer-motion";
import { animate, createMotionPath, svg } from "animejs";
import { Link } from "react-router-dom";
import AppSkeleton from "../../components/AppSkeleton";
import Countdown from "../../components/Countdown";
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

const UPCOMING_RACE_FIXTURE = {
  round: 4,
  name: "Japanese Grand Prix",
  circuit_name: "Suzuka Circuit",
  country: "Japan",
  race_at: "2026-04-05T05:00:00.000Z",
  lock_at: "2026-04-05T04:45:00.000Z",
};

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
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
          Next Race
        </p>
        <h2 className="text-2xl font-f1 font-bold text-foreground md:text-3xl">
          UPCOMING RACE
        </h2>
      </div>
      <div className="border-t border-border pt-10">{children}</div>
    </div>
  </section>
);

const TrackUnavailable = ({ message = "Track preview unavailable" }) => (
  <UpcomingRaceShell>
    <p className="font-mono text-sm text-muted-foreground">{message}</p>
  </UpcomingRaceShell>
);

function UpcomingRaceContent({
  carRef,
  drawablePathRef,
  motionPathRef,
  race,
  trackPath,
  trackViewBox,
}) {
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
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
            Next Race
          </p>
          <h2 className="text-2xl font-f1 font-bold text-foreground md:text-3xl">
            UPCOMING RACE
          </h2>
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
                Circuit Name:{" "}
                <span className="font-semibold text-foreground">
                  {race.circuit_name || "TBD"}
                </span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Race Name:{" "}
                <span className="font-semibold text-foreground">
                  {race.name || "TBD"}
                </span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Country:{" "}
                <span className="font-semibold text-foreground">
                  {race.country || "TBD"}
                </span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Race Date:{" "}
                <span className="font-semibold text-foreground">
                  {formatDate(raceAt)}
                </span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Race Start Time:{" "}
                <span className="font-semibold text-foreground">
                  {formatTime(raceAt)}
                </span>
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                Prediction Lock Time:{" "}
                <span className="font-semibold text-foreground">
                  {formatTime(lockAt)}
                </span>
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
            <div className="relative mx-auto w-full max-w-105" aria-hidden="true">
              <svg
                viewBox={trackViewBox}
                className="h-auto w-full overflow-visible text-foreground/70"
              >
                <path
                  d={trackPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="opacity-25"
                />
                <path
                  ref={drawablePathRef}
                  d={trackPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="track-path opacity-70"
                />
                <path
                  ref={motionPathRef}
                  d={trackPath}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="12"
                />
              </svg>
              <div
                ref={carRef}
                className="car absolute left-0 top-0 h-2.5 w-5 origin-center rounded-sm bg-primary/90 shadow-none"
                style={{ marginLeft: "-10px", marginTop: "-5px" }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
            <div className="flex-1 md:flex-none">
              <a href="/login">
                <LandingButton variant="racing" size="lg">
                  Make Predictions
                </LandingButton>
              </a>
            </div>
            <Link to="/calendar">
              <LandingButton variant="racingOutline" size="lg">
                View Full Calendar
              </LandingButton>
            </Link>
          </div>
        </Motion.div>
      </div>
    </section>
  );
}

const UpcomingRace = () => {
  const motionPathRef = useRef(null);
  const drawablePathRef = useRef(null);
  const carRef = useRef(null);
  const { data: race, isLoading, isError } = useNextRace();

  const track = useMemo(
    () => {
      // Only resolve track if race data is loaded and valid
      if (!race || !race.round) {
        return null;
      }
      return tracks[Number(race.round)] ?? null;
    },
    [race],
  );
  const trackPath = track?.path;
  const trackViewBox = track?.viewBox;

  useEffect(() => {
    if (!race || !trackPath) return undefined;

    const motionPathEl = motionPathRef.current;
    const drawablePathEl = drawablePathRef.current;
    const carEl = carRef.current;

    if (!motionPathEl || !drawablePathEl || !carEl) return undefined;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
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
  }, [race, trackPath]);

  if (isError) {
    return <TrackUnavailable />;
  }

  if (!trackPath || !trackViewBox) {
    return <TrackUnavailable />;
  }

  if (!race && !isLoading) {
    return <TrackUnavailable message="No upcoming races scheduled." />;
  }

  return (
    <AppSkeleton
      name="landing-upcoming-race"
      loading={isLoading && !race}
      placeholder={
        <UpcomingRaceContent
          carRef={null}
          drawablePathRef={null}
          motionPathRef={null}
          race={UPCOMING_RACE_FIXTURE}
          trackPath={trackPath}
          trackViewBox={trackViewBox}
        />
      }
    >
      <UpcomingRaceContent
        carRef={carRef}
        drawablePathRef={drawablePathRef}
        motionPathRef={motionPathRef}
        race={race}
        trackPath={trackPath}
        trackViewBox={trackViewBox}
      />
    </AppSkeleton>
  );
};

export default UpcomingRace;
