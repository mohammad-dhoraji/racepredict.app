function PerformanceSnapshot({ stats = {} }) {
  return (
    <section className="max-w-5xl mx-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">
          Performance Snapshot
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-zinc-400 text-sm">Accuracy</p>
            <p className="text-xl font-bold">
              {stats.accuracy != null && Number.isFinite(stats.accuracy)
                ? `${(stats.accuracy * 100).toFixed(1)}%`
                : '—'}
            </p>          </div>
        </div>
      </div>
    </section>
  );
}

export default PerformanceSnapshot;