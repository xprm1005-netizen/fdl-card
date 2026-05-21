import { useState } from 'react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Input from '../../components/ui/Input';
import PhotoUploader from '../../components/player/PhotoUploader';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

const TEAM_COLORS = ['#FFD700', '#00E5FF', '#E040FB', '#FF5252', '#00E676', '#FF9800', '#FFFFFF', '#2196F3'];

export default function SettingsPage() {
  const { academy, setAcademy } = useAuthStore();
  const [name, setName] = useState(academy?.name || '');
  const [color, setColor] = useState(academy?.primary_color || '#FFD700');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(academy?.logo_url || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      let logoUrl = academy?.logo_url;

      if (logoFile) {
        const path = `${academy.id}/logo.png`;
        await supabase.storage.from('player-photos').upload(path, logoFile, { upsert: true });
        const { data: { publicUrl } } = supabase.storage.from('player-photos').getPublicUrl(path);
        logoUrl = publicUrl;
      }

      const { data } = await supabase.from('academies').update({ name, primary_color: color, logo_url: logoUrl })
        .eq('id', academy.id).select().single();
      setAcademy(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <Topbar title="아카데미 설정" />
      <div style={{ padding: '24px 20px', maxWidth: 500, margin: '0 auto' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ fontSize: 14, color: C.sub, marginBottom: 12, fontWeight: 500 }}>아카데미 로고</div>
            <PhotoUploader
              label="로고 업로드 (정방형 권장)"
              onFile={(f) => { setLogoFile(f); setLogoPreview(URL.createObjectURL(f)); }}
              preview={logoPreview}
            />
          </div>

          <Input
            label="아카데미명"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>팀 대표 컬러</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {TEAM_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: c,
                    border: color === c ? `3px solid ${C.white}` : `2px solid ${C.border}`,
                    cursor: 'pointer',
                    boxShadow: color === c ? `0 0 12px ${c}80` : 'none',
                    transition: 'all 0.15s',
                  }}
                />
              ))}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 36, height: 36, padding: 2, background: C.card, border: `1px solid ${C.border}`, borderRadius: '50%', cursor: 'pointer' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: color }} />
              <span style={{ fontSize: 13, color: C.sub }}>선택된 컬러: <strong style={{ color: C.white }}>{color}</strong></span>
            </div>
          </div>

          {saved && (
            <div style={{ background: C.greenSoft, border: `1px solid ${C.green}40`, borderRadius: radius.md, padding: '10px 14px', fontSize: 13, color: C.green, textAlign: 'center' }}>
              ✓ 저장되었습니다
            </div>
          )}

          <Btn type="submit" fullWidth loading={saving}>저장하기</Btn>
        </form>
      </div>
    </AppShell>
  );
}
