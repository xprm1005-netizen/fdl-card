import { supabase } from '../lib/supabase';
import { calcOverall } from '../lib/utils';

export async function getCardsByPlayer(playerId) {
  const { data, error } = await supabase
    .from('player_cards')
    .select('*, card_templates(*)')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCard(id) {
  const { data, error } = await supabase
    .from('player_cards')
    .select('*, card_templates(*), players(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createCard({ academyId, playerId, templateId, stats }) {
  const overall = calcOverall(stats);
  const { data, error } = await supabase
    .from('player_cards')
    .insert({ academy_id: academyId, player_id: playerId, template_id: templateId, stats, overall })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCardStats(id, stats) {
  const overall = calcOverall(stats);
  const { data, error } = await supabase
    .from('player_cards')
    .update({ stats, overall })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function saveCardPreview(cardId, dataURL) {
  const blob = await (await fetch(dataURL)).blob();
  const path = `${cardId}/preview.png`;
  const { error } = await supabase.storage
    .from('card-previews')
    .upload(path, blob, { contentType: 'image/png', upsert: true });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from('card-previews').getPublicUrl(path);

  await supabase.from('player_cards').update({ preview_url: publicUrl }).eq('id', cardId);
  return publicUrl;
}
