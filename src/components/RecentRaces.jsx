function RecentRaces({ predictions }) {
  const formatPoints = (points) => {
    if (points == null) return "—";
    if (points > 0) return `+${points}`;
    return `${points}`;
  };

  if (!predictions || predictions.length === 0) {
    return (
      <section className="max-w-5xl mx-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center">
          <h2 className="text-xl font-semibold mb-4">
            No Predictions Yet
          </h2>
          <p className="text-zinc-400">
            Make your first race prediction and start climbing the leaderboard.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Recent Races
        </h2>

        <div className="space-y-4">
          {predictions.slice(0, 5).map((race) => (
            <div
              key={race.id}
              className="flex justify-between items-center border-b border-zinc-800 pb-3"
            >
              <div>
                <p className="font-semibold">
                  {race.races?.name}
                </p>
                <p className="text-sm text-zinc-400">
                  Predicted: {race.p1} • {race.p2} • {race.p3}
                </p>
              </div>
              <span className="font-bold">
                {formatPoints(race.points)} pts
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RecentRaces;