// Example client registry (replace with DB in production)
module.exports = [
  {
    businessId: "acme-corp",
    apiKey: "acme-secret-key-123",
    googleCredentials: {
      client_id: "acme-client-id",
      client_secret: "acme-client-secret",
      redirect_uris: ["http://localhost:4000/oauth2callback"]
    },
    googleToken: {
      access_token: "...",
      refresh_token: "...",
      scope: "https://www.googleapis.com/auth/calendar",
      token_type: "Bearer",
      expiry_date: 1751001671984
    }
  },
  {
    businessId: "globex",
    apiKey: "globex-secret-key-456",
    googleCredentials: {
      client_id: "globex-client-id",
      client_secret: "globex-client-secret",
      redirect_uris: ["http://localhost:4000/oauth2callback"]
    },
    googleToken: {
      access_token: "...",
      refresh_token: "...",
      scope: "https://www.googleapis.com/auth/calendar",
      token_type: "Bearer",
      expiry_date: 1751001671984
    }
  }
]; 