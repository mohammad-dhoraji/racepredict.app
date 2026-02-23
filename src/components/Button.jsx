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
        cursor-pointer
        px-6 py-2.5
        text-lg font-semibold
        text-[#c1a362]
        border-2 border-[#c1a362]
        rounded-[34px]
        bg-transparent
        overflow-hidden
        transition-all duration-300
        ease-[cubic-bezier(0.23,1,0.320,1)]
        hover:scale-110
        hover:text-[#212121]
        active:scale-100
        hover:shadow-[0_0_20px_rgba(193,163,98,0.4)]
        disabled:opacity-50
        disabled:cursor-not-allowed
        
        before:content-['']
        before:absolute
        before:inset-0
        before:m-auto
        before:w-[50px]
        before:h-[50px]
        before:rounded-[34px]
        before:scale-0
        before:bg-[#c1a362]
        before:-z-10
        before:transition-all
        before:duration-500
        before:ease-[cubic-bezier(0.23,1,0.320,1)]
        hover:before:scale-[3]
        
        ${className}
      `}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
