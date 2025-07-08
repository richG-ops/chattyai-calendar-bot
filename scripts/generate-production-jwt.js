const jwt = require('jsonwebtoken');

// Replace this with your production JWT_SECRET from Render
const JWT_SECRET = process.env.JWT_SECRET || 'REPLACE_WITH_YOUR_PRODUCTION_JWT_SECRET';

if (JWT_SECRET === 'REPLACE_WITH_YOUR_PRODUCTION_JWT_SECRET') {
  console.error('❌ Please replace JWT_SECRET with your actual production secret');
  process.exit(1);
}

const token = jwt.sign(
  { api_key: 'test-api-key' },
  JWT_SECRET,
  { expiresIn: '365d' }
);

console.log('✅ Generated Production JWT Token:');
console.log(token);
console.log('\n📋 Use this token in your API requests:');
console.log(`Authorization: Bearer ${token}`);