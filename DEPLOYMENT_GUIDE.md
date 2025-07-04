# 🚀 Render Deployment Guide

## **Multi-Tenant Google Calendar API - Production Deployment**

### 📋 **Prerequisites**
- ✅ GitHub repository with your code
- ✅ Render account (free tier available)
- ✅ Google Cloud Console project with OAuth credentials

---

## **Step 1: Prepare Your Repository**

### 1.1 **Update .gitignore**
Make sure these files are ignored:
```
.env
token.json
node_modules/
*.log
```

### 1.2 **Verify Key Files**
- ✅ `package.json` - Has correct start script
- ✅ `render.yaml` - Deployment configuration
- ✅ `google-calendar-api.js` - Main API file
- ✅ `middleware/auth.js` - Authentication middleware
- ✅ `models/tenant.js` - Database model
- ✅ `knexfile.js` - Database configuration

---

## **Step 2: Deploy to Render**

### 2.1 **Connect GitHub Repository**
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Select the repository: `chattyai-calendar-bot`

### 2.2 **Configure Environment Variables**
In Render dashboard, set these environment variables:

#### **Required Variables:**
```
NODE_ENV=production
PORT=4000
JWT_SECRET=[Render will generate this]
DATABASE_URL=[Render will set this automatically]
```

#### **Google OAuth Variables:**
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-app-name.onrender.com/auth/google/callback
```

### 2.3 **Deploy**
1. Click "Create Blueprint Instance"
2. Render will automatically:
   - Create PostgreSQL database
   - Deploy your web service
   - Set up environment variables
   - Run database migrations

---

## **Step 3: Post-Deployment Setup**

### 3.1 **Run Database Migrations**
After deployment, run migrations:
```bash
# In Render shell or locally with production DATABASE_URL
npx knex migrate:latest
```

### 3.2 **Add Your First Tenant**
Use the production tenant script:
```bash
node scripts/addTenant.js
```

### 3.3 **Test Your API**
```bash
# Test health endpoint
curl https://your-app-name.onrender.com/health

# Test with JWT token
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://your-app-name.onrender.com/get-availability
```

---

## **Step 4: Google OAuth Setup**

### 4.1 **Update Google Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-app-name.onrender.com/auth/google/callback
   ```

### 4.2 **Update Environment Variables**
In Render dashboard, update:
```
GOOGLE_REDIRECT_URI=https://your-app-name.onrender.com/auth/google/callback
```

---

## **Step 5: Production Testing**

### 5.1 **Health Check**
```bash
curl https://your-app-name.onrender.com/health
```

### 5.2 **Authentication Test**
```bash
# Get JWT token from tenant creation
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://your-app-name.onrender.com/get-availability
```

### 5.3 **Book Appointment Test**
```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"date": "2025-01-15", "time": "10:00", "title": "Test Appointment"}' \
  https://your-app-name.onrender.com/book-appointment
```

---

## **🔧 Troubleshooting**

### **Common Issues:**

1. **Database Connection Error**
   - Check DATABASE_URL in Render environment variables
   - Verify SSL configuration in knexfile.js

2. **JWT Authentication Error**
   - Ensure JWT_SECRET is set in Render
   - Check token format in requests

3. **Google OAuth Error**
   - Verify redirect URI matches exactly
   - Check client ID and secret

4. **Migration Errors**
   - Run migrations manually in Render shell
   - Check database permissions

---

## **🎯 Next Steps After Deployment**

1. **Add More Tenants** - Use production tenant script
2. **Monitor Logs** - Check Render logs for errors
3. **Set Up Monitoring** - Add health checks and alerts
4. **Scale Up** - Upgrade plan if needed
5. **Add Features** - Email notifications, dashboard, etc.

---

## **📞 Support**

If you encounter issues:
1. Check Render logs in dashboard
2. Verify environment variables
3. Test locally with production DATABASE_URL
4. Check Google OAuth configuration

**Your API will be live at:** `https://your-app-name.onrender.com` 🚀 