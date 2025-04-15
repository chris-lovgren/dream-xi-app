# Dream XI - Football Team Selection App

A simple web application where users can create and share their dream football teams.

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
├── team.json         # Database file storing all teams
└── package.json      # Project configuration and dependencies
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

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to:
   ```
   http://localhost:3000
   ```

## Deployment

This app can be easily deployed to services like Render.com or Railway.app. See the deployment section in each file for specific instructions.

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [JavaScript Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [HTML & CSS Basics](https://developer.mozilla.org/en-US/docs/Learn) 