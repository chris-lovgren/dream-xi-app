# Dream XI - Football Team Builder

A beginner-friendly web application that lets you create and share your dream football team formations. Built with modern JavaScript and following Object-Oriented Programming principles.

## 🚀 Live Demo

Try the application here: [https://dream-xi-app.onrender.com](https://dream-xi-app.onrender.com)

*(Note: The demo might take a few seconds to load initially as it's hosted on a free service.)*

## 📚 Table of Contents
- [Dream XI - Football Team Builder](#dream-xi---football-team-builder)
  - [🚀 Live Demo](#-live-demo)
  - [📚 Table of Contents](#-table-of-contents)
  - [What is Dream XI?](#what-is-dream-xi)
  - [Features](#features)
  - [Project Structure](#project-structure)
  - [How It Works](#how-it-works)
    - [Frontend Architecture](#frontend-architecture)
    - [Backend Architecture](#backend-architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Development Guide](#development-guide)
    - [Frontend Development](#frontend-development)
    - [Backend Development](#backend-development)
  - [API Documentation](#api-documentation)
  - [Contributing](#contributing)
  - [Support](#support)
  - [Deployment](#deployment)

## What is Dream XI?

Dream XI is a fun web application that lets you:
1. 🏆 Create your dream football team
2. ⚽ Select players for different positions
3. 💾 Save and share your team
4. 👀 View other users' teams

## Features

- ✨ Modern, responsive design
- 🔒 Secure data handling
- 📱 Mobile-friendly interface
- ⚡ Fast and reliable
- 🛠️ Easy to understand code structure

## Project Structure

```
dream-xi/
├── public/                    # Frontend files
│   ├── index.html            # Main webpage
│   ├── styles.css            # Styling
│   ├── app.js                # Main application logic
│   └── js/                   # JavaScript modules
│       └── classes/          # OOP Classes
│           ├── BaseComponent.js  # Base class for components
│           ├── Team.js          # Team data handling
│           ├── TeamDisplay.js   # UI for displaying teams
│           ├── TeamService.js   # API communication
│           └── FormManager.js   # Form handling
├── backend/                  # Backend files
│   └── index.js             # Server code
├── team.json                # Data storage
├── package.json             # Project configuration
└── README.md               # This file
```

## How It Works

### Frontend Architecture

The frontend is built using Object-Oriented Programming principles:

1. **BaseComponent** (`BaseComponent.js`)
   - Provides common functionality for all components
   - Handles error management and logging
   - Manages event handling

2. **Team** (`Team.js`)
   - Represents a football team
   - Handles data validation
   - Manages team structure

3. **TeamDisplay** (`TeamDisplay.js`)
   - Shows teams in the UI
   - Creates team cards
   - Handles loading states

4. **TeamService** (`TeamService.js`)
   - Communicates with the backend
   - Handles API requests
   - Manages data fetching and saving

5. **FormManager** (`FormManager.js`)
   - Manages the team creation form
   - Handles form validation
   - Processes form submissions

### Backend Architecture

The backend is built with Node.js and Express:

1. **Server Setup**
   - Creates a web server
   - Handles HTTP requests
   - Serves static files

2. **API Endpoints**
   - `GET /ping`: Server health check
   - `GET /teams`: Get all teams
   - `POST /team`: Save a new team

3. **Data Management**
   - Stores teams in a JSON file
   - Validates incoming data
   - Handles errors gracefully

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dream-xi.git
   cd dream-xi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

4. Open your browser and visit: `http://localhost:3000`

## Development Guide

### Frontend Development
1. **HTML Structure** (`index.html`)
   - Form for team creation
   - Display area for saved teams
   - Message area for notifications

2. **Styling** (`styles.css`)
   - Modern, responsive design
   - CSS variables for theming
   - Animations and transitions

3. **JavaScript** (`app.js` and classes)
   - Object-oriented structure
   - Event handling
   - Data validation
   - API communication

### Backend Development
1. **Server** (`backend/index.js`)
   - API endpoints
   - Data validation
   - Error handling
   - Security features

## API Documentation

For detailed API information, see [API.md](API.md).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

Need help? Here's what you can do:
1. Check the documentation
2. Search existing issues
3. Create a new issue

## Deployment

The application is deployed on Render.com:
- Automatic deployments from GitHub
- Free hosting tier
- Easy setup process

For deployment details, see the [Deployment Guide](DEPLOYMENT.md). 