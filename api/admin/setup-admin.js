import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SETUP_SECRET = process.env.SETUP_SECRET || 'fdl-setup-2024';
const ADMIN_USER_ID = '8235cd5e-5781-4af4-829a-0886fde1d93e';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (secret !== SETUP_SECRET) return res.status(403).json({ error: 'Forbidden' });

  const email = 'admin@fdl.com';
  const password = 'admin1';

  // Try updating existing user first
  const { data: updated, error: updateError } = await supabase.auth.admin.updateUserById(
    ADMIN_USER_ID,
    { password, email_confirm: true }
  );

  if (!updateError) {
    return res.status(200).json({ action: 'updated', email, id: ADMIN_USER_ID });
  }

  // If update failed, try creating
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError) {
    return res.status(500).json({
      updateError: updateError.message,
      createError: createError.message,
    });
  }

  return res.status(200).json({ action: 'created', email, id: created.user?.id });
}
