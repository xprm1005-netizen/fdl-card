import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fdl.com';

  if (user.email !== adminEmail) {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, academy_id, status')
      .eq('id', orderId)
      .single();

    if (orderError || !order) return res.status(404).json({ error: 'Order not found' });

    if (!['pending', 'cancelled'].includes(order.status)) {
      return res.status(403).json({ error: '결제 진행 중인 주문은 삭제할 수 없습니다.' });
    }

    const { data: academy } = await supabase
      .from('academies')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!academy || academy.id !== order.academy_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  const { error: e1 } = await supabase.from('order_items').delete().eq('order_id', orderId);
  if (e1) return res.status(500).json({ error: e1.message });

  const { error: e2 } = await supabase.from('payments').delete().eq('order_id', orderId);
  if (e2) return res.status(500).json({ error: e2.message });

  const { error: e3 } = await supabase.from('print_jobs').delete().eq('order_id', orderId);
  if (e3) return res.status(500).json({ error: e3.message });

  const { error: e4 } = await supabase.from('orders').delete().eq('id', orderId);
  if (e4) return res.status(500).json({ error: e4.message });

  return res.status(200).json({ success: true });
}
