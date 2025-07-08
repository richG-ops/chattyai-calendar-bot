// Validate Google Credentials Script
const fs = require('fs');

console.log('🔍 Google Credentials Validator\n');

// Check environment variable
if (process.env.GOOGLE_CREDENTIALS) {
  console.log('✅ GOOGLE_CREDENTIALS environment variable found');
  try {
    const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    validateCredentials(creds, 'Environment Variable');
  } catch (error) {
    console.error('❌ Failed to parse GOOGLE_CREDENTIALS:', error.message);
    console.log('\nMake sure GOOGLE_CREDENTIALS is valid JSON!');
  }
} else {
  console.log('⚠️  No GOOGLE_CREDENTIALS environment variable found');
}

// Check local file
if (fs.existsSync('credentials.json')) {
  console.log('\n✅ credentials.json file found');
  try {
    const fileContent = fs.readFileSync('credentials.json', 'utf8');
    const creds = JSON.parse(fileContent);
    validateCredentials(creds, 'Local File');
  } catch (error) {
    console.error('❌ Failed to parse credentials.json:', error.message);
  }
} else {
  console.log('\n⚠️  No credentials.json file found');
}

function validateCredentials(creds, source) {
  console.log(`\n📋 Validating credentials from ${source}:`);
  
  // Check structure
  if (creds.web) {
    console.log('  ✅ Found "web" credentials');
    validateOAuthCreds(creds.web);
  } else if (creds.installed) {
    console.log('  ✅ Found "installed" credentials');
    validateOAuthCreds(creds.installed);
  } else {
    console.error('  ❌ No "web" or "installed" section found!');
    console.log('  Expected structure: { "web": {...} } or { "installed": {...} }');
  }
}

function validateOAuthCreds(oauth) {
  const required = ['client_id', 'client_secret', 'redirect_uris'];
  const missing = [];
  
  required.forEach(field => {
    if (!oauth[field]) {
      missing.push(field);
    }
  });
  
  if (missing.length > 0) {
    console.error(`  ❌ Missing required fields: ${missing.join(', ')}`);
  } else {
    console.log(`  ✅ All required fields present`);
    console.log(`  • Client ID: ${oauth.client_id.substring(0, 30)}...`);
    console.log(`  • Client Secret: ***hidden***`);
    console.log(`  • Redirect URIs: ${oauth.redirect_uris.join(', ')}`);
    
    // Check redirect URIs
    const productionUri = 'https://chattyai-calendar-bot-1.onrender.com/auth/google/callback';
    if (oauth.redirect_uris.includes(productionUri)) {
      console.log(`  ✅ Production redirect URI found`);
    } else {
      console.warn(`  ⚠️  Production redirect URI not found: ${productionUri}`);
      console.log(`  Add this to your Google Cloud Console OAuth settings!`);
    }
  }
}

console.log('\n📌 Next Steps:');
console.log('1. Ensure GOOGLE_CREDENTIALS in Render matches your OAuth app');
console.log('2. Verify redirect URIs in Google Cloud Console include:');
console.log('   https://chattyai-calendar-bot-1.onrender.com/auth/google/callback');
console.log('3. Make sure the OAuth app is not in test mode with expired tokens'); 