import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.REMOVEBG_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'REMOVEBG_API_KEY not configured' });

  const { playerId, imageBase64 } = req.body;
  if (!playerId || !imageBase64) return res.status(400).json({ error: 'playerId and imageBase64 required' });

  await supabase.from('players').update({ bg_removal_status: 'processing' }).eq('id', playerId);

  try {
    const bgRes = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: imageBase64,
        size: 'auto',
        format: 'png',
      }),
    });

    if (!bgRes.ok) {
      const err = await bgRes.text();
      await supabase.from('players').update({ bg_removal_status: 'failed' }).eq('id', playerId);
      return res.status(400).json({ error: `remove.bg error: ${err}` });
    }

    const buffer = Buffer.from(await bgRes.arrayBuffer());
    const path = `${playerId}/bg-removed.png`;

    const { error: uploadError } = await supabase.storage
      .from('player-photos')
      .upload(path, buffer, { contentType: 'image/png', upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('player-photos').getPublicUrl(path);

    await supabase.from('players').update({
      photo_bg_removed_url: publicUrl,
      bg_removal_status: 'done',
    }).eq('id', playerId);

    return res.status(200).json({ url: publicUrl });
  } catch (err) {
    await supabase.from('players').update({ bg_removal_status: 'failed' }).eq('id', playerId);
    return res.status(500).json({ error: err.message });
  }
}
