import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import CardCanvas from '../../components/card/CardCanvas';
import CardBack from '../../components/card/CardBack';
import TemplateSelector from '../../components/card/TemplateSelector';
import StatsInputPanel from '../../components/card/StatsInputPanel';
import Btn from '../../components/ui/Btn';
import { C, ff, radius } from '../../tokens';

const CARD_W = 400;
const CARD_H = 560;

const TEMPLATES = [
  {
    id: 'gold',
    slug: 'gold',
    name: 'Gold',
    config: {
      width: CARD_W, height: CARD_H,
      background: { colors: ['#1a1000', '#3d2b00', '#1a1000'] },
      border: { color: '#FFD700', width: 3, glowColor: 'rgba(255,215,0,0.4)', glowBlur: 20 },
      playerPhoto: { x: 60, y: 100, width: 280, height: 290 },
      overall: { x: 28, y: 22, fontSize: 58, fill: '#FFD700' },
      position: { x: 28, y: 90, fontSize: 17, fill: '#FFD700' },
      playerName: { x: CARD_W / 2, y: 410, fontSize: 28, fill: '#FFFFFF', width: 340 },
      teamColorBar: { y: 448, height: 4 },
      stats: { paddingX: 20, y: 462, rowHeight: 22, valueFontSize: 14, valueColor: '#FFD700', labelFontSize: 9, labelColor: '#A0A0A0', cols: 6 },
      watermark: { x: CARD_W / 2, y: 548, fontSize: 8, fill: 'rgba(255,255,255,0.15)' },
    },
  },
  {
    id: 'chrome',
    slug: 'chrome',
    name: 'Chrome',
    config: {
      width: CARD_W, height: CARD_H,
      background: { colors: ['#0d0d0d', '#1e2530', '#0d0d0d'] },
      border: { color: '#B0C4DE', width: 3, glowColor: 'rgba(176,196,222,0.3)', glowBlur: 20 },
      playerPhoto: { x: 60, y: 100, width: 280, height: 290 },
      overall: { x: 28, y: 22, fontSize: 58, fill: '#B0C4DE' },
      position: { x: 28, y: 90, fontSize: 17, fill: '#B0C4DE' },
      playerName: { x: CARD_W / 2, y: 410, fontSize: 28, fill: '#E8EDF2', width: 340 },
      teamColorBar: { y: 448, height: 4 },
      stats: { paddingX: 20, y: 462, rowHeight: 22, valueFontSize: 14, valueColor: '#B0C4DE', labelFontSize: 9, labelColor: '#8898AA', cols: 6 },
      watermark: { x: CARD_W / 2, y: 548, fontSize: 8, fill: 'rgba(255,255,255,0.15)' },
    },
  },
  {
    id: 'legend',
    slug: 'legend',
    name: 'Legend',
    config: {
      width: CARD_W, height: CARD_H,
      background: { colors: ['#0f0015', '#2a003d', '#0f0015'] },
      border: { color: '#E040FB', width: 3, glowColor: 'rgba(224,64,251,0.45)', glowBlur: 28 },
      playerPhoto: { x: 60, y: 100, width: 280, height: 290 },
      overall: { x: 28, y: 22, fontSize: 58, fill: '#E040FB' },
      position: { x: 28, y: 90, fontSize: 17, fill: '#E040FB' },
      playerName: { x: CARD_W / 2, y: 410, fontSize: 28, fill: '#FFFFFF', width: 340 },
      teamColorBar: { y: 448, height: 4 },
      stats: { paddingX: 20, y: 462, rowHeight: 22, valueFontSize: 14, valueColor: '#E040FB', labelFontSize: 9, labelColor: '#CE93D8', cols: 6 },
      watermark: { x: CARD_W / 2, y: 548, fontSize: 8, fill: 'rgba(255,255,255,0.15)' },
    },
  },
];

const MOCK_PLAYER = { name: '김민준', position: 'ST', jersey_number: 10, id: 'demo-001' };
const DEFAULT_STATS = { pac: 80, dri: 75, phy: 72, acc: 78, tac: 68, psy: 70 };
const STEPS = ['템플릿 선택', '능력치 입력', '카드 완성'];

export default function DemoCardPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [showBack, setShowBack] = useState(false);

  const accent = { gold: '#FFD700', chrome: '#B0C4DE', legend: '#E040FB' }[template.slug] || '#FFD700';

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
              <CardBack template={template} player={MOCK_PLAYER} stats={stats} teamColor={accent} scale={0.65} />
            ) : (
              <CardCanvas ref={canvasRef} template={template} player={MOCK_PLAYER} stats={stats} teamColor={accent} scale={0.65} />
            )}
          </div>

          {/* Step content */}
          <div style={{ flex: 1, minWidth: 280, maxWidth: 420 }}>
            {step === 0 && (
              <div>
                <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 800 }}>템플릿 선택</h2>
                <TemplateSelector templates={TEMPLATES} selected={template} onSelect={setTemplate} />
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
