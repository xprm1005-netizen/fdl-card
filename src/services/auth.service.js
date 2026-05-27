import { supabase } from '../lib/supabase';

const ERROR_MAP = {
  'User already registered': '이미 등록된 이메일입니다. 로그인 페이지를 이용해주세요.',
  'Invalid login credentials': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Email not confirmed': '이메일 인증이 필요합니다. 받은편지함을 확인해주세요.',
  'Invalid email or password': '이메일 또는 비밀번호가 올바르지 않습니다.',
  'Password should be at least 6 characters': '비밀번호는 6자 이상이어야 합니다.',
  'Unable to validate email address: invalid format': '올바른 이메일 형식이 아닙니다.',
};

function toKorean(error) {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  return ERROR_MAP[error.message] || error.message;
}

export async function signUp({ email, password, academyName, primaryColor, logoFile }) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(toKorean(error));

  if (!data.user) {
    throw new Error('이메일 인증 링크를 발송했습니다. 받은편지함을 확인하고 링크를 클릭한 뒤 다시 로그인해주세요.');
  }

  // 이미 아카데미가 있으면 그대로 반환 (재시도 케이스)
  const { data: existing } = await supabase
    .from('academies')
    .select('*')
    .eq('owner_id', data.user.id)
    .maybeSingle();
  if (existing) return { ...data, academy: existing };

  const { data: academy, error: academyError } = await supabase
    .from('academies')
    .insert({ name: academyName, primary_color: primaryColor || '#FFD700', owner_id: data.user.id })
    .select()
    .single();
  if (academyError) throw new Error(toKorean(academyError));

  if (logoFile && academy?.id) {
    try {
      const ext = logoFile.name.split('.').pop();
      const path = `academy-logos/${academy.id}.${ext}`;
      await supabase.storage.from('card-previews').upload(path, logoFile, { upsert: true });
      const { data: { publicUrl } } = supabase.storage.from('card-previews').getPublicUrl(path);
      const { data: updated } = await supabase
        .from('academies')
        .update({ logo_url: publicUrl })
        .eq('id', academy.id)
        .select()
        .single();
      if (updated) return { ...data, academy: updated };
    } catch {
      // 로고 업로드 실패는 치명적이지 않으므로 계속 진행
    }
  }

  return { ...data, academy };
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(toKorean(error));
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function loadCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { user: null, academy: null };

    const { data: academy } = await supabase
      .from('academies')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle();

    return { user, academy };
  } catch {
    return { user: null, academy: null };
  }
}
