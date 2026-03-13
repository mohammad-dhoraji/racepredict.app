import { useEffect, useMemo, useRef } from "react";
import { animate, createMotionPath, svg } from "animejs";
import { DEFAULT_TRACK, tracks } from "../data/trackPaths";

const BASE_DURATION = 13000;

const TrackAnimation = ({ track = DEFAULT_TRACK, duration = BASE_DURATION, className = "" }) => {
  const pathRef = useRef(null);
  const drawablePathRef = useRef(null);
  const carRef = useRef(null);

  const trackData = useMemo(() => tracks[track] ?? tracks[DEFAULT_TRACK], [track]);
  const { viewBox, path: trackPath } = trackData;

  useEffect(() => {
    const pathEl = pathRef.current;
    const drawablePathEl = drawablePathRef.current;
    const carEl = carRef.current;

    if (!pathEl || !drawablePathEl || !carEl) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const carAnimation = animate(carEl, {
      ease: "linear",
      duration,
      loop: true,
      ...createMotionPath(pathEl),
    });

    const [drawable] = svg.createDrawable(drawablePathEl);
    const drawAnimation = animate(drawable, {
      draw: "0 1",
      ease: "linear",
      duration,
      loop: true,
    });

    return () => {
      carAnimation.cancel();
      drawAnimation.cancel();
      carEl.style.removeProperty("transform");
      drawablePathEl.removeAttribute("stroke-dashoffset");
      drawablePathEl.removeAttribute("stroke-dasharray");
    };
  }, [duration, trackPath]);

  const wrapperClassName = `relative mx-auto w-full max-w-[420px] ${className}`.trim();

  return (
    <div className={wrapperClassName} aria-hidden="true">
  <svg viewBox={viewBox} className="w-full h-auto overflow-visible text-foreground/70">
        <path d={trackPath} fill="none" stroke="currentColor" strokeWidth="2" className="opacity-25" />
        <path
          ref={drawablePathRef}
          d={trackPath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="opacity-70"
        />
        <path ref={pathRef} d={trackPath} fill="none" stroke="transparent" strokeWidth="12" />
      </svg>

      <div
        ref={carRef}
        className="absolute top-0 left-0 h-2.5 w-5 rounded-sm bg-primary/90 shadow-none origin-center"
        style={{ marginLeft: "-10px", marginTop: "-5px" }}
      />
    </div>
  );
};

export default TrackAnimation;

