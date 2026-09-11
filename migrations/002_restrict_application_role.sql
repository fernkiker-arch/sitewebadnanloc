do $$
begin
  if exists (select 1 from pg_roles where rolname = 'swiftxpress_app') then
    execute 'revoke all on table quote_requests from swiftxpress_app';
    execute 'revoke all on table quote_rate_limits from swiftxpress_app';
    execute 'grant usage on schema public to swiftxpress_app';
    execute 'grant insert (
      customer_name,
      company,
      phone,
      email,
      pickup_address,
      delivery_address,
      delivery_date,
      parcel_type,
      additional_instructions,
      language
    ) on quote_requests to swiftxpress_app';
    execute 'grant select (reference) on quote_requests to swiftxpress_app';
    execute 'grant select, insert, update on quote_rate_limits to swiftxpress_app';
  end if;
end;
$$;
