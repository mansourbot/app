-- Cards Against Reality (initial Supabase schema)
create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  meta jsonb not null,
  cards jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists decks_owner_idx on decks(owner_id);

-- optional: auto-update updated_at
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists decks_set_updated_at on decks;
create trigger decks_set_updated_at
before update on decks
for each row execute procedure set_updated_at();
