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
  { key: 'paid',      label: '결제완료' },
  { key: 'confirmed', label: '확인완료' },
  { key: 'printing',  label: '인쇄중' },
  { key: 'shipped',   label: '배송중' },
  { key: 'delivered', label: '배송완료' },
];

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState(null);

  async function load(status) {
    let q = supabase.from('orders').select('*, academies(name)').order('created_at', { ascending: false });
    if (status) q = q.eq('status', status);
    const { data } = await q;
    setOrders(data || []);
  }

  useEffect(() => { load(tab); }, [tab]);

  return (
    <AdminShell>
      <Topbar title="주문 관리" />
      <div style={{ padding: '20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {TABS.map((t) => (
            <button key={String(t.key)} onClick={() => setTab(t.key)} style={{
              padding: '6px 16px', borderRadius: 20,
              background: tab === t.key ? C.gold : C.card,
              color: tab === t.key ? C.bg : C.sub,
              border: `1px solid ${tab === t.key ? C.gold : C.border}`,
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: 'inherit',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: radius.lg, padding: '16px 20px',
                cursor: 'pointer', display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: 16, alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.gold }}>{order.order_number}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{order.academies?.name} · {formatDateTime(order.created_at)}</div>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{formatKRW(order.total_amount)}</span>
              <Pill status={order.status} />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
