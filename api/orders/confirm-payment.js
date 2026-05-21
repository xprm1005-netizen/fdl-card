import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { paymentKey, orderId, amount } = req.body;
  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ error: 'paymentKey, orderId, amount required' });
  }

  const { data: order, error: orderFetchError } = await supabase
    .from('orders').select('*').eq('id', orderId).single();

  if (orderFetchError || !order) return res.status(404).json({ error: 'Order not found' });
  if (order.total_amount !== amount) return res.status(400).json({ error: 'Amount mismatch' });
  if (order.status !== 'pending') return res.status(400).json({ error: 'Order already processed' });

  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) return res.status(500).json({ error: 'TOSS_SECRET_KEY not configured' });

  const encoded = Buffer.from(secretKey + ':').toString('base64');
  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  const tossData = await tossRes.json();

  if (!tossRes.ok) {
    return res.status(400).json({ error: tossData.message || 'Toss payment confirm failed' });
  }

  await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);

  await supabase.from('payments').insert({
    order_id: orderId,
    payment_key: paymentKey,
    payment_type: tossData.type,
    method: tossData.method,
    amount,
    status: 'done',
    approved_at: tossData.approvedAt,
    raw_response: tossData,
  });

  return res.status(200).json({ orderNumber: order.order_number });
}
