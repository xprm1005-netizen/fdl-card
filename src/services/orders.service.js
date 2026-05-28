import { supabase } from '../lib/supabase';

export async function getOrders(academyId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, player_cards(*, players(*), card_templates(*)))')
    .eq('academy_id', academyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, player_cards(*, players(*), card_templates(*))), payments(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createOrder({ academyId, cartItems, shipping }) {
  const res = await fetch('/api/orders/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ academyId, cartItems, shipping }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function cancelOrder(id) {
  const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id);
  if (error) throw error;
}

export async function deleteOrder(id) {
  // Delete child records first
  const { error: itemsError } = await supabase.from('order_items').delete().eq('order_id', id);
  if (itemsError) throw itemsError;

  const { error: paymentsError } = await supabase.from('payments').delete().eq('order_id', id);
  if (paymentsError) throw paymentsError;

  const { error: jobsError } = await supabase.from('print_jobs').delete().eq('order_id', id);
  if (jobsError) throw jobsError;

  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
}

export async function confirmPayment({ paymentKey, orderId, amount }) {
  const res = await fetch('/api/orders/confirm-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
