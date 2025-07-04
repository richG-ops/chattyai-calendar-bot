require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');

async function addTenantLocal(name, credsPath, tokenPath) {
  try {
    const api_key = crypto.randomBytes(16).toString('hex');
    const g_credentials = JSON.parse(fs.readFileSync(credsPath));
    const g_token = JSON.parse(fs.readFileSync(tokenPath));

    // Create tenant object
    const tenant = {
      id: crypto.randomUUID(),
      name,
      api_key,
      g_credentials,
      g_token,
      created_at: new Date()
    };

    // Generate JWT token
    const token = jwt.sign({ api_key }, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production', { expiresIn: '365d' });

    console.log(`✅ Tenant "${name}" created successfully!`);
    console.log(`ID: ${tenant.id}`);
    console.log(`API Key: ${api_key}`);
    console.log(`JWT Token: ${token}`);
    console.log(`\n📋 Tenant Details:`);
    console.log(`- Name: ${tenant.name}`);
    console.log(`- Google Client ID: ${g_credentials.client_id || g_credentials.installed?.client_id}`);
    console.log(`- Token Expiry: ${new Date(g_token.expiry_date).toLocaleString()}`);
    console.log(`\n🔑 Use this JWT in your Authorization header:`);
    console.log(`Authorization: Bearer ${token}`);
    console.log(`\n📝 For database storage, run this SQL:`);
    console.log(`INSERT INTO tenants (id, name, api_key, g_credentials, g_token, created_at) VALUES ('${tenant.id}', '${tenant.name}', '${api_key}', '${JSON.stringify(g_credentials)}', '${JSON.stringify(g_token)}', '${tenant.created_at.toISOString()}');`);

    return { tenant, token };
  } catch (error) {
    console.error('❌ Error creating tenant:', error.message);
    throw error;
  }
}

const [name, creds, token] = process.argv.slice(2);
if (!name || !creds || !token) {
  console.error('Usage: node scripts/addTenantLocal.js "Tenant Name" ./credentials.json ./token.json');
  process.exit(1);
}

addTenantLocal(name, creds, token).catch(console.error); 