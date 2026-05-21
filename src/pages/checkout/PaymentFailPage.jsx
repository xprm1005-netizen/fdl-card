import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Btn from '../../components/ui/Btn';
import { C } from '../../tokens';

export default function PaymentFailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const location = useLocation();
  const message = params.get('message') || location.state?.message || '결제가 취소되거나 실패했습니다.';

  return (
    <AppShell>
      <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 400, margin: '0 auto' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>😢</div>
        <h2 style={{ margin: '0 0 8px', color: C.white }}>결제 실패</h2>
        <p style={{ color: C.sub, fontSize: 14, marginBottom: 32 }}>{message}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={() => navigate('/cart')} fullWidth>장바구니로 돌아가기</Btn>
          <Btn variant="ghost" onClick={() => navigate('/dashboard')} fullWidth>홈으로</Btn>
        </div>
      </div>
    </AppShell>
  );
}
