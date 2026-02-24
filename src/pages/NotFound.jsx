import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white flex flex-col items-center justify-center px-6 text-center">
        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-14 shadow-2xl shadow-black/40 max-w-md">
          <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-linear-to-r from-white to-zinc-400 bg-clip-text">404</h1>
          <p className="text-zinc-400 text-lg mb-10">
            Looks like you missed the apex. This page doesn't exist.
          </p>

          <div className="flex gap-4">
            <Button onClick={() => navigate("/")}>
              Go Home
            </Button>

            <Button
              className="bg-zinc-700 hover:bg-zinc-600"
              onClick={() => navigate("/leaderboard")}
            >
              View Leaderboard
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
