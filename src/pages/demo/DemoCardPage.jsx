import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CardCanvas from '../../components/card/CardCanvas';
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
      background: { colors: ['#3D2B00', '#1A1200', '#0D0900'] },
      border: { color: '#FFD700', width: 3, glowColor: '#FFD700', glowBlur: 30 },
      playerPhoto: { x: 50, y: 80, width: 300, height: 300, shadowColor: '#FFD70060', shadowBlur: 20 },
      overall: { x: 18, y: 36, fontSize: 52, fill: '#FFD700' },
      position: { x: 18, y: 94, fontSize: 18, fill: '#FFD700' },
      playerName: { x: CARD_W / 2, y: 392, fontSize: 32, fill: '#FFD700', width: 360 },
      teamColorBar: { y: 430, height: 4 },
      stats: { paddingX: 20, y: 448, rowHeight: 22, valueFontSize: 22, valueColor: '#FFD700', labelFontSize: 11, labelColor: '#C8A000' },
      watermark: { x: CARD_W / 2, y: 538, fontSize: 9, fill: 'rgba(255,215,0,0.25)' },
    },
  },
  {
    id: 'toty',
    slug: 'toty',
    name: 'TOTY',
    config: {
      width: CARD_W, height: CARD_H,
      background: { colors: ['#001A26', '#000D14', '#000608'] },
      border: { color: '#00E5FF', width: 3, glowColor: '#00E5FF', glowBlur: 35 },
      playerPhoto: { x: 50, y: 80, width: 300, height: 300, shadowColor: '#00E5FF60', shadowBlur: 25 },
      overall: { x: 18, y: 36, fontSize: 52, fill: '#00E5FF' },
      position: { x: 18, y: 94, fontSize: 18, fill: '#00E5FF' },
      playerName: { x: CARD_W / 2, y: 392, fontSize: 32, fill: '#00E5FF', width: 360 },
      teamColorBar: { y: 430, height: 4 },
      stats: { paddingX: 20, y: 448, rowHeight: 22, valueFontSize: 22, valueColor: '#00E5FF', labelFontSize: 11, labelColor: '#0099B0' },
      watermark: { x: CARD_W / 2, y: 538, fontSize: 9, fill: 'rgba(0,229,255,0.25)' },
    },
  },
  {
    id: 'chrome',
    slug: 'chrome',
    name: 'Chrome',
    config: {
      width: CARD_W, height: CARD_H,
      background: { colors: ['#1C2333', '#0D1220', '#070C18'] },
      border: { color: '#B0C4DE', width: 3, glowColor: '#B0C4DE', glowBlur: 20 },
      playerPhoto: { x: 50, y: 80, width: 300, height: 300, shadowColor: '#B0C4DE50', shadowBlur: 15 },
      overall: { x: 18, y: 36, fontSize: 52, fill: '#B0C4DE' },
      position: { x: 18, y: 94, fontSize: 18, fill: '#B0C4DE' },
      playerName: { x: CARD_W / 2, y: 392, fontSize: 32, fill: '#FFFFFF', width: 360 },
      teamColorBar: { y: 430, height: 4 },
      stats: { paddingX: 20, y: 448, rowHeight: 22, valueFontSize: 22, valueColor: '#FFFFFF', labelFontSize: 11, labelColor: '#8A9BB0' },
      watermark: { x: CARD_W / 2, y: 538, fontSize: 9, fill: 'rgba(176,196,222,0.25)' },
    },
  },
  {
    id: 'legend',
    slug: 'legend',
    name: 'Legend',
    config: {
      width: CARD_W, height: CARD_H,
      background: { colors: ['#200028', '#100014', '#08000C'] },
      border: { color: '#E040FB', width: 3, glowColor: '#E040FB', glowBlur: 35 },
      playerPhoto: { x: 50, y: 80, width: 300, height: 300, shadowColor: '#E040FB60', shadowBlur: 25 },
      overall: { x: 18, y: 36, fontSize: 52, fill: '#E040FB' },
      position: { x: 18, y: 94, fontSize: 18, fill: '#E040FB' },
      playerName: { x: CARD_W / 2, y: 392, fontSize: 32, fill: '#E040FB', width: 360 },
      teamColorBar: { y: 430, height: 4 },
      stats: { paddingX: 20, y: 448, rowHeight: 22, valueFontSize: 22, valueColor: '#E040FB', labelFontSize: 11, labelColor: '#9C00B8' },
      watermark: { x: CARD_W / 2, y: 538, fontSize: 9, fill: 'rgba(224,64,251,0.25)' },
    },
  },
];

const MOCK_PLAYER = { name: '김민준', position: 'ST', jersey_number: 10 };

const DEFAULT_STATS = { shooting: 78, passing: 74, speed: 82, dribbling: 76, physical: 70 };

const STEPS = ['템플릿 선택', '능력치 입력', '카드 완성'];

export default function DemoCardPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);
  const [template, setTemplate] = useState(TEMPLATES[0]);
  const [stats, setStats] = useState(DEFAULT_STATS);

  const accent = {
    gold: '#FFD700', toty: '#00E5FF', chrome: '#B0C4DE', legend: '#E040FB',
  }[template.slug] || '#FFD700';

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
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}
        >
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
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
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

        {/* Main layout */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Live card preview (always visible) */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 11, color: C.sub, letterSpacing: 2 }}>실시간 미리보기</div>
            <CardCanvas
              ref={canvasRef}
              template={template}
              player={MOCK_PLAYER}
              stats={stats}
              teamColor={accent}
              scale={0.65}
            />
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
                  <Btn variant="ghost" onClick={() => setStep(0)} style={{ flex: 1 }}>
                    <ChevronLeft size={16} /> 이전
                  </Btn>
                  <Btn onClick={() => setStep(2)} style={{ flex: 2 }}>
                    완성 확인 <ChevronRight size={16} />
                  </Btn>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>카드 완성!</h2>
                <p style={{ color: C.sub, fontSize: 14, marginBottom: 24 }}>
                  실제 서비스에서는 이 카드를 장바구니에 담고 결제 후 7일 이내 실물 배송됩니다.
                </p>

                {/* Summary */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, color: C.sub, letterSpacing: 1, marginBottom: 12 }}>선수 정보</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: C.sub, fontSize: 14 }}>이름</span>
                    <span style={{ fontWeight: 700 }}>{MOCK_PLAYER.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: C.sub, fontSize: 14 }}>포지션</span>
                    <span style={{ fontWeight: 700 }}>{MOCK_PLAYER.position}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: C.sub, fontSize: 14 }}>템플릿</span>
                    <span style={{ fontWeight: 700, color: accent }}>{template.name}</span>
                  </div>
                </div>

                {/* Pricing */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: 20, marginBottom: 24 }}>
                  <div style={{ fontSize: 12, color: C.sub, letterSpacing: 1, marginBottom: 12 }}>가격 안내</div>
                  {[
                    { qty: '1장', price: '6,900원' },
                    { qty: '5장', price: '24,900원', badge: '인기' },
                    { qty: '11장', price: '49,900원', badge: 'BEST' },
                    { qty: '20장', price: '89,000원', badge: '최저가' },
                  ].map((p) => (
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
                  <Btn variant="ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>
                    <ChevronLeft size={16} /> 수정
                  </Btn>
                  <Btn onClick={() => navigate('/signup')} style={{ flex: 2 }}>
                    회원가입 후 주문하기
                  </Btn>
                </div>
                <p style={{ textAlign: 'center', fontSize: 12, color: C.gray, marginTop: 12 }}>
                  데모 페이지입니다 — 실제 주문은 회원가입 후 가능합니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
