-- FDL CARD — 템플릿 시드 (v3 — PNG overlay system)

DELETE FROM public.card_templates;

INSERT INTO public.card_templates (slug, name, is_premium, price, config) VALUES
('fdl1', 'FDL No.1', false, 0, '{"width":420,"height":560}'::jsonb),
('fdl2', 'FDL No.2', false, 0, '{"width":420,"height":560}'::jsonb),
('fdl3', 'FDL No.3', false, 0, '{"width":420,"height":560}'::jsonb),
('fdl4', 'FDL No.4', false, 0, '{"width":420,"height":560}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET
  name       = EXCLUDED.name,
  is_premium = EXCLUDED.is_premium,
  price      = EXCLUDED.price,
  config     = EXCLUDED.config;
