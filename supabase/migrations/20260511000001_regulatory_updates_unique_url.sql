ALTER TABLE public.regulatory_updates
ADD CONSTRAINT regulatory_updates_url_key UNIQUE (url);
