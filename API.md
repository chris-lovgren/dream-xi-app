# Dream XI API Documentation

This document provides detailed information about the Dream XI API endpoints, their usage, and examples.

## Base URL

The base URL for all API endpoints is:
```
https://your-render-app-url.onrender.com
```

## Endpoints

### 1. Health Check
Check if the server is running.

**Endpoint:** `GET /ping`

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2024-04-15T12:00:00.000Z"
}
```

### 2. Get All Teams
Retrieve all saved teams.

**Endpoint:** `GET /teams`

**Response:**
```json
[
    {
        "submitterName": "John Doe",
        "goalkeeper": "David De Gea",
        "defenders": ["Virgil van Dijk", "Trent Alexander-Arnold", "Andrew Robertson"],
        "midfielders": ["Kevin De Bruyne", "Bruno Fernandes", "Paul Pogba"],
        "forwards": ["Cristiano Ronaldo", "Lionel Messi"]
    },
    // ... more teams
]
```

**Error Responses:**
- `500 Internal Server Error`: If there's an error reading the teams file
```json
{
    "message": "Failed to load teams",
    "error": "Error message here"
}
```

### 3. Save a Team
Save a new team to the database.

**Endpoint:** `POST /team`

**Request Body:**
```json
{
    "submitterName": "John Doe",
    "goalkeeper": "David De Gea",
    "defenders": ["Virgil van Dijk", "Trent Alexander-Arnold", "Andrew Robertson"],
    "midfielders": ["Kevin De Bruyne", "Bruno Fernandes", "Paul Pogba"],
    "forwards": ["Cristiano Ronaldo", "Lionel Messi"]
}
```

**Validation Rules:**
- `submitterName`: Required, non-empty string
- `goalkeeper`: Required, non-empty string
- `defenders`: Required array, 3-5 players
- `midfielders`: Required array, 3-5 players
- `forwards`: Required array, 1-3 players

**Success Response:**
```json
{
    "message": "Team saved successfully"
}
```

**Error Responses:**
- `400 Bad Request`: If validation fails
```json
{
    "message": "Missing required fields",
    "details": {
        "hasSubmitterName": false,
        "hasGoalkeeper": true,
        "defendersCount": 2,
        "midfieldersCount": 3,
        "forwardsCount": 2
    }
}
```

- `500 Internal Server Error`: If there's an error saving the team
```json
{
    "message": "Failed to save team",
    "error": "Error message here"
}
```

## Error Handling

All endpoints follow a consistent error response format:

```json
{
    "message": "Error message here",
    "error": "Detailed error message (in development only)"
}
```

Common HTTP status codes:
- `200 OK`: Successful GET request
- `201 Created`: Successful POST request
- `400 Bad Request`: Invalid input data
- `500 Internal Server Error`: Server-side error

## Rate Limiting

Currently, there are no rate limits implemented. However, please use the API responsibly.

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:
- Allowed Origins: `*` (all origins)
- Allowed Headers: `Origin`, `X-Requested-With`, `Content-Type`, `Accept`
- Allowed Methods: `GET`, `POST`

## Security Headers

The API includes the following security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## Example Usage

### JavaScript Fetch Example

```javascript
// Get all teams
async function getTeams() {
    const response = await fetch('/teams');
    if (!response.ok) {
        throw new Error('Failed to fetch teams');
    }
    return await response.json();
}

// Save a team
async function saveTeam(team) {
    const response = await fetch('/team', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(team)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
    }
    
    return await response.json();
}
```

### cURL Examples

```bash
# Get all teams
curl https://your-render-app-url.onrender.com/teams

# Save a team
curl -X POST https://your-render-app-url.onrender.com/team \
  -H "Content-Type: application/json" \
  -d '{
    "submitterName": "John Doe",
    "goalkeeper": "David De Gea",
    "defenders": ["Virgil van Dijk", "Trent Alexander-Arnold", "Andrew Robertson"],
    "midfielders": ["Kevin De Bruyne", "Bruno Fernandes", "Paul Pogba"],
    "forwards": ["Cristiano Ronaldo", "Lionel Messi"]
  }'
```

## Support

For any issues or questions, please contact the development team or create an issue in the GitHub repository. 