import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import CardPreview from '../../components/card/CardPreview';
import StatSlider from '../../components/ui/StatSlider';
import Btn from '../../components/ui/Btn';
import { C, ff, radius } from '../../tokens';
import { calcOverall } from '../../lib/utils';

const W = 420, H = 560;

const TEMPLATES = [
  { id: 'fdl1', slug: 'fdl1', name: 'FDL No.1', is_premium: false, price: 0, config: { width: W, height: H } },
  { id: 'fdl2', slug: 'fdl2', name: 'FDL No.2', is_premium: false, price: 0, config: { width: W, height: H } },
  { id: 'fdl3', slug: 'fdl3', name: 'FDL No.3', is_premium: false, price: 0, config: { width: W, height: H } },
  { id: 'fdl4', slug: 'fdl4', name: 'FDL No.4', is_premium: false, price: 0, config: { width: W, height: H } },
];

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST'];

const STAT_KEYS   = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
const STAT_LABELS = { pac: '스피드', dri: '드리블', phy: '피지컬', acc: '정확도', tac: '전술이해', psy: '멘탈' };

const DEFAULT_FORM  = { name: '김민준', position: 'ST', age: 10, club: 'FDL FC' };
const DEFAULT_STATS = { pac: 80, dri: 75, phy: 72, acc: 78, tac: 68, psy: 70 };

function getOvrColor(val) {
  if (val >= 85) return '#00E676';
  if (val >= 70) return '#FFD700';
  if (val >= 55) return '#FF9800';
  return '#FF5252';
}

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
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [form, setForm]         = useState(DEFAULT_FORM);
  const [stats, setStats]       = useState(DEFAULT_STATS);

  const ovr = calcOverall(stats);
  const ovrColor = getOvrColor(ovr);

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function setStat(key, val) {
    setStats((s) => ({ ...s, [key]: val }));
  }

  const player  = { name: form.name, position: form.position, age: form.age };
  const academy = { name: form.club };

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
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 800 }}>
          ⚽ FDL CARD — 데모
        </div>
        <div style={{ width: 60 }} />
      </nav>

      {/* 본문 */}
      <div style={{
        paddingTop: 68, paddingBottom: 60,
        maxWidth: 960, margin: '0 auto', padding: '68px 20px 60px',
      }}>
        <div style={{
          display: 'flex', gap: 40, alignItems: 'flex-start',
          flexWrap: 'wrap', justifyContent: 'center',
        }}>

          {/* ── 왼쪽: 카드 미리보기 ── */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 10, color: C.sub, letterSpacing: 2 }}>실시간 미리보기</div>

            <CardPreview
              template={template}
              player={player}
              stats={stats}
              academy={academy}
              scale={0.65}
            />

            {/* OVR 배지 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.lg, padding: '10px 20px',
            }}>
              <span style={{ fontSize: 11, color: C.sub, letterSpacing: 1 }}>OVR</span>
              <span style={{ fontSize: 40, fontWeight: 900, color: ovrColor, lineHeight: 1, fontFamily: ff.display }}>
                {ovr}
              </span>
            </div>
          </div>

          {/* ── 오른쪽: 편집 패널 ── */}
          <div style={{ flex: 1, minWidth: 290, maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* 템플릿 선택 */}
            <section>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>템플릿</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {TEMPLATES.map((t) => {
                  const isActive = template.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t)}
                      style={{
                        background: isActive ? '#ffffff18' : C.card,
                        border: `2px solid ${isActive ? '#06f185' : C.border}`,
                        borderRadius: radius.md,
                        padding: 0, cursor: 'pointer',
                        overflow: 'hidden', transition: 'all 0.15s',
                      }}
                    >
                      <img
                        src={`/thumbnails/${t.slug}.png`}
                        alt={t.name}
                        style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{
                        padding: '4px 0',
                        fontSize: 10, fontWeight: 700,
                        color: isActive ? '#06f185' : C.sub,
                        textAlign: 'center',
                      }}>
                        {t.name}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* 선수 정보 */}
            <section>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>선수 정보</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* 이름 */}
                <div>
                  <label style={labelStyle}>이름</label>
                  <input
                    style={inputStyle}
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    placeholder="선수 이름"
                    maxLength={16}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  {/* 포지션 */}
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>포지션</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      value={form.position}
                      onChange={(e) => setField('position', e.target.value)}
                    >
                      {POSITIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* 나이 */}
                  <div style={{ width: 80 }}>
                    <label style={labelStyle}>나이</label>
                    <input
                      style={inputStyle}
                      type="number"
                      min={5} max={19}
                      value={form.age}
                      onChange={(e) => setField('age', Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* 아카데미 */}
                <div>
                  <label style={labelStyle}>아카데미</label>
                  <input
                    style={inputStyle}
                    value={form.club}
                    onChange={(e) => setField('club', e.target.value)}
                    placeholder="아카데미 이름"
                    maxLength={20}
                  />
                </div>
              </div>
            </section>

            {/* 능력치 슬라이더 */}
            <section>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 12 }}>능력치</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {STAT_KEYS.map((key) => (
                  <StatSlider
                    key={key}
                    statKey={key}
                    label={STAT_LABELS[key]}
                    value={stats[key] ?? 70}
                    onChange={(val) => setStat(key, val)}
                  />
                ))}
              </div>
            </section>

            {/* CTA */}
            <section style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.xl, padding: 20,
            }}>
              <div style={{ fontSize: 12, color: C.sub, letterSpacing: 1, marginBottom: 12 }}>
                셀프 서비스 가격
              </div>
              {[
                { qty: '1장',  price: '6,900원' },
                { qty: '5장',  price: '24,900원', badge: '인기' },
                { qty: '11장', price: '49,900원', badge: 'BEST' },
                { qty: '20장', price: '89,000원', badge: '최저가' },
              ].map((p) => (
                <div key={p.qty} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '7px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{p.qty}</span>
                    {p.badge && (
                      <span style={{
                        fontSize: 9, color: C.gold,
                        border: `1px solid ${C.gold}55`,
                        padding: '1px 6px', borderRadius: 10, letterSpacing: 1,
                      }}>
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>{p.price}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <Btn style={{ width: '100%' }} onClick={() => navigate('/signup')}>
                  회원가입 후 주문하기
                </Btn>
              </div>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  onClick={() => navigate('/pricing')}
                  style={{
                    background: 'none', border: 'none', color: C.gold,
                    fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  원스톱 패키지 가격 보기 →
                </button>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
