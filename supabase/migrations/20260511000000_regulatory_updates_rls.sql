ALTER TABLE public.regulatory_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated read regulatory_updates"
  ON public.regulatory_updates
  FOR SELECT
  TO authenticated
  USING (true);
