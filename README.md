# Upcoming Matches List — SportsOrca Internship Task

Thank you for considering my submission for the **Full Stack Development Internship at SportsOrca**.

## Task Overview

Create a simple web application displaying a list of upcoming matches for a selected sport (Soccer) fetched from a freely available API.

---

## Project Details

### Sport Selected
- **Soccer** (English Premier League)

### Features
- Fetches upcoming match data from the Football-Data.org API.
- Displays each match with:
  - Home and away team names
  - Team logos
  - Scheduled date and time
- Built with:
  - Backend: Node.js + Express (proxy server fetching data from Football-Data API)
  - Frontend: React with Tailwind CSS for styling

---

## API Used

- **Football-Data.org API**  
  Endpoint for upcoming matches:  
  `https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED`  
  (English Premier League scheduled matches)  
- Teams and logos fetched from:  
  `https://api.football-data.org/v4/competitions/PL/teams`  

*Note: Requires an API token from Football-Data.org.*

---

## How to Run Locally

### Backend

1. Clone the repo  
2. Install dependencies:  
   ```bash
   npm install
Add your Football-Data API token to the backend code (replace API_TOKEN value)

Run the server:
node server.js
Backend runs on http://localhost:5000

Frontend
Navigate to frontend directory (if separate)

Install dependencies:
npm install
Run React app:


npm start
Frontend runs on http://localhost:3000 and fetches data from the backend.

Project Structure
server.js — Node.js Express backend to fetch and cache matches & team logos

MatchList.jsx — React component to display upcoming matches

.gitignore — ignores node_modules, logs, etc.

Submission
Please find the project repository here:
https://github.com/prakhaaar/sports_orca_task

Contact
For any questions, feel free to reach me at:
Email: mprakhar07@gmail.com

Thank you for reviewing my submission! Looking forward to your feedback.

Best regards,
