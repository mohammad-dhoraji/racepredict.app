import React, { useEffect, useState } from "react";
import AppSkeleton from "../components/AppSkeleton";
import PageWrapper from "../components/PageWrapper";
import { fetchDriverStandings } from "../services/standingsService";

const DRIVER_STANDINGS_FIXTURE = [
  {
    position: 1,
    name: "Max Verstappen",
    code: "VER",
    team: "Red Bull",
    points: 112,
    wins: 3,
  },
  {
    position: 2,
    name: "Lando Norris",
    code: "NOR",
    team: "McLaren",
    points: 96,
    wins: 1,
  },
  {
    position: 3,
    name: "Charles Leclerc",
    code: "LEC",
    team: "Ferrari",
    points: 88,
    wins: 1,
  },
  {
    position: 4,
    name: "Oscar Piastri",
    code: "PIA",
    team: "McLaren",
    points: 79,
    wins: 0,
  },
];

function DriversContent({ driversData }) {
  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight mb-12 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Drivers Championship - 2026
        </h1>

        <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 text-zinc-300 text-xs uppercase tracking-widest border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Pos</th>
                  <th className="px-6 py-4 text-left font-semibold">Driver</th>
                  <th className="px-6 py-4 text-left font-semibold">Team</th>
                  <th className="px-6 py-4 text-left font-semibold">Pts</th>
                  <th className="px-6 py-4 text-left font-semibold">Wins</th>
                </tr>
              </thead>
              <tbody>
                {driversData.map((driver) => (
                  <tr
                    key={driver.position}
                    className="border-t border-zinc-800 hover:bg-zinc-800/50 transition"
                  >
                    <td className="px-6 py-4 font-bold">{driver.position}</td>

                    <td className="px-6 py-4">
                      {driver.name}
                      <span className="text-zinc-500 ml-2 text-sm">
                        {driver.code}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-zinc-400">{driver.team}</td>

                    <td className="px-6 py-4 font-semibold">{driver.points}</td>

                    <td className="px-6 py-4">{driver.wins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mt-8">
          Use championship trends and win count to guide your podium
          predictions.
        </p>
      </div>
    </div>
  );
}

function Drivers() {
  const [driversData, setDriversData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadStandings() {
      try {
        setLoading(true);
        const data = await fetchDriverStandings();
        setDriversData(data);
      } catch {
        setError("Failed to load standings");
      } finally {
        setLoading(false);
      }
    }

    loadStandings();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-800 text-red-500 flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <PageWrapper>
      <AppSkeleton
        name="drivers-page"
        loading={loading}
        placeholder={<DriversContent driversData={DRIVER_STANDINGS_FIXTURE} />}
      >
        <DriversContent driversData={driversData} />
      </AppSkeleton>
    </PageWrapper>
  );
}

export default Drivers;
