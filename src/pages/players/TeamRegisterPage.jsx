import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, CheckCircle, Plus, Trash2 } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Input from '../../components/ui/Input';
import { C, ff, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { createPlayer } from '../../services/players.service';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST'];
const PRESET_SIZES = [5, 11, 15, 20];

function makePlayer(idx) {
  return { name: '', position: 'ST', jersey_number: String(idx + 1) };
}

export default function TeamRegisterPage() {
  const navigate = useNavigate();
  const { academy } = useAuthStore();

  const [step, setStep] = useState(1); // 1: size, 2: form, 3: done
  const [teamSize, setTeamSize] = useState(null);
  const [customSize, setCustomSize] = useState('');
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registered, setRegistered] = useState([]);

  function handleSelectSize(n) {
    setTeamSize(n);
    setPlayers(Array.from({ length: n }, (_, i) => makePlayer(i)));
  }

  function handleCustomSize() {
    const n = parseInt(customSize);
    if (!n || n < 1 || n > 30) { setError('1~30명 사이로 입력하세요'); return; }
    setError('');
    handleSelectSize(n);
  }

  function updatePlayer(idx, field, value) {
    setPlayers((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p));
  }

  function addRow() {
    setPlayers((prev) => [...prev, makePlayer(prev.length)]);
    setTeamSize((n) => n + 1);
  }

  function removeRow(idx) {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
    setTeamSize((n) => n - 1);
  }

  async function handleSubmit() {
    const invalid = players.findIndex((p) => !p.name.trim() || !p.jersey_number);
    if (invalid >= 0) { setError(`${invalid + 1}번 선수의 이름과 등번호를 입력해주세요`); return; }
    setError('');
    setLoading(true);
    try {
      const results = await Promise.all(
        players.map((p) =>
          createPlayer({
            academyId: academy.id,
            name: p.name.trim(),
            position: p.position,
            jerseyNumber: Number(p.jersey_number),
          })
        )
      );
      setRegistered(results);
      setStep(3);
    } catch (err) {
      setError('등록 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <Topbar title="팀 일괄 등록" back />
      <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto', fontFamily: ff.body }}>

        {/* Step 1: Size selection */}
        {step === 1 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,215,0,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Users size={32} color={C.gold} />
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>팀 인원을 선택하세요</h2>
              <p style={{ margin: 0, color: C.sub, fontSize: 14 }}>선수 이름, 포지션, 등번호를 한 번에 등록합니다</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
              {PRESET_SIZES.map((n) => (
                <button
                  key={n}
                  onClick={() => { handleSelectSize(n); setStep(2); }}
                  style={{
                    background: C.card, border: `2px solid ${C.border}`,
                    borderRadius: radius.xl, padding: '24px 16px',
                    cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = C.gold}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
                >
                  <span style={{ fontSize: 36, fontWeight: 900, color: C.gold, fontFamily: "'Bebas Neue', Impact, sans-serif" }}>{n}명</span>
                  <span style={{ fontSize: 12, color: C.sub }}>
                    {n === 5 ? '미니 팀' : n === 11 ? '정규 팀' : n === 15 ? '확장 스쿼드' : '대형 팀'}
                  </span>
                </button>
              ))}
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: 20 }}>
              <div style={{ fontSize: 13, color: C.sub, marginBottom: 12 }}>직접 입력</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="number"
                  min={1} max={30}
                  value={customSize}
                  onChange={(e) => { setCustomSize(e.target.value); setError(''); }}
                  placeholder="인원 수 (1~30)"
                  style={{
                    flex: 1, background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: radius.md, padding: '10px 14px',
                    color: C.white, fontSize: 15, fontFamily: 'inherit',
                    outline: 'none',
                  }}
                />
                <Btn onClick={() => { handleCustomSize(); if (!error) setStep(2); }}>확인</Btn>
              </div>
              {error && <div style={{ color: '#FF5252', fontSize: 12, marginTop: 8 }}>{error}</div>}
            </div>
          </div>
        )}

        {/* Step 2: Player form */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>선수 정보 입력 ({teamSize}명)</h2>
              <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>← 인원 변경</button>
            </div>

            {/* Column headers */}
            <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr 100px 70px 32px', gap: 8, marginBottom: 8, padding: '0 4px' }}>
              <div style={{ fontSize: 11, color: C.gray }}>#</div>
              <div style={{ fontSize: 11, color: C.gray }}>이름 *</div>
              <div style={{ fontSize: 11, color: C.gray }}>포지션</div>
              <div style={{ fontSize: 11, color: C.gray }}>등번호 *</div>
              <div />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {players.map((p, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '28px 1fr 100px 70px 32px', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 12, color: C.gray, textAlign: 'center' }}>{idx + 1}</div>
                  <input
                    value={p.name}
                    onChange={(e) => updatePlayer(idx, 'name', e.target.value)}
                    placeholder="선수명"
                    style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: radius.md, padding: '9px 12px',
                      color: C.white, fontSize: 14, fontFamily: 'inherit',
                      outline: 'none', width: '100%', boxSizing: 'border-box',
                    }}
                  />
                  <select
                    value={p.position}
                    onChange={(e) => updatePlayer(idx, 'position', e.target.value)}
                    style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: radius.md, padding: '9px 8px',
                      color: C.white, fontSize: 13, fontFamily: 'inherit',
                      outline: 'none', width: '100%',
                    }}
                  >
                    {POSITIONS.map((pos) => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                  <input
                    type="number"
                    min={1} max={99}
                    value={p.jersey_number}
                    onChange={(e) => updatePlayer(idx, 'jersey_number', e.target.value)}
                    placeholder="#"
                    style={{
                      background: C.surface, border: `1px solid ${C.border}`,
                      borderRadius: radius.md, padding: '9px 10px',
                      color: C.white, fontSize: 14, fontFamily: 'inherit',
                      outline: 'none', width: '100%', boxSizing: 'border-box', textAlign: 'center',
                    }}
                  />
                  <button
                    onClick={() => removeRow(idx)}
                    style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              style={{ background: 'none', border: `1px dashed ${C.border}`, borderRadius: radius.md, padding: '10px 16px', color: C.sub, cursor: 'pointer', width: '100%', fontSize: 13, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 20 }}
            >
              <Plus size={14} /> 선수 추가
            </button>

            {error && (
              <div style={{ background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.3)', borderRadius: radius.md, padding: '10px 14px', color: '#FF5252', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <div style={{ background: 'rgba(255,215,0,0.05)', border: `1px solid ${C.goldMed}`, borderRadius: radius.md, padding: '10px 14px', color: C.sub, fontSize: 12, marginBottom: 20 }}>
              💡 스탯(능력치)은 기본값으로 등록되며, 각 선수 카드 생성 시 개별 조정할 수 있습니다.
            </div>

            <Btn fullWidth loading={loading} onClick={handleSubmit}>
              {players.length}명 모두 등록하기 <ChevronRight size={16} />
            </Btn>
          </div>
        )}

        {/* Step 3: Done */}
        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: 'rgba(0,230,118,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle size={36} color="#00E676" />
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>{registered.length}명 등록 완료!</h2>
            <p style={{ color: C.sub, fontSize: 14, marginBottom: 28 }}>이제 각 선수의 카드를 만들어보세요.</p>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: 20, marginBottom: 24, textAlign: 'left' }}>
              {players.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: idx < players.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 13, color: C.sub }}>#{p.jersey_number}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: C.gold, fontWeight: 700 }}>{p.position}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Btn fullWidth onClick={() => navigate('/players')}>선수 목록에서 카드 만들기</Btn>
              <Btn variant="ghost" fullWidth onClick={() => navigate('/dashboard')}>홈으로</Btn>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
