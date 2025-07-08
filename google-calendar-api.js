const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

// Load credentials from environment variable (Render) or local file (development)
let CREDENTIALS;
try {
  if (process.env.GOOGLE_CREDENTIALS) {
    // Production: Use environment variable
    CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log('✅ Loaded credentials from environment variable');
  } else {
    // Development: Use local file
    if (fs.existsSync('credentials.json')) {
      CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json'));
      console.log('✅ Loaded credentials from local file');
    } else {
      console.error('❌ No credentials found!');
      console.error('For production (Render): Set GOOGLE_CREDENTIALS environment variable');
      console.error('For development: Create credentials.json file');
      console.error('See DEPLOYMENT_GUIDE.md for setup instructions');
      process.exit(1);
    }
  }
} catch (error) {
  console.error('❌ Error loading credentials:', error.message);
  console.error('Make sure your credentials are valid JSON format');
  process.exit(1);
}

const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed || CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Function to load and set credentials with refresh handling
function loadAndSetCredentials() {
  try {
    let tokens;
    if (process.env.GOOGLE_TOKEN) {
      // Production: Use environment variable
      tokens = JSON.parse(process.env.GOOGLE_TOKEN);
      console.log('✅ Loaded token from environment variable');
    } else if (fs.existsSync(TOKEN_PATH)) {
      // Development: Use local file
      tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
      console.log('✅ Loaded token from local file');
    } else {
      console.log('⚠️ No token found - authentication required');
      console.log('For production: Set GOOGLE_TOKEN environment variable');
      console.log('For development: Visit /auth to authenticate');
      return false;
    }
    
    oAuth2Client.setCredentials(tokens);
    
    // Check if token is expired and we have a refresh token
    if (tokens.expiry_date && Date.now() >= tokens.expiry_date && tokens.refresh_token) {
      console.log('🔄 Token expired, attempting to refresh...');
      return refreshAccessToken();
    }
    
    console.log('✅ Authentication successful');
    return true;
  } catch (error) {
    console.error('❌ Error loading token:', error);
    return false;
  }
}

// Function to refresh access token
async function refreshAccessToken() {
  try {
    const { credentials } = await oAuth2Client.refreshAccessToken();
    oAuth2Client.setCredentials(credentials);
    
    // Save the new tokens
    if (process.env.GOOGLE_TOKEN) {
      // In production, you'd need to update the environment variable
      console.log('Token refreshed successfully (production mode)');
    } else {
      // Development: Save to file
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
      console.log('Token refreshed and saved successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
}

// OAuth authentication endpoints (for local development)
app.get('/auth', (req, res) => {
  // Create a new OAuth2 client with the correct redirect URI based on environment
  const redirectUri = process.env.NODE_ENV === 'production' 
    ? 'https://chattyai-calendar-bot-1.onrender.com/auth/google/callback'
    : 'http://localhost:4000/auth/google/callback';
  const authClient = new google.auth.OAuth2(
    oAuth2Client._clientId,
    oAuth2Client._clientSecret,
    redirectUri
  );
  
  // Always request offline access and force consent to ensure refresh token is provided
  const authUrl = authClient.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  res.send(`<a href="${authUrl}">Authenticate with Google</a>`);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    // Save tokens
    if (process.env.GOOGLE_TOKEN) {
      // In production, you'd need to update the environment variable
      console.log('Authentication successful (production mode)');
    } else {
      // Development: Save to file
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log('Authentication successful, tokens saved');
    }
    
    res.send('Authentication successful! You can close this tab.');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Add a callback endpoint for port 4000
app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    // Create a new OAuth2 client with the correct redirect URI for the callback
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? 'https://chattyai-calendar-bot-1.onrender.com/auth/google/callback'
      : 'http://localhost:4000/auth/google/callback';
    const callbackClient = new google.auth.OAuth2(client_id, client_secret, redirectUri);
    
    const { tokens } = await callbackClient.getToken(code);
    oAuth2Client.setCredentials(tokens);
    
    // Save tokens
    if (process.env.GOOGLE_TOKEN) {
      // In production, you'd need to update the environment variable
      console.log('Authentication successful (production mode)');
      console.log('IMPORTANT: Copy this token and add it as GOOGLE_TOKEN environment variable in Render:');
      console.log(JSON.stringify(tokens));
    } else {
      // Development: Save to file
      fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
      console.log('Authentication successful, tokens saved');
    }
    
    res.send('Authentication successful! You can close this tab. Check the server logs for the token if in production mode.');
  } catch (error) {
    console.error('Error getting tokens:', error);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Initialize credentials
loadAndSetCredentials();

// Middleware to ensure auth is always set
function ensureAuth(req, res, next) {
  if (!loadAndSetCredentials()) {
    return res.status(500).json({ error: 'Not authenticated. Go to /auth first or set GOOGLE_TOKEN env var on Render.' });
  }
  next();
}

// Helper to create an OAuth2 client for a specific tenant
function getOAuth2ClientForTenant(tenant) {
  // Handle both 'web' and 'installed' credential types
  const creds = tenant.g_credentials.web || tenant.g_credentials.installed;
  if (!creds) {
    throw new Error('Invalid credentials structure');
  }
  
  const { client_id, client_secret, redirect_uris } = creds;
  const tenantOAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  tenantOAuth2Client.setCredentials(tenant.g_token);
  return tenantOAuth2Client;
}

// GET /get-availability: Returns available 30-minute slots for the next 7 days
app.get('/get-availability', authMiddleware, async (req, res) => {
  try {
    const oAuth2Client = getOAuth2ClientForTenant(req.tenant);
    const calendar = require('googleapis').google.calendar({ version: 'v3', auth: oAuth2Client });
    const now = new Date();
    const weekLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const freebusy = await calendar.freebusy.query({
      requestBody: {
        timeMin: now.toISOString(),
        timeMax: weekLater.toISOString(),
        timeZone: 'America/Los_Angeles',
        items: [{ id: 'primary' }],
      },
    });

    const busy = freebusy.data.calendars.primary.busy;
    let slots = [];
    let slotStart = new Date(now);
    while (slots.length < 3 && slotStart < weekLater) {
      let slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000);
      const overlap = busy.some(b =>
        new Date(b.start) < slotEnd && new Date(b.end) > slotStart
      );
      if (!overlap && slotEnd <= weekLater) {
        slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() });
      }
      slotStart = new Date(slotStart.getTime() + 30 * 60 * 1000);
    }
    res.json({ slots });
  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(500).json({ error: 'Failed to get availability', details: error.message });
  }
});

// POST /book-appointment: Books a new appointment
app.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    const oAuth2Client = getOAuth2ClientForTenant(req.tenant);
    const calendar = require('googleapis').google.calendar({ version: 'v3', auth: oAuth2Client });
    const { start, end, summary } = req.body;
    // Input validation
    if (!start || !end) {
      return res.status(400).json({ error: 'Missing required fields: start, end' });
    }
    // Validate ISO date format
    if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
      return res.status(400).json({ error: 'Invalid date format. Use ISO 8601.' });
    }
    const event = {
      summary: summary || 'Booked via ChattyAI',
      start: { dateTime: start, timeZone: 'America/Los_Angeles' },
      end: { dateTime: end, timeZone: 'America/Los_Angeles' },
    };
    await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    console.log(`Appointment booked: ${start} - ${end} (${summary || 'Booked via ChattyAI'})`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: 'Failed to book appointment', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
