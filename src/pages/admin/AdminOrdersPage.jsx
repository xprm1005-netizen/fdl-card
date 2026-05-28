import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../../components/layout/AdminShell';
import Topbar from '../../components/layout/Topbar';
import Pill from '../../components/ui/Pill';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';
import { formatKRW, formatDateTime } from '../../lib/utils';

const TABS = [
  { key: null,        label: '전체' },
  { key: 'pending',   label: '입금 대기' },
  { key: 'paid',      label: '입금 확인' },
  { key: 'confirmed', label: '확인 완료' },
  { key: 'printing',  label: '인쇄 중' },
  { key: 'shipped',   label: '배송 중' },
  { key: 'delivered', label: '배송 완료' },
];

async function fetchAdminOrders() {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/api/admin/orders', {
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState([]);
  const [tab, setTab] = useState(null);
  const [counts, setCounts] = useState({});

  async function load() {
    const data = await fetchAdminOrders().catch(() => []);
    setAllOrders(data);
    const c = {};
    data.forEach(({ status }) => { c[status] = (c[status] || 0) + 1; });
    setCounts(c);
  }

  useEffect(() => { load(); }, []);

  const orders = tab ? allOrders.filter((o) => o.status === tab) : allOrders;

  return (
    <AdminShell>
      <Topbar title="주문 관리" />
      <div style={{ padding: '16px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {TABS.map((t) => {
            const count = t.key ? (counts[t.key] || 0) : Object.values(counts).reduce((a, b) => a + b, 0);
            const isActive = tab === t.key;
            const isPendingAlert = t.key === 'pending' && (counts['pending'] || 0) > 0;
            return (
              <button key={String(t.key)} onClick={() => setTab(t.key)} style={{
                padding: '6px 12px', borderRadius: 20,
                background: isActive ? C.gold : (isPendingAlert ? 'rgba(41,237,115,0.12)' : C.card),
                color: isActive ? C.bg : (isPendingAlert ? '#29ED73' : C.sub),
                border: `1px solid ${isActive ? C.gold : (isPendingAlert ? 'rgba(41,237,115,0.4)' : C.border)}`,
                cursor: 'pointer', fontSize: 12, fontWeight: 600,
                fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {t.label}
                {count > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 800,
                    background: isActive ? 'rgba(0,0,0,0.2)' : (isPendingAlert ? '#29ED73' : C.border),
                    color: isActive ? C.bg : (isPendingAlert ? '#0a0a0a' : C.sub),
                    borderRadius: 10, padding: '1px 6px', minWidth: 16, textAlign: 'center',
                  }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>

        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: C.sub, fontSize: 14 }}>
            주문이 없습니다
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/admin/orders/${order.id}`)}
                style={{
                  background: C.card,
                  border: `1px solid ${order.status === 'pending' ? 'rgba(41,237,115,0.3)' : C.border}`,
                  borderRadius: radius.lg, padding: '14px 16px',
                  cursor: 'pointer', display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 12, alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{order.order_number}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                    {order.academies?.name} · {formatDateTime(order.created_at)}
                  </div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>
                  {formatKRW(order.total_amount)}
                </span>
                <Pill status={order.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
