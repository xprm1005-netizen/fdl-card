import { NavLink, useNavigate } from 'react-router-dom';
import { Package, Printer, Users, CreditCard, ArrowLeft } from 'lucide-react';
import { C, radius } from '../../tokens';

const NAV = [
  { to: '/admin/orders',    icon: Package,  label: '주문 관리' },
  { to: '/admin/print',     icon: Printer,  label: '인쇄 작업' },
  { to: '/admin/academies', icon: Users,    label: '아카데미' },
  { to: '/admin/templates', icon: CreditCard, label: '템플릿' },
];

export default function AdminShell({ children }) {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <aside style={{
        width: 200, background: C.surface,
        borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column',
        height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 100,
      }}>
        <div style={{ padding: '20px 16px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.toty, fontWeight: 700, letterSpacing: 2 }}>FDL CARD</div>
          <div style={{ fontSize: 13, color: C.white, fontWeight: 600, marginTop: 2 }}>관리자</div>
        </div>
        <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: radius.md,
              color: isActive ? C.toty : C.sub,
              background: isActive ? C.totySoft : 'transparent',
              textDecoration: 'none', fontSize: 14, fontWeight: 500,
            })}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', padding: '10px 12px',
              background: 'none', border: 'none',
              color: C.sub, cursor: 'pointer', fontSize: 14,
              fontFamily: 'inherit', borderRadius: radius.md,
            }}
          >
            <ArrowLeft size={18} />
            대시보드로
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, marginLeft: 200, minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
