
-- Function to create a profile for a new user
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, user_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    (new.raw_user_meta_data->>'user_type')::user_role
  );
  return new;
end;
$$;

-- Trigger to execute the function after a new user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

