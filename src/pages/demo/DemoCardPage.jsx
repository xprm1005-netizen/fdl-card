import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import CardCanvas from '../../components/card/CardCanvas';
import CardBack from '../../components/card/CardBack';
import TemplateSelector from '../../components/card/TemplateSelector';
import StatsInputPanel from '../../components/card/StatsInputPanel';
import Btn from '../../components/ui/Btn';
import { C, ff, radius } from '../../tokens';

const W = 400;
const H = 560;

function makeBase(slug, colors, borderColor, glowColor, glowBlur, accentColor, labelColor, extra = {}) {
  return {
    id: slug, slug, name: extra.name || slug.charAt(0).toUpperCase() + slug.slice(1),
    is_premium: extra.is_premium || false,
    price: extra.price || 0,
    config: {
      width: W, height: H,
      background: { colors },
      border: { color: borderColor, width: 3, glowColor, glowBlur },
      overall: { x: 20, y: 14, fontSize: 62, fill: accentColor },
      position: { x: 20, y: 80, fontSize: 15, fill: accentColor },
      playerPhoto: { x: 40, y: 105, width: 320, height: 290 },
      playerName: { x: W / 2, y: 398, fontSize: 24, fill: extra.nameFill || '#FFFFFF', width: 340 },
      teamColorBar: { y: 436, height: 9 },
      stats: {
        paddingX: 20, y: 456, rowHeight: 24,
        valueFontSize: 17, valueColor: accentColor,
        labelFontSize: 10, labelColor,
        cols: 6,
      },
      decorations: extra.decorations || [],
    },
  };
}

const TEMPLATES = [
  makeBase(
    'gold',
    ['#071008', '#12351E', '#071008'],
    '#62FF7E', 'rgba(98,255,126,0.42)', 22,
    '#62FF7E', '#31402D',
    {
      decorations: [
        { type: 'rect', x: 210, y: -60, width: 320, height: 150, fill: 'rgba(255,215,0,0.05)', rotation: -32 },
        { type: 'circle', x: 360, y: 500, radius: 80, fill: 'rgba(255,215,0,0.03)' },
      ],
    },
  ),
  makeBase(
    'chrome',
    ['#080c10', '#20282D', '#0a1018'],
    '#DCE7EF', 'rgba(220,231,239,0.3)', 22,
    '#DCE7EF', '#708090',
    {
      nameFill: '#E8EDF2',
      decorations: [
        { type: 'rect', x: 0, y: 145, width: W, height: 1, fill: 'rgba(176,196,222,0.06)' },
        { type: 'rect', x: 0, y: 225, width: W, height: 1, fill: 'rgba(176,196,222,0.05)' },
        { type: 'rect', x: 0, y: 305, width: W, height: 1, fill: 'rgba(176,196,222,0.06)' },
        { type: 'rect', x: 0, y: 385, width: W, height: 1, fill: 'rgba(176,196,222,0.05)' },
      ],
    },
  ),
  makeBase(
    'legend',
    ['#0c0014', '#2A1435', '#0c0014'],
    '#C77DFF', 'rgba(199,125,255,0.48)', 30,
    '#C77DFF', '#CE93D8',
    {
      decorations: [
        { type: 'circle', x: 50, y: 480, radius: 90, fill: 'rgba(224,64,251,0.04)' },
        { type: 'circle', x: 360, y: 460, radius: 70, fill: 'rgba(224,64,251,0.04)' },
      ],
    },
  ),
  makeBase(
    'rising',
    ['#111407', '#2D3F08', '#111407'],
    '#BFFF35', 'rgba(191,255,53,0.62)', 34,
    '#BFFF35', '#CFEF7A',
    {
      name: 'Rising Pro',
      is_premium: true, price: 3900, nameFill: '#F8FFE9',
      decorations: [
        { type: 'rect', x: 140, y: -40, width: 320, height: 180, fill: 'rgba(191,255,53,0.07)', rotation: -35 },
        { type: 'circle', x: 200, y: 295, radius: 200, fill: 'rgba(191,255,53,0.04)' },
      ],
    },
  ),
  makeBase(
    'matchday',
    ['#00110E', '#07372F', '#00110E'],
    '#31E6C5', 'rgba(49,230,197,0.52)', 32,
    '#31E6C5', '#83F3DD',
    {
      name: 'Match Day',
      is_premium: true, price: 3900,
      nameFill: '#E8FFF9',
      decorations: [
        { type: 'rect', x: 0, y: 130, width: W, height: 2, fill: 'rgba(49,230,197,0.08)' },
        { type: 'rect', x: 0, y: 300, width: W, height: 2, fill: 'rgba(49,230,197,0.08)' },
        { type: 'rect', x: 310, y: -30, width: 110, height: 90, fill: 'rgba(49,230,197,0.05)', rotation: -48 },
      ],
    },
  ),
];

