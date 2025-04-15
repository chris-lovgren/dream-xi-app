# Dream XI - Football Team Builder

A web application that allows users to create and save their dream football team formations. Built with Node.js, Express, and vanilla JavaScript.

## Live Demo

The application is deployed on Render and can be accessed here:
[https://dream-xi-app.onrender.com](https://dream-xi-app.onrender.com)

*(Note: Free Render services may spin down after inactivity and take a few seconds to load initially.)*

## Table of Contents
- [Dream XI - Football Team Builder](#dream-xi---football-team-builder)
  - [Live Demo](#live-demo)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Project Structure](#project-structure)
    - [File Descriptions](#file-descriptions)
  - [How It Works](#how-it-works)
    - [Frontend (User Interface)](#frontend-user-interface)
    - [Backend (Server)](#backend-server)
    - [Data Storage](#data-storage)
  - [Getting Started](#getting-started)
  - [Development](#development)
  - [API Documentation](#api-documentation)
  - [Contributing](#contributing)
  - [Support](#support)
  - [Deployment](#deployment)
    - [Deployment Details](#deployment-details)
    - [Deployment Process](#deployment-process)

## Project Overview

Dream XI is a simple web application that lets users:
1. Create their dream football team
2. Select players for different positions
3. Save and view their team
4. See other users' teams

The application follows a client-server architecture:
- **Frontend**: Handles the user interface and user interactions
- **Backend**: Manages data storage and API endpoints
- **Data Storage**: Uses a JSON file to store team data

## Project Structure

```
dream-xi/
├── public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS styles
│   └── app.js             # Frontend JavaScript
├── backend/               # Backend files
│   └── index.js          # Server code
├── team.json             # Data storage
├── package.json          # Project configuration
└── README.md            # This file
```

### File Descriptions

1. **Frontend Files** (`public/`):
   - `index.html`: The main webpage that users see
     - Contains the form for creating teams
     - Displays saved teams
     - Links to CSS and JavaScript files
   - `styles.css`: Controls how the application looks
     - Defines colors, layouts, and animations
     - Makes the app responsive (works on mobile)
   - `app.js`: Handles user interactions
     - Collects form data
     - Sends data to the server
     - Updates the display

2. **Backend Files** (`backend/`):
   - `index.js`: The server code
     - Creates the web server
     - Handles API requests
     - Manages data storage
     - Implements security features

3. **Data Files**:
   - `team.json`: Stores all saved teams
     - Created automatically when first team is saved
     - Updated when new teams are added

4. **Configuration Files**:
   - `package.json`: Project settings
     - Lists required software packages
     - Defines start commands
     - Contains project metadata

## How It Works

### Frontend (User Interface)

1. **HTML Structure** (`index.html`):
   - Contains a form with fields for:
     - User's name
     - Goalkeeper selection
     - Defender selections (3-5 players)
     - Midfielder selections (3-5 players)
     - Forward selections (1-3 players)
   - Has a section to display saved teams

2. **Styling** (`styles.css`):
   - Uses CSS variables for consistent colors
   - Implements responsive design
   - Adds animations and transitions
   - Styles form elements and team cards

3. **User Interaction** (`app.js`):
   - Listens for form submissions
   - Validates user input
   - Shows loading states
   - Displays success/error messages
   - Updates the team display

### Backend (Server)

1. **Server Setup** (`backend/index.js`):
   - Creates an Express server
   - Sets up middleware for:
     - JSON parsing
     - CORS (Cross-Origin Resource Sharing)
     - Security headers
   - Serves static files (HTML, CSS, JS)

2. **API Endpoints**:
   - `GET /ping`: Health check
   - `GET /teams`: Get all saved teams
   - `POST /team`: Save a new team

3. **Data Management**:
   - Reads from `team.json`
   - Writes to `team.json`
   - Handles file errors
   - Validates team data

### Data Storage

1. **Team Data Format**:
```json
{
    "submitterName": "User's Name",
    "goalkeeper": "Player Name",
    "defenders": ["Player 1", "Player 2", "Player 3"],
    "midfielders": ["Player 1", "Player 2", "Player 3"],
    "forwards": ["Player 1", "Player 2"]
}
```

2. **File Operations**:
   - Created when first team is saved
   - Updated with new teams
   - Read to display teams
   - Handles empty/invalid states

## Getting Started

1. **Prerequisites**:
   - Node.js (version 14 or higher)
   - npm (comes with Node.js)

2. **Installation**:
   ```bash
   # Clone the repository
   git clone https://github.com/yourusername/dream-xi.git
   cd dream-xi

   # Install dependencies
   npm install
   ```

3. **Running the Application**:
   ```bash
   # Start the server
   npm start
   ```
   The application will be available at `http://localhost:3000`

## Development

1. **Frontend Development**:
   - Edit `public/index.html` for structure
   - Modify `public/styles.css` for styling
   - Update `public/app.js` for functionality

2. **Backend Development**:
   - Modify `backend/index.js` for server changes
   - Update API endpoints as needed
   - Add new features or validation

3. **Testing**:
   - Test form validation
   - Check error handling
   - Verify team display
   - Test on different devices

## API Documentation

For detailed information about the API endpoints, see [API.md](API.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For questions or issues, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## Deployment

This application is deployed on Render.com, a cloud platform that makes it easy to deploy web applications.

### Deployment Details
- **Platform:** [Render.com](https://render.com)
- **Service Type:** Web Service
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node.js
- **Auto-Deploy:** Enabled (deploys automatically when changes are pushed to the main branch)

### Deployment Process
1. Changes are pushed to the GitHub repository
2. Render detects the changes
3. Automatic build process starts
4. Application is deployed to production
5. New version becomes available at [https://dream-xi-app.onrender.com](https://dream-xi-app.onrender.com) 