const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ⚠️ Football-Data API token hardcoded here
const API_TOKEN = "81d804275815428c8ffe628b8345fe7a";

// CORS for frontend
app.use(cors({
  origin: [
    'https://sports-orca.vercel.app',
    /https:\/\/sports-orca-.*\.vercel\.app/
  ],
  methods: ['GET'],
  optionsSuccessStatus: 200
}));

const MATCHES_URL = "https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED";
const TEAMS_URL = "https://api.football-data.org/v4/competitions/PL/teams";

let teamLogos = {};

// Fetch team logos once
async function fetchTeamLogos() {
  try {
    const response = await axios.get(TEAMS_URL, {
      headers: { "X-Auth-Token": API_TOKEN },
    });

    response.data.teams.forEach((team) => {
      teamLogos[team.name] = team.crest;
    });

    console.log(`✅ Cached ${Object.keys(teamLogos).length} team logos`);
  } catch (err) {
    console.error("❌ Failed to fetch team logos:", err.message);
  }
}

fetchTeamLogos();

function formatUKDateTime(utcDateString) {
  const date = new Date(utcDateString);
  return {
    date: date.toLocaleDateString('en-GB', { 
      timeZone: 'Europe/London',
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }),
    time: date.toLocaleTimeString('en-GB', { 
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  };
}

app.get("/api/matches", async (req, res) => {
  console.log(`📡 API hit from ${req.headers.origin || req.ip}`);
  
  try {
    const response = await axios.get(MATCHES_URL, {
      headers: { "X-Auth-Token": API_TOKEN },
    });

    const matchesRaw = response.data.matches || [];
    console.log(`✅ Retrieved ${matchesRaw.length} matches`);

    const matches = matchesRaw.map((match) => {
      const { date, time } = formatUKDateTime(match.utcDate);

      return {
        id: match.id,
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        homeLogo: teamLogos[match.homeTeam.name] || 'https://via.placeholder.com/48?text=🏠',
        awayLogo: teamLogos[match.awayTeam.name] || 'https://via.placeholder.com/48?text=✈️',
        date,
        time
      };
    });

    res.json(matches);
  } catch (error) {
    console.error("❌ Match API error:", {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });

    res.status(500).json({ 
      error: "Failed to fetch match data",
      details: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    status: "active",
    service: "SportsOrca API",
    version: "1.2",
    environment: "direct-token",
    matchesEndpoint: "/api/matches",
    teamsCached: Object.keys(teamLogos).length
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`⚽ Using Football API token: ${API_TOKEN.slice(0, 4)}...${API_TOKEN.slice(-4)}`);
});
