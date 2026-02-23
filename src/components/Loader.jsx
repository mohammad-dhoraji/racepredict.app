import React from "react";

const Loader = ({ text = "Loading data..." }) => {
  return (
    <div className="min-h-screen bg-neutral-800 flex flex-col items-center justify-center w-full">
      
      {/* Animated F1 Bar */}
      <div className="w-48 h-1 bg-zinc-700 overflow-hidden rounded-full">
        <div className="h-full w-1/3 bg-red-600 animate-loadingBar rounded-full"></div>
      </div>

      {/* Loading Text */}
      <p className="text-zinc-400 mt-6 text-sm tracking-widest uppercase">
        {text}
      </p>
    </div>
  );
};

export default Loader;
