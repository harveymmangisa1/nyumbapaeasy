# Supabase Email Confirmation Setup

## The Problem
Users get a 404 error when clicking email confirmation links because Supabase doesn't know where to redirect them.

## Solution: Configure Supabase Dashboard

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Select your project: `nyumbapaeasy`

### Step 2: Configure Authentication URLs
Go to **Authentication** → **URL Configuration**

Add these URLs:

#### Site URL:
```
http://localhost:3001
```
(For production, use your deployed domain like `https://yourdomain.com`)

#### Redirect URLs (add all of these):
```
http://localhost:3001/auth/callback
http://localhost:3001/welcome
http://localhost:3001
```

For production, also add:
```
https://yourdomain.com/auth/callback
https://yourdomain.com/welcome
https://yourdomain.com
```

### Step 3: Email Templates (Optional)
Go to **Authentication** → **Email Templates**

Customize the confirmation email to include clear instructions:
- Edit "Confirm signup" template
- The `{{ .ConfirmationURL }}` variable will automatically use the redirect URL

### Step 4: Disable Email Confirmation (Only if needed for development)
**WARNING: Only do this for development/testing!**

Go to **Authentication** → **Providers** → **Email**
- Uncheck "Enable email confirmations"
- This allows immediate login without email verification
- **DO NOT use this in production!**

## Current App Configuration
The app is already configured with:
- Email confirmation callback page: `/auth/callback`
- Registration redirect: `${window.location.origin}/auth/callback`
- Auto-redirect to `/welcome` after confirmation

## Testing
1. Apply the Supabase dashboard settings above
2. Register a new user
3. Check your email
4. Click the confirmation link
5. Should redirect to your app at `/auth/callback` → `/welcome`
