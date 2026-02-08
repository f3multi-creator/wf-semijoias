-- Create carts table
create table if not exists public.carts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  items jsonb default '[]'::jsonb,
  status text default 'open' check (status in ('open', 'abandoned', 'converted')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- One cart per user for simplicity
);

-- Policy to allow users to manage their own cart
alter table public.carts enable row level security;

create policy "Users can view their own cart"
  on public.carts for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own cart"
  on public.carts for all
  using (auth.uid() = user_id);

-- Index for cron job performance
create index if not exists carts_status_updated_at_idx on public.carts (status, updated_at);
