
const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
const CREDENTIALS = JSON.parse(fs.readFileSync('credentials.json'));
const { client_secret, client_id, redirect_uris } = CREDENTIALS.installed || CREDENTIALS.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

app.get('/auth', (req, res) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  res.send(`<a href="${authUrl}">Authenticate with Google</a>`);
});

app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  res.send('Authentication successful! You can close this tab.');
});

function ensureAuth(req, res, next) {
  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    next();
  } else {
    res.send('Not authenticated. Go to /auth first.');
  }
}

// Check calendar for open slots
app.get('/get-availability', ensureAuth, async (req, res) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
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
});

// Book a new appointment
app.post('/book-appointment', ensureAuth, async (req, res) => {
  const { start, end, summary } = req.body;
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const event = {
    summary: summary || 'Booked via ChattyAI',
    start: { dateTime: start, timeZone: 'America/Los_Angeles' },
    end: { dateTime: end, timeZone: 'America/Los_Angeles' },
  };
  await calendar.events.insert({
    calendarId: 'primary',
    resource: event,
  });
  res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
