-- Services and bookings for Pawsome Mobile Grooming

create table public.services (
  id text primary key,
  name text not null,
  minutes integer not null,
  prices jsonb not null
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.services (id),
  dog_size text not null check (dog_size in ('small', 'medium', 'large')),
  starts_at timestamptz not null unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  dog_name text not null,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;
alter table public.bookings enable row level security;

create policy "Anyone can see the services" on public.services
  for select using (true);

create policy "Anyone can book" on public.bookings
  for insert with check (true);

create policy "Enable read access for all users" on public.bookings
  for select using (true);

insert into public.services (id, name, minutes, prices) values
  ('nails', 'Nail trim', 30, '{"small": 20, "medium": 20, "large": 25}'),
  ('bath', 'Bath and brush', 60, '{"small": 55, "medium": 70, "large": 85}'),
  ('groom', 'Full groom (bath, haircut, nails)', 120, '{"small": 75, "medium": 95, "large": 120}');
