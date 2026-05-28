import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2, XCircle } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Pill from '../../components/ui/Pill';
import { C, radius } from '../../tokens';
import { getOrder, cancelOrder, deleteOrder } from '../../services/orders.service';
import { formatKRW, formatDateTime } from '../../lib/utils';

const STATUS_STEPS = ['pending', 'paid', 'confirmed', 'printing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then(setOrder);
  }, [id]);

  async function handleCancel() {
    if (!confirm('주문을 취소하시겠습니까?')) return;
    try {
      await cancelOrder(id);
      setOrder((o) => ({ ...o, status: 'cancelled' }));
    } catch (err) {
      alert('취소 중 오류: ' + err.message);
    }
  }

  async function handleDelete() {
    if (!confirm('주문을 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    try {
      await deleteOrder(id);
      navigate('/orders');
    } catch (err) {
      alert('삭제 중 오류: ' + err.message);
    }
  }

  if (!order) return <AppShell><div style={{ padding: 40, textAlign: 'center', color: C.sub }}>로딩 중...</div></AppShell>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <AppShell>
      <Topbar title={order.order_number} back />
      <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto' }}>
        {/* Status */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: C.white }}>주문 상태</h3>
            <Pill status={order.status} />
          </div>
          {/* Timeline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {STATUS_STEPS.map((s, i) => {
              const done = i <= currentStep;
              const LABELS = { pending: '주문', paid: '결제', confirmed: '확인', printing: '인쇄', shipped: '배송', delivered: '완료' };
              return [
                <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: done ? C.gold : C.border,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, color: done ? C.bg : C.sub, fontWeight: 700,
                  }}>{done ? '✓' : i + 1}</div>
                  <div style={{ fontSize: 10, color: done ? C.gold : C.sub, whiteSpace: 'nowrap' }}>{LABELS[s]}</div>
                </div>,
                i < STATUS_STEPS.length - 1 ? (
                  <div key={`l-${s}`} style={{ flex: 1, height: 2, background: i < currentStep ? C.gold : C.border, marginBottom: 14 }} />
                ) : null,
              ];
            })}
          </div>
          {order.tracking_number && (
            <div style={{ marginTop: 16, background: C.totySoft, border: `1px solid ${C.toty}30`, borderRadius: radius.md, padding: '12px 16px' }}>
              <div style={{ fontSize: 12, color: C.toty, fontWeight: 600 }}>배송 정보</div>
              <div style={{ fontSize: 14, color: C.white, marginTop: 2 }}>{order.shipping_carrier} · {order.tracking_number}</div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, color: C.white }}>주문 상품</h3>
          {order.order_items?.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: 14, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              {item.player_cards?.preview_url && (
                <img src={item.player_cards.preview_url} alt="카드" style={{ width: 50, height: 70, objectFit: 'cover', borderRadius: 5 }} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>{item.player_cards?.players?.name} 카드</div>
                <div style={{ fontSize: 12, color: C.sub }}>{item.player_cards?.card_templates?.name} · {item.quantity}장</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{formatKRW(item.unit_price * item.quantity)}</div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 700 }}>
            <span style={{ color: C.white }}>합계</span>
            <span style={{ color: C.gold, fontSize: 18 }}>{formatKRW(order.total_amount)}</span>
          </div>
        </div>

        {/* Shipping */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 16, color: C.white }}>배송 정보</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: C.white }}>
            <div><span style={{ color: C.sub, marginRight: 8 }}>받는 분</span>{order.shipping_name}</div>
            <div><span style={{ color: C.sub, marginRight: 8 }}>연락처</span>{order.shipping_phone}</div>
            <div><span style={{ color: C.sub, marginRight: 8 }}>주소</span>{order.shipping_address} {order.shipping_address2}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, color: C.gray, textAlign: 'center', marginBottom: order.status === 'pending' || order.status === 'cancelled' ? 20 : 0 }}>
          주문일시 {formatDateTime(order.created_at)}
        </div>

        {/* 결제 대기 상태: 취소 + 삭제 버튼 */}
        {order.status === 'pending' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleCancel} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'transparent', border: '1px solid #ff993340',
              borderRadius: radius.md, padding: '12px 0',
              color: '#ff9933', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <XCircle size={15} /> 결제 취소
            </button>
            <button onClick={handleDelete} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'transparent', border: '1px solid #ff444440',
              borderRadius: radius.md, padding: '12px 0',
              color: '#ff4444', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <Trash2 size={15} /> 주문 삭제
            </button>
          </div>
        )}

        {/* 취소된 주문: 삭제만 가능 */}
        {order.status === 'cancelled' && (
          <button onClick={handleDelete} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'transparent', border: '1px solid #ff444440',
            borderRadius: radius.md, padding: '12px 0',
            color: '#ff4444', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Trash2 size={15} /> 주문 삭제
          </button>
        )}
      </div>
    </AppShell>
  );
}
