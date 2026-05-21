-- =====================================================
-- FDL CARD — Supabase Schema
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. academies
CREATE TABLE public.academies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  logo_url      TEXT,
  primary_color TEXT NOT NULL DEFAULT '#FFD700',
  owner_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_academies_owner ON public.academies(owner_id);

-- 2. players
CREATE TABLE public.players (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id           UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  position             TEXT NOT NULL CHECK (position IN ('GK','CB','LB','RB','CDM','CM','CAM','LW','RW','ST','CF')),
  jersey_number        SMALLINT NOT NULL CHECK (jersey_number BETWEEN 1 AND 99),
  age                  SMALLINT CHECK (age BETWEEN 4 AND 30),
  photo_url            TEXT,
  photo_bg_removed_url TEXT,
  bg_removal_status    TEXT NOT NULL DEFAULT 'none'
                       CHECK (bg_removal_status IN ('none','pending','processing','done','failed')),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(academy_id, jersey_number)
);
CREATE INDEX idx_players_academy ON public.players(academy_id);

-- 3. card_templates
CREATE TABLE public.card_templates (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  thumbnail_url TEXT,
  config        JSONB NOT NULL DEFAULT '{}',
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    SMALLINT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. player_cards
CREATE TABLE public.player_cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  player_id   UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.card_templates(id),
  stats       JSONB NOT NULL DEFAULT '{"pac":75,"dri":70,"phy":70,"acc":75,"tac":70,"psy":70}',
  overall     SMALLINT NOT NULL DEFAULT 72,
  preview_url TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_cards_academy ON public.player_cards(academy_id);
CREATE INDEX idx_cards_player  ON public.player_cards(player_id);

-- 5. cart_items
CREATE TABLE public.cart_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  card_id     UUID NOT NULL REFERENCES public.player_cards(id) ON DELETE CASCADE,
  quantity    SMALLINT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(academy_id, card_id)
);

-- 6. orders
CREATE TABLE public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id        UUID NOT NULL REFERENCES public.academies(id) ON DELETE RESTRICT,
  order_number      TEXT NOT NULL UNIQUE,
  status            TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','paid','confirmed','printing','shipped','delivered','cancelled','refunded')),
  total_amount      INTEGER NOT NULL,
  shipping_name     TEXT NOT NULL,
  shipping_phone    TEXT NOT NULL,
  shipping_address  TEXT NOT NULL,
  shipping_address2 TEXT,
  shipping_zip      TEXT NOT NULL,
  shipping_carrier  TEXT,
  tracking_number   TEXT,
  shipped_at        TIMESTAMPTZ,
  delivered_at      TIMESTAMPTZ,
  note              TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_orders_academy ON public.orders(academy_id);
CREATE INDEX idx_orders_status  ON public.orders(status);

-- 7. order_items
CREATE TABLE public.order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  card_id     UUID NOT NULL REFERENCES public.player_cards(id) ON DELETE RESTRICT,
  quantity    SMALLINT NOT NULL,
  unit_price  INTEGER NOT NULL,
  snapshot    JSONB NOT NULL DEFAULT '{}'
);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- 8. payments
CREATE TABLE public.payments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  payment_key   TEXT UNIQUE,
  payment_type  TEXT,
  method        TEXT,
  amount        INTEGER NOT NULL,
  status        TEXT NOT NULL DEFAULT 'ready'
                CHECK (status IN ('ready','in_progress','done','canceled','aborted','expired','partial_canceled')),
  approved_at   TIMESTAMPTZ,
  raw_response  JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_payments_order ON public.payments(order_id);

-- 9. print_jobs
CREATE TABLE public.print_jobs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id       UUID NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
  status         TEXT NOT NULL DEFAULT 'queued'
                 CHECK (status IN ('queued','sent_to_printer','printing','done','failed')),
  print_file_url TEXT,
  printer_note   TEXT,
  dispatched_at  TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================================================
-- Triggers
-- =====================================================

-- auto order_number
CREATE SEQUENCE IF NOT EXISTS order_seq START 1;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.order_number := 'FDL-' ||
    TO_CHAR(NOW() AT TIME ZONE 'Asia/Seoul', 'YYYYMMDD') || '-' ||
    LPAD(NEXTVAL('order_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.generate_order_number();

-- updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_cards_updated_at
  BEFORE UPDATE ON public.player_cards
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- RLS
-- =====================================================

ALTER TABLE public.academies      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_cards   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs     ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.my_academy_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT id FROM public.academies WHERE owner_id = auth.uid() LIMIT 1;
$$;

CREATE POLICY "academy_owner" ON public.academies
  FOR ALL USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE POLICY "players_academy" ON public.players
  FOR ALL USING (academy_id = my_academy_id()) WITH CHECK (academy_id = my_academy_id());

CREATE POLICY "templates_public_read" ON public.card_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "cards_academy" ON public.player_cards
  FOR ALL USING (academy_id = my_academy_id()) WITH CHECK (academy_id = my_academy_id());

CREATE POLICY "cart_academy" ON public.cart_items
  FOR ALL USING (academy_id = my_academy_id()) WITH CHECK (academy_id = my_academy_id());

CREATE POLICY "orders_academy_read" ON public.orders
  FOR SELECT USING (academy_id = my_academy_id());
CREATE POLICY "orders_academy_insert" ON public.orders
  FOR INSERT WITH CHECK (academy_id = my_academy_id());

CREATE POLICY "order_items_read" ON public.order_items
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE academy_id = my_academy_id())
  );

CREATE POLICY "payments_read" ON public.payments
  FOR SELECT USING (
    order_id IN (SELECT id FROM public.orders WHERE academy_id = my_academy_id())
  );

CREATE POLICY "print_jobs_deny" ON public.print_jobs
  FOR ALL USING (false);

-- =====================================================
-- Premium Templates
-- =====================================================

ALTER TABLE public.card_templates
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price INTEGER NOT NULL DEFAULT 0;

-- Academy-level template unlocks (purchased premium templates)
CREATE TABLE IF NOT EXISTS public.academy_template_unlocks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academy_id  UUID NOT NULL REFERENCES public.academies(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.card_templates(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payment_key TEXT,
  UNIQUE(academy_id, template_id)
);
CREATE INDEX IF NOT EXISTS idx_unlocks_academy ON public.academy_template_unlocks(academy_id);

ALTER TABLE public.academy_template_unlocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "unlocks_academy_read" ON public.academy_template_unlocks
  FOR SELECT USING (academy_id = my_academy_id());
CREATE POLICY "unlocks_academy_insert" ON public.academy_template_unlocks
  FOR INSERT WITH CHECK (academy_id = my_academy_id());

-- =====================================================
-- Storage Buckets (run in Supabase dashboard SQL editor)
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('player-photos', 'player-photos', false),
  ('card-previews', 'card-previews', true),
  ('print-files',   'print-files',   false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "photos_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'player-photos');

CREATE POLICY "photos_owner_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'player-photos');

CREATE POLICY "photos_owner_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'player-photos');

CREATE POLICY "previews_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'card-previews');

CREATE POLICY "previews_auth_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'card-previews');

CREATE POLICY "previews_auth_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'card-previews');
