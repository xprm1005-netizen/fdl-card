import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Trophy, ShoppingCart, Package, Settings, LogOut, Shield } from 'lucide-react';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { signOut } from '../../services/auth.service';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@fdlcard.com';

const NAV = [
  { to: '/dashboard', icon: Home,     label: '대시보드' },
  { to: '/players',   icon: Users,    label: '선수 관리' },
  { to: '/ranking',   icon: Trophy,   label: '랭킹' },
  { to: '/orders',    icon: Package,  label: '주문 현황' },
  { to: '/settings',  icon: Settings, label: '마이페이지' },
];

export default function Sidebar() {
  const { user, academy, clear } = useAuthStore();
  const count = useCartStore((s) => s.count());
  const navigate = useNavigate();
  const isAdmin = user?.email === ADMIN_EMAIL;

  async function handleSignOut() {
    await signOut();
    clear();
    navigate('/');
  }

  return (
    <aside style={{
      width: 220,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {academy?.logo_url ? (
            <img src={academy.logo_url} alt="로고" style={{ width: 32, height: 32, borderRadius: 6, objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 32, height: 32, background: C.goldSoft, borderRadius: 6, border: `1px solid ${C.goldMed}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, color: C.gold, fontWeight: 800 }}>F</span>
            </div>
          )}
          <div>
            <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>FDL CARD</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 1, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {academy?.name || '아카데미'}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: radius.md,
            color: isActive ? C.gold : C.sub,
            background: isActive ? C.goldSoft : 'transparent',
            textDecoration: 'none', fontSize: 14, fontWeight: 500,
            transition: 'all 0.15s',
          })}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {/* Cart */}
        <NavLink to="/cart" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 12px', borderRadius: radius.md,
          color: isActive ? C.gold : C.sub,
          background: isActive ? C.goldSoft : 'transparent',
          textDecoration: 'none', fontSize: 14, fontWeight: 500,
          transition: 'all 0.15s',
        })}>
          <ShoppingCart size={18} />
          장바구니
          {count > 0 && (
            <span style={{ marginLeft: 'auto', background: C.gold, color: C.bg, borderRadius: 10, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>{count}</span>
          )}
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin/orders" style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: radius.md,
            color: isActive ? C.toty : C.sub,
            background: isActive ? C.totySoft : 'transparent',
            textDecoration: 'none', fontSize: 14, fontWeight: 500,
            marginTop: 8,
          })}>
            <Shield size={18} />
            어드민
          </NavLink>
        )}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px', borderTop: `1px solid ${C.border}` }}>
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '10px 12px',
            background: 'none', border: 'none',
            color: C.sub, cursor: 'pointer',
            fontSize: 14, borderRadius: radius.md,
            fontFamily: 'inherit',
          }}
        >
          <LogOut size={18} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
