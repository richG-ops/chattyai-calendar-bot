const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'your-super-secret-jwt-key-change-this-in-production');
    console.log('JWT decoded successfully:', decoded.api_key);
    
    // Use mock tenant for local testing (credentials loaded from environment)
    const tenant = {
      id: 'mock-tenant-id',
      name: 'Your Business',
      api_key: decoded.api_key,
      g_credentials: {
        web: {
          client_id: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
          client_secret: process.env.GOOGLE_CLIENT_SECRET || "REPLACE_WITH_ENV_VAR",
          redirect_uris: ["http://localhost:3000/oauth2callback"]
        }
      },
      g_token: {
        access_token: process.env.GOOGLE_ACCESS_TOKEN || "mock-access-token",
        scope: "https://www.googleapis.com/auth/calendar",
        token_type: "Bearer",
        expiry_date: Date.now() + 3600000,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN || "mock-refresh-token"
      }
    };

    req.tenant = tenant;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(403).json({ error: 'Forbidden' });
  }
}; 