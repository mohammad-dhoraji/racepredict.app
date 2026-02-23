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
      <div className="min-h-screen bg-neutral-800 text-white px-6 py-10 w-full">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">
            Drivers Championship – 2025
          </h1>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Pos</th>
                    <th className="px-6 py-4">Driver</th>
                    <th className="px-6 py-4">Team</th>
                    <th className="px-6 py-4">Pts</th>
                    <th className="px-6 py-4">Wins</th>
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

          <p className="text-zinc-500 text-sm mt-6">
            Use championship trends and win count to guide your podium
            predictions.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Drivers;
