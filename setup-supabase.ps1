# Install Supabase CLI using scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
scoop install supabase

# Now you can run:
# supabase login
# supabase link --project-ref your-project-ref
# supabase db push