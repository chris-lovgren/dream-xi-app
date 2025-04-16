/**
 * Main application file for Dream XI
 * This file initializes the application and sets up the core components
 */

// Import the required classes
import { TeamService } from './js/services/TeamService.js';
import { TeamDisplay } from './js/classes/TeamDisplay.js';
import { FormManager } from './js/classes/FormManager.js';

// Wait for the DOM to be fully loaded before initializing the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the TeamService for API communication
    const teamService = new TeamService();
    
    // Initialize the TeamDisplay for rendering teams in the UI
    const teamDisplay = new TeamDisplay(document.getElementById('teamsList'));
    
    // Initialize the FormManager to handle form interactions
    const formManager = new FormManager(
        document.getElementById('teamForm'),
        teamService,
        teamDisplay
    );

    // Load and display any existing teams when the page loads
    teamService.getAllTeams()
        .then(teams => teamDisplay.displayTeams(teams))
        .catch(error => teamDisplay.showMessage(error.message, 'error'));
});
  