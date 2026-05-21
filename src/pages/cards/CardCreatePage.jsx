import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Download, Save, RotateCcw } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import CardCanvas from '../../components/card/CardCanvas';
import CardBack from '../../components/card/CardBack';
import TemplateSelector from '../../components/card/TemplateSelector';
import StatsInputPanel from '../../components/card/StatsInputPanel';
import { C, radius } from '../../tokens';
import { getPlayer } from '../../services/players.service';
import { getTemplates } from '../../services/templates.service';
import { createCard, saveCardPreview } from '../../services/cards.service';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useIsMd } from '../../lib/utils';

const DEFAULT_STATS = { pac: 75, dri: 70, phy: 70, acc: 75, tac: 70, psy: 70 };
const PRICES = { 1: 6900, 5: 24900, 11: 49900, 20: 89000 };

export default function CardCreatePage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { academy } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const isMd = useIsMd();
  const canvasRef = useRef(null);

  const [player, setPlayer] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [step, setStep] = useState(1); // 1: template, 2: stats, 3: preview
  const [saving, setSaving] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    Promise.all([getPlayer(playerId), getTemplates()]).then(([p, t]) => {
      setPlayer(p);
      setTemplates(t);
      if (t.length > 0) setSelectedTemplate(t[0]);
    });
  }, [playerId]);

  async function handleSaveCard() {
    if (!selectedTemplate) return;
    setSaving(true);
    try {
      const card = await createCard({
        academyId: academy.id,
        playerId: player.id,
        templateId: selectedTemplate.id,
        stats,
      });
      // Export and save preview
      if (canvasRef.current) {
        const dataURL = canvasRef.current.toDataURL({ pixelRatio: 3 });
        await saveCardPreview(card.id, dataURL);
      }
      setSavedCard(card);
      setStep(3);
    } catch (err) {
      alert('카드 저장 중 오류: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleAddToCart() {
    if (!savedCard) return;
    addItem({ id: savedCard.id, ...savedCard }, PRICES[1]);
    navigate('/cart');
  }

  function handleDownload() {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL({ pixelRatio: 3 });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${player?.name || 'player'}-card.png`;
    a.click();
  }

  if (!player) return <AppShell><div style={{ padding: 40, textAlign: 'center', color: C.sub }}>로딩 중...</div></AppShell>;

  const teamColor = academy?.primary_color || '#FFD700';

  const canvasScale = isMd ? 0.75 : 0.65;

  return (
    <AppShell>
      <Topbar title={`${player.name} 카드 만들기`} back />
      <div style={{ padding: '20px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          {['템플릿 선택', '능력치 입력', '완성'].map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return [
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: done ? C.gold : active ? C.gold : C.border,
                  color: done || active ? C.bg : C.sub,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{done ? '✓' : s}</div>
                <span style={{ fontSize: 13, color: active ? C.white : C.sub, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>,
              s < 3 ? <div key={`sep-${s}`} style={{ flex: 1, height: 1, background: C.border, maxWidth: 40 }} /> : null,
            ];
          })}
        </div>

        <div style={{ display: isMd ? 'grid' : 'block', gridTemplateColumns: '1fr 400px', gap: 32 }}>
          {/* Left: controls */}
          <div>
            {step === 1 && (
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: 17, color: C.white }}>카드 템플릿 선택</h3>
                <TemplateSelector
                  templates={templates}
                  selected={selectedTemplate}
                  onSelect={setSelectedTemplate}
                />
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
                  <Btn onClick={() => setStep(2)} disabled={!selectedTemplate}>다음 단계 →</Btn>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: 17, color: C.white }}>선수 능력치 입력</h3>
                <StatsInputPanel stats={stats} onChange={setStats} />
                <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                  <Btn variant="ghost" onClick={() => setStep(1)}>← 이전</Btn>
                  <Btn onClick={handleSaveCard} loading={saving} style={{ flex: 1 }}>
                    <Save size={16} /> 카드 저장
                  </Btn>
                </div>
              </div>
            )}

            {step === 3 && savedCard && (
              <div>
                <div style={{
                  background: C.greenSoft, border: `1px solid ${C.green}40`,
                  borderRadius: radius.lg, padding: '20px',
                  marginBottom: 20, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                  <h3 style={{ margin: '0 0 4px', color: C.green, fontSize: 18 }}>카드가 완성됐습니다!</h3>
                  <p style={{ margin: 0, color: C.sub, fontSize: 13 }}>실물 카드로 주문하거나 이미지로 저장하세요</p>
                </div>

                {/* Pricing */}
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ margin: '0 0 12px', color: C.white, fontSize: 15 }}>주문 가격</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                    {Object.entries(PRICES).map(([qty, price]) => (
                      <div key={qty} style={{
                        background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: radius.md, padding: '12px',
                        textAlign: 'center',
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: "'Bebas Neue', Impact, sans-serif" }}>{qty}장</div>
                        <div style={{ fontSize: 14, color: C.gold, fontWeight: 700 }}>{price.toLocaleString()}원</div>
                        <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{Math.round(price / qty).toLocaleString()}원/장</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Btn onClick={handleAddToCart} fullWidth>
                    <ShoppingCart size={18} /> 장바구니 담기
                  </Btn>
                  <Btn variant="ghost" onClick={handleDownload} fullWidth>
                    <Download size={16} /> 이미지 다운로드
                  </Btn>
                  <Btn variant="ghost" onClick={() => navigate(`/players/${player.id}`)} fullWidth>
                    선수 페이지로 돌아가기
                  </Btn>
                </div>
              </div>
            )}
          </div>

          {/* Right: card preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 12, color: C.sub, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>실시간 미리보기</div>
              {selectedTemplate && (
                <button
                  onClick={() => setShowBack((b) => !b)}
                  style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 6, padding: '3px 10px', color: C.sub, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <RotateCcw size={12} /> {showBack ? '앞면' : '뒷면'}
                </button>
              )}
            </div>
            {selectedTemplate && (
              showBack ? (
                <CardBack
                  template={selectedTemplate}
                  player={player}
                  stats={stats}
                  teamColor={teamColor}
                  scale={canvasScale}
                />
              ) : (
                <CardCanvas
                  ref={canvasRef}
                  template={selectedTemplate}
                  player={player}
                  stats={stats}
                  teamColor={teamColor}
                  scale={canvasScale}
                />
              )
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
