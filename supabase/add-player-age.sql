-- Add optional player age for card front AGE field.
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS age SMALLINT CHECK (age BETWEEN 4 AND 30);

