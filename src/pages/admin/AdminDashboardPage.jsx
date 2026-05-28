import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../../components/layout/AdminShell';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';
import { formatKRW } from '../../lib/utils';
import { updateOrderStatus, createPrintJob } from '../../services/admin.service';

async function fetchAdminOrders() {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch('/api/admin/orders', {
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState({});

  async function loadAll() {
    const orders = await fetchAdminOrders().catch(() => []);
    if (!orders.length && orders.length !== 0) return;

    const counts = {};
    let totalRevenue = 0;
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let monthRevenue = 0;

    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
      if (!['cancelled', 'refunded'].includes(o.status)) {
        totalRevenue += o.total_amount;
        if (new Date(o.created_at) >= thisMonth) monthRevenue += o.total_amount;
      }
    });

    setStats({ counts, totalRevenue, monthRevenue, total: orders.length });
    setPendingOrders(orders.filter((o) => o.status === 'pending').slice(0, 10));
    setPaidOrders(orders.filter((o) => o.status === 'paid').slice(0, 10));
    setConfirmedOrders(orders.filter((o) => o.status === 'confirmed').slice(0, 10));
  }

  useEffect(() => { loadAll(); }, []);

  async function handleConfirmPayment(orderId) {
    setLoading((l) => ({ ...l, [orderId]: true }));
    await updateOrderStatus(orderId, 'paid');
    await loadAll();
    setLoading((l) => ({ ...l, [orderId]: false }));
  }

  async function handleStartPrint(orderId) {
    setLoading((l) => ({ ...l, [orderId]: true }));
    await createPrintJob(orderId);
    await loadAll();
    setLoading((l) => ({ ...l, [orderId]: false }));
  }

  const STATUS_CARDS = stats ? [
    { label: '입금 대기',  value: stats.counts['pending']   || 0, color: '#29ED73', bg: 'rgba(41,237,115,0.08)',  border: 'rgba(41,237,115,0.3)',  urgent: (stats.counts['pending'] || 0) > 0 },
    { label: '입금 확인',  value: stats.counts['paid']      || 0, color: '#00D4FF', bg: 'rgba(0,212,255,0.08)',   border: 'rgba(0,212,255,0.25)',  urgent: false },
    { label: '발주 대기',  value: stats.counts['confirmed'] || 0, color: '#FFD700', bg: 'rgba(255,215,0,0.08)',   border: 'rgba(255,215,0,0.25)',  urgent: (stats.counts['confirmed'] || 0) > 0 },
    { label: '인쇄 중',   value: stats.counts['printing']  || 0, color: '#FF9800', bg: 'rgba(255,152,0,0.08)',   border: 'rgba(255,152,0,0.25)',  urgent: false },
    { label: '배송 중',   value: stats.counts['shipped']   || 0, color: '#9B59B6', bg: 'rgba(155,89,182,0.08)',  border: 'rgba(155,89,182,0.25)', urgent: false },
    { label: '배송 완료', value: stats.counts['delivered'] || 0, color: C.sub,     bg: 'rgba(255,255,255,0.04)', border: C.border,               urgent: false },
  ] : [];

  return (
    <AdminShell>
      <style>{`
        @media (max-width: 600px) {
          .dash-revenue  { grid-template-columns: 1fr 1fr !important; }
          .dash-status   { grid-template-columns: repeat(3, 1fr) !important; }
          .dash-panels   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div style={{ padding: '20px 16px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: '#29ED73', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>ADMIN DASHBOARD</div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: C.white }}>전체 주문 현황</h2>
        </div>

        {/* 매출 요약 */}
        {stats && (
          <div className="dash-revenue" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: '총 누적 매출',   value: formatKRW(stats.totalRevenue), icon: '💰' },
              { label: '이번 달 매출',   value: formatKRW(stats.monthRevenue),  icon: '📅' },
              { label: '전체 주문',      value: `${stats.total}건`,             icon: '📦' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: radius.lg, padding: '14px 12px',
              }}>
                <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: C.white, wordBreak: 'break-all' }}>{value}</div>
                <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 상태별 현황 */}
        <div className="dash-status" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6, marginBottom: 20 }}>
          {STATUS_CARDS.map(({ label, value, color, bg, border, urgent }) => (
            <div key={label} style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: radius.md, padding: '10px 6px', textAlign: 'center',
              position: 'relative',
            }}>
              {urgent && value > 0 && (
                <div style={{
                  position: 'absolute', top: 5, right: 5,
                  width: 7, height: 7, borderRadius: '50%',
                  background: color, boxShadow: `0 0 5px ${color}`,
                }} />
              )}
              <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: 9, color: C.sub, marginTop: 2, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* 4개 패널 */}
        <div className="dash-panels" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* 입금 확인 필요 */}
          <div style={{ background: C.card, border: '1px solid rgba(41,237,115,0.25)', borderRadius: radius.xl, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#29ED73' }}>입금 확인 필요</div>
                <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>신한 110-590-001866</div>
              </div>
              <span style={{
                background: 'rgba(41,237,115,0.15)', border: '1px solid rgba(41,237,115,0.3)',
                borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 800, color: '#29ED73',
              }}>{pendingOrders.length}건</span>
            </div>
            {pendingOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: C.sub, fontSize: 12 }}>대기 없음</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pendingOrders.map((o) => (
                  <div key={o.id} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: radius.md,
                    padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ flex: 1, cursor: 'pointer', minWidth: 0 }} onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.order_number}</div>
                      <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>{formatKRW(o.total_amount)}</div>
                    </div>
                    <button
                      disabled={loading[o.id]}
                      onClick={() => handleConfirmPayment(o.id)}
                      style={{
                        padding: '5px 10px', borderRadius: radius.sm, flexShrink: 0,
                        background: 'rgba(41,237,115,0.15)', border: '1px solid rgba(41,237,115,0.4)',
                        color: '#29ED73', fontSize: 10, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        opacity: loading[o.id] ? 0.5 : 1,
                      }}
                    >{loading[o.id] ? '처리중' : '✅ 확인'}</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 발주 대기 */}
          <div style={{ background: C.card, border: '1px solid rgba(255,215,0,0.25)', borderRadius: radius.xl, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#FFD700' }}>발주 대기</div>
                <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>인쇄 전송 대기 중</div>
              </div>
              <span style={{
                background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 800, color: '#FFD700',
              }}>{confirmedOrders.length}건</span>
            </div>
            {confirmedOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: C.sub, fontSize: 12 }}>발주 대기 없음</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {confirmedOrders.map((o) => (
                  <div key={o.id} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: radius.md,
                    padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <div style={{ flex: 1, cursor: 'pointer', minWidth: 0 }} onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.order_number}</div>
                      <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>{formatKRW(o.total_amount)}</div>
                    </div>
                    <button
                      disabled={loading[o.id]}
                      onClick={() => handleStartPrint(o.id)}
                      style={{
                        padding: '5px 10px', borderRadius: radius.sm, flexShrink: 0,
                        background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)',
                        color: '#FFD700', fontSize: 10, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit',
                        opacity: loading[o.id] ? 0.5 : 1,
                      }}
                    >{loading[o.id] ? '처리중' : '🖨️ 발주'}</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 입금 완료 */}
          <div style={{ background: C.card, border: '1px solid rgba(0,212,255,0.2)', borderRadius: radius.xl, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#00D4FF' }}>입금 완료</div>
                <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>주문 확인 처리 필요</div>
              </div>
              <span style={{
                background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 800, color: '#00D4FF',
              }}>{paidOrders.length}건</span>
            </div>
            {paidOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px 0', color: C.sub, fontSize: 12 }}>없음</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {paidOrders.map((o) => (
                  <div key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: radius.md,
                    padding: '10px 12px', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.order_number}</div>
                      <div style={{ fontSize: 10, color: C.sub, marginTop: 1 }}>{o.academies?.name}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.white, flexShrink: 0, marginLeft: 8 }}>{formatKRW(o.total_amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 전체 주문 현황 */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: C.white }}>전체 주문</div>
              <button onClick={() => navigate('/admin/orders')} style={{
                background: 'none', border: 'none', color: C.sub,
                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
              }}>전체보기 →</button>
            </div>
            {stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { status: 'pending',   label: '입금 대기',  color: '#29ED73' },
                  { status: 'paid',      label: '입금 확인',  color: '#00D4FF' },
                  { status: 'confirmed', label: '발주 대기',  color: '#FFD700' },
                  { status: 'printing',  label: '인쇄 중',   color: '#FF9800' },
                  { status: 'shipped',   label: '배송 중',   color: '#9B59B6' },
                  { status: 'delivered', label: '배송 완료', color: C.sub     },
                  { status: 'cancelled', label: '취소',      color: '#ff4444' },
                ].map(({ status, label, color }) => {
                  const count = stats.counts[status] || 0;
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={status} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color }}>{count}건</span>
                      </div>
                      <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </AdminShell>
  );
}
