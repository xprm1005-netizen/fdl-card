import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { loadCurrentUser } from './services/auth.service';
import { supabase } from './lib/supabase';
import { C } from './tokens';

const LandingPage       = lazy(() => import('./pages/LandingPage'));
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage        = lazy(() => import('./pages/auth/SignupPage'));
const DashboardPage     = lazy(() => import('./pages/dashboard/DashboardPage'));
const PlayersPage       = lazy(() => import('./pages/players/PlayersPage'));
const PlayerNewPage     = lazy(() => import('./pages/players/PlayerNewPage'));
const PlayerDetailPage  = lazy(() => import('./pages/players/PlayerDetailPage'));
const CardCreatePage    = lazy(() => import('./pages/cards/CardCreatePage'));
const CardDetailPage    = lazy(() => import('./pages/cards/CardDetailPage'));
const CartPage          = lazy(() => import('./pages/cart/CartPage'));
const CheckoutPage      = lazy(() => import('./pages/checkout/CheckoutPage'));
const PaymentPage       = lazy(() => import('./pages/checkout/PaymentPage'));
const PaymentSuccessPage= lazy(() => import('./pages/checkout/PaymentSuccessPage'));
const PaymentFailPage   = lazy(() => import('./pages/checkout/PaymentFailPage'));
const OrdersPage        = lazy(() => import('./pages/orders/OrdersPage'));
const OrderDetailPage   = lazy(() => import('./pages/orders/OrderDetailPage'));
const SettingsPage      = lazy(() => import('./pages/settings/SettingsPage'));
const AdminOrdersPage   = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminOrderDetail  = lazy(() => import('./pages/admin/AdminOrderDetailPage'));
const AdminPrintPage    = lazy(() => import('./pages/admin/AdminPrintPage'));
const AdminAcademies    = lazy(() => import('./pages/admin/AdminAcademiesPage'));
const AdminTemplates    = lazy(() => import('./pages/admin/AdminTemplatesPage'));
const DemoCardPage      = lazy(() => import('./pages/demo/DemoCardPage'));
const RankingPage       = lazy(() => import('./pages/ranking/RankingPage'));
const TeamRegisterPage  = lazy(() => import('./pages/players/TeamRegisterPage'));
const PricingPage       = lazy(() => import('./pages/pricing/PricingPage'));
const CardSharePage     = lazy(() => import('./pages/share/CardSharePage'));
const PackOpenPage      = lazy(() => import('./pages/packs/PackOpenPage'));

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@fdlcard.com';

function Protected({ children }) {
  const { user, loading } = useAuthStore();
  const location = useLocation();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuthStore();
  if (loading) return <Loader />;
  if (!user || user.email !== ADMIN_EMAIL) return <Navigate to="/dashboard" replace />;
  return children;
}

function Loader() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const { setUser, setAcademy, setLoading } = useAuthStore();

  useEffect(() => {
    loadCurrentUser()
      .then(({ user, academy }) => { setUser(user); setAcademy(academy); })
      .catch(() => {})
      .finally(() => setLoading(false));

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          setUser(null);
          setAcademy(null);
          setLoading(false);
        } else if (session?.user) {
          loadCurrentUser()
            .then(({ user, academy }) => { setUser(user); setAcademy(academy); })
            .catch(() => {})
            .finally(() => setLoading(false));
        }
      });
      subscription = data.subscription;
    } catch {
      setLoading(false);
    }
    return () => subscription?.unsubscribe();
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.white, fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, sans-serif" }}>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
          <Route path="/players" element={<Protected><PlayersPage /></Protected>} />
          <Route path="/players/new" element={<Protected><PlayerNewPage /></Protected>} />
          <Route path="/players/:id" element={<Protected><PlayerDetailPage /></Protected>} />
          <Route path="/cards/create/:playerId" element={<Protected><CardCreatePage /></Protected>} />
          <Route path="/cards/:id" element={<Protected><CardDetailPage /></Protected>} />
          <Route path="/cart" element={<Protected><CartPage /></Protected>} />
          <Route path="/checkout" element={<Protected><CheckoutPage /></Protected>} />
          <Route path="/checkout/payment" element={<Protected><PaymentPage /></Protected>} />
          <Route path="/checkout/success" element={<Protected><PaymentSuccessPage /></Protected>} />
          <Route path="/checkout/fail" element={<Protected><PaymentFailPage /></Protected>} />
          <Route path="/orders" element={<Protected><OrdersPage /></Protected>} />
          <Route path="/orders/:id" element={<Protected><OrderDetailPage /></Protected>} />
          <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />

          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
          <Route path="/admin/print" element={<AdminRoute><AdminPrintPage /></AdminRoute>} />
          <Route path="/admin/academies" element={<AdminRoute><AdminAcademies /></AdminRoute>} />
          <Route path="/admin/templates" element={<AdminRoute><AdminTemplates /></AdminRoute>} />

          <Route path="/demo" element={<DemoCardPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/ranking" element={<Protected><RankingPage /></Protected>} />
          <Route path="/players/new-team" element={<Protected><TeamRegisterPage /></Protected>} />
          <Route path="/packs" element={<Protected><PackOpenPage /></Protected>} />

          {/* 공개 카드 공유 — 인증 불필요 */}
          <Route path="/c/:token" element={<CardSharePage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}
