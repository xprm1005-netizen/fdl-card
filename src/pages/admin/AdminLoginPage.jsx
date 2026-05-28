import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { C, radius } from '../../tokens';
import Btn from '../../components/ui/Btn';
import Input from '../../components/ui/Input';
import { signIn, loadCurrentUser } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

// 서버에서 admin 권한 확인 (환경변수 불일치 문제 방지)
async function checkIsAdmin() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return false;
  const res = await fetch('/api/admin/me', {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  return res.ok;
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user, setUser, setAcademy } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 경우 admin 여부 서버로 확인 후 리다이렉트
  useEffect(() => {
    if (user) {
      checkIsAdmin().then((ok) => {
        if (ok) navigate('/admin/dashboard', { replace: true });
      });
    }
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form);
      const isAdmin = await checkIsAdmin();
      if (!isAdmin) {
        await supabase.auth.signOut();
        setError('관리자 계정이 아닙니다.');
        setLoading(false);
        return;
      }
      const { user: u, academy } = await loadCurrentUser();
      setUser(u);
      setAcademy(academy);
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError('이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>

        {/* 로고 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 16,
            background: 'rgba(41,237,115,0.1)', border: '1px solid rgba(41,237,115,0.3)',
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 24 }}>🔐</span>
          </div>
          <div style={{ fontSize: 10, color: '#29ED73', letterSpacing: 4, fontWeight: 700, marginBottom: 6 }}>
            FDL CARD
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: C.white }}>
            관리자 로그인
          </h1>
          <p style={{ color: C.sub, fontSize: 13, marginTop: 6 }}>
            관리자 전용 페이지입니다
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input
            label="이메일"
            type="email"
            placeholder="admin@fdl.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="비밀번호"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && (
            <div style={{
              background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.3)',
              borderRadius: radius.md, padding: '10px 14px',
              fontSize: 13, color: '#ff6b6b',
            }}>
              {error}
            </div>
          )}

          <Btn type="submit" fullWidth loading={loading} style={{ marginTop: 4 }}>
            관리자 대시보드 입장
          </Btn>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: C.sub, textDecoration: 'none', fontSize: 13 }}>
            ← 일반 사용자 홈으로
          </a>
        </p>
      </div>
    </div>
  );
}