const MOCK_PLAYER = { name: '김민준', position: 'ST', jersey_number: 10, age: 10, id: 'demo-001' };
const MOCK_ACADEMY = { name: 'FDL FC', logo_url: null };
const DEFAULT_STATS = { pac: 80, dri: 75, phy: 72, acc: 78, tac: 68, psy: 70 };
const STEPS = ['템플릿 선택', '능력치 입력', '카드 완성'];

const ACCENT_MAP = {
  gold: '#62FF7E', chrome: '#DCE7EF', legend: '#C77DFF',
  rising: '#BFFF35', matchday: '#31E6C5',
};

export default function DemoCardPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [showBack, setShowBack] = useState(false);

  const accent = ACCENT_MAP[template.slug] || '#FFD700';

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 20px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.bg}ee`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontFamily: 'inherit' }}>
          <ChevronLeft size={16} /> 홈
        </button>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 800 }}>⚽ FDL CARD — 데모</div>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ paddingTop: 72, paddingBottom: 60, maxWidth: 900, margin: '0 auto', padding: '72px 20px 60px' }}>
        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 40 }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: i < step ? C.gold : i === step ? `linear-gradient(135deg, ${accent}, ${accent}aa)` : C.card,
                  border: `2px solid ${i <= step ? accent : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  color: i <= step ? (i < step ? C.bg : C.white) : C.gray,
                  transition: 'all 0.3s',
                  boxShadow: i === step ? `0 0 16px ${accent}55` : 'none',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                <div style={{ fontSize: 11, color: i <= step ? C.white : C.gray, whiteSpace: 'nowrap' }}>{label}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 60, height: 2, background: i < step ? accent : C.border, margin: '0 4px', marginBottom: 22, transition: 'background 0.3s' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Live card preview */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ fontSize: 11, color: C.sub, letterSpacing: 2 }}>실시간 미리보기</div>
              <button
                onClick={() => setShowBack((b) => !b)}
                style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 10px', color: C.sub, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <RotateCcw size={11} /> {showBack ? '앞면' : '뒷면'}
              </button>
            </div>
            {showBack ? (
              <CardBack template={template} player={MOCK_PLAYER} stats={stats} academy={MOCK_ACADEMY} teamColor={accent} scale={0.65} />
            ) : (
              <CardCanvas ref={canvasRef} template={template} player={MOCK_PLAYER} stats={stats} academy={MOCK_ACADEMY} teamColor={accent} scale={0.65} />
            )}
          </div>

          {/* Step content */}
          <div style={{ flex: 1, minWidth: 280, maxWidth: 420 }}>
            {step === 0 && (
              <div>
                <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800 }}>템플릿 선택</h2>
                <TemplateSelector
                  templates={TEMPLATES}
                  selected={template}
                  onSelect={setTemplate}
                  onPremiumClick={(t) => alert(`🔒 ${t.name} 프리미엄 템플릿 (${t.price?.toLocaleString()}원)\n회원가입 후 구매할 수 있습니다.`)}
                />
                <div style={{ marginTop: 24 }}>
                  <Btn style={{ width: '100%' }} onClick={() => setStep(1)}>
                    다음 — 능력치 입력 <ChevronRight size={16} />
                  </Btn>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800 }}>능력치 입력</h2>
                <StatsInputPanel stats={stats} onChange={setStats} />
                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                  <Btn variant="ghost" onClick={() => setStep(0)} style={{ flex: 1 }}><ChevronLeft size={16} /> 이전</Btn>
                  <Btn onClick={() => setStep(2)} style={{ flex: 2 }}>완성 확인 <ChevronRight size={16} /></Btn>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>카드 완성!</h2>
                <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>앞면·뒷면 버튼으로 카드를 확인해보세요. 실제 서비스에서 주문 시 7영업일 이내 실물 배송됩니다.</p>

                {/* Pricing summary */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: C.sub, letterSpacing: 1, marginBottom: 12 }}>셀프 서비스 가격</div>
                  {[{ qty: '1장', price: '6,900원' }, { qty: '5장', price: '24,900원', badge: '인기' }, { qty: '11장', price: '49,900원', badge: 'BEST' }, { qty: '20장', price: '89,000원', badge: '최저가' }].map((p) => (
                    <div key={p.qty} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{p.qty}</span>
                        {p.badge && <span style={{ fontSize: 9, color: C.gold, border: `1px solid ${C.goldMed}`, padding: '1px 6px', borderRadius: 10, letterSpacing: 1 }}>{p.badge}</span>}
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 800, color: C.gold }}>{p.price}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}><ChevronLeft size={16} /> 수정</Btn>
                  <Btn onClick={() => navigate('/signup')} style={{ flex: 2 }}>회원가입 후 주문하기</Btn>
                </div>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                  <button onClick={() => navigate('/pricing')} style={{ background: 'none', border: 'none', color: C.gold, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
                    원스톱 패키지 가격 보기 →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
