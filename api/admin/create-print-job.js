import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { orderId } = req.body;
  if (!orderId) return res.status(400).json({ error: 'orderId required' });

  const { data: items } = await supabase
    .from('order_items')
    .select('*, player_cards(*, players(*), card_templates(*))')
    .eq('order_id', orderId);

  const manifest = {
    orderId,
    generatedAt: new Date().toISOString(),
    cards: (items || []).map((item) => ({
      playerName: item.player_cards?.players?.name,
      templateName: item.player_cards?.card_templates?.name,
      previewUrl: item.player_cards?.preview_url,
      quantity: item.quantity,
    })),
  };

  const manifestBlob = Buffer.from(JSON.stringify(manifest, null, 2));
  const path = `${orderId}/manifest.json`;

  await supabase.storage.from('print-files').upload(path, manifestBlob, {
    contentType: 'application/json', upsert: true,
  });

  const { data: { publicUrl } } = supabase.storage.from('print-files').getPublicUrl(path);

  const { error } = await supabase.from('print_jobs').insert({
    order_id: orderId,
    status: 'queued',
    print_file_url: publicUrl,
    dispatched_at: new Date().toISOString(),
  });

  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('orders').update({ status: 'printing' }).eq('id', orderId);

  return res.status(200).json({ success: true, manifestUrl: publicUrl });
}
