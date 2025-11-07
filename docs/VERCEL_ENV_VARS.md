# Vercel Environment Variables for Supabase

Set these in Vercel → Project → Settings → Environment Variables

Required (Client)
- VITE_SUPABASE_URL = https://usgdqysffzskvlqxksyg.supabase.co
- VITE_SUPABASE_ANON_KEY = <paste anon key from Supabase Dashboard>

Optional (Server-side only; never exposed to client bundles)
- SUPABASE_SERVICE_KEY = <paste service_role key from Supabase Dashboard>

Notes
- After updating, redeploy the project (Vercel will prompt you or you can trigger a new build).
- If you previously had old values, remove them to avoid confusion.
- Clear auth state after deploy if users stay logged in from the old project: log out or clear site data.

Supabase Auth URL Configuration (Dashboard → Auth → URL Configuration)
- Allowed Redirect URLs:
  - https://nyumbapaeasy.vercel.app
  - https://nyumbapaeasy.vercel.app/auth/callback
  - https://nyumbapaeasy.vercel.app/welcome
- Allowed Callback URLs:
  - https://nyumbapaeasy.vercel.app/auth/callback
- Allowed Sign-out URLs (optional):
  - https://nyumbapaeasy.vercel.app
- Allowed CORS origins:
  - https://nyumbapaeasy.vercel.app

Local Development (adjust port to your dev server)
- Site URL: http://localhost:5173 (or your dev port)
- Allowed Redirect URLs:
  - http://localhost:5173
  - http://localhost:5173/auth/callback
  - http://localhost:5173/welcome
- Allowed Callback URLs:
  - http://localhost:5173/auth/callback
- Allowed CORS origins:
  - http://localhost:5173

Troubleshooting
- If you see network calls to an old Supabase ref (e.g., ijnvohgmmkhafsowpgof), your environment still has old values (local or Vercel). Update and redeploy/restart.
- Clear localStorage and cookies to drop sessions tied to the old project.
- Ensure Email provider is enabled if using OTP/magic links.
