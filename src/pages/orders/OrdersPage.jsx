import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Pill from '../../components/ui/Pill';
import EmptyState from '../../components/ui/EmptyState';
import Btn from '../../components/ui/Btn';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { getOrders } from '../../services/orders.service';
import { formatKRW, formatDate } from '../../lib/utils';

export default function OrdersPage() {
  const { academy } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!academy) return;
    getOrders(academy.id).then((o) => { setOrders(o); setLoading(false); });
  }, [academy]);

  return (
    <AppShell>
      <Topbar title="주문 내역" />
      <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>
        {!loading && orders.length === 0 ? (
          <EmptyState
            icon={<Package size={48} color={C.gray} />}
            title="주문 내역이 없습니다"
            description="카드를 만들고 주문해보세요"
            action={<Btn onClick={() => navigate('/players')}>카드 만들기</Btn>}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: radius.lg, padding: '18px 20px',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = C.borderMed}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.gold, fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>
                    {order.order_number}
                  </span>
                  <Pill status={order.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <div style={{ fontSize: 13, color: C.sub }}>{formatDate(order.created_at)}</div>
                    {order.tracking_number && (
                      <div style={{ fontSize: 12, color: C.toty, marginTop: 2 }}>
                        📦 {order.shipping_carrier} {order.tracking_number}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: C.white }}>{formatKRW(order.total_amount)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
