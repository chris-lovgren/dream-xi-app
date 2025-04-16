// Import necessary modules
// express: Web framework for Node.js that helps us create a server
// fs/promises: File system operations that let us read/write files
// url and path: Help us work with file paths correctly
import express from 'express';
import { writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { connectDB } from './config/database.js';
import Team from './models/Team.js';

// Get the current file's directory path
// This is needed because we're using ES modules (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express application
// This is our server that will handle requests
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
let isConnected = false;
const connectWithRetry = async () => {
    try {
        await connectDB();
        isConnected = true;
    } catch (error) {
        console.error('Failed to connect to MongoDB, retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    }
};

// Start MongoDB connection
connectWithRetry();

// Middleware to parse JSON data from requests
// This lets us read JSON data sent in requests
app.use(express.json());

// CORS (Cross-Origin Resource Sharing) middleware
// This allows our frontend to talk to our backend even if they're on different domains
app.use((req, res, next) => {
    // Allow requests from any origin
    res.header('Access-Control-Allow-Origin', '*');
    // Allow these headers in requests
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Move to the next middleware
    next();
});

// Security headers middleware
// These headers help protect our application from common web vulnerabilities
app.use((req, res, next) => {
    // Prevent browsers from guessing content type
    res.header('X-Content-Type-Options', 'nosniff');
    // Prevent our site from being embedded in iframes
    res.header('X-Frame-Options', 'DENY');
    // Enable XSS protection in browsers
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files (HTML, CSS, JS) from the public folder
// This makes our frontend files accessible
app.use(express.static(join(__dirname, '../public')));

// Error handling middleware
// This catches any errors that happen in our routes
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error('Error:', err);
    // Send a response with the error message
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        // Only include stack trace in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Validation middleware
// This checks if the team data is valid before saving it
const validateTeam = (req, res, next) => {
    const team = req.body;
    
    // Check required fields
    if (!team.submitterName?.trim() || !team.goalkeeper?.trim()) {
        return res.status(400).json({
            message: 'Missing required fields',
            details: {
                hasSubmitterName: !!team.submitterName?.trim(),
                hasGoalkeeper: !!team.goalkeeper?.trim()
            }
        });
    }

    // Check number of defenders
    if (!Array.isArray(team.defenders) || team.defenders.length < 3 || team.defenders.length > 5) {
        return res.status(400).json({
            message: 'Invalid number of defenders',
            details: { count: team.defenders?.length }
        });
    }

    // Check number of midfielders
    if (!Array.isArray(team.midfielders) || team.midfielders.length < 3 || team.midfielders.length > 5) {
        return res.status(400).json({
            message: 'Invalid number of midfielders',
            details: { count: team.midfielders?.length }
        });
    }

    // Check number of forwards
    if (!Array.isArray(team.forwards) || team.forwards.length < 1 || team.forwards.length > 3) {
        return res.status(400).json({
            message: 'Invalid number of forwards',
            details: { count: team.forwards?.length }
        });
    }

    // If all checks pass, move to the next middleware
    next();
};

// Health check endpoint
app.get('/ping', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        mongodb: isConnected ? 'connected' : 'connecting'
    });
});

// GET /teams route - Returns all saved teams
app.get('/teams', async (req, res, next) => {
    try {
        console.log('Reading teams from:', TEAM_FILE);
        // Read the team data file
        const data = await readFile(TEAM_FILE, 'utf8');
        
        // Parse the JSON data, default to empty array if file is empty
        const teams = JSON.parse(data || '[]');
        console.log(`Found ${teams.length} teams`);
        
        // Ensure we always return an array
        if (!Array.isArray(teams)) {
            console.warn('Teams data is not an array, returning empty array');
            res.json([]);
            return;
        }
        
        // Send the teams back to the client
        res.json(teams);
    } catch (error) {
        // If file doesn't exist yet, return empty array
        if (error.code === 'ENOENT') {
            console.log('Team file does not exist yet, returning empty array');
            res.json([]);
        } else {
            // For other errors, pass to error handler
            console.error('Error reading teams:', error);
            next(error);
        }
    }
});

// POST /team route - Saves a new team
app.post('/team', validateTeam, async (req, res, next) => {
    try {
        console.log('Saving new team from:', req.body.submitterName);
        // Read existing teams from file
        let teams = [];
        try {
            const data = await readFile(TEAM_FILE, 'utf8');
            console.log('Existing teams data:', data);
            
            // Handle empty file
            if (!data.trim()) {
                teams = [];
            } else {
                const parsedData = JSON.parse(data);
                
                // Ensure we have an array of teams
                if (Array.isArray(parsedData)) {
                    teams = parsedData;
                } else if (typeof parsedData === 'object' && parsedData !== null) {
                    // If we have a single team object, convert to array
                    teams = [parsedData];
                } else {
                    teams = [];
                }
            }
        } catch (error) {
            // If file doesn't exist, that's okay - we'll start fresh
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        // Add the new team to our array
        teams.push(req.body);
        console.log(`Total teams after adding: ${teams.length}`);
        
        // Save the updated teams back to the file
        await writeFile(TEAM_FILE, JSON.stringify(teams, null, 2));
        console.log('Team saved successfully');
        
        // Send success response
        res.status(201).json({ message: 'Team saved successfully' });
    } catch (error) {
        console.error('Error saving team:', error);
        // Pass any errors to the error handler
        next(error);
    }
});

// Routes

// Get all teams
app.get('/api/teams', async (req, res, next) => {
    try {
        if (!isConnected) {
            throw new Error('Database not connected');
        }
        const teams = await Team.find().sort({ createdAt: -1 });
        res.json(teams);
    } catch (error) {
        next(error);
    }
});

// Get teams by formation
app.get('/api/teams/formation/:formation', async (req, res, next) => {
    try {
        const teams = await Team.findByFormation(req.params.formation);
        res.json(teams);
    } catch (error) {
        next(error);
    }
});

// Get teams with specific player
app.get('/api/teams/player/:playerName', async (req, res, next) => {
    try {
        const teams = await Team.findByPlayer(req.params.playerName);
        res.json(teams);
    } catch (error) {
        next(error);
    }
});

// Create a new team
app.post('/api/teams', async (req, res, next) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Validation Error',
                details: error.errors
            });
        } else {
            next(error);
        }
    }
});

// Get a specific team
app.get('/api/teams/:id', async (req, res, next) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        next(error);
    }
});

// Update a team
app.put('/api/teams/:id', async (req, res, next) => {
    try {
        const team = await Team.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({
                message: 'Validation Error',
                details: error.errors
            });
        } else {
            next(error);
        }
    }
});

// Delete a team
app.delete('/api/teams/:id', async (req, res, next) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json({ message: 'Team deleted successfully' });
    } catch (error) {
        next(error);
    }
});

// Apply error handling middleware
// This catches any unhandled errors
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Team file location:', TEAM_FILE);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`MongoDB Status: ${isConnected ? 'Connected' : 'Connecting...'}`);
});
