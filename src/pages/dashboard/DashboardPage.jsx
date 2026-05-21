import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, Package, Plus, Trophy, ShoppingCart } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Pill from '../../components/ui/Pill';
import { C, ff, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { getPlayers } from '../../services/players.service';
import { getOrders } from '../../services/orders.service';
import { formatKRW, formatDate } from '../../lib/utils';

function StatCard({ label, value, icon: Icon, color = C.gold }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: radius.lg, padding: '16px 20px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ width: 44, height: 44, background: `${color}15`, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.white, fontFamily: ff.display }}>{value}</div>
        <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{label}</div>
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: '선수 등록', icon: Plus,    color: C.gold,   bg: 'rgba(255,215,0,0.08)',   to: '/players/new' },
  { label: '카드 만들기', icon: CreditCard, color: C.toty, bg: 'rgba(0,229,255,0.08)', to: '/players' },
  { label: '랭킹 보기',  icon: Trophy,  color: C.legend, bg: 'rgba(224,64,251,0.08)', to: '/ranking' },
  { label: '주문 조회',  icon: Package, color: C.green,  bg: 'rgba(0,230,118,0.08)',  to: '/orders' },
];

export default function DashboardPage() {
  const { academy } = useAuthStore();
  const cartCount = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!academy) return;
    Promise.all([getPlayers(academy.id), getOrders(academy.id)]).then(([p, o]) => {
      setPlayers(p);
      setOrders(o);
    });
  }, [academy]);

  const pendingOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.status));

  return (
    <AppShell>
      {/* App-style header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: `${C.bg}ee`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {academy?.logo_url ? (
            <img src={academy.logo_url} alt="로고" style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }} />
          ) : (
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: C.goldSoft, border: `1px solid ${C.goldMed}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: C.gold, fontWeight: 800,
            }}>F</div>
          )}
          <div>
            <div style={{ fontSize: 11, color: C.sub }}>안녕하세요!</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>
              {academy?.name || '아카데미'}
            </div>
          </div>
        </div>

        {/* Cart icon */}
        <button
          onClick={() => navigate('/cart')}
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: 8, color: C.sub,
          }}
        >
          <ShoppingCart size={22} color={cartCount > 0 ? C.gold : C.gray} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: 2, right: 2,
              background: C.gold, color: C.bg,
              borderRadius: 8, padding: '1px 5px',
              fontSize: 9, fontWeight: 700, lineHeight: 1.4,
            }}>{cartCount}</span>
          )}
        </button>
      </div>

      <div style={{ padding: '20px 20px 32px', maxWidth: 960, margin: '0 auto' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
          <StatCard label="등록 선수" value={players.length} icon={Users} color={C.gold} />
          <StatCard label="진행 주문" value={pendingOrders.length} icon={Package} color={C.toty} />
          <StatCard label="총 주문" value={orders.length} icon={CreditCard} color={C.legend} />
        </div>

        {/* Quick actions 2x2 grid */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, marginBottom: 12, letterSpacing: 1 }}>빠른 실행</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {QUICK_ACTIONS.map(({ label, icon: Icon, color, bg, to }) => (
              <button
                key={label}
                onClick={() => navigate(to)}
                style={{
                  background: bg,
                  border: `1px solid ${color}30`,
                  borderRadius: radius.lg,
                  padding: '20px 16px',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ width: 38, height: 38, background: `${color}20`, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        {orders.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.sub, letterSpacing: 1 }}>최근 주문</div>
              <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: C.gold, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>전체 보기 →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: radius.md, padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{order.order_number}</div>
                    <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{formatDate(order.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{formatKRW(order.total_amount)}</span>
                    <Pill status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {orders.length === 0 && players.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            background: C.card, borderRadius: radius.xl,
            border: `1px solid ${C.border}`,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚽</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 6 }}>아직 데이터가 없어요</div>
            <div style={{ fontSize: 13, color: C.sub, marginBottom: 20 }}>선수를 등록하고 첫 번째 카드를 만들어보세요</div>
            <button
              onClick={() => navigate('/players/new')}
              style={{
                background: C.gold, color: C.bg, border: 'none',
                borderRadius: radius.md, padding: '10px 20px',
                fontWeight: 700, fontSize: 14, cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              선수 등록하기
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
