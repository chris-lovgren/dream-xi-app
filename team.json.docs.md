# team.json Documentation

## Purpose
`team.json` serves as a simple JSON database for storing football teams submitted by users in the Dream XI application. It is automatically managed by the backend server (`backend/index.js`).

## File Structure
The file contains an array of team objects, where each team object has the following structure:

```json
{
  "submitterName": "Name of person who created the team",
  "goalkeeper": "Name of goalkeeper",
  "defenders": ["Defender 1", "Defender 2", "Defender 3", ...], // 3-5 players
  "midfielders": ["Midfielder 1", "Midfielder 2", "Midfielder 3", ...], // 3-5 players
  "forwards": ["Forward 1", "Forward 2", ...] // 1-3 players
}
```

## How It Works

1. **Initial State**
   - When the application starts, `team.json` is empty (`[]`)
   - The backend is designed to handle this empty state

2. **Adding Teams**
   - When a user submits a team through the form:
     1. The backend reads `team.json`
     2. Adds the new team to the array
     3. Saves the updated array back to `team.json`

3. **Viewing Teams**
   - When viewing teams:
     1. The backend reads `team.json`
     2. Returns the array of teams to the frontend
     3. The frontend displays them in the "Saved Teams" section

## Example Data
Here's an example of how the file looks when populated:

```json
[
  {
    "submitterName": "John",
    "goalkeeper": "Alisson",
    "defenders": ["Van Dijk", "Robertson", "Alexander-Arnold"],
    "midfielders": ["Fabinho", "Henderson", "Thiago"],
    "forwards": ["Salah", "Mane", "Firmino"]
  }
]
```

## Important Notes
- This file is automatically managed by the application
- Do not manually edit this file while the server is running
- The file is located in the project root directory
- The backend handles all file operations (reading/writing)
- The frontend never directly accesses this file 