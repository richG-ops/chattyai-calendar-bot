require('dotenv').config();
const Tenants = require('../models/tenant');
const crypto = require('crypto');
const fs = require('fs');

async function addTenant(name, credsPath, tokenPath) {
  const api_key = crypto.randomBytes(16).toString('hex');
  const g_credentials = JSON.parse(fs.readFileSync(credsPath));
  const g_token = JSON.parse(fs.readFileSync(tokenPath));

  const [tenant] = await Tenants.createTenant({
    name, api_key, g_credentials, g_token
  });

  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ api_key }, process.env.JWT_SECRET, { expiresIn: '365d' });
  console.log(`✅ Tenant "${name}" created successfully!`);
  console.log(`API Key: ${api_key}`);
  console.log(`JWT Token: ${token}`);
  console.log(`\nUse this JWT in your Authorization header:`);
  console.log(`Authorization: Bearer ${token}`);
}

const [name, creds, token] = process.argv.slice(2);
if (!name || !creds || !token) {
  console.error('Usage: node scripts/addTenant.js "Tenant Name" ./credentials.json ./token.json');
  process.exit(1);
}

addTenant(name, creds, token).catch(console.error); 