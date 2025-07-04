# 🏢 Multi-Tenant Calendar API Setup

## ✅ What's Been Implemented

### 1. Database Schema
- **Table**: `tenants` with UUID primary keys
- **Fields**: `id`, `name`, `api_key`, `g_credentials`, `g_token`, `created_at`
- **Migration**: Successfully created and applied

### 2. Authentication System
- **JWT-based authentication** with tenant-specific API keys
- **Middleware**: `middleware/auth.js` validates tokens and fetches tenant data
- **Security**: Each tenant has unique API key and JWT token

### 3. API Integration
- **Updated endpoints**: `/get-availability` and `/book-appointment`
- **Dynamic credentials**: Each request uses tenant-specific Google credentials
- **No more static client configs**: Fully database-driven

### 4. Tenant Onboarding Tools
- **CLI Script**: `scripts/addTenantLocal.js` for easy tenant creation
- **JWT Generation**: Automatic token creation with 1-year expiry
- **Database Ready**: SQL insert statements provided

## 🚀 Quick Start

### 1. Create a New Tenant
```bash
node scripts/addTenantLocal.js "Your Business Name" ./credentials.json ./token.json
```

### 2. Test Your API
```bash
# Start the server
node google-calendar-api.js

# Test with curl (replace YOUR_JWT_TOKEN)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:4000/get-availability
```

### 3. Book an Appointment
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"start":"2025-07-04T10:00:00Z","end":"2025-07-04T10:30:00Z","summary":"Client Appointment"}' \
  http://localhost:4000/book-appointment
```

## 🔧 Database Integration

### For Production (when database is accessible):
```bash
# Use the database-connected version
node scripts/addTenant.js "Business Name" ./credentials.json ./token.json
```

### For Development (local testing):
```bash
# Use the local version that generates SQL
node scripts/addTenantLocal.js "Business Name" ./credentials.json ./token.json
```

## 📋 API Endpoints

### Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Scope**: Tenant-specific Google Calendar access

### Available Endpoints
1. `GET /get-availability` - Returns available 30-minute slots
2. `POST /book-appointment` - Books a new appointment
3. `GET /health` - Health check (no auth required)

## 🔐 Security Features

- **Unique API Keys**: Each tenant gets a cryptographically secure 32-character API key
- **JWT Tokens**: 1-year expiry with tenant-specific claims
- **Database Isolation**: Each tenant's credentials are stored separately
- **No Cross-Tenant Access**: Tenants can only access their own calendars

## 🎯 Next Steps

1. **Test the API** with the generated JWT tokens
2. **Deploy to Render** with the updated tenant system
3. **Add more tenants** using the CLI tools
4. **Build the dashboard** for tenant management
5. **Add email notifications** for appointments

## 🛠️ Troubleshooting

### Database Connection Issues
- Check your `DATABASE_URL` in `.env`
- Ensure SSL is configured properly for Render
- Test connection with: `npx knex migrate:status`

### JWT Issues
- Verify `JWT_SECRET` is set in `.env`
- Check token expiry (1 year by default)
- Ensure Authorization header format: `Bearer TOKEN`

### Google Calendar Issues
- Verify tenant credentials are valid
- Check token expiry and refresh tokens
- Ensure calendar permissions are correct

## 📊 Example Tenant Data

```json
{
  "id": "uuid-here",
  "name": "Acme Salon",
  "api_key": "4ec3607ff3686fa1291fa3d62fbd7752",
  "g_credentials": {
    "web": {
      "client_id": "your-google-client-id",
      "client_secret": "your-google-client-secret",
      "redirect_uris": ["http://localhost:3000/oauth2callback"]
    }
  },
  "g_token": {
    "access_token": "google-access-token",
    "refresh_token": "google-refresh-token",
    "expiry_date": 1751586625128
  }
}
```

Your multi-tenant calendar API is now ready! 🎉 