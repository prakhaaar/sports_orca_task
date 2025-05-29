const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

// ✅ Allow all relevant frontend domains
// Update CORS configuration in backend:
app.use(cors({
  origin: [
    'https://sports-orca-psi.vercel.app',
    // Add these wildcard patterns for Vercel preview deployments:
    /https:\/\/sports-orca-.*-prakhars-projects\.vercel\.app/,
    /https:\/\/sports-orca-.*\.vercel\.app/
  ],
  methods: ['GET']
}));

// ✅ Use the new API token from football-data.org
const API_TOKEN = "81d804275815428c8ffe628b8345fe7a";

// API endpoints
const MATCHES_URL =
  "https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED";
const TEAMS_URL = "https://api.football-data.org/v4/competitions/PL/teams";

// Cache for team logos
let teamLogos = {};

// ✅ Fetch team logos once on server start
async function fetchTeamLogos() {
  try {
    const response = await axios.get(TEAMS_URL, {
      headers: { "X-Auth-Token": API_TOKEN },
    });

    // Save team name → crest (logo) mapping
    response.data.teams.forEach((team) => {
      teamLogos[team.name] = team.crest;
    });

    console.log("✅ Team logos cached.");
  } catch (error) {
    console.error("❌ Failed to fetch team logos:", error.message);
  }
}

fetchTeamLogos(); // Call at server start

// ✅ Endpoint to get matches with logos and formatted date/time
app.get("/api/matches", async (req, res) => {
  try {
    const response = await axios.get(MATCHES_URL, {
      headers: { "X-Auth-Token": API_TOKEN },
    });

    // ✅ Log response to debug issues
    console.log("✅ Raw matches response received");
    console.log(response.data);

    const matchesRaw = response.data.matches || [];

    // Transform match data
    const matches = matchesRaw.map((match) => ({
      id: match.id,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeLogo: teamLogos[match.homeTeam.name] || null,
      awayLogo: teamLogos[match.awayTeam.name] || null,
      date: match.utcDate.split("T")[0], // YYYY-MM-DD
      time: match.utcDate.split("T")[1].slice(0, 5), // HH:MM
    }));

    res.json(matches);
  } catch (error) {
    console.error("❌ Error fetching match data:", error.message);
    res.status(500).json({ error: error.message || "Failed to fetch match data" });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
