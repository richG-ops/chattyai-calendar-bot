const jwt = require('jsonwebtoken');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiMjBjYTM3MDQzZGRlNzAzYzk2Y2MzZjg3N2EwOGUwNzciLCJpYXQiOjE3NTE1ODcxNjgsImV4cCI6MTc4MzEyMzE2OH0.oSCCbum3TKfGZVh6bHv_a0_7obDriinc8A9HVmC5Y64";

try {
  const decoded = jwt.verify(token, 'your-super-secret-jwt-key-change-this-in-production');
  console.log('✅ JWT Token is valid!');
  console.log('Decoded payload:', decoded);
  console.log('API Key:', decoded.api_key);
} catch (error) {
  console.error('❌ JWT Token is invalid:', error.message);
}