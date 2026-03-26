import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 overflow-hidden relative">
      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
       

        {/* 404 number */}
        <div className="opacity-0 animate-fade-up-delay-1 mb-2">
          <span className="font-display text-8xl md:text-[10rem] leading-none tracking-tighter text-foreground/10 select-none font-bold">
            404
          </span>
        </div>

        {/* Headline */}
        <h1 className="opacity-0 animate-fade-up-delay-1 font-f1   text-3xl md:text-5xl lg:text-6xl uppercase tracking-tight text-foreground mb-4">
          YOU&apos;VE GONE OFF TRACK
        </h1>

        {/* Subtext */}
        <p className="opacity-0 animate-fade-up-delay-2 text-muted-foreground text-sm md:text-base uppercase tracking-widest mb-2 font-medium">
          "No data on this sector. Box box box."
        </p>
        <p className="opacity-0 animate-fade-up-delay-2 text-muted-foreground/60 text-xs uppercase tracking-widest mb-10">
          10 seconds penalty for going off track.
        </p>

        {/* CTAs */}
        <div className="opacity-0 animate-fade-up-delay-3 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="animate-pulse-glow uppercase tracking-widest font-bold text-sm px-8 bg-red-500 text-destructive-foreground hover:bg-destructive/90">
            <Link to="/">RETURN TO GRID</Link>
          </Button>
         
        </div>

        {/* Bottom HUD detail */}
        <div className="opacity-0 animate-fade-up-delay-3 mt-16 flex items-center justify-center gap-3 text-muted-foreground/40 text-[10px] uppercase tracking-[0.3em]">
          <span>GRIDLOCK</span>
          <span className="w-1 h-1 rounded-full bg-[hsl(var(--racing-red))] animate-blink-red" />
          <span>SYSTEM</span>
          <span className="w-1 h-1 rounded-full bg-[hsl(var(--racing-red))] animate-blink-red" style={{ animationDelay: "0.3s" }} />
          <span>OFFLINE</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
