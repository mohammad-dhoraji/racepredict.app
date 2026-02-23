import React from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="min-h-screen bg-neutral-800 text-white flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-zinc-400 text-lg mb-6">
          Looks like you missed the apex. This page doesn’t exist.
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
    </PageWrapper>
  );
};

export default NotFound;
