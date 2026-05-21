import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Pill from '../../components/ui/Pill';
import BgRemovalStatus from '../../components/player/BgRemovalStatus';
import { C, radius } from '../../tokens';
import { getPlayer, deletePlayer } from '../../services/players.service';
import { formatDate } from '../../lib/utils';

const POSITION_COLORS = { GK:'#FF9800', CB:'#2196F3', LB:'#2196F3', RB:'#2196F3', CDM:'#9C27B0', CM:'#9C27B0', CAM:'#E91E63', LW:'#4CAF50', RW:'#4CAF50', ST:'#F44336', CF:'#F44336' };

export default function PlayerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayer(id).then((p) => { setPlayer(p); setLoading(false); });
  }, [id]);

  async function handleDelete() {
    if (!confirm(`${player.name} 선수를 삭제하시겠습니까?`)) return;
    await deletePlayer(id);
    navigate('/players');
  }

  if (loading) return <AppShell><div style={{ padding: 40, textAlign: 'center', color: C.sub }}>로딩 중...</div></AppShell>;
  if (!player) return <AppShell><div style={{ padding: 40, textAlign: 'center', color: C.red }}>선수를 찾을 수 없습니다.</div></AppShell>;

  const cards = player.player_cards || [];

  return (
    <AppShell>
      <Topbar
        title={player.name}
        back
        right={
          <button onClick={handleDelete} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', padding: 8 }}>
            <Trash2 size={18} />
          </button>
        }
      />
      <div style={{ padding: '24px 20px', maxWidth: 800, margin: '0 auto' }}>
        {/* Player info */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: radius.xl, overflow: 'hidden', marginBottom: 28,
          display: 'flex', gap: 0,
        }}>
          <div style={{ width: 160, minHeight: 200, background: C.card2, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
            {(player.photo_bg_removed_url || player.photo_url) ? (
              <img src={player.photo_bg_removed_url || player.photo_url} alt={player.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
                <CreditCard size={40} color={C.dim} />
              </div>
            )}
          </div>
          <div style={{ padding: '24px', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{
                background: POSITION_COLORS[player.position] || C.gold,
                color: '#fff', fontSize: 12, fontWeight: 700,
                padding: '3px 10px', borderRadius: 4,
              }}>{player.position}</span>
              <span style={{ fontSize: 14, color: C.sub }}>#{player.jersey_number}</span>
            </div>
            <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: C.white }}>{player.name}</h2>
            <BgRemovalStatus status={player.bg_removal_status} />
            <div style={{ fontSize: 12, color: C.gray, marginTop: 8 }}>등록일 {formatDate(player.created_at)}</div>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, color: C.white }}>선수 카드</h3>
          <Btn size="sm" onClick={() => navigate(`/cards/create/${player.id}`)}><Plus size={16} /> 카드 만들기</Btn>
        </div>

        {cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', border: `2px dashed ${C.border}`, borderRadius: radius.xl }}>
            <CreditCard size={40} color={C.gray} style={{ marginBottom: 12 }} />
            <div style={{ color: C.sub, fontSize: 14 }}>아직 카드가 없습니다</div>
            <Btn onClick={() => navigate(`/cards/create/${player.id}`)} style={{ marginTop: 16 }}><Plus size={16} /> 첫 카드 만들기</Btn>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => navigate(`/cards/${card.id}`)}
                style={{
                  background: C.card2, border: `1px solid ${C.border}`,
                  borderRadius: radius.lg, overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {card.preview_url ? (
                  <img src={card.preview_url} alt="카드" style={{ width: '100%', aspectRatio: '400/560', objectFit: 'cover' }} />
                ) : (
                  <div style={{ aspectRatio: '400/560', background: C.card, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={32} color={C.dim} />
                  </div>
                )}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 13, color: C.white, fontWeight: 600 }}>{card.card_templates?.name || 'Gold'}</div>
                  <div style={{ fontSize: 24, color: C.gold, fontWeight: 800, fontFamily: "'Bebas Neue', Impact, sans-serif" }}>{card.overall}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
