const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS so frontend clients can access this API
app.use(cors({
  origin: 'https://sports-orca-psi.vercel.app' // or whichever deployed domain you're using
}));

// ✅ Replace with your new API token
const API_TOKEN = "81d804275815428c8ffe628b8345fe7a";

// API endpoint for upcoming Premier League matches
const MATCHES_URL = "https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED";

// API endpoint for all Premier League teams (used to get team logos)
const TEAMS_URL = "https://api.football-data.org/v4/competitions/PL/teams";

// This object stores team names and their corresponding logos (in-memory)
let teamLogos = {};

// Fetch team logos once when the server starts
async function fetchTeamLogos() {
  try {
    const response = await axios.get(TEAMS_URL, {
      headers: { "X-Auth-Token": API_TOKEN },
    });

    // Save team name → crest (logo) mapping in memory
    response.data.teams.forEach((team) => {
      teamLogos[team.name] = team.crest;
    });

    console.log("✅ Team logos cached.");
  } catch (error) {
    console.error("❌ Failed to fetch team logos:", error.message);
  }
}

fetchTeamLogos(); // Initialize team logos on server start

// Endpoint to get all upcoming Premier League matches with logos and formatted date/time
app.get("/api/matches", async (req, res) => {
  try {
    const response = await axios.get(MATCHES_URL, {
      headers: { "X-Auth-Token": API_TOKEN },
    });

    const matchesRaw = response.data.matches || [];

    // Transform match data to include only the necessary fields and logos
    const matches = matchesRaw.map((match) => ({
      id: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeLogo: teamLogos[match.homeTeam.name] || null,
      awayLogo: teamLogos[match.awayTeam.name] || null,
      date: match.utcDate.split("T")[0], // Get date in YYYY-MM-DD
      time: match.utcDate.split("T")[1].slice(0, 5), // Get time in HH:MM
    }));

    res.json(matches);
  } catch (error) {
    console.error("❌ Error fetching match data:", error);
    res.status(500).json({ error: error.message || "Failed to fetch match data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
