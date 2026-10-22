drop policy if exists "Anyone can create leads" on public.leads;

create policy "Anyone can create valid leads"
on public.leads for insert
to anon, authenticated
with check (
  length(trim(name)) between 2 and 120
  and length(trim(phone)) between 6 and 20
  and length(trim(email)) between 5 and 254
  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  and coalesce(length(message), 0) <= 2000
  and coalesce(length(business_type), 0) <= 80
  and coalesce(length(product_interest), 0) <= 80
  and coalesce(length(city), 0) <= 80
  and status = 'new'
);