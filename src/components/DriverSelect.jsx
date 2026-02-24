import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const DriverSelect = ({
  label,
  value,
  onChange,
  drivers,
  disabled,
  highlight,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs text-zinc-400 mb-3 uppercase tracking-widest">
        {label}
      </label>

      <button
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 transition-all duration-200 ${
          open ? `ring-2 ${highlight}` : ""
        } hover:border-[#c1a362]/40`}
      >
        <span className={value ? "text-white" : "text-zinc-500"}>
          {value || "Select Driver"}
        </span>
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
          {drivers.map((driver) => (
            <div
              key={driver}
              onClick={() => {
                onChange(driver);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer transition-all duration-150 ${
                value === driver
                  ? "bg-[#c1a362]/20 text-[#c1a362]"
                  : "hover:bg-zinc-800"
              }`}
            >
              {driver}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverSelect;