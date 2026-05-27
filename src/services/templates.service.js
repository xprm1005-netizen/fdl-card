import { supabase } from '../lib/supabase';

const THUMBNAIL_MAP = {
  future:   '/thumbnails/future.png',
  elite:    '/thumbnails/elite.png',
  classic:  '/thumbnails/classic.png',
  shadow:   '/thumbnails/shadow.png',
  fdl:      '/thumbnails/fdl.png',
  champion: '/thumbnails/champion.png',
};

export async function getTemplates() {
  const { data, error } = await supabase
    .from('card_templates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data.map((t) => ({ ...t, thumbnail_url: THUMBNAIL_MAP[t.slug] || null }));
}

export async function getTemplate(id) {
  const { data, error } = await supabase
    .from('card_templates')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
