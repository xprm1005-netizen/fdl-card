import { supabase } from '../lib/supabase';
import { calcOverall, determineGrade } from '../lib/utils';

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
  const grade   = determineGrade(overall).slug;
  const { data, error } = await supabase
    .from('player_cards')
    .insert({ academy_id: academyId, player_id: playerId, template_id: templateId, stats, overall, grade })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getCardByToken(token) {
  const { data, error } = await supabase
    .from('player_cards')
    .select('*, card_templates(*), players(*)')
    .eq('share_token', token)
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

export async function deleteCard(id) {
  // Remove from cart first (FK constraint)
  const { error: cartError } = await supabase.from('cart_items').delete().eq('card_id', id);
  if (cartError) throw cartError;

  const { error } = await supabase.from('player_cards').delete().eq('id', id);
  if (error) {
    // order_items still reference this card — block with a clear message
    if (error.code === '23503') throw new Error('이 카드는 주문 내역이 있어 삭제할 수 없습니다.');
    throw error;
  }
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
