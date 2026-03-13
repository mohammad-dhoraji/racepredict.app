import { NavLink } from "react-router-dom";

function Navbar() {
  const base =
    "px-3 py-1 rounded-xl font-medium transition";
  const active =
    "bg-red-600 text-white";

  return (
    <div className="flex items-center gap-8 bg-neutral-900 px-8 py-5 rounded-3xl   ">
      <h1 className="text-xl font-bold bg-linear-to-r from-white to-zinc-300 bg-clip-text text-transparent select-none whitespace-nowrap">
        Gridlock
      </h1>
      <div className="flex gap-4 flex-1 justify-center">
        <NavLink
        to="/home"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/home/groups"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Groups
      </NavLink>

      <NavLink
        to="/home/drivers"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Drivers
      </NavLink>

      <NavLink
        to="/home/leaderboard"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Leaderboard
      </NavLink>
    </div>
  </div>
);

}

export default Navbar;
