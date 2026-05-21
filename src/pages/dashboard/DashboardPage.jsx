import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, Package, Plus } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Pill from '../../components/ui/Pill';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { getPlayers } from '../../services/players.service';
import { getOrders } from '../../services/orders.service';
import { formatKRW, formatDate } from '../../lib/utils';

function StatCard({ label, value, icon: Icon, color = C.gold }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: radius.lg, padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{ width: 48, height: 48, background: `${color}15`, borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.white }}>{value}</div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { academy } = useAuthStore();
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
      <Topbar
        title="대시보드"
        right={<Btn size="sm" onClick={() => navigate('/players/new')}><Plus size={16} /> 선수 등록</Btn>}
      />
      <div style={{ padding: '24px 20px', maxWidth: 960, margin: '0 auto' }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 22, color: C.white }}>
            안녕하세요, <span style={{ color: C.gold }}>{academy?.name}</span> 👋
          </h2>
          <p style={{ margin: '6px 0 0', color: C.sub, fontSize: 14 }}>선수카드를 만들어 아이들에게 특별한 경험을 선물하세요.</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard label="등록 선수" value={players.length} icon={Users} color={C.gold} />
          <StatCard label="진행 중인 주문" value={pendingOrders.length} icon={Package} color={C.toty} />
          <StatCard label="총 주문" value={orders.length} icon={CreditCard} color={C.legend} />
        </div>

        {/* Quick action */}
        <div style={{
          background: `linear-gradient(135deg, #1a1000, #2d1f00)`,
          border: `1px solid ${C.goldMed}`,
          borderRadius: radius.xl,
          padding: '28px 32px',
          marginBottom: 32,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>NEW CARD</div>
            <h3 style={{ margin: 0, fontSize: 22, color: C.white, fontWeight: 800 }}>선수카드 만들기</h3>
            <p style={{ margin: '6px 0 0', color: C.sub, fontSize: 13 }}>사진 업로드 → 템플릿 선택 → 주문 완료</p>
          </div>
          <Btn onClick={() => navigate('/players/new')} size="lg">
            <Plus size={20} /> 시작하기
          </Btn>
        </div>

        {/* Recent orders */}
        {orders.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 17, color: C.white }}>최근 주문</h3>
              <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: C.gold, cursor: 'pointer', fontSize: 13 }}>전체 보기 →</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: radius.md, padding: '14px 18px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{order.order_number}</div>
                    <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{formatDate(order.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.gold }}>{formatKRW(order.total_amount)}</span>
                    <Pill status={order.status} />
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
