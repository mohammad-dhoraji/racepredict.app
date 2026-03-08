// DATA LAYER
// Later you ONLY replace BASE_URL with your backend.

const BASE_URL = "https://api.jolpi.ca/ergast/f1/2026";

export async function fetchDriverStandings() {
  const response = await fetch(`${BASE_URL}/driverstandings/?format=json`);

  if (!response.ok) {
    throw new Error("Failed to fetch driver standings");
  }

  const data = await response.json();

  const standings =
    data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings;

  if (!standings) return [];

  return standings.map((driver) => ({
    position: Number(driver.position),
    name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
    code: driver.Driver.code,
    team: driver.Constructors?.[0]?.name ?? "—",
    points: Number(driver.points),
    wins: Number(driver.wins),
  }));
}
