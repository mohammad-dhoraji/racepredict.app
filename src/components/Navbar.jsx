import { NavLink } from "react-router-dom";

function Navbar() {
  const base =
    "px-3 py-1 rounded-xl font-medium transition";
  const active =
    "bg-red-600 text-white";

  return (
    <div className="flex gap-4 bg-neutral-900 px-8 py-5 rounded-3xl   ">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/groups"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Groups
      </NavLink>

      <NavLink
        to="/drivers"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Drivers
      </NavLink>

      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `${base} ${isActive ? active : "text-white"}`
        }
      >
        Leaderboard
      </NavLink>
    </div>
  );
}

export default Navbar;
