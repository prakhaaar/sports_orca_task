import { useEffect, useState } from "react";

// MatchList component displays a list of upcoming football matches
export default function MatchList() {
  const [matches, setMatches] = useState([]); // Stores the list of matches
  const [loading, setLoading] = useState(true); // Indicates if data is still being fetched

  useEffect(() => {
    // Fetch match data from the backend API when the component mounts
    fetch("/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data); // Save fetched match data to state
        setLoading(false); // Turn off loading state
      })
      .catch((err) => {
        console.error("Error fetching matches:", err);
        setLoading(false); // Even on error, stop loading spinner
      });
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1c1c1c] text-white px-4 py-12 font-sans">
      {/* App title */}
      <h2 className="text-4xl font-extrabold text-center mb-10 tracking-wide">
        ⚽ SportsOrca ⚽
      </h2>

      {/* Handle loading and empty state */}
      {loading ? (
        <p className="text-center text-gray-400">Loading...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-400">No upcoming matches.</p>
      ) : (
        // Render the match list
        <div className="grid gap-6 max-w-4xl mx-auto">
          {matches.map((match) => (
            <div
              key={match.id}
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300"
            >
              {/* Home team info */}
              <div className="flex items-center gap-4">
                <img
                  src={match.homeLogo}
                  alt={match.homeTeam}
                  className="h-12 w-12 object-contain rounded-full bg-white/10 p-1"
                />
                <span className="font-semibold text-lg">{match.homeTeam}</span>
              </div>

              {/* VS label */}
              <span className="text-orange-400 font-bold text-xl">VS</span>

              {/* Away team info */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-lg">{match.awayTeam}</span>
                <img
                  src={match.awayLogo}
                  alt={match.awayTeam}
                  className="h-12 w-12 object-contain rounded-full bg-white/10 p-1"
                />
              </div>

              {/* Match date and time */}
              <div className="text-right text-sm text-gray-300 ml-4 min-w-[70px]">
                <div>{match.date}</div>
                <div>{match.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
