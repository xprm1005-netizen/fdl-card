import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import Input from '../../components/ui/Input';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { createOrder } from '../../services/orders.service';
import { formatKRW } from '../../lib/utils';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { academy } = useAuthStore();
  const { items, total, clear } = useCartStore();
  const [form, setForm] = useState({ name: '', phone: '', address: '', address2: '', zip: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function handleNext(e) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.zip) {
      setError('필수 항목을 모두 입력해주세요.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const cartItems = items.map((i) => ({ cardId: i.cardId, quantity: i.quantity, unitPrice: i.unitPrice }));
      const { orderId, amount } = await createOrder({
        academyId: academy.id,
        cartItems,
        shipping: { name: form.name, phone: form.phone, address: form.address, address2: form.address2, zip: form.zip },
      });
      navigate('/checkout/payment', { state: { orderId, amount } });
    } catch (err) {
      setError('주문 생성 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <AppShell>
      <Topbar title="배송 정보" back />
      <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
        {/* Order summary */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '16px', marginBottom: 24 }}>
          <div style={{ fontSize: 14, color: C.sub, marginBottom: 8 }}>주문 내역</div>
          {items.map((item) => (
            <div key={item.cardId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: C.white, padding: '4px 0' }}>
              <span>{item.card?.players?.name || '선수 카드'} × {item.quantity}장</span>
              <span style={{ color: C.gold }}>{formatKRW(item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <span style={{ color: C.white }}>합계</span>
            <span style={{ color: C.gold, fontSize: 18 }}>{formatKRW(total())}</span>
          </div>
        </div>

        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ margin: 0, fontSize: 17, color: C.white }}>배송지 입력</h3>
          <Input label="받는 분 *" placeholder="홍길동" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <Input label="연락처 *" type="tel" placeholder="010-0000-0000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <div style={{ display: 'flex', gap: 10 }}>
            <Input label="우편번호 *" placeholder="12345" value={form.zip} onChange={(e) => set('zip', e.target.value)} style={{ width: 120 }} />
          </div>
          <Input label="주소 *" placeholder="시/도, 시/군/구, 읍/면/동, 번지" value={form.address} onChange={(e) => set('address', e.target.value)} />
          <Input label="상세 주소" placeholder="아파트, 동/호수 등" value={form.address2} onChange={(e) => set('address2', e.target.value)} />

          {error && (
            <div style={{ background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: radius.md, padding: '10px 14px', fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}

          <div style={{ background: C.goldSoft, border: `1px solid ${C.goldMed}`, borderRadius: radius.md, padding: '12px 16px', fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
            📦 주문 확인 후 <strong style={{ color: C.gold }}>7영업일 이내</strong> 배송됩니다.<br />
            카드 제작 특성상 결제 완료 후 취소/환불이 어려울 수 있습니다.
          </div>

          <Btn type="submit" fullWidth size="lg" loading={loading}>
            결제하기 — {formatKRW(total())}
          </Btn>
        </form>
      </div>
    </AppShell>
  );
}
