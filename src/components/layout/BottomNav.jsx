import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Plus, Package, User } from 'lucide-react';
import { C } from '../../tokens';
import { useCartStore } from '../../store/cartStore';

const LEFT_NAV = [
  { to: '/dashboard', icon: Home,  label: '홈' },
  { to: '/players',   icon: Users, label: '선수' },
];
const RIGHT_NAV = [
  { to: '/orders',   icon: Package, label: '주문', cartBadge: true },
  { to: '/settings', icon: User,    label: '마이' },
];

export default function BottomNav() {
  const count = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const location = useLocation();

  function isActive(to) {
    return location.pathname === to || location.pathname.startsWith(to + '/');
  }

  const btnBase = {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '10px 0 8px', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: 10, fontWeight: 500, fontFamily: 'inherit', gap: 3,
    position: 'relative',
  };

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: C.surface,
      borderTop: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'stretch',
      zIndex: 100,
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
    }}>
      {/* Left tabs */}
      {LEFT_NAV.map(({ to, icon: Icon, label }) => (
        <button key={to} onClick={() => navigate(to)} style={{ ...btnBase, color: isActive(to) ? '#29ED73' : C.gray }}>
          <Icon size={22} />
          <span>{label}</span>
        </button>
      ))}

      {/* Center: 카드 만들기 */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0 4px' }}>
        <button
          onClick={() => navigate('/players')}
          style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#29ED73', border: '3px solid #0a0a0a',
            boxShadow: '0 4px 20px rgba(41,237,115,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transform: 'translateY(-10px)',
          }}>
          <Plus size={26} color="#0a0a0a" strokeWidth={2.5} />
        </button>
      </div>

      {/* Right tabs */}
      {RIGHT_NAV.map(({ to, icon: Icon, label, cartBadge }) => (
        <button
          key={to}
          onClick={() => (cartBadge && count > 0) ? navigate('/cart') : navigate(to)}
          style={{ ...btnBase, color: isActive(to) ? '#29ED73' : C.gray }}>
          <div style={{ position: 'relative' }}>
            <Icon size={22} />
            {cartBadge && count > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: '#29ED73', color: '#0a0a0a',
                borderRadius: 8, padding: '1px 5px',
                fontSize: 9, fontWeight: 700,
              }}>{count}</span>
            )}
          </div>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
