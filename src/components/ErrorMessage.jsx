import React from "react";
import Button from "./Button";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="w-full py-6 px-4 bg-zinc-900/60 border border-red-600/30 rounded-lg text-zinc-200">
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-red-400">{message}</div>
        {onRetry && (
          <Button className="px-3 py-1" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
