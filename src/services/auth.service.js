import { supabase } from '../lib/supabase';

export async function signUp({ email, password, academyName, primaryColor }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;

  const { error: academyError } = await supabase.from('academies').insert({
    name: academyName,
    primary_color: primaryColor || '#FFD700',
    owner_id: data.user.id,
  });
  if (academyError) throw academyError;

  return data;
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
