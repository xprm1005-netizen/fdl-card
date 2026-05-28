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
import { supabase } from '../../lib/supabase';
import { createPlayer, uploadPlayerPhoto } from '../../services/players.service';

const POSITIONS = ['GK','CB','LB','RB','CDM','CM','CAM','LW','RW','CF','ST'];

// Revised Romanization of Korean
const CHO  = ['k','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
const JONG = ['','k','k','k','n','n','n','t','l','k','m','p','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t'];

function romanizeHangul(str) {
  let result = '';
  for (const ch of str) {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const offset = code - 0xAC00;
      const cho  = Math.floor(offset / (21 * 28));
      const jung = Math.floor((offset % (21 * 28)) / 28);
      const jong = offset % 28;
      result += CHO[cho] + JUNG[jung] + JONG[jong];
    } else if ((code >= 0x41 && code <= 0x5A) || (code >= 0x61 && code <= 0x7A)) {
      result += ch;
    } else if (ch === ' ') {
      result += ' ';
    }
  }
  return result.toUpperCase();
}

export default function PlayerNewPage() {
  const { academy } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', nameEn: '', position: 'ST', jerseyNumber: '', age: '' });
  const [nameEnManual, setNameEnManual] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [bgStatus, setBgStatus] = useState('none');
  const [playerId, setPlayerId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [bgRemoving, setBgRemoving] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function handleNameChange(e) {
    const val = e.target.value;
    set('name', val);
    if (!nameEnManual) {
      set('nameEn', romanizeHangul(val));
    }
  }

  function handleNameEnChange(e) {
    setNameEnManual(true);
    set('nameEn', e.target.value);
  }

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
        nameEn: form.nameEn || undefined,
        position: form.position,
        jerseyNumber: Number(form.jerseyNumber),
        age: form.age ? Number(form.age) : null,
      });
      setPlayerId(player.id);

      if (photoFile) {
        await uploadPlayerPhoto(player.id, photoFile);
        await handleRemoveBg(player.id);
      } else {
        navigate(`/players/${player.id}`);
      }
    } catch (err) {
      setError(err.message || '저장 중 오류가 발생했습니다.');
      setSaving(false);
    }
  }

  async function handleRemoveBg(pid) {
    setBgRemoving(true);
    setBgStatus('processing');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/remove-bg`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ playerId: pid }),
        }
      );
      if (res.ok) {
        setBgStatus('done');
      } else {
        setBgStatus('failed');
      }
    } catch {
      setBgStatus('failed');
    } finally {
      setBgRemoving(false);
      navigate(`/players/${pid}`);
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

          <Input
            label="선수 이름 *"
            placeholder="홍길동"
            value={form.name}
            onChange={handleNameChange}
          />

          <Input
            label="영문 이름 (카드에 표시)"
            placeholder="HONG GIL DONG"
            value={form.nameEn}
            onChange={handleNameEnChange}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
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
            <Input
              label="나이"
              type="number"
              min={4} max={30}
              placeholder="10"
              value={form.age}
              onChange={(e) => set('age', e.target.value)}
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
