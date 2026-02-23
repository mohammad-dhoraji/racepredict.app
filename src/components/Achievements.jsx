function Achievements() {
  return (
    <section className="max-w-5xl mx-auto" aria-labelledby="achievements-heading">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 id="achievements-heading" className="text-xl font-semibold mb-6">
          Achievements
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-2xl mb-2" aria-hidden="true">🥇</p>
            <p className="text-sm">Perfect Podium</p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-2xl mb-2" aria-hidden="true">🔥</p>
            <p className="text-sm">3 Race Streak</p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-2xl mb-2" aria-hidden="true">🎯</p>
            <p className="text-sm">Sharp Shooter</p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-4">
            <p className="text-2xl mb-2" aria-hidden="true">📈</p>
            <p className="text-sm">Big Gain</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Achievements;