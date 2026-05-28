import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, RotateCcw } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import SvgCardFront from '../../components/card/SvgCardFront';
import SvgCardBack from '../../components/card/SvgCardBack';
import CardInfoInputPanel from '../../components/card/CardInfoInputPanel';
import StatsInputPanel from '../../components/card/StatsInputPanel';
import { C, radius } from '../../tokens';
import { getPlayer } from '../../services/players.service';
import { getTemplates } from '../../services/templates.service';
import { createCard } from '../../services/cards.service';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useIsMd } from '../../lib/utils';

const DEFAULT_STATS = { pac: 75, dri: 70, phy: 70, acc: 75, tac: 70, psy: 70 };
const PRICES = { 1: 6900, 5: 24900, 11: 49900, 20: 89000 };

const STEPS = ['카드 정보', '능력치 입력', '완성'];

export default function CardCreatePage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const { academy } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const isMd = useIsMd();

  const [player, setPlayer] = useState(null);
  const [defaultTemplateId, setDefaultTemplateId] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [cardInfo, setCardInfo] = useState({
    cardType: 'THE',
    cardLabel: '',
    jerseyNumber: '',
    position: '',
    description: '',
    height: '',
    weight: '',
  });
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedCard, setSavedCard] = useState(null);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    Promise.all([getPlayer(playerId), getTemplates()]).then(([p, t]) => {
      setPlayer(p);
      if (t.length > 0) setDefaultTemplateId(t[0].id);
      setCardInfo(prev => ({
        ...prev,
        cardLabel: (p.name || '').toUpperCase(),
        jerseyNumber: p.jersey_number ? String(p.jersey_number) : '',
        position: p.position || 'FW',
      }));
    });
  }, [playerId]);

  async function handleSaveCard() {
    setSaving(true);
    try {
      const card = await createCard({
        academyId: academy.id,
        playerId: player.id,
        templateId: defaultTemplateId,
        stats,
      });
      setSavedCard({ ...card, playerName: player.name });
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

  if (!player) {
    return <AppShell><div style={{ padding: 40, textAlign: 'center', color: C.sub }}>로딩 중...</div></AppShell>;
  }

  const scale = isMd ? 0.72 : 0.60;
  const logoUrl = academy?.logo_url || '/brand/fdl-logo.svg';

  const previewFront = (
    <SvgCardFront
      cardType={cardInfo.cardType}
      cardLabel={cardInfo.cardLabel}
      jerseyNumber={cardInfo.jerseyNumber}
      position={cardInfo.position}
      photoUrl={player.photo_bg_removed_url || player.photo_url || ''}
      playerNameEn={player.name_en || ''}
      academyLogoUrl={logoUrl}
      playerName={player.name}
      academyName={academy?.name || ''}
      age={player.age}
      height={cardInfo.height}
      weight={cardInfo.weight}
      birthDate={player.birth_date || ''}
      nationality={player.nationality || ''}
      pac={stats.pac} dri={stats.dri} phy={stats.phy}
      acc={stats.acc} tac={stats.tac} psy={stats.psy}
      scale={scale}
    />
  );

  const previewBack = (
    <SvgCardBack
      jerseyNumber={cardInfo.jerseyNumber}
      position={cardInfo.position}
      pac={stats.pac} dri={stats.dri} phy={stats.phy}
      acc={stats.acc} tac={stats.tac} psy={stats.psy}
      playerName={player.name}
      description={cardInfo.description}
      height={cardInfo.height}
      weight={cardInfo.weight}
      academyName={academy?.name || ''}
      scale={scale}
    />
  );

  return (
    <AppShell>
      <Topbar title={`${player.name} 카드 만들기`} back />

      <div style={{ padding: '20px', maxWidth: 1100, margin: '0 auto' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          {STEPS.map((label, i) => {
            const s = i + 1;
            const active = step === s;
            const done = step > s;
            return [
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: done || active ? C.gold : C.border,
                  color: done || active ? C.bg : C.sub,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>{done ? '✓' : s}</div>
                <span style={{ fontSize: 13, color: active ? C.white : C.sub, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>,
              s < STEPS.length ? <div key={`sep-${s}`} style={{ flex: 1, height: 1, background: C.border, maxWidth: 40 }} /> : null,
            ];
          })}
        </div>

        <div style={{ display: isMd ? 'grid' : 'block', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>

          {/* Left: form steps */}
          <div>
            {step === 1 && (
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: 17, color: C.white }}>카드 정보 입력</h3>
                <CardInfoInputPanel info={cardInfo} onChange={setCardInfo} />
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                  <Btn onClick={() => setStep(2)}>다음 단계 →</Btn>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 style={{ margin: '0 0 16px', fontSize: 17, color: C.white }}>능력치 입력</h3>
                <StatsInputPanel stats={stats} onChange={setStats} />
                <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                  <Btn variant="ghost" onClick={() => setStep(1)}>← 이전</Btn>
                  <Btn onClick={() => setStep(3)} style={{ flex: 1 }}>미리보기 &amp; 주문 →</Btn>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                {savedCard ? (
                  <div>
                    <div style={{
                      background: C.greenSoft, border: `1px solid ${C.green}40`,
                      borderRadius: radius.lg, padding: '20px',
                      marginBottom: 20, textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                      <h3 style={{ margin: '0 0 4px', color: C.green, fontSize: 18 }}>카드가 완성됐습니다!</h3>
                      <p style={{ margin: 0, color: C.sub, fontSize: 13 }}>실물 카드로 주문하거나 선택해주세요</p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                      <h4 style={{ margin: '0 0 12px', color: C.white, fontSize: 15 }}>주문 가격</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                        {Object.entries(PRICES).map(([qty, price]) => (
                          <div key={qty} style={{
                            background: C.card, border: `1px solid ${C.border}`,
                            borderRadius: radius.md, padding: '12px', textAlign: 'center',
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
                      <Btn variant="ghost" onClick={() => navigate(`/players/${player.id}`)} fullWidth>
                        선수 페이지로 돌아가기
                      </Btn>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 style={{ margin: '0 0 16px', fontSize: 17, color: C.white }}>최종 확인 &amp; 저장</h3>
                    <div style={{
                      background: C.card, border: `1px solid ${C.border}`,
                      borderRadius: radius.lg, padding: '16px', marginBottom: 20,
                    }}>
                      <div style={{ fontSize: 13, color: C.sub, marginBottom: 8 }}>카드 정보 요약</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', fontSize: 13 }}>
                        <span style={{ color: C.sub }}>선수</span><span style={{ color: C.white }}>{player.name}</span>
                        <span style={{ color: C.sub }}>라벨</span><span style={{ color: C.white }}>{cardInfo.cardType} {cardInfo.cardLabel}</span>
                        <span style={{ color: C.sub }}>포지션</span><span style={{ color: C.white }}>#{cardInfo.jerseyNumber} {cardInfo.position}</span>
                        {cardInfo.height && <><span style={{ color: C.sub }}>키</span><span style={{ color: C.white }}>{cardInfo.height}cm</span></>}
                        {cardInfo.weight && <><span style={{ color: C.sub }}>몸무게</span><span style={{ color: C.white }}>{cardInfo.weight}kg</span></>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <Btn variant="ghost" onClick={() => setStep(2)}>← 이전</Btn>
                      <Btn onClick={handleSaveCard} loading={saving} style={{ flex: 1 }}>
                        카드 저장 &amp; 주문하기
                      </Btn>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: card preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: isMd ? 0 : 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: C.sub, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>실시간 미리보기</span>
              <button
                onClick={() => setShowBack(b => !b)}
                style={{
                  background: 'none', border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: '3px 10px',
                  color: C.sub, fontSize: 11, cursor: 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <RotateCcw size={12} /> {showBack ? '앞면 보기' : '뒷면 보기'}
              </button>
            </div>
            {showBack ? previewBack : previewFront}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
