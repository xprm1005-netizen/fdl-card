import { supabase } from '../lib/supabase';

export async function getTemplates() {
  const { data, error } = await supabase
    .from('card_templates')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  if (error) throw error;
  return data;
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
