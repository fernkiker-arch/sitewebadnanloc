#!/bin/sh
set -eu

: "${SWIFTXPRESS_APP_PASSWORD:?SWIFTXPRESS_APP_PASSWORD is required}"

psql \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set=ON_ERROR_STOP=1 \
  --set=database_name="$POSTGRES_DB" \
  --set=app_password="$SWIFTXPRESS_APP_PASSWORD" <<'SQL'
select format(
  'create role swiftxpress_app login password %L',
  :'app_password'
)
where not exists (
  select 1 from pg_roles where rolname = 'swiftxpress_app'
) \gexec

select format(
  'alter role swiftxpress_app password %L',
  :'app_password'
) \gexec

alter role swiftxpress_app
  nosuperuser
  nocreatedb
  nocreaterole
  noinherit
  noreplication;

select format(
  'grant connect on database %I to swiftxpress_app',
  :'database_name'
) \gexec
SQL
