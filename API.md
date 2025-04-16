# Dream XI API Documentation

A simple guide to understanding and using the Dream XI API. This API allows you to create and manage football teams.

## 🚀 Quick Start

The API is available at:
```
https://dream-xi-app.onrender.com
```

## 📋 Endpoints

### 1. Health Check
Check if the server is running.

**Request:**
```
GET /ping
```

**Response:**
```json
{
    "status": "ok",
    "timestamp": "2024-04-15T12:00:00.000Z"
}
```

### 2. Get All Teams
Get a list of all saved teams.

**Request:**
```
GET /teams
```

**Response:**
```json
[
    {
        "submitterName": "John Doe",
        "goalkeeper": "David De Gea",
        "defenders": ["Virgil van Dijk", "Trent Alexander-Arnold", "Andrew Robertson"],
        "midfielders": ["Kevin De Bruyne", "Bruno Fernandes", "Paul Pogba"],
        "forwards": ["Cristiano Ronaldo", "Lionel Messi"]
    }
]
```

### 3. Save a Team
Create a new team.

**Request:**
```
POST /team
```

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

**Response:**
```json
{
    "message": "Team saved successfully"
}
```

## 🔍 Validation Rules

When creating a team, make sure to follow these rules:

1. **Submitter Name**
   - Required
   - Must not be empty

2. **Goalkeeper**
   - Required
   - Must not be empty

3. **Defenders**
   - Required
   - Must have 3-5 players
   - Each player must not be empty

4. **Midfielders**
   - Required
   - Must have 3-5 players
   - Each player must not be empty

5. **Forwards**
   - Required
   - Must have 1-3 players
   - Each player must not be empty

## ⚠️ Error Handling

If something goes wrong, you'll get an error response:

```json
{
    "message": "Error message here",
    "error": "Detailed error message (in development only)"
}
```

Common error codes:
- `200 OK`: Everything worked
- `201 Created`: Team was saved successfully
- `400 Bad Request`: Your request was invalid
- `500 Internal Server Error`: Something went wrong on our end

## 🔒 Security

The API includes these security features:
- CORS enabled for all origins
- Security headers to prevent common attacks
- Input validation to prevent bad data

## 💻 Example Code

### JavaScript
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

### cURL
```bash
# Get all teams
curl https://dream-xi-app.onrender.com/teams

# Save a team
curl -X POST https://dream-xi-app.onrender.com/team \
  -H "Content-Type: application/json" \
  -d '{
    "submitterName": "John Doe",
    "goalkeeper": "David De Gea",
    "defenders": ["Virgil van Dijk", "Trent Alexander-Arnold", "Andrew Robertson"],
    "midfielders": ["Kevin De Bruyne", "Bruno Fernandes", "Paul Pogba"],
    "forwards": ["Cristiano Ronaldo", "Lionel Messi"]
  }'
```

## ❓ Need Help?

If you have questions or find issues:
1. Check this documentation
2. Look at the example code
3. Create an issue in our GitHub repository 