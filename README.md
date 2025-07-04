# ChattyAI Calendar Bot

A Google Calendar API integration with Vapi plugin support for intelligent scheduling and appointment booking.

## Features

- ✅ Google Calendar integration
- ✅ Check availability for next 7 days
- ✅ Book appointments automatically
- ✅ Vapi plugin for voice AI integration
- ✅ Cloud-ready (Render deployment)
- ✅ Secure environment variable configuration

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Google Calendar API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Download `credentials.json`

### 3. Local Development
```bash
# Set environment variables
export GOOGLE_CREDENTIALS='{"installed":{"client_id":"...","client_secret":"..."}}'
export GOOGLE_TOKEN='{"access_token":"...","refresh_token":"..."}'

# Start the server
npm start
```

### 4. Get Authentication Token (Local)
1. Start the server: `npm start`
2. Visit: `http://localhost:3000/auth`
3. Complete Google OAuth flow
4. Copy contents of generated `token.json`

## Render Deployment

### 1. Environment Variables
Set these in your Render dashboard:

- `GOOGLE_CREDENTIALS`: Full contents of credentials.json (one line)
- `GOOGLE_TOKEN`: Full contents of token.json (one line)
- `PORT`: 10000 (Render default)

### 2. Deploy
1. Connect your GitHub repository to Render
2. Set environment variables
3. Deploy!

## Vapi Integration

### Plugin Setup
The `vapi-plugin.js` file provides Vapi integration:

```javascript
const { GoogleCalendarPlugin } = require('./vapi-plugin');

const calendar = new GoogleCalendarPlugin();

// Get available slots
const slots = await calendar.getAvailableSlots();

// Schedule a meeting
const result = await calendar.scheduleMeeting(
  '2024-01-15T10:00:00Z',
  '2024-01-15T10:30:00Z',
  'Team Meeting'
);
```

### Vapi Configuration
Add to your Vapi assistant:

```javascript
{
  "name": "google-calendar",
  "description": "Google Calendar integration for scheduling",
  "functions": [
    {
      "name": "getAvailableSlots",
      "description": "Get available time slots"
    },
    {
      "name": "scheduleMeeting", 
      "description": "Schedule a meeting"
    }
  ]
}
```

## API Endpoints

### GET /get-availability
Returns available 30-minute slots for the next 7 days.

**Response:**
```json
{
  "slots": [
    {
      "start": "2024-01-15T10:00:00.000Z",
      "end": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### POST /book-appointment
Books a new appointment.

**Request:**
```json
{
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T10:30:00Z", 
  "summary": "Team Meeting"
}
```

**Response:**
```json
{
  "success": true
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_CREDENTIALS` | Google OAuth credentials JSON | Yes |
| `GOOGLE_TOKEN` | Google OAuth token JSON | Yes |
| `PORT` | Server port (default: 3000) | No |
| `CALENDAR_API_URL` | Base URL for Vapi plugin | No |

## Security Notes

- ✅ Never commit `credentials.json` or `token.json` to Git
- ✅ Use environment variables in production
- ✅ `.gitignore` excludes sensitive files
- ✅ HTTPS required for production

## Troubleshooting

### Common Issues

1. **"Not authenticated" error**
   - Ensure `GOOGLE_TOKEN` is set correctly
   - Re-authenticate locally and update token

2. **"Repository not found" on GitHub**
   - Check repository URL in remote origin
   - Ensure repository exists on GitHub

3. **Render deployment fails**
   - Verify environment variables are set
   - Check logs for specific error messages

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Google Calendar API documentation
3. Check Render deployment logs

## License

MIT License - feel free to use and modify! 