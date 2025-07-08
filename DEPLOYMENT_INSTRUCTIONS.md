# Production Deployment Instructions

## Prerequisites
- GitHub repository connected to Render
- Google Cloud Console project with Calendar API enabled
- Local working setup (confirmed)

## Step 1: Prepare Environment Variables

Save these for Render configuration:

```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=c13dc78e31b861b8020265d7472c4388e6f247b8fe36afabb19d11f314c8226ef035019979c5dbeb91ac430bd9a23f7f02f2f8fdc60dbaf67f8428f0ca924d60
```

## Step 2: Configure Google Credentials in Render

1. Go to https://dashboard.render.com
2. Select your service: chattyai-calendar-bot-1
3. Go to Environment tab
4. Add the following environment variables:

### GOOGLE_CREDENTIALS
Set as the JSON string of your credentials (use the one from your local credentials.json)

### GOOGLE_TOKEN  
Will be set after OAuth flow completes

## Step 3: Deploy to Render

1. Commit only safe files:
```bash
git add .gitignore DEPLOYMENT_INSTRUCTIONS.md scripts/generate-production-jwt.js
git commit -m "Add deployment instructions and JWT generator"
git push origin main
```

2. Render will auto-deploy when changes are pushed

## Step 4: Complete OAuth Flow in Production

1. Visit: https://chattyai-calendar-bot-1.onrender.com/auth
2. Click "Authenticate with Google"
3. Complete the OAuth flow
4. Check Render logs for the token
5. Add the token as GOOGLE_TOKEN environment variable

## Step 5: Test Production API

Generate a test JWT:
```bash
JWT_SECRET=c13dc78e31b861b8020265d7472c4388e6f247b8fe36afabb19d11f314c8226ef035019979c5dbeb91ac430bd9a23f7f02f2f8fdc60dbaf67f8428f0ca924d60 node scripts/generate-production-jwt.js
```

Test availability:
```bash
curl -X GET "https://chattyai-calendar-bot-1.onrender.com/get-availability" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Test booking:
```bash
curl -X POST "https://chattyai-calendar-bot-1.onrender.com/book-appointment" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"start":"2025-07-10T14:00:00Z","end":"2025-07-10T14:30:00Z","summary":"Production test"}'
```

## Important Security Notes
- Never commit credentials.json or token.json
- Always use environment variables for secrets
- Keep JWT_SECRET secure and unique per environment