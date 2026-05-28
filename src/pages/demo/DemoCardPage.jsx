import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw } from 'lucide-react';
import SvgCardFront from '../../components/card/SvgCardFront';
import SvgCardBack from '../../components/card/SvgCardBack';
import StatSlider from '../../components/ui/StatSlider';
import Btn from '../../components/ui/Btn';
import { C, ff, radius } from '../../tokens';
import { calcOverall } from '../../lib/utils';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST'];
const STAT_KEYS   = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
const STAT_LABELS = { pac: '스피드', dri: '드리블', phy: '피지컬', acc: '정확도', tac: '전술이해', psy: '멘탈' };

const DEFAULT_FORM  = { name: '내 선수', position: 'ST', age: '10', club: 'FDL FC', height: '165', weight: '58' };
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

  function setField(key, val) { setForm((f) => ({ ...f, [key]: val })); }
  function setStat(key, val)  { setStats((s) => ({ ...s, [key]: val })); }

  const ovr = calcOverall(stats);

  // cardLabel: first word of name → line2, rest → line3
  const nameWords = (form.name || '').trim().split(/\s+/).filter(Boolean);
  const cardLabel = nameWords.slice(0, 2).join(' ') || '내 선수';

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
              <SvgCardFront
                cardType="THE"
                cardLabel={cardLabel}
                position={form.position}
                playerName={form.name}
                academyName={form.club}
                age={form.age}
                height={form.height}
                weight={form.weight}
                pac={stats.pac} dri={stats.dri} phy={stats.phy}
                acc={stats.acc} tac={stats.tac} psy={stats.psy}
                scale={0.65}
              />
            )}

            {/* OVR 배지 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.lg, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 11, color: C.sub, letterSpacing: 1 }}>OVR</span>
              <span style={{ fontSize: 40, fontWeight: 900, color: '#29ED73', lineHeight: 1 }}>
                {ovr}
              </span>
            </div>
          </div>

          {/* ── 오른쪽: 편집 패널 ── */}
          <div style={{ flex: 1, minWidth: 290, maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 선수 정보 */}
            <section>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>선수 정보</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
            <section style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: 20 }}>
              <div style={{ fontSize: 12, color: C.sub, letterSpacing: 1, marginBottom: 12 }}>셀프 서비스 가격</div>
              {[
                { qty: '1장',  price: '6,900원' },
                { qty: '5장',  price: '24,900원', badge: '인기' },
                { qty: '11장', price: '49,900원', badge: 'BEST' },
                { qty: '20장', price: '89,000원', badge: '최저가' },
              ].map((p) => (
                <div key={p.qty} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{p.qty}</span>
                    {p.badge && <span style={{ fontSize: 9, color: '#29ED73', border: `1px solid #29ED7355`, padding: '1px 6px', borderRadius: 10 }}>{p.badge}</span>}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: '#29ED73' }}>{p.price}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <Btn style={{ width: '100%' }} onClick={() => navigate('/signup')}>
                  회원가입 후 주문하기
                </Btn>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
