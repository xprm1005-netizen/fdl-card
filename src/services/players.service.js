import { supabase } from '../lib/supabase';

export async function getPlayers(academyId) {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('academy_id', academyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPlayer(id) {
  const { data, error } = await supabase
    .from('players')
    .select('*, player_cards(*, card_templates(*))')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createPlayer({ academyId, name, position, jerseyNumber, age }) {
  const payload = {
    academy_id: academyId,
    name,
    position,
    jersey_number: jerseyNumber,
  };
  if (age !== undefined && age !== null && age !== '') {
    payload.age = Number(age);
  }

  const { data, error } = await supabase
    .from('players')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePlayer(id, updates) {
  const { data, error } = await supabase
    .from('players')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePlayer(id) {
  const { error } = await supabase.from('players').delete().eq('id', id);
  if (error) throw error;
}

export async function uploadPlayerPhoto(playerId, file) {
  const path = `${playerId}/original.jpg`;
  const { error } = await supabase.storage
    .from('player-photos')
    .upload(path, file, { upsert: true, contentType: 'image/jpeg' });
  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage.from('player-photos').getPublicUrl(path);

  await supabase.from('players').update({
    photo_url: publicUrl,
    bg_removal_status: 'pending',
  }).eq('id', playerId);

  return publicUrl;
}
