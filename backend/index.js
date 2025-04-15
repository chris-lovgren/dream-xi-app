// Import necessary modules
// express: Web framework for Node.js that helps us create a server
// fs/promises: File system operations that let us read/write files
// url and path: Help us work with file paths correctly
import express from 'express';
import { writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's directory path
// This is needed because we're using ES modules (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express application
// This is our server that will handle requests
const app = express();

// Define where we'll store our team data
// We use join() to create a path that works on any operating system
const TEAM_FILE = join(__dirname, '..', 'team.json');

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

// Simple ping route to check if the server is running
// Returns the current time to help with debugging
app.get('/ping', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /teams route - Returns all saved teams
app.get('/teams', async (req, res, next) => {
    try {
        // Read the team data file
        const data = await readFile(TEAM_FILE, 'utf8');
        
        // Parse the JSON data, default to empty array if file is empty
        const teams = JSON.parse(data || '[]');
        
        // Ensure we always return an array
        if (!Array.isArray(teams)) {
            res.json([]);
            return;
        }
        
        // Send the teams back to the client
        res.json(teams);
    } catch (error) {
        // If file doesn't exist yet, return empty array
        if (error.code === 'ENOENT') {
            res.json([]);
        } else {
            // For other errors, pass to error handler
            next(error);
        }
    }
});

// POST /team route - Saves a new team
app.post('/team', validateTeam, async (req, res, next) => {
    try {
        // Read existing teams from file
        let teams = [];
        try {
            const data = await readFile(TEAM_FILE, 'utf8');
            
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
        
        // Save the updated teams back to the file
        await writeFile(TEAM_FILE, JSON.stringify(teams, null, 2));
        
        // Send success response
        res.status(201).json({ message: 'Team saved successfully' });
    } catch (error) {
        // Pass any errors to the error handler
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
});
