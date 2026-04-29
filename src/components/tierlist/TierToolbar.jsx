export default function TierToolbar({
  activeCategory,
  setActiveCategory,
  navItems,
  onHomeClick,
  onReset,
  onExport
}) {
  const handleExport = () => {
    onExport?.();
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-2xl">
      <nav className="flex justify-between items-center px-6 py-4 w-full max-w-7xl mx-auto">
        <button
          type="button"
          onClick={onHomeClick}
          className="text-lg font-bold tracking-tighter text-[#e5e2e1] uppercase font-f1 cursor-pointer transition-all duration-200 hover:text-white hover:opacity-100 opacity-90"
        >
          Gridlock
        </button>

        <div className="hidden md:flex items-center gap-8 font-f1 text-sm tracking-tight font-medium">
          {navItems.map((item) => {
            const isActive = activeCategory === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setActiveCategory(item.key)}
                className={`transition-colors ${
                  isActive
                    ? "text-[#ff3b30]"
                    : "text-[#e5e2e1]/50 hover:text-[#ffffff]"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="font-f1 text-sm tracking-tight font-medium text-[#e5e2e1]/50 hover:text-[#ffffff] transition-colors scale-95 active:scale-90 transition-transform duration-200"
          >

            Reset
          </button>
          <button
            onClick={handleExport}
            className="bg-[#ff3b30] text-white px-5 py-2 rounded-lg font-f1 text-sm tracking-tight font-semibold scale-95 active:scale-90 transition-transform duration-200 hover:bg-[#ff5545]"
          >

            Export
          </button>
        </div>
      </nav>
    </header>
  );
}
