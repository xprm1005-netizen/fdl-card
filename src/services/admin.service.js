import { supabase } from '../lib/supabase';

async function authHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch('/api/admin/update-order', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ orderId, status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createPrintJob(orderId) {
  const res = await fetch('/api/admin/create-print-job', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function assignShipping(orderId, carrier, trackingNumber) {
  const res = await fetch('/api/admin/shipping', {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ orderId, carrier, trackingNumber }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
