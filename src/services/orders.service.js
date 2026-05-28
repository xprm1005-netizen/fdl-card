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
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  const res = await fetch('/api/orders/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ orderId: id }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || '삭제 중 오류가 발생했습니다.');
  }
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
