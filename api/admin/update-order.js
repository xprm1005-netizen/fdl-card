import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@fdl.com';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { status } = req.query;
    let q = supabase.from('orders').select('*, academies(name), order_items(count)').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data, error } = await q;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization?.replace('Bearer ', ''));
  if (!user || user.email !== ADMIN_EMAIL) return res.status(403).json({ error: 'Forbidden' });

  const { orderId, status } = req.body;
  if (!orderId || !status) return res.status(400).json({ error: 'orderId and status required' });

  const updates = { status };
  if (status === 'shipped') updates.shipped_at = new Date().toISOString();
  if (status === 'delivered') updates.delivered_at = new Date().toISOString();

  const { error } = await supabase.from('orders').update(updates).eq('id', orderId);
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
