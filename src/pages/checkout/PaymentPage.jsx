import { useNavigate, useLocation } from 'react-router-dom';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { C, radius } from '../../tokens';
import { formatKRW } from '../../lib/utils';
import { useCartStore } from '../../store/cartStore';

const BANK = {
  name: '신한은행',
  account: '110-590-001866',
  holder: '풋볼데이터랩 (유재상)',
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const clearCart = useCartStore((s) => s.clear);
  const { orderId, amount, orderNumber } = location.state || {};

  if (!orderId || !amount) {
    navigate('/cart');
    return null;
  }

  function handleDone() {
    clearCart();
    navigate('/checkout/success', { state: { orderNumber, amount, bankTransfer: true } });
  }

  return (
    <AppShell>
      <Topbar title="계좌이체 결제" back />
      <div style={{ padding: '24px 20px', maxWidth: 480, margin: '0 auto' }}>

        {/* 결제 금액 */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: radius.xl, padding: '24px', marginBottom: 20,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 8, letterSpacing: 0.5 }}>결제 금액</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: '#29ED73', letterSpacing: -1 }}>
            {formatKRW(amount)}
          </div>
          {orderNumber && (
            <div style={{ fontSize: 12, color: C.sub, marginTop: 8 }}>주문번호 {orderNumber}</div>
          )}
        </div>

        {/* 계좌 정보 */}
        <div style={{
          background: 'rgba(41,237,115,0.06)',
          border: '1px solid rgba(41,237,115,0.25)',
          borderRadius: radius.xl, padding: '20px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 12, color: '#29ED73', fontWeight: 700, letterSpacing: 1, marginBottom: 14 }}>
            입금 계좌 정보
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: C.sub }}>은행</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{BANK.name}</span>
            </div>
            <div style={{ height: 1, background: C.border }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: C.sub }}>계좌번호</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#29ED73', letterSpacing: 1 }}>{BANK.account}</span>
            </div>
            <div style={{ height: 1, background: C.border }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: C.sub }}>예금주</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.white }}>{BANK.holder}</span>
            </div>
          </div>
        </div>

        {/* 안내 */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: radius.lg, padding: '16px', marginBottom: 28,
          fontSize: 13, color: C.sub, lineHeight: 1.7,
        }}>
          <div style={{ color: C.white, fontWeight: 700, marginBottom: 6 }}>입금 안내</div>
          <div>• 위 계좌로 <strong style={{ color: '#29ED73' }}>{formatKRW(amount)}</strong>을 이체해주세요</div>
          <div>• 입금자명을 아카데미명 또는 주문번호로 입력해 주시면 확인이 빠릅니다</div>
          <div>• 입금 확인 후 카드 제작이 시작됩니다 (영업일 기준 1~2일)</div>
          <div>• 문의: 카카오톡 또는 인스타그램 DM</div>
        </div>

        {/* 이체 완료 버튼 */}
        <button onClick={handleDone} style={{
          width: '100%', padding: '16px 0',
          background: '#29ED73', color: '#0a0a0a',
          border: 'none', borderRadius: radius.lg,
          fontSize: 16, fontWeight: 900,
          cursor: 'pointer', fontFamily: 'inherit',
          marginBottom: 10,
        }}>
          이체 완료했어요 →
        </button>
        <button onClick={() => navigate('/orders')} style={{
          width: '100%', padding: '13px 0',
          background: 'transparent', color: C.sub,
          border: `1px solid ${C.border}`, borderRadius: radius.lg,
          fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          나중에 이체하기
        </button>
      </div>
    </AppShell>
  );
}
