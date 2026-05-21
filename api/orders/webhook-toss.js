import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const event = req.body;

  if (event.eventType === 'DEPOSIT_CALLBACK') {
    const { orderId, status } = event.data;
    if (status === 'DONE') {
      await supabase.from('orders').update({ status: 'paid' }).eq('id', orderId);
    }
  }

  return res.status(200).json({ received: true });
}
