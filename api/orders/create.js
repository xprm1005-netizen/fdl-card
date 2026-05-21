import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { academyId, cartItems, shipping } = req.body;
  if (!academyId || !cartItems?.length || !shipping) {
    return res.status(400).json({ error: 'academyId, cartItems, shipping required' });
  }

  const totalAmount = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const { data: order, error: orderError } = await supabase.from('orders').insert({
    academy_id: academyId,
    status: 'pending',
    total_amount: totalAmount,
    shipping_name: shipping.name,
    shipping_phone: shipping.phone,
    shipping_address: shipping.address,
    shipping_address2: shipping.address2 || null,
    shipping_zip: shipping.zip,
  }).select().single();

  if (orderError) return res.status(500).json({ error: orderError.message });

  const itemRows = cartItems.map((i) => ({
    order_id: order.id,
    card_id: i.cardId,
    quantity: i.quantity,
    unit_price: i.unitPrice,
    snapshot: {},
  }));

  const { error: itemError } = await supabase.from('order_items').insert(itemRows);
  if (itemError) {
    await supabase.from('orders').delete().eq('id', order.id);
    return res.status(500).json({ error: itemError.message });
  }

  return res.status(200).json({ orderId: order.id, orderNumber: order.order_number, amount: totalAmount });
}
