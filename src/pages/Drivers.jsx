import React, { useEffect, useState } from "react";
import { fetchDriverStandings } from "../services/standingsService";
import PageWrapper from "../components/PageWrapper";
import { useLoading } from "../context/LoadingContext";

function Drivers() {
  const [driversData, setDriversData] = useState([]);
  const [error, setError] = useState(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    async function loadStandings() {
      try {
        setLoading(true);
        const data = await fetchDriverStandings();
        setDriversData(data);
      } catch (err) {
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
      <div className="min-h-screen bg-linear-to-b from-neutral-800 via-neutral-950 to-black text-white px-6 py-10 w-full">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight mb-12 bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Drivers Championship – 2025
          </h1>

          <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden ">
            <div className="absolute -top-1 left-0 w-full h-[3px] bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
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

                      <td className="px-6 py-4 font-semibold">
                        {driver.points}
                      </td>

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
    </PageWrapper>
  );
}

export default Drivers;
