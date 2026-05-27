import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { C, radius } from '../../tokens';
import Btn from '../../components/ui/Btn';
import Input from '../../components/ui/Input';
import { signIn } from '../../services/auth.service';
import { loadCurrentUser } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setAcademy } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(form);
      const { user, academy } = await loadCurrentUser();
      setUser(user);
      setAcademy(academy);
      navigate(from, { replace: true });
    } catch (err) {
      setError('이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: '#29ED73', letterSpacing: 4, fontWeight: 700, marginBottom: 8 }}>⚽ FDL CARD</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.white }}>로그인</h1>
          <p style={{ color: C.sub, fontSize: 14, marginTop: 8 }}>아카데미 계정으로 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="이메일"
            type="email"
            placeholder="academy@example.com"
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
            <div style={{ background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: radius.md, padding: '10px 14px', fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}

          <Btn type="submit" fullWidth loading={loading} style={{ marginTop: 8 }}>
            로그인
          </Btn>
        </form>

        <p style={{ textAlign: 'center', color: C.sub, fontSize: 14, marginTop: 24 }}>
          계정이 없으신가요?{' '}
          <Link to="/signup" style={{ color: '#29ED73', textDecoration: 'none', fontWeight: 600 }}>무료 가입</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 8 }}>
          <Link to="/" style={{ color: C.gray, textDecoration: 'none', fontSize: 13 }}>← 홈으로</Link>
        </p>
      </div>
    </div>
  );
}
