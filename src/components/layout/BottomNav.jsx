import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { Home, Users, Trophy, Package, User } from 'lucide-react';
import { C } from '../../tokens';
import { useCartStore } from '../../store/cartStore';

const NAV = [
  { to: '/dashboard', icon: Home,    label: '홈' },
  { to: '/players',   icon: Users,   label: '선수' },
  { to: '/ranking',   icon: Trophy,  label: '랭킹' },
  { to: '/orders',    icon: Package, label: '주문', cartBadge: true },
  { to: '/settings',  icon: User,    label: '마이' },
];

export default function BottomNav() {
  const count = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
    }}>
      {NAV.map(({ to, icon: Icon, label, cartBadge }) => {
        const isActive = location.pathname === to || location.pathname.startsWith(to + '/');

        function handleClick() {
          if (cartBadge && count > 0) {
            navigate('/cart');
          } else {
            navigate(to);
          }
        }

        return (
          <button
            key={to}
            onClick={handleClick}
            style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '10px 0 8px',
              color: isActive ? C.gold : C.gray,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 10, fontWeight: 500,
              position: 'relative',
              gap: 3,
              fontFamily: 'inherit',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={22} />
              {cartBadge && count > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -8,
                  background: C.gold, color: C.bg,
                  borderRadius: 8, padding: '1px 5px',
                  fontSize: 9, fontWeight: 700,
                }}>{count}</span>
              )}
            </div>
            {label}
          </button>
        );
      })}
    </nav>
  );
}
