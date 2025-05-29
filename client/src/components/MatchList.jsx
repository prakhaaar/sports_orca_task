import { useEffect, useState } from "react";

export default function MatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/matches`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Full fetch error:", err);
      setError(err.message || "Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1c1c1c] text-white px-4 md:px-8 py-12 font-sans">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 tracking-wide">
        ⚽ SportsOrca ⚽
      </h2>

      {error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">⚠️ Error: {error}</p>
          <button
            onClick={fetchMatches}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-full font-medium transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No upcoming matches found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 max-w-7xl mx-auto px-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:scale-[1.02] transition-transform duration-300"
            >
              <div className="flex items-center gap-3">
                <img
                  src={match.homeLogo}
                  alt={`Logo of ${match.homeTeam}`}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full bg-white/10 p-1"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=❌")}
                />
                <span className="font-semibold text-sm sm:text-lg">{match.homeTeam}</span>
              </div>

              <span className="text-orange-400 font-bold text-lg sm:text-xl">VS</span>

              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm sm:text-lg">{match.awayTeam}</span>
                <img
                  src={match.awayLogo}
                  alt={`Logo of ${match.awayTeam}`}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain rounded-full bg-white/10 p-1"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/48?text=❌")}
                />
              </div>

              <div className="text-center sm:text-right text-xs sm:text-sm text-gray-300 min-w-[80px]">
                <div>{match.date}</div>
                <div className="text-orange-400 font-medium">{match.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center text-gray-500 text-xs sm:text-sm mt-10">
        <p>Backend: {API_BASE_URL}</p>
        <p>Loaded {matches.length} matches</p>
      </div>
    </section>
  );
}
