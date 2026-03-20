import { useEffect, useState } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { LandingButton } from "./LandingButton";
import RaceLights from "./RaceLights";
import { hyperspeedPresets } from "../../components/HyperSpeedPresets";
import Hyperspeed from "../../components/Hyperspeed";

const Hero = () => {
  const [showLights, setShowLights] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLights(false);
    }, 4200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pb-12 pt-24">
      <div className="absolute inset-0 z-0">
        <Hyperspeed effectOptions={hyperspeedPresets.two} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/30 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="relative pt-[84px] text-center">
          <AnimatePresence>
            {showLights && (
              <Motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <RaceLights className="mb-0" />
              </Motion.div>
            )}
          </AnimatePresence>

          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.7 }}
          >
            <h1 className="mb-6 text-4xl leading-none font-f1 font-black tracking-tight text-foreground md:text-6xl lg:text-7xl">
              PREDICT THE <span className="text-primary">GRID</span>
            </h1>
            <p className="mx-auto mb-3 max-w-xl text-xl font-light text-muted-foreground md:text-2xl">
              Call P1, P2, P3, and Driver of the Day. Compete on leaderboards and in private groups.
            </p>
            <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground/50 lg:mb-12">
              Competitive GridLock prediction platform
            </p>
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.5 }}
            className="flex justify-center"
          >
            <a href="/login">
              <LandingButton variant="racing" size="lg">
                Enter The Grid
              </LandingButton>
            </a>
          </Motion.div>
        </div>

        <Motion.div
          className="mx-auto mt-14 h-px w-full border-t border-border lg:mt-16"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 3.5, duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </section>
  );
};

export default Hero;
