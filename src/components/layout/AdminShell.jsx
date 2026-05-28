import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Printer, Users, CreditCard, LogOut } from 'lucide-react';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: '대시보드' },
  { to: '/admin/orders',    icon: Package,          label: '주문' },
  { to: '/admin/print',     icon: Printer,          label: '인쇄' },
  { to: '/admin/academies', icon: Users,            label: '아카데미' },
  { to: '/admin/templates', icon: CreditCard,       label: '템플릿' },
];

export default function AdminShell({ children }) {
  const navigate = useNavigate();
  const { setUser, setAcademy } = useAuthStore();

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setAcademy(null);
    navigate('/admin', { replace: true });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <style>{`
        @media (max-width: 767px) {
          .admin-sidebar  { display: none !important; }
          .admin-main     { margin-left: 0 !important; padding-bottom: 72px; }
          .admin-topnav   { display: flex !important; }
          .admin-bottomnav { display: flex !important; }
        }
        @media (min-width: 768px) {
          .admin-sidebar  { display: flex !important; }
          .admin-main     { margin-left: 200px !important; }
          .admin-topnav   { display: none !important; }
          .admin-bottomnav { display: none !important; }
        }
      `}</style>

      {/* ── 데스크탑 사이드바 ── */}
      <aside className="admin-sidebar" style={{
        width: 200, background: C.surface,
        borderRight: `1px solid ${C.border}`,
        flexDirection: 'column',
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
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: '100%', padding: '10px 12px',
            background: 'none', border: 'none',
            color: C.sub, cursor: 'pointer', fontSize: 14,
            fontFamily: 'inherit', borderRadius: radius.md,
          }}>
            <LogOut size={18} />
            로그아웃
          </button>
        </div>
      </aside>

      {/* ── 모바일 상단 헤더 ── */}
      <div className="admin-topnav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', height: 52,
      }}>
        <span style={{ fontSize: 14, fontWeight: 900, color: C.toty, letterSpacing: 2 }}>FDL CARD</span>
        <button onClick={handleLogout} style={{
          background: 'none', border: `1px solid ${C.border}`,
          borderRadius: 8, padding: '5px 12px',
          color: C.sub, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <LogOut size={14} />
          로그아웃
        </button>
      </div>

      {/* ── 모바일 하단 탭바 ── */}
      <nav className="admin-bottomnav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        background: C.surface, borderTop: `1px solid ${C.border}`,
        justifyContent: 'space-around', alignItems: 'stretch',
        height: 60,
      }}>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flex: 1, gap: 3, textDecoration: 'none',
            color: isActive ? C.toty : C.sub,
            background: isActive ? C.totySoft : 'transparent',
          })}>
            <Icon size={20} />
            <span style={{ fontSize: 9, fontWeight: 600 }}>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ── 콘텐츠 영역 ── */}
      <main className="admin-main" style={{ flex: 1, minHeight: '100vh', paddingTop: 52 }}>
        {children}
      </main>
    </div>
  );
}
