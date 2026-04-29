import React from "react";
import AppSkeleton from "../components/AppSkeleton";
import ErrorMessage from "../components/ErrorMessage";
import RaceCard from "../components/RaceCard";
import { useRaces } from "../hooks/useRaces";
import { detectNextRace } from "../lib/utils";
import { LandingButton } from "../landing/components/LandingButton";

const CALENDAR_FIXTURE = [
  {
    id: "fixture-race-1",
    round: 1,
    location: "Bahrain",
    name: "Bahrain Grand Prix",
    country: "Bahrain",
    countryFlag: "BH",
    race_date: "2026-03-08T15:00:00.000Z",
    race_state: "results_ready",
    winner: "Max Verstappen",
    circuitId: "bahrain",
  },
  {
    id: "fixture-race-2",
    round: 2,
    location: "Suzuka",
    name: "Japanese Grand Prix",
    country: "Japan",
    countryFlag: "JP",
    race_date: "2026-04-05T05:00:00.000Z",
    race_state: "upcoming",
    circuitId: "suzuka",
  },
  {
    id: "fixture-race-3",
    round: 3,
    location: "Monaco",
    name: "Monaco Grand Prix",
    country: "Monaco",
    countryFlag: "MC",
    race_date: "2026-05-24T13:00:00.000Z",
    race_state: "upcoming",
    circuitId: "monaco",
  },
];

function CalendarPageContent({ races, season }) {
  const nextRaceId = detectNextRace(races);

  if (!races.length) {
    return (
      <div className="min-h-screen bg-background py-28 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-f1 font-bold mb-6 text-foreground">
            No Races
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            No races scheduled for this season.
          </p>
          <LandingButton asChild href="/login">
            <span>Make Predictions</span>
          </LandingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 space-y-2 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            Season {season}
          </p>
          <h1 className="font-f1 text-4xl font-black uppercase tracking-tight text-foreground md:text-5xl">
            Race Calendar
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Track every Grand Prix. Make predictions before lock. See podium
            results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {races.map((race) => (
            <RaceCard
              key={race.id}
              race={race}
              isNext={race.id === nextRaceId}
            />
          ))}
        </div>

        <div className="mt-20 flex flex-col sm:flex-row gap-4 justify-center">
          <LandingButton size="lg" href="/login" className="w-full sm:w-auto">
            Make Predictions
          </LandingButton>
          <LandingButton
            variant="racingOutline"
            size="lg"
            className="w-full sm:w-auto"
          >
            View Leaderboard
          </LandingButton>
        </div>
      </div>
    </div>
  );
}

const CalendarPage = () => {
  const { data: races = [], isLoading, error, refetch } = useRaces();

  const sortedRaces = React.useMemo(() => {
    return [...races].sort(
      (a, b) =>
        new Date(a.date || a.race_date).getTime() -
        new Date(b.date || b.race_date).getTime(),
    );
  }, [races]);

  const season = new Date().getFullYear();

  if (error) {
    return (
      <div className="min-h-screen bg-background py-28 px-6 flex items-center justify-center">
        <ErrorMessage
          message="Failed to load race calendar"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <AppSkeleton
      name="calendar-page"
      loading={isLoading}
      placeholder={
        <CalendarPageContent races={CALENDAR_FIXTURE} season={season} />
      }
    >
      <CalendarPageContent races={sortedRaces} season={season} />
    </AppSkeleton>
  );
};

export default CalendarPage;
