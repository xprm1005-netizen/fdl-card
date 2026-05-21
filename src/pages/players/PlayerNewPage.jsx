import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Input, { Select } from '../../components/ui/Input';
import PhotoUploader from '../../components/player/PhotoUploader';
import BgRemovalStatus from '../../components/player/BgRemovalStatus';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { createPlayer, uploadPlayerPhoto } from '../../services/players.service';
import { supabase } from '../../lib/supabase';

const POSITIONS = ['GK','CB','LB','RB','CDM','CM','CAM','LW','RW','CF','ST'];

export default function PlayerNewPage() {
  const { academy } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', position: 'ST', jerseyNumber: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [bgStatus, setBgStatus] = useState('none');
  const [playerId, setPlayerId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [bgRemoving, setBgRemoving] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handlePhoto(file) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.name.trim()) { setError('선수 이름을 입력하세요.'); return; }
    if (!form.jerseyNumber) { setError('등번호를 입력하세요.'); return; }
    setError('');
    setSaving(true);
    try {
      const player = await createPlayer({
        academyId: academy.id,
        name: form.name,
        position: form.position,
        jerseyNumber: Number(form.jerseyNumber),
      });
      setPlayerId(player.id);

      if (photoFile) {
        await uploadPlayerPhoto(player.id, photoFile);
        await handleRemoveBg(player.id, photoFile);
      } else {
        navigate(`/players/${player.id}`);
      }
    } catch (err) {
      setError(err.message || '저장 중 오류가 발생했습니다.');
      setSaving(false);
    }
  }

  async function handleRemoveBg(pid, file) {
    setBgRemoving(true);
    setBgStatus('processing');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result.split(',')[1];
        const res = await fetch('/api/players/remove-bg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: pid, imageBase64: base64 }),
        });
        if (res.ok) {
          setBgStatus('done');
          navigate(`/players/${pid}`);
        } else {
          setBgStatus('failed');
          navigate(`/players/${pid}`);
        }
        setBgRemoving(false);
      };
    } catch {
      setBgStatus('failed');
      setBgRemoving(false);
      navigate(`/players/${playerId || pid}`);
    }
  }

  return (
    <AppShell>
      <Topbar title="선수 등록" back />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Photo */}
          <div>
            <div style={{ fontSize: 14, color: C.sub, marginBottom: 12, fontWeight: 500 }}>선수 사진</div>
            <PhotoUploader onFile={handlePhoto} preview={photoPreview} />
            {bgStatus !== 'none' && (
              <div style={{ marginTop: 8 }}>
                <BgRemovalStatus status={bgStatus} />
              </div>
            )}
          </div>

          <Input label="선수 이름 *" placeholder="홍길동" value={form.name} onChange={(e) => set('name', e.target.value)} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Select label="포지션 *" value={form.position} onChange={(e) => set('position', e.target.value)}>
              {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Input
              label="등번호 *"
              type="number"
              min={1} max={99}
              placeholder="10"
              value={form.jerseyNumber}
              onChange={(e) => set('jerseyNumber', e.target.value)}
            />
          </div>

          {error && (
            <div style={{ background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: radius.md, padding: '10px 14px', fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}

          {bgRemoving && (
            <div style={{ background: C.goldSoft, border: `1px solid ${C.goldMed}`, borderRadius: radius.md, padding: '12px 16px', fontSize: 13, color: C.gold }}>
              🎨 AI로 누끼 작업 중입니다... 잠시만 기다려주세요
            </div>
          )}

          <div style={{ display: 'flex', gap: 12 }}>
            <Btn type="button" variant="ghost" onClick={() => navigate('/players')} style={{ flex: 1 }}>취소</Btn>
            <Btn type="submit" loading={saving || bgRemoving} style={{ flex: 2 }}>
              {photoFile ? '저장 및 누끼 처리' : '저장'}
            </Btn>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
