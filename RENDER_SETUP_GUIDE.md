# Render Environment Variables Setup Guide

## 🔧 Fix GOOGLE_CREDENTIALS Environment Variable

### Step 1: Access Render Dashboard
1. Go to [render.com](https://render.com)
2. Sign in to your account
3. Find your `chattyai-calendar-bot` service
4. Click on your service name

### Step 2: Navigate to Environment Tab
1. In your service dashboard, click the **"Environment"** tab
2. Look for the **"Environment Variables"** section

### Step 3: Edit GOOGLE_CREDENTIALS
1. Find the `GOOGLE_CREDENTIALS` variable
2. Click the **"Edit"** button (pencil icon) next to it
3. **Delete everything** in the current value box

### Step 4: Copy Your Credentials
1. Open your `credentials.json` file on your computer
2. **Select ALL content** (Ctrl+A or Cmd+A)
3. **Copy** the entire JSON (Ctrl+C or Cmd+C)

### Step 5: Paste into Render
1. Go back to the Render value box
2. **Paste** the entire JSON content (Ctrl+V or Cmd+V)
3. Click **"Save Changes"**

---

## 📋 Example: What Your GOOGLE_CREDENTIALS Should Look Like

```json
{
  "installed": {
    "client_id": "YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com",
    "project_id": "your-project-name",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "YOUR_ACTUAL_CLIENT_SECRET",
    "redirect_uris": ["http://localhost"]
  }
}
```

**⚠️ IMPORTANT:** The entire JSON above (including the curly braces `{}`) should be pasted as **ONE LINE** in Render.

---

## 🔧 Fix GOOGLE_TOKEN Environment Variable

### Step 1: Get Your Token (Local)
1. Start your app locally: `npm start`
2. Visit: `http://localhost:3000/auth`
3. Complete Google OAuth flow
4. Copy contents of generated `token.json`

### Step 2: Set Token in Render
1. Go back to Render Environment tab
2. Find or create `GOOGLE_TOKEN` variable
3. Click **"Edit"**
4. Paste the entire token JSON content
5. Click **"Save Changes"**

---

## 📋 Example: What Your GOOGLE_TOKEN Should Look Like

```json
{
  "access_token": "ya29.a0AfB_byC...",
  "refresh_token": "1//04dX...",
  "scope": "https://www.googleapis.com/auth/calendar",
  "token_type": "Bearer",
  "expiry_date": 1703123456789
}
```

**⚠️ IMPORTANT:** The entire JSON above should be pasted as **ONE LINE** in Render.

---

## ✅ Verification Steps

### 1. Check Environment Variables
- Go to Render Environment tab
- Verify both variables are set
- No syntax errors (proper JSON)

### 2. Redeploy
1. Go to Render dashboard
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait for deployment to complete

### 3. Test Your API
1. Get your Render URL (e.g., `https://your-app.onrender.com`)
2. Test: `GET /get-availability`
3. Should return available slots (not authentication error)

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid JSON" Error
**Solution:** Ensure the entire JSON is on one line with no line breaks

### Issue: "Not authenticated" Error
**Solution:** 
1. Check `GOOGLE_TOKEN` is set correctly
2. Re-authenticate locally and update token
3. Redeploy

### Issue: "Client ID not found" Error
**Solution:**
1. Verify `GOOGLE_CREDENTIALS` contains the full JSON
2. Check client_id and client_secret are correct
3. Ensure Google Cloud Console project is active

---

## 🎯 Success Indicators

✅ Environment variables show no syntax errors  
✅ Deployment completes successfully  
✅ `/get-availability` returns JSON with slots  
✅ No authentication errors in logs  

---

## 📞 Need Help?

If you're still having issues:
1. Check Render deployment logs
2. Verify Google Cloud Console settings
3. Test locally first with environment variables
4. Contact support with specific error messages 