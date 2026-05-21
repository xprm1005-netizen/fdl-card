import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Btn from '../../components/ui/Btn';
import Spinner from '../../components/ui/Spinner';
import { C, radius } from '../../tokens';
import { confirmPayment } from '../../services/orders.service';
import { useCartStore } from '../../store/cartStore';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const clearCart = useCartStore((s) => s.clear);
  const [state, setState] = useState('confirming'); // confirming | done | error
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = Number(params.get('amount'));

    if (!paymentKey || !orderId || !amount) { navigate('/dashboard'); return; }

    confirmPayment({ paymentKey, orderId, amount })
      .then(({ orderNumber }) => {
        clearCart();
        setOrderNumber(orderNumber);
        setState('done');
      })
      .catch(() => setState('error'));
  }, []);

  if (state === 'confirming') return (
    <AppShell>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 16 }}>
        <Spinner size={40} />
        <p style={{ color: C.sub }}>결제 확인 중...</p>
      </div>
    </AppShell>
  );

  if (state === 'error') return (
    <AppShell>
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ color: C.red }}>결제 확인 실패</h2>
        <p style={{ color: C.sub }}>결제는 완료됐을 수 있습니다. 주문 내역을 확인해주세요.</p>
        <Btn onClick={() => navigate('/orders')}>주문 내역 확인</Btn>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
        <h2 style={{ margin: '0 0 8px', fontSize: 28, color: C.white, fontWeight: 800 }}>주문 완료!</h2>
        <div style={{ fontSize: 14, color: C.gold, fontWeight: 600, marginBottom: 24 }}>{orderNumber}</div>
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: radius.xl, padding: '24px',
          marginBottom: 28, textAlign: 'left',
        }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>🃏</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>카드 제작이 시작됩니다</div>
              <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>주문 확인 후 영업일 기준 7일 이내 배송</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <span style={{ fontSize: 20 }}>📦</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.white }}>배송 알림</div>
              <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>운송장 번호 등록 시 문자로 알려드립니다</div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={() => navigate('/orders')} fullWidth>주문 내역 보기</Btn>
          <Btn variant="ghost" onClick={() => navigate('/dashboard')} fullWidth>홈으로</Btn>
        </div>
      </div>
    </AppShell>
  );
}
