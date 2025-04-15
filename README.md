# Dream XI - Football Team Selection App

A simple web application where users can create and share their dream football teams.

## Live Demo

The application is deployed on Render and can be accessed here:
[https://dream-xi-app.onrender.com](https://dream-xi-app.onrender.com)

*(Note: Free Render services may spin down after inactivity and take a few seconds to load initially.)*

## Project Architecture

This application follows a simple client-server architecture:

```
dream-xi/
├── public/           # Frontend files (HTML, CSS, JavaScript)
│   ├── index.html    # Main page with the team selection form
│   ├── styles.css    # Styling for the application
│   └── app.js        # Frontend logic and API calls
├── backend/          # Server-side code
│   └── index.js      # Express server and API endpoints
├── team.json         # Database file storing all teams (ephemeral on free tier)
├── team.json.docs.md # Documentation for team.json
├── package.json      # Project configuration and dependencies
├── Procfile          # Specifies how to run the app on Render
└── README.md         # This file
```

### How It Works

1. **Frontend (public/)**
   - The user interface is built with plain HTML, CSS, and JavaScript
   - No frameworks are used to keep it simple and beginner-friendly
   - The form collects team data and sends it to the backend
   - Teams are displayed in a list below the form

2. **Backend (backend/)**
   - Built with Express.js, a simple Node.js web framework
   - Handles two main routes:
     - GET /teams: Returns all saved teams
     - POST /team: Saves a new team
   - Data is stored in a simple JSON file (team.json)

3. **Data Storage**
   - Teams are stored in team.json
   - Each team has:
     - submitterName: Who created the team
     - goalkeeper: The goalkeeper
     - defenders: Array of defenders (3-5 players)
     - midfielders: Array of midfielders (3-5 players)
     - forwards: Array of forwards (1-3 players)

## Setup Instructions (Local Development)

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd dream-xi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or for production mode start
   # npm start
   ```

4. Open your browser to:
   ```
   http://localhost:3000
   ```

## Deployment

This app is configured for deployment on Render.

* **Platform:** Render.com
* **Service Type:** Web Service
* **Build Command:** `npm install`
* **Start Command:** `npm start` (or uses `Procfile`: `web: node backend/index.js`)
* **Live URL:** [https://dream-xi-app.onrender.com](https://dream-xi-app.onrender.com)

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML & CSS Basics](https://developer.mozilla.org/en-US/docs/Learn)
- [Render Documentation](https://render.com/docs) 