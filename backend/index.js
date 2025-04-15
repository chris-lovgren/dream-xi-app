// Import necessary modules
// express: Web framework for Node.js
// fs/promises: File system operations with promises
// url and path: For handling file paths
import express from 'express';
import { writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's directory path
// This is needed because we're using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express application
const app = express();

// Define the path to our team data file
// We store it in the project root directory
const TEAM_FILE = join(__dirname, '..', 'team.json');

// Middleware to parse JSON data from requests
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the public folder
app.use(express.static(join(__dirname, '../public')));

// Simple ping route to check if the server is running
app.get('/ping', (req, res) => {
  res.send('pong');
});

// GET /teams route - Returns all saved teams
app.get('/teams', async (req, res) => {
  try {
    console.log('Reading teams from:', TEAM_FILE);
    // Read the team data file
    const data = await readFile(TEAM_FILE, 'utf8');
    console.log('Raw data from file:', data);
    
    // Parse the JSON data, default to empty array if file is empty
    const teams = JSON.parse(data || '[]');
    console.log('Parsed teams:', teams);
    
    // Ensure we always return an array
    if (!Array.isArray(teams)) {
      console.warn('Teams data is not an array, converting to empty array');
      res.json([]);
      return;
    }
    
    // Send the teams back to the client
    res.json(teams);
  } catch (error) {
    console.error('Error in GET /teams:', error);
    if (error.code === 'ENOENT') {
      // If file doesn't exist yet, return empty array
      res.json([]);
    } else {
      // For other errors, send error message
      res.status(500).json({ message: 'Failed to load teams', error: error.message });
    }
  }
});

// POST /team route - Saves a new team
app.post('/team', async (req, res) => {
  // Get the new team data from the request body
  const newTeam = req.body;
  console.log('Received new team:', newTeam);

  // Validate the team data
  if (!newTeam.submitterName?.trim() || !newTeam.goalkeeper?.trim() || 
      !newTeam.defenders?.length || !newTeam.midfielders?.length || !newTeam.forwards?.length) {
    console.log('Validation failed:', newTeam);
    return res.status(400).json({ 
      message: 'Missing required team information',
      details: {
        hasSubmitterName: !!newTeam.submitterName?.trim(),
        hasGoalkeeper: !!newTeam.goalkeeper?.trim(),
        defendersCount: newTeam.defenders?.length,
        midfieldersCount: newTeam.midfielders?.length,
        forwardsCount: newTeam.forwards?.length
      }
    });
  }

  try {
    // Read existing teams from file
    let teams = [];
    try {
      console.log('Reading existing teams from:', TEAM_FILE);
      const data = await readFile(TEAM_FILE, 'utf8');
      console.log('Raw data from file:', data);
      
      // Handle empty file
      if (!data.trim()) {
        console.log('File is empty, using empty array');
        teams = [];
      } else {
        const parsedData = JSON.parse(data);
        console.log('Parsed data:', parsedData);
        console.log('Type of parsed data:', typeof parsedData);
        
        // Ensure we have an array of teams
        if (Array.isArray(parsedData)) {
          teams = parsedData;
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          // If we have a single team object, convert to array
          teams = [parsedData];
        } else {
          console.warn('Invalid data format, using empty array');
          teams = [];
        }
      }
      
      console.log('Current teams:', teams);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error reading existing teams:', error);
        throw error;
      }
      console.log('No existing teams file found, starting fresh');
    }

    // Add the new team to our array
    console.log('Adding new team to array');
    teams.push(newTeam);
    console.log('Teams after adding new team:', teams);

    // Save the updated teams back to the file
    console.log('Saving teams to:', TEAM_FILE);
    await writeFile(TEAM_FILE, JSON.stringify(teams, null, 2));
    
    // Send success response
    res.status(201).json({ message: 'Team saved successfully' });
  } catch (error) {
    console.error('Error in POST /team:', error);
    res.status(500).json({ 
      message: 'Failed to save team',
      error: error.message,
      code: error.code
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Team file location:', TEAM_FILE);
});
