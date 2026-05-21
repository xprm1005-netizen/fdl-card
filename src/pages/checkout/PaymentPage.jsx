import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Spinner from '../../components/ui/Spinner';
import { C } from '../../tokens';
import { useAuthStore } from '../../store/authStore';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { academy } = useAuthStore();
  const { orderId, amount } = location.state || {};

  useEffect(() => {
    if (!orderId || !amount) { navigate('/cart'); return; }

    async function initPayment() {
      try {
        const { loadTossPayments } = await import('@tosspayments/sdk');
        const toss = await loadTossPayments(import.meta.env.VITE_TOSS_CLIENT_KEY);
        await toss.requestPayment('카드', {
          amount,
          orderId,
          orderName: `FDL 선수카드`,
          customerName: academy?.name || '아카데미',
          successUrl: `${window.location.origin}/checkout/success`,
          failUrl: `${window.location.origin}/checkout/fail`,
        });
      } catch (err) {
        if (err.code !== 'USER_CANCEL') {
          navigate('/checkout/fail', { state: { message: err.message } });
        } else {
          navigate('/checkout');
        }
      }
    }

    initPayment();
  }, [orderId, amount]);

  return (
    <AppShell>
      <Topbar title="결제" back />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <Spinner size={40} />
        <p style={{ color: C.sub, fontSize: 14 }}>결제창을 준비하고 있습니다...</p>
      </div>
    </AppShell>
  );
}
