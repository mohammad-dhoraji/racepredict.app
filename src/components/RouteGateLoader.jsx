function GateBlock({ className }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/70 animate-pulse ${className}`}
    />
  );
}

function RouteGateLoader({
  title = "Loading GridLock",
  subtitle = "Preparing your race dashboard...",
}) {
  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center">
        <div className="w-full space-y-6">
          <div className="space-y-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-zinc-500">
              GridLock
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
              {title}
            </h1>
            <p className="text-sm text-zinc-400 sm:text-base">{subtitle}</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <GateBlock className="h-72" />
            <div className="space-y-5">
              <GateBlock className="h-32" />
              <GateBlock className="h-32" />
            </div>
          </div>

          <GateBlock className="h-56" />
        </div>
      </div>
    </div>
  );
}

export default RouteGateLoader;
