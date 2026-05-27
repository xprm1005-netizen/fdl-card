import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ShoppingCart, ChevronRight, CreditCard } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import { C, ff, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { getPlayers } from '../../services/players.service';
import { getOrders } from '../../services/orders.service';
import { determineGrade, calcOverall, formatKRW } from '../../lib/utils';

const STATUS_LABEL = {
  pending: '결제 대기', paid: '결제 완료', printing: '제작 중',
  shipped: '배송 중', delivered: '배송 완료', cancelled: '취소',
};
const STATUS_COLOR = {
  pending: '#888', paid: '#29ED73', printing: '#FFD700',
  shipped: '#00D4FF', delivered: '#4CAF50', cancelled: '#666',
};

function PlayerCard({ player, onCreateCard }) {
  const ovr = player.latest_overall || 0;
  const grade = ovr > 0 ? determineGrade(ovr) : null;
  const photo = player.photo_bg_removed_url || player.photo_url;

  return (
    <div style={{
      background: C.card, border: `1px solid ${grade ? `${grade.color}30` : C.border}`,
      borderRadius: 16, padding: '14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {/* Photo */}
      <div style={{
        width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
        flexShrink: 0, background: '#1e1e1e',
        border: grade ? `1.5px solid ${grade.color}50` : `1.5px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {photo ? (
          <img src={photo} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: 22 }}>⚽</span>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 3 }}>{player.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: '#0a0a0a',
            background: '#29ED73', borderRadius: 4, padding: '1px 6px',
          }}>{player.position}</span>
          <span style={{ fontSize: 10, color: C.sub }}>#{player.jersey_number}</span>
          {grade && (
            <span style={{ fontSize: 10, fontWeight: 800, color: grade.color }}>
              {grade.name} {ovr}
            </span>
          )}
        </div>
      </div>

      {/* Action */}
      <button
        onClick={() => onCreateCard(player.id)}
        style={{
          background: '#29ED73', color: '#0a0a0a',
          border: 'none', borderRadius: 10, padding: '8px 14px',
          fontSize: 12, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit',
          flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4,
        }}>
        <CreditCard size={13} /> 카드 만들기
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { academy } = useAuthStore();
  const cartCount = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!academy) return;
    Promise.all([getPlayers(academy.id), getOrders(academy.id)])
      .then(([p, o]) => { setPlayers(p); setOrders(o); })
      .finally(() => setLoading(false));
  }, [academy]);

  const recentOrders = orders.slice(0, 3);

  return (
    <AppShell>
      <style>{`@keyframes fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* ── 헤더 ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: `${C.bg}f0`, backdropFilter: 'blur(14px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {academy?.logo_url ? (
            <img src={academy.logo_url} alt="" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#29ED7320', border: '1px solid #29ED7340', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#29ED73', fontWeight: 900 }}>
              {(academy?.name || 'F')[0]}
            </div>
          )}
          <div>
            <div style={{ fontSize: 12, color: C.sub, lineHeight: 1 }}>안녕하세요</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.white, lineHeight: 1.3 }}>{academy?.name || '내 팀'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {cartCount > 0 && (
            <button onClick={() => navigate('/cart')}
              style={{
                background: '#29ED7318', border: '1px solid #29ED7340',
                borderRadius: 10, padding: '7px 12px',
                color: '#29ED73', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
              <ShoppingCart size={14} /> {cartCount}
            </button>
          )}
        </div>
      </div>

      <div style={{ padding: '16px 20px 80px', maxWidth: 600, margin: '0 auto', animation: 'fade-in 0.3s ease' }}>

        {/* ── 선수 등록 유도 배너 ── */}
        {!loading && players.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, #29ED7315, #29ED7305)',
            border: '1px solid #29ED7330',
            borderRadius: 20, padding: '28px 24px',
            textAlign: 'center', marginBottom: 20,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: C.white, marginBottom: 8 }}>
              첫 선수를 등록해보세요
            </div>
            <div style={{ fontSize: 14, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
              선수 정보와 능력치를 입력하면<br />바로 카드를 만들 수 있어요
            </div>
            <button onClick={() => navigate('/players/new')}
              style={{
                background: '#29ED73', color: '#0a0a0a',
                border: 'none', borderRadius: 12, padding: '14px 32px',
                fontSize: 15, fontWeight: 900,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
              <Plus size={16} /> 선수 등록하기
            </button>
          </div>
        ) : (
          <>
            {/* ── 선수 섹션 ── */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: C.white }}>
                  선수 {players.length}명
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => navigate('/players/new')}
                    style={{
                      background: '#29ED7318', border: '1px solid #29ED7340',
                      borderRadius: 8, padding: '6px 12px',
                      color: '#29ED73', fontSize: 12, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                    <Plus size={12} /> 등록
                  </button>
                  <button onClick={() => navigate('/players')}
                    style={{
                      background: 'none', border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: '6px 12px',
                      color: C.sub, fontSize: 12, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 3,
                    }}>
                    전체 <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {players.slice(0, 5).map((player) => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onCreateCard={(id) => navigate(`/cards/create/${id}`)}
                  />
                ))}
                {players.length > 5 && (
                  <button onClick={() => navigate('/players')}
                    style={{
                      background: 'none', border: `1px dashed ${C.border}`,
                      borderRadius: 16, padding: '14px',
                      color: C.sub, fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}>
                    +{players.length - 5}명 더 보기 <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── 최근 주문 ── */}
        {recentOrders.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.white }}>최근 주문</span>
              <button onClick={() => navigate('/orders')}
                style={{ background: 'none', border: 'none', color: C.sub, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3 }}>
                전체 <ChevronRight size={12} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentOrders.map((order) => (
                <div key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer',
                  }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 3 }}>
                      {order.order_number}
                    </div>
                    <div style={{
                      display: 'inline-block', fontSize: 10, fontWeight: 700,
                      color: STATUS_COLOR[order.status] || '#888',
                      background: `${STATUS_COLOR[order.status] || '#888'}15`,
                      border: `1px solid ${STATUS_COLOR[order.status] || '#888'}30`,
                      borderRadius: 6, padding: '2px 8px',
                    }}>
                      {STATUS_LABEL[order.status] || order.status}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#29ED73' }}>
                      {formatKRW(order.total_amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
