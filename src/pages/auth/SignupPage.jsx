import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { C, radius } from '../../tokens';
import Btn from '../../components/ui/Btn';
import Input from '../../components/ui/Input';
import { signUp } from '../../services/auth.service';
import { loadCurrentUser } from '../../services/auth.service';
import { useAuthStore } from '../../store/authStore';

const TEAM_COLORS = ['#FFD700', '#00E5FF', '#E040FB', '#FF5252', '#00E676', '#FF9800', '#FFFFFF'];

export default function SignupPage() {
  const navigate = useNavigate();
  const { setUser, setAcademy } = useAuthStore();
  const [form, setForm] = useState({
    academyName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    primaryColor: '#FFD700',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(key, val) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.passwordConfirm) { setError('비밀번호가 일치하지 않습니다.'); return; }
    if (form.password.length < 6) { setError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (!form.academyName.trim()) { setError('아카데미명을 입력해주세요.'); return; }

    setLoading(true);
    try {
      const signed = await signUp({
        email: form.email,
        password: form.password,
        academyName: form.academyName,
        primaryColor: form.primaryColor,
        logoFile,
      });
      const { user, academy } = await loadCurrentUser();
      setUser(user);
      setAcademy(signed.academy || academy);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: 4, fontWeight: 700, marginBottom: 8 }}>⚽ FDL CARD</div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: C.white }}>아카데미 등록</h1>
          <p style={{ color: C.sub, fontSize: 14, marginTop: 8 }}>선수카드 제작을 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="아카데미명 *"
            placeholder="예: FDL FC 축구 아카데미"
            value={form.academyName}
            onChange={(e) => set('academyName', e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>아카데미 로고</span>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.md, padding: 12, cursor: 'pointer',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 10,
                background: C.card2, border: `1px solid ${C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', color: C.gray, fontSize: 11,
              }}>
                {logoPreview ? (
                  <img src={logoPreview} alt="로고 미리보기" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : 'LOGO'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.white, fontSize: 14, fontWeight: 700 }}>카드에 들어갈 로고 선택</div>
                <div style={{ color: C.sub, fontSize: 12, marginTop: 3 }}>선택하지 않으면 FDL 기본 마크가 표시됩니다.</div>
              </div>
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setLogoFile(file);
                  setLogoPreview(URL.createObjectURL(file));
                }}
              />
            </label>
          </div>

          {/* Team color picker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>팀 대표 컬러</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              {TEAM_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => set('primaryColor', color)}
                  style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    background: color,
                    border: form.primaryColor === color ? `3px solid ${C.white}` : `2px solid ${C.border}`,
                    cursor: 'pointer',
                    boxShadow: form.primaryColor === color ? `0 0 12px ${color}80` : 'none',
                    transition: 'all 0.15s',
                  }}
                />
              ))}
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => set('primaryColor', e.target.value)}
                style={{ width: 36, height: 36, padding: 2, background: C.card, border: `1px solid ${C.border}`, borderRadius: '50%', cursor: 'pointer' }}
                title="직접 선택"
              />
            </div>
          </div>

          <Input
            label="이메일 *"
            type="email"
            placeholder="academy@example.com"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            required
          />
          <Input
            label="비밀번호 *"
            type="password"
            placeholder="6자 이상"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            required
          />
          <Input
            label="비밀번호 확인 *"
            type="password"
            placeholder="비밀번호 재입력"
            value={form.passwordConfirm}
            onChange={(e) => set('passwordConfirm', e.target.value)}
            required
          />

          {error && (
            <div style={{ background: C.redSoft, border: `1px solid ${C.red}40`, borderRadius: radius.md, padding: '10px 14px', fontSize: 13, color: C.red }}>
              {error}
            </div>
          )}

          <Btn type="submit" fullWidth loading={loading} style={{ marginTop: 8 }}>
            아카데미 시작하기
          </Btn>
        </form>

        <p style={{ textAlign: 'center', color: C.sub, fontSize: 14, marginTop: 24 }}>
          이미 계정이 있으신가요?{' '}
          <Link to="/login" style={{ color: C.gold, textDecoration: 'none', fontWeight: 600 }}>로그인</Link>
        </p>
      </div>
    </div>
  );
}
