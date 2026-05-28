import { useNavigate, useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Btn from '../../components/ui/Btn';
import { C, radius } from '../../tokens';
import { formatKRW } from '../../lib/utils';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, amount } = location.state || {};

  return (
    <AppShell>
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
        <h2 style={{ margin: '0 0 8px', fontSize: 26, color: C.white, fontWeight: 900 }}>주문이 접수됐어요!</h2>
        {orderNumber && (
          <div style={{ fontSize: 14, color: '#29ED73', fontWeight: 700, marginBottom: 6 }}>{orderNumber}</div>
        )}
        {amount && (
          <div style={{ fontSize: 13, color: C.sub, marginBottom: 28 }}>입금 금액: {formatKRW(amount)}</div>
        )}

        <div style={{
          background: 'rgba(41,237,115,0.06)',
          border: '1px solid rgba(41,237,115,0.25)',
          borderRadius: radius.xl, padding: '20px',
          marginBottom: 28, textAlign: 'left',
        }}>
          <div style={{ fontSize: 13, color: C.white, fontWeight: 700, marginBottom: 12 }}>다음 단계 안내</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '💳', title: '계좌이체 완료', desc: '신한 110-590-001866 (풋볼데이터랩)으로 이체' },
              { icon: '✔️', title: '입금 확인', desc: '관리자가 입금 확인 후 제작 시작 (영업일 1~2일)' },
              { icon: '📦', title: '카드 배송', desc: '제작 완료 후 아카데미로 빠르게 배송' },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{title}</div>
                  <div style={{ fontSize: 12, color: C.sub, marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn onClick={() => navigate('/orders')} fullWidth>주문 내역 확인</Btn>
          <Btn variant="ghost" onClick={() => navigate('/dashboard')} fullWidth>홈으로</Btn>
        </div>
      </div>
    </AppShell>
  );
}
