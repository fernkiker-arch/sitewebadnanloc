create extension if not exists pgcrypto;

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default (
    'SX-' ||
    to_char(clock_timestamp() at time zone 'UTC', 'YYYYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
  ),
  customer_name text not null,
  company text,
  phone text not null,
  email text not null,
  pickup_address text not null,
  delivery_address text not null,
  delivery_date date not null,
  parcel_type text not null,
  additional_instructions text,
  language text not null default 'fr',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quote_requests_customer_name_length
    check (char_length(customer_name) between 2 and 120),
  constraint quote_requests_company_length
    check (company is null or char_length(company) between 1 and 120),
  constraint quote_requests_phone_length
    check (char_length(phone) between 7 and 32),
  constraint quote_requests_email_length
    check (char_length(email) between 3 and 254),
  constraint quote_requests_pickup_address_length
    check (char_length(pickup_address) between 5 and 240),
  constraint quote_requests_delivery_address_length
    check (char_length(delivery_address) between 5 and 240),
  constraint quote_requests_parcel_type_allowed
    check (parcel_type in (
      'envelope',
      'small_parcel',
      'medium_parcel',
      'large_parcel',
      'multiple_items',
      'other'
    )),
  constraint quote_requests_instructions_length
    check (
      additional_instructions is null or
      char_length(additional_instructions) between 1 and 1000
    ),
  constraint quote_requests_language_allowed
    check (language in ('fr', 'en')),
  constraint quote_requests_status_allowed
    check (status in ('new', 'contacted', 'quoted', 'closed', 'spam'))
);

create index if not exists quote_requests_status_created_at_idx
  on quote_requests (status, created_at desc);

create table if not exists quote_rate_limits (
  identifier_hash text primary key,
  request_count integer not null default 1,
  window_started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quote_rate_limits_identifier_hash_length
    check (char_length(identifier_hash) = 64),
  constraint quote_rate_limits_request_count_positive
    check (request_count > 0)
);

create index if not exists quote_rate_limits_updated_at_idx
  on quote_rate_limits (updated_at);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists quote_requests_set_updated_at on quote_requests;
create trigger quote_requests_set_updated_at
before update on quote_requests
for each row
execute function set_updated_at();
