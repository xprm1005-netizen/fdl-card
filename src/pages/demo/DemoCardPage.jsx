import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SvgCardFront from '../../components/card/SvgCardFront';
import SvgCardBack from '../../components/card/SvgCardBack';
import StatSlider from '../../components/ui/StatSlider';
import Btn from '../../components/ui/Btn';
import { C, ff, radius } from '../../tokens';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST'];
const STAT_KEYS   = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
const STAT_LABELS = { pac: '스피드', dri: '드리블', phy: '피지컬', acc: '정확도', tac: '전술이해', psy: '멘탈' };
const LABEL_PRESETS = ['SPEED KING', 'GOAL MACHINE', 'PLAYMAKER', 'IRON WALL', 'DRIBBLE KING', 'FINISHER', 'ASSIST KING', 'GUARDIAN', 'TEAM PLAYER', 'ROCKET SHOT', 'DIRECT KICK'];

const DEFAULT_FORM  = { name: '김성현', position: 'ST', age: '10', club: 'FDL FC', height: '165', weight: '58', cardLabel: 'SPEED KING' };

const BG_OPTIONS = [
  { id: 'stadium', label: '⚽ 잔디',  color: '#0d2015' },
  { id: 'night',   label: '🌙 야간',  color: '#040d1f' },
  { id: 'fire',    label: '🔥 열정',  color: '#2a0906' },
  { id: 'speed',   label: '⚡ 스피드', color: '#020a18' },
];
const DEFAULT_STATS = { pac: 80, dri: 75, phy: 72, acc: 78, tac: 68, psy: 70 };

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: C.card, border: `1px solid ${C.border}`,
  borderRadius: radius.md, padding: '9px 12px',
  color: C.white, fontSize: 14, fontFamily: 'inherit',
  outline: 'none',
};
const labelStyle = {
  display: 'block', fontSize: 11, color: C.sub,
  letterSpacing: 1, fontWeight: 600, marginBottom: 5,
  textTransform: 'uppercase',
};

export default function DemoCardPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState(DEFAULT_FORM);
  const [stats, setStats]   = useState(DEFAULT_STATS);
  const [showBack, setShowBack] = useState(false);
  const [bgStyle, setBgStyle] = useState('stadium');

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })); }
  function setStat(key, val)  { setStats((s) => ({ ...s, [key]: val })); }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>

      {/* 네비 */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 20px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.bg}ee`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', color: C.sub, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'inherit',
        }}>
          <ChevronLeft size={15} /> 홈
        </button>
        <div style={{ fontSize: 11, color: '#29ED73', letterSpacing: 3, fontWeight: 800 }}>
          ⚽ FDL CARD — 데모
        </div>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ paddingTop: 68, paddingBottom: 60, maxWidth: 960, margin: '0 auto', padding: '68px 20px 60px' }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>

          {/* ── 왼쪽: 카드 미리보기 ── */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 10, color: C.sub, letterSpacing: 2 }}>실시간 미리보기</div>

            {/* 앞/뒷면 토글 */}
            <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 3, gap: 2 }}>
              {['앞면', '뒷면'].map((label, i) => (
                <button key={label} onClick={() => setShowBack(i === 1)}
                  style={{
                    background: showBack === (i === 1) ? '#29ED73' : 'transparent',
                    color: showBack === (i === 1) ? '#0a0a0a' : C.sub,
                    border: 'none', borderRadius: 16, padding: '5px 18px',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {showBack ? (
              <SvgCardBack
                position={form.position}
                pac={stats.pac} dri={stats.dri} phy={stats.phy}
                acc={stats.acc} tac={stats.tac} psy={stats.psy}
                height={form.height}
                weight={form.weight}
                scale={0.65}
              />
            ) : (
              <>
                <SvgCardFront
                  cardType="THE"
                  cardLabel={form.cardLabel}
                  position={form.position}
                  playerName={form.name}
                  academyName={form.club}
                  age={form.age}
                  height={form.height}
                  weight={form.weight}
                  pac={stats.pac} dri={stats.dri} phy={stats.phy}
                  acc={stats.acc} tac={stats.tac} psy={stats.psy}
                  bgStyle={bgStyle}
                  scale={0.65}
                />

                {/* 배경 선택 */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {BG_OPTIONS.map(({ id, label, color }) => (
                    <button key={id} onClick={() => setBgStyle(id)}
                      style={{
                        background: color,
                        border: bgStyle === id ? '2px solid #29ED73' : `2px solid ${C.border}`,
                        borderRadius: 8, padding: '6px 10px',
                        color: bgStyle === id ? '#29ED73' : C.sub,
                        fontSize: 11, fontWeight: 700, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

          </div>

          {/* ── 오른쪽: 편집 패널 ── */}
          <div style={{ flex: 1, minWidth: 290, maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 선수 정보 */}
            <section>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>선수 정보</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label style={labelStyle}>카드 라벨</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.cardLabel} onChange={(e) => setField('cardLabel', e.target.value)}>
                    {LABEL_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>이름</label>
                  <input style={inputStyle} value={form.name} onChange={(e) => setField('name', e.target.value)} placeholder="선수 이름" maxLength={16} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>포지션</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.position} onChange={(e) => setField('position', e.target.value)}>
                      {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div style={{ width: 80 }}>
                    <label style={labelStyle}>나이</label>
                    <input style={inputStyle} type="number" min={5} max={19} value={form.age} onChange={(e) => setField('age', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>아카데미</label>
                    <input style={inputStyle} value={form.club} onChange={(e) => setField('club', e.target.value)} placeholder="아카데미" maxLength={20} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>키 (cm)</label>
                    <input style={inputStyle} type="number" value={form.height} onChange={(e) => setField('height', e.target.value)} placeholder="165" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>몸무게 (kg)</label>
                    <input style={inputStyle} type="number" value={form.weight} onChange={(e) => setField('weight', e.target.value)} placeholder="58" />
                  </div>
                </div>
              </div>
            </section>

            {/* 능력치 슬라이더 */}
            <section>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 12 }}>능력치</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {STAT_KEYS.map((key) => (
                  <StatSlider key={key} statKey={key} label={STAT_LABELS[key]} value={stats[key] ?? 70} onChange={(val) => setStat(key, val)} />
                ))}
              </div>
            </section>

            {/* CTA */}
            <section>
              <Btn style={{ width: '100%' }} onClick={() => navigate('/signup')}>
                회원가입 후 주문하기
              </Btn>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
