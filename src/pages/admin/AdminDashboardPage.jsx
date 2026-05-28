import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../../components/layout/AdminShell';
import Pill from '../../components/ui/Pill';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';
import { formatKRW, formatDateTime } from '../../lib/utils';
import { updateOrderStatus, createPrintJob } from '../../services/admin.service';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [confirmedOrders, setConfirmedOrders] = useState([]);
  const [loading, setLoading] = useState({});

  async function loadAll() {
    const { data: orders } = await supabase
      .from('orders')
      .select('id, status, total_amount, created_at, order_number, academy_id, academies(name)')
      .order('created_at', { ascending: false });

    if (!orders) return;

    // 통계
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
      <div style={{ padding: '24px' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: '#29ED73', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>ADMIN DASHBOARD</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.white }}>전체 주문 현황</h2>
        </div>

        {/* 매출 요약 */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: '총 누적 매출',    value: formatKRW(stats.totalRevenue),  icon: '💰' },
              { label: '이번 달 매출',   value: formatKRW(stats.monthRevenue),   icon: '📅' },
              { label: '전체 주문 건수', value: `${stats.total}건`,              icon: '📦' },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: radius.lg, padding: '16px',
              }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: C.white }}>{value}</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* 상태별 현황 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 28 }}>
          {STATUS_CARDS.map(({ label, value, color, bg, border, urgent }) => (
            <div key={label} style={{
              background: bg, border: `1px solid ${border}`,
              borderRadius: radius.lg, padding: '14px 10px', textAlign: 'center',
              position: 'relative',
            }}>
              {urgent && value > 0 && (
                <div style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: color, boxShadow: `0 0 6px ${color}`,
                }} />
              )}
              <div style={{ fontSize: 26, fontWeight: 900, color }}>{value}</div>
              <div style={{ fontSize: 10, color: C.sub, marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* ── 입금 확인 필요 ── */}
          <div style={{ background: C.card, border: '1px solid rgba(41,237,115,0.25)', borderRadius: radius.xl, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#29ED73' }}>입금 확인 필요</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>신한 110-590-001866 입금 대기 중</div>
              </div>
              <div style={{
                background: 'rgba(41,237,115,0.15)', border: '1px solid rgba(41,237,115,0.3)',
                borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 800, color: '#29ED73',
              }}>
                {pendingOrders.length}건
              </div>
            </div>
            {pendingOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: C.sub, fontSize: 13 }}>대기 중인 주문 없음</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {pendingOrders.map((o) => (
                  <div key={o.id} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: radius.md,
                    padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{o.order_number}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>
                        {o.academies?.name} · {formatKRW(o.total_amount)}
                      </div>
                    </div>
                    <button
                      disabled={loading[o.id]}
                      onClick={() => handleConfirmPayment(o.id)}
                      style={{
                        padding: '6px 12px', borderRadius: radius.sm,
                        background: 'rgba(41,237,115,0.15)', border: '1px solid rgba(41,237,115,0.4)',
                        color: '#29ED73', fontSize: 11, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                        opacity: loading[o.id] ? 0.5 : 1,
                      }}
                    >
                      {loading[o.id] ? '처리중' : '✅ 입금확인'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 발주 대기 (인쇄 전송) ── */}
          <div style={{ background: C.card, border: '1px solid rgba(255,215,0,0.25)', borderRadius: radius.xl, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#FFD700' }}>발주 대기</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>확인 완료 → 인쇄 전송 대기</div>
              </div>
              <div style={{
                background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 800, color: '#FFD700',
              }}>
                {confirmedOrders.length}건
              </div>
            </div>
            {confirmedOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: C.sub, fontSize: 13 }}>발주 대기 없음</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {confirmedOrders.map((o) => (
                  <div key={o.id} style={{
                    background: 'rgba(255,255,255,0.04)', borderRadius: radius.md,
                    padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
                  }}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/admin/orders/${o.id}`)}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{o.order_number}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>
                        {o.academies?.name} · {formatKRW(o.total_amount)}
                      </div>
                    </div>
                    <button
                      disabled={loading[o.id]}
                      onClick={() => handleStartPrint(o.id)}
                      style={{
                        padding: '6px 12px', borderRadius: radius.sm,
                        background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.4)',
                        color: '#FFD700', fontSize: 11, fontWeight: 700,
                        cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                        opacity: loading[o.id] ? 0.5 : 1,
                      }}
                    >
                      {loading[o.id] ? '처리중' : '🖨️ 인쇄발주'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 입금 확인 완료 (주문 확인 대기) ── */}
          <div style={{ background: C.card, border: `1px solid rgba(0,212,255,0.2)`, borderRadius: radius.xl, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#00D4FF' }}>입금 완료</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>주문 확인 처리 필요</div>
              </div>
              <div style={{
                background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)',
                borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 800, color: '#00D4FF',
              }}>
                {paidOrders.length}건
              </div>
            </div>
            {paidOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: C.sub, fontSize: 13 }}>없음</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {paidOrders.map((o) => (
                  <div
                    key={o.id}
                    onClick={() => navigate(`/admin/orders/${o.id}`)}
                    style={{
                      background: 'rgba(255,255,255,0.04)', borderRadius: radius.md,
                      padding: '10px 14px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.gold }}>{o.order_number}</div>
                      <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>{o.academies?.name}</div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{formatKRW(o.total_amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── 최근 전체 주문 ── */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>전체 주문</div>
              <button
                onClick={() => navigate('/admin/orders')}
                style={{
                  background: 'none', border: 'none', color: C.sub,
                  fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                전체보기 →
              </button>
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
                  { status: 'cancelled', label: '취소',      color: '#ff4444'  },
                ].map(({ status, label, color }) => {
                  const count = stats.counts[status] || 0;
                  const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <div key={status} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 12, color: C.sub }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}건</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
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
