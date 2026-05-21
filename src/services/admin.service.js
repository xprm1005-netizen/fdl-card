export async function getAllOrders(status) {
  const params = status ? `?status=${status}` : '';
  const res = await fetch(`/api/admin/orders${params}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch('/api/admin/update-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, status }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createPrintJob(orderId) {
  const res = await fetch('/api/admin/create-print-job', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function assignShipping(orderId, carrier, trackingNumber) {
  const res = await fetch('/api/admin/shipping', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, carrier, trackingNumber }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
