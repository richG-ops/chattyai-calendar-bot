const jwt = require('jsonwebtoken');
const fs = require('fs');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'your-super-secret-jwt-key-change-this-in-production');
    console.log('JWT decoded successfully:', decoded.api_key);
    
    // Load actual credentials and token from files
    let credentials, googleToken;
    
    try {
      // Load credentials
      if (process.env.GOOGLE_CREDENTIALS) {
        credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
      } else if (fs.existsSync('credentials.json')) {
        credentials = JSON.parse(fs.readFileSync('credentials.json'));
      } else {
        throw new Error('No credentials found');
      }
      
      // Load token
      if (process.env.GOOGLE_TOKEN) {
        googleToken = JSON.parse(process.env.GOOGLE_TOKEN);
      } else if (fs.existsSync('token.json')) {
        googleToken = JSON.parse(fs.readFileSync('token.json'));
      } else {
        throw new Error('No token found');
      }
    } catch (error) {
      console.error('Error loading Google credentials/token:', error);
      return res.status(500).json({ error: 'Google authentication not configured' });
    }
    
    // Create tenant with actual credentials
    const tenant = {
      id: 'local-tenant',
      name: 'Local Business',
      api_key: decoded.api_key,
      g_credentials: credentials,
      g_token: googleToken
    };

    req.tenant = tenant;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(403).json({ error: 'Forbidden' });
  }
}; 