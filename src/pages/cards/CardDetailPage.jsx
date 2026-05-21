import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Download, Edit3 } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import CardCanvas from '../../components/card/CardCanvas';
import { C, radius } from '../../tokens';
import { getCard } from '../../services/cards.service';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { calcOverall } from '../../lib/utils';

const PRICES = { 1: 6900, 5: 24900, 11: 49900, 20: 89000 };

export default function CardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { academy } = useAuthStore();
  const addItem = useCartStore((s) => s.addItem);
  const canvasRef = useRef(null);
  const [card, setCard] = useState(null);

  useEffect(() => {
    getCard(id).then(setCard);
  }, [id]);

  function handleDownload() {
    if (!canvasRef.current) return;
    const dataURL = canvasRef.current.toDataURL({ pixelRatio: 3 });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `${card?.players?.name || 'card'}-fdl.png`;
    a.click();
  }

  if (!card) return <AppShell><div style={{ padding: 40, textAlign: 'center', color: C.sub }}>로딩 중...</div></AppShell>;

  const teamColor = academy?.primary_color || '#FFD700';
  const overall = calcOverall(card.stats);

  return (
    <AppShell>
      <Topbar title="카드 상세" back />
      <div style={{ padding: '24px 20px', maxWidth: 700, margin: '0 auto' }}>
        {/* Card preview */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <CardCanvas
            ref={canvasRef}
            template={card.card_templates}
            player={card.players}
            stats={card.stats}
            teamColor={teamColor}
            scale={0.85}
          />
        </div>

        {/* Stats */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: C.white }}>능력치</h3>
            <div style={{ fontSize: 36, fontWeight: 900, color: C.gold, fontFamily: "'Bebas Neue', Impact, sans-serif" }}>OVR {overall}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, textAlign: 'center' }}>
            {Object.entries(card.stats).map(([key, val]) => (
              <div key={key}>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.white, fontFamily: "'Bebas Neue', Impact, sans-serif" }}>{val}</div>
                <div style={{ fontSize: 10, color: C.sub, textTransform: 'uppercase' }}>
                  {{ shooting: 'SHO', passing: 'PAS', speed: 'SPD', dribbling: 'DRI', physical: 'PHY' }[key]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={() => { addItem(card, PRICES[1]); navigate('/cart'); }} fullWidth>
            <ShoppingCart size={18} /> 장바구니 담기 — {PRICES[1].toLocaleString()}원/장
          </Btn>
          <Btn variant="ghost" onClick={handleDownload} fullWidth>
            <Download size={16} /> 이미지 저장
          </Btn>
          <Btn variant="ghost" onClick={() => navigate(`/cards/create/${card.player_id}`)} fullWidth>
            <Edit3 size={16} /> 새 카드 만들기
          </Btn>
        </div>
      </div>
    </AppShell>
  );
}
