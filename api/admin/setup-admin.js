import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const SETUP_SECRET = process.env.SETUP_SECRET || 'fdl-setup-2024';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { secret } = req.body || {};
  if (secret !== SETUP_SECRET) return res.status(403).json({ error: 'Forbidden' });

  const email = 'admin@fdl.com';
  const password = 'admin1';

  // Check if user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return res.status(500).json({ error: listError.message });

  const existing = users.find((u) => u.email === email);

  if (existing) {
    // Update password
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ action: 'updated', email });
  } else {
    // Create user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ action: 'created', email, id: data.user?.id });
  }
}
