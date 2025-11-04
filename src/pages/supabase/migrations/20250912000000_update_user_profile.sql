create or replace function public.update_user_profile(
  user_id uuid,
  user_name text,
  user_role text
)
returns void as $$
begin
  update auth.users
  set raw_user_meta_data = raw_user_meta_data || jsonb_build_object('full_name', user_name)
  where id = user_id;

  update public.profiles
  set name = user_name,
      role = user_role
  where id = user_id;
end;
$$ language plpgsql security definer;