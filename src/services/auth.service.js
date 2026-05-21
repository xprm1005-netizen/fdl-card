import { supabase } from '../lib/supabase';

export async function signUp({ email, password, academyName, primaryColor, logoFile }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const { data: academy, error: academyError } = await supabase.from('academies').insert({
    name: academyName,
    primary_color: primaryColor || '#FFD700',
    owner_id: data.user.id,
  }).select().single();
  if (academyError) throw academyError;

  if (logoFile && academy?.id) {
    const ext = logoFile.name.split('.').pop();
    const path = `academy-logos/${academy.id}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('player-photos')
      .upload(path, logoFile, { upsert: true });
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('player-photos').getPublicUrl(path);
    const { data: updatedAcademy, error: logoError } = await supabase
      .from('academies')
      .update({ logo_url: publicUrl })
      .eq('id', academy.id)
      .select()
      .single();
    if (logoError) throw logoError;
    return { ...data, academy: updatedAcademy };
  }

  return { ...data, academy };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, academy: null };

  const { data: academy } = await supabase
    .from('academies')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  return { user, academy };
}
