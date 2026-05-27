import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Plus, Minus } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import EmptyState from '../../components/ui/EmptyState';
import { C, radius } from '../../tokens';
import { useCartStore } from '../../store/cartStore';
import { formatKRW } from '../../lib/utils';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total } = useCartStore();

  return (
    <AppShell>
      <Topbar title="장바구니" back />
      <div style={{ padding: '20px', maxWidth: 700, margin: '0 auto' }}>
        {items.length === 0 ? (
          <EmptyState
            icon={<ShoppingCart size={48} color={C.gray} />}
            title="장바구니가 비어있습니다"
            description="카드를 만들고 주문해보세요"
            action={<Btn onClick={() => navigate('/players')}>선수 카드 만들기</Btn>}
          />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {items.map((item) => (
                <div key={item.cardId} style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: radius.lg, padding: '16px',
                  display: 'flex', gap: 16, alignItems: 'center',
                }}>
                  {item.card?.preview_url ? (
                    <img src={item.card.preview_url} alt="카드" style={{ width: 56, height: 78, objectFit: 'cover', borderRadius: 6, flexShrink: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.5)' }} />
                  ) : (
                    <div style={{ width: 56, height: 78, background: C.card2, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 20 }}>🃏</span>
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 4 }}>
                      {item.card?.playerName || item.card?.players?.name || '선수 카드'}
                    </div>
                    <div style={{ fontSize: 13, color: C.sub }}>
                      {item.card?.card_templates?.name || item.card?.template?.name || 'Gold'} 카드
                    </div>
                    <div style={{ fontSize: 14, color: C.gold, fontWeight: 700, marginTop: 4 }}>
                      {formatKRW(item.unitPrice)} / 장
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <button onClick={() => removeItem(item.cardId)} style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={16} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => updateQuantity(item.cardId, item.quantity - 1)}
                        style={{ width: 28, height: 28, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      ><Minus size={14} /></button>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.white, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.cardId, item.quantity + 1)}
                        style={{ width: 28, height: 28, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 6, color: C.white, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      ><Plus size={14} /></button>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{formatKRW(item.unitPrice * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '20px', marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: C.sub }}>상품 합계</span>
                <span style={{ color: C.white }}>{formatKRW(total())}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: C.sub }}>배송비</span>
                <span style={{ color: C.green }}>무료</span>
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 17, fontWeight: 700, color: C.white }}>총 결제금액</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{formatKRW(total())}</span>
              </div>
            </div>

            <Btn fullWidth size="lg" onClick={() => navigate('/checkout')}>
              주문하기 — {formatKRW(total())}
            </Btn>
          </>
        )}
      </div>
    </AppShell>
  );
}
