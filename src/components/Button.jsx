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
  rounded-xl
  transition-all duration-300 ease-out
  active:scale-[0.98]
  disabled:opacity-50
  disabled:cursor-not-allowed
  ${className}
`}
    >
      {children}
    </button>
  );
}
