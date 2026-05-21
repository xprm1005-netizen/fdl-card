import { NavLink } from 'react-router-dom';
import { Users, CreditCard, ShoppingCart, Package } from 'lucide-react';
import { C } from '../../tokens';
import { useCartStore } from '../../store/cartStore';

const NAV = [
  { to: '/dashboard', icon: CreditCard, label: '홈' },
  { to: '/players',   icon: Users,       label: '선수' },
  { to: '/cart',      icon: ShoppingCart, label: '장바구니' },
  { to: '/orders',    icon: Package,     label: '주문' },
];

export default function BottomNav() {
  const count = useCartStore((s) => s.count());

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
    }}>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink key={to} to={to} style={({ isActive }) => ({
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '10px 0 8px',
          color: isActive ? C.gold : C.gray,
          textDecoration: 'none',
          fontSize: 10, fontWeight: 500,
          position: 'relative',
          gap: 3,
        })}>
          <div style={{ position: 'relative' }}>
            <Icon size={22} />
            {label === '장바구니' && count > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: C.gold, color: C.bg,
                borderRadius: 8, padding: '1px 5px',
                fontSize: 9, fontWeight: 700,
              }}>{count}</span>
            )}
          </div>
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
