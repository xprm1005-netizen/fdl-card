import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AdminShell from '../../components/layout/AdminShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Pill from '../../components/ui/Pill';
import Modal from '../../components/ui/Modal';
import Input, { Select } from '../../components/ui/Input';
import { C, radius } from '../../tokens';
import { getOrder } from '../../services/orders.service';
import { updateOrderStatus, createPrintJob, assignShipping } from '../../services/admin.service';
import { formatKRW, formatDateTime } from '../../lib/utils';

const CARRIERS = ['CJ대한통운', '한진택배', '롯데택배', '우체국택배', '로젠택배', '대신택배'];

const BANK = { name: '신한은행', account: '110-590-001866', holder: '풋볼데이터랩 (유재상)' };

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [shippingModal, setShippingModal] = useState(false);
  const [shipping, setShipping] = useState({ carrier: CARRIERS[0], trackingNumber: '' });
  const [loading, setLoading] = useState(false);

  async function reload() { const o = await getOrder(id); setOrder(o); }
  useEffect(() => { reload(); }, [id]);

  async function handleStatusChange(newStatus) {
    setLoading(true);
    try {
      await updateOrderStatus(id, newStatus);
      await reload();
    } finally {
      setLoading(false);
    }
  }

  async function handlePrint() {
    setLoading(true);
    try {
      await createPrintJob(id);
      await reload();
    } finally {
      setLoading(false);
    }
  }

  async function handleShipping(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await assignShipping(id, shipping.carrier, shipping.trackingNumber);
      setShippingModal(false);
      await reload();
    } finally {
      setLoading(false);
    }
  }

  if (!order) return (
    <AdminShell>
      <div style={{ padding: 40, textAlign: 'center', color: C.sub }}>로딩 중...</div>
    </AdminShell>
  );

  return (
    <AdminShell>
      <Topbar title={order.order_number} back />
      <div style={{ padding: '20px', maxWidth: 800, margin: '0 auto' }}>

        {/* Status + Actions */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: C.white }}>상태 관리</h3>
            <Pill status={order.status} />
          </div>

          {/* 입금 대기: 계좌 정보 + 입금 확인 버튼 */}
          {order.status === 'pending' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{
                background: 'rgba(41,237,115,0.06)',
                border: '1px solid rgba(41,237,115,0.25)',
                borderRadius: radius.md, padding: '14px 16px', marginBottom: 14,
              }}>
                <div style={{ fontSize: 12, color: '#29ED73', fontWeight: 700, marginBottom: 8 }}>
                  입금 대기 계좌
                </div>
                <div style={{ fontSize: 14, color: C.white, fontWeight: 700 }}>
                  {BANK.name} {BANK.account}
                </div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{BANK.holder}</div>
                <div style={{ fontSize: 15, fontWeight: 900, color: '#29ED73', marginTop: 6 }}>
                  {formatKRW(order.total_amount)}
                </div>
              </div>
              <Btn onClick={() => handleStatusChange('paid')} loading={loading} fullWidth>
                ✅ 입금 확인 — 제작 시작
              </Btn>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {order.status === 'paid' && (
              <Btn size="sm" onClick={() => handleStatusChange('confirmed')} loading={loading}>
                ✓ 주문 확인
              </Btn>
            )}
            {order.status === 'confirmed' && (
              <Btn size="sm" onClick={handlePrint} loading={loading}>
                🖨️ 인쇄 전송
              </Btn>
            )}
            {order.status === 'printing' && (
              <Btn size="sm" onClick={() => setShippingModal(true)}>
                📦 발송 등록
              </Btn>
            )}
            {order.status === 'shipped' && (
              <Btn size="sm" onClick={() => handleStatusChange('delivered')} loading={loading}>
                ✓ 배송 완료 처리
              </Btn>
            )}
            {['paid', 'confirmed'].includes(order.status) && (
              <Btn size="sm" variant="danger" onClick={() => {
                if (!confirm('주문을 취소하시겠습니까?')) return;
                handleStatusChange('cancelled');
              }}>
                주문 취소
              </Btn>
            )}
          </div>
        </div>

        {/* Items */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px', color: C.white }}>주문 상품</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
            {order.order_items?.map((item) => (
              <div key={item.id} style={{ textAlign: 'center' }}>
                {item.player_cards?.preview_url && (
                  <img src={item.player_cards.preview_url} alt="카드"
                    style={{ width: '100%', aspectRatio: '400/560', objectFit: 'cover', borderRadius: 8 }} />
                )}
                <div style={{ fontSize: 12, color: C.white, marginTop: 6 }}>
                  {item.player_cards?.players?.name}
                </div>
                <div style={{ fontSize: 11, color: C.sub }}>
                  {item.quantity}장 · {formatKRW(item.unit_price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 16, paddingTop: 12, textAlign: 'right' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.gold }}>
              {formatKRW(order.total_amount)}
            </span>
          </div>
        </div>

        {/* Shipping info */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 12px', color: C.white }}>배송 정보</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: C.sub, width: 70, flexShrink: 0 }}>받는 분</span>
              <span style={{ color: C.white }}>{order.shipping_name} ({order.shipping_phone})</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ color: C.sub, width: 70, flexShrink: 0 }}>주소</span>
              <span style={{ color: C.white }}>
                {order.shipping_zip && `[${order.shipping_zip}] `}
                {order.shipping_address} {order.shipping_address2}
              </span>
            </div>
            {order.tracking_number && (
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ color: C.sub, width: 70, flexShrink: 0 }}>운송장</span>
                <span style={{ color: C.toty, fontWeight: 600 }}>
                  {order.shipping_carrier} {order.tracking_number}
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: 12, color: C.sub, textAlign: 'center' }}>
          주문일시 {formatDateTime(order.created_at)}
        </div>
      </div>

      {/* Shipping modal */}
      <Modal open={shippingModal} onClose={() => setShippingModal(false)} title="배송 정보 등록">
        <form onSubmit={handleShipping} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Select
            label="택배사"
            value={shipping.carrier}
            onChange={(e) => setShipping((s) => ({ ...s, carrier: e.target.value }))}
          >
            {CARRIERS.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Input
            label="운송장 번호"
            placeholder="1234567890123"
            value={shipping.trackingNumber}
            onChange={(e) => setShipping((s) => ({ ...s, trackingNumber: e.target.value }))}
            required
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" type="button" onClick={() => setShippingModal(false)} style={{ flex: 1 }}>
              취소
            </Btn>
            <Btn type="submit" loading={loading} style={{ flex: 2 }}>
              등록하기
            </Btn>
          </div>
        </form>
      </Modal>
    </AdminShell>
  );
}
