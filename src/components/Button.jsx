import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative
        px-6 py-3
        text-sm font-semibold tracking-wider uppercase
        text-[#c1a362]
        border border-[#c1a362]/40
        rounded-xl
        bg-zinc-900
        transition-all duration-300 ease-out
        hover:bg-[#c1a362]
        hover:text-black
        hover:shadow-[0_0_20px_rgba(193,163,98,0.25)]
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? "Submitting..." : children}
    </button>
  );
}