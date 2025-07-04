#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Production Setup Script');
console.log('==========================\n');

// Generate a secure JWT secret
const jwtSecret = crypto.randomBytes(64).toString('hex');

console.log('✅ Generated JWT Secret:');
console.log(jwtSecret);
console.log('\n📋 Environment Variables for Render:');
console.log('=====================================');
console.log(`NODE_ENV=production`);
console.log(`PORT=4000`);
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`DATABASE_URL=[Render will set this automatically]`);
console.log(`GOOGLE_CLIENT_ID=[Your Google Client ID]`);
console.log(`GOOGLE_CLIENT_SECRET=[Your Google Client Secret]`);
console.log(`GOOGLE_REDIRECT_URI=https://your-app-name.onrender.com/auth/google/callback`);

console.log('\n🔧 Next Steps:');
console.log('1. Go to render.com and create a new Blueprint');
console.log('2. Connect your GitHub repository');
console.log('3. Set the environment variables above in Render dashboard');
console.log('4. Update your Google OAuth redirect URI');
console.log('5. Deploy!');

console.log('\n📖 See DEPLOYMENT_GUIDE.md for detailed instructions'); 