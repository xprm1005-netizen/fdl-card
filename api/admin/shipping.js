import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId, carrier, trackingNumber } = req.body;
  if (!orderId || !carrier || !trackingNumber) {
    return res.status(400).json({ error: 'orderId, carrier, trackingNumber required' });
  }

  const { error } = await supabase.from('orders').update({
    status: 'shipped',
    shipping_carrier: carrier,
    tracking_number: trackingNumber,
    shipped_at: new Date().toISOString(),
  }).eq('id', orderId);

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ success: true });
}
