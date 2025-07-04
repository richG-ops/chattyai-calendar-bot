# 🚀 Quick Reference: Render Environment Variables

## 📋 GOOGLE_CREDENTIALS (Highlighted)

**Copy this EXACT format from your `credentials.json`:**

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

**⚠️ CRITICAL:** Paste as **ONE LINE** in Render!

---

## 📋 GOOGLE_TOKEN (Highlighted)

**Copy this EXACT format from your `token.json`:**

```json
{
  "access_token": "ya29.a0AfB_byC...",
  "refresh_token": "1//04dX...",
  "scope": "https://www.googleapis.com/auth/calendar",
  "token_type": "Bearer",
  "expiry_date": 1703123456789
}
```

**⚠️ CRITICAL:** Paste as **ONE LINE** in Render!

---

## 🔧 Render Steps (Highlighted)

1. **Go to:** `render.com` → Your Service → **Environment** tab
2. **Find:** `GOOGLE_CREDENTIALS` → Click **Edit** (pencil icon)
3. **Delete:** Everything in the value box
4. **Copy:** Entire contents of your `credentials.json` file
5. **Paste:** Into Render value box
6. **Save:** Click "Save Changes"
7. **Repeat:** Same steps for `GOOGLE_TOKEN`
8. **Redeploy:** Manual Deploy → Deploy latest commit

---

## ✅ Test Your Setup

**Test URL:** `https://your-app.onrender.com/get-availability`

**Expected Response:**
```json
{
  "slots": [
    {
      "start": "2024-01-15T10:00:00.000Z",
      "end": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**❌ If you get "Not authenticated" → Check your `GOOGLE_TOKEN`**
**❌ If you get "Client ID not found" → Check your `GOOGLE_CREDENTIALS`** 