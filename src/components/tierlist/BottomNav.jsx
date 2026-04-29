import { Car, Route, Users } from "lucide-react";

const navIcons = {
  drivers: Car,
  teams: Users,
  circuits: Route
};

export default function BottomNav({
  activeCategory,
  setActiveCategory,
  navItems
}) {

  return (
    <nav className="md:hidden fixed bottom-6 left-0 right-0 flex justify-center z-[60] px-4">
      <div
        className="w-[90%] max-w-md bg-[#1c1c1c]/70 backdrop-blur-3xl rounded-2xl px-4 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex justify-around items-center"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map((item) => {
          const isActive = activeCategory === item.key;
          const Icon = navIcons[item.key];

          return (
            <button
              type="button"
              key={item.key}
              onClick={() => setActiveCategory(item.key)}
              aria-pressed={isActive}
              className={`
                flex flex-col items-center justify-center gap-1 p-2 rounded-xl
                transition-all duration-300 ease-out
                ${isActive
                  ? "text-[#ff3b30] scale-110"
                  : "text-white/40 hover:text-white"
                }
              `}
            >
              <Icon size={20} strokeWidth={2.5} />
              <span className="text-[10px] uppercase tracking-widest font-mono">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
