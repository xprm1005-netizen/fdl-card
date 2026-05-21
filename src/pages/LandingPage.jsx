import { useNavigate } from 'react-router-dom';
import { C, ff, radius } from '../tokens';
import Btn from '../components/ui/Btn';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: C.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 32px',
      fontFamily: ff.body,
      backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,215,0,0.06), transparent)',
    }}>
      {/* Logo & brand */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontSize: 72, lineHeight: 1, marginBottom: 20 }}>⚽</div>
        <div style={{
          fontSize: 'clamp(40px, 10vw, 64px)',
          fontFamily: ff.display,
          letterSpacing: 6,
          color: C.gold,
          lineHeight: 1,
          textShadow: '0 0 60px rgba(255,215,0,0.3)',
          marginBottom: 12,
        }}>
          FDL CARD
        </div>
        <p style={{ fontSize: 16, color: C.sub, margin: 0, letterSpacing: 1 }}>
          유소년 축구 선수카드 플랫폼
        </p>
      </div>

      {/* CTA buttons */}
      <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Btn size="lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/signup')}>
          시작하기
        </Btn>
        <Btn variant="ghost" size="lg" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/login')}>
          로그인
        </Btn>
      </div>

      {/* Demo link */}
      <button
        onClick={() => navigate('/demo')}
        style={{
          marginTop: 32,
          background: 'none',
          border: 'none',
          color: C.gray,
          fontSize: 13,
          cursor: 'pointer',
          fontFamily: ff.body,
          textDecoration: 'underline',
          textDecorationColor: C.border,
        }}
      >
        로그인 없이 둘러보기 →
      </button>
    </div>
  );
}
