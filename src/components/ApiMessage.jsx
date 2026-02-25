import React from "react";

const VARIANT_STYLES = {
  error: "border-red-500/40 bg-red-500/10 text-red-200",
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  info: "border-zinc-600 bg-zinc-800/60 text-zinc-200",
};

export default function ApiMessage({ variant = "info", message }) {
  if (!message) return null;

  const style = VARIANT_STYLES[variant] || VARIANT_STYLES.info;
  const role = variant === "error" ? "alert" : "status";

  const ariaLive = role === "alert" ? "assertive" : "polite";

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`rounded-xl border px-4 py-3 text-sm ${style}`}
    >
      {message}
    </div>
  );
}
