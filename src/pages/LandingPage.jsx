import { useNavigate } from 'react-router-dom';
import { C, ff } from '../tokens';

const STEPS = [
  { num: '01', title: '선수 등록', desc: '이름·포지션·사진을 입력하면\nAI가 자동으로 누끼 작업까지 완성해드립니다' },
  { num: '02', title: '카드 제작', desc: '능력치를 입력하고\n나만의 선수 카드를 만드세요' },
  { num: '03', title: '실물 카드 배송', desc: '완성된 카드를 인쇄해\n아카데미로 빠르게 배송해드립니다' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(41,237,115,0.09) 0%, ${C.bg} 55%)`,
      color: C.white,
      fontFamily: ff.body,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Top bar */}
      <div style={{
        width: '100%', maxWidth: 480,
        padding: '20px 24px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: '#29ED73', fontFamily: ff.display, letterSpacing: 3 }}>
          FDL CARD
        </span>
        <button onClick={() => navigate('/login')}
          style={{
            background: 'none', border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '6px 16px',
            color: C.sub, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
          로그인
        </button>
      </div>

      {/* Headline */}
      <div style={{
        textAlign: 'center', padding: '28px 24px 0',
        animation: 'fade-up 0.5s ease both',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#29ED73', letterSpacing: 3, marginBottom: 10 }}>
          ⚽ 아카데미 감독 &amp; 코치 전용 플랫폼
        </div>
        <h1 style={{
          margin: 0, fontSize: 28, fontWeight: 900, lineHeight: 1.3,
          color: C.white, letterSpacing: -0.5,
        }}>
          선수 한 명 한 명을<br />프로처럼 기록하고 관리하세요
        </h1>
      </div>

      {/* Steps */}
      <div style={{
        width: '100%', maxWidth: 480,
        padding: '32px 24px 8px',
        display: 'flex', flexDirection: 'column', gap: 12,
        animation: 'fade-up 0.5s 0.15s ease both',
      }}>
        {STEPS.map(({ num, title, desc }) => (
          <div key={num} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
            borderRadius: 16, padding: '18px 20px',
            display: 'flex', alignItems: 'flex-start', gap: 16,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: '#29ED7320', border: '1px solid #29ED7340',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 900, color: '#29ED73', letterSpacing: 0.5,
            }}>{num}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.white, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{
        width: '100%', maxWidth: 360, padding: '20px 24px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
        animation: 'fade-up 0.5s 0.3s ease both',
      }}>
        <button onClick={() => navigate('/signup')}
          style={{
            background: '#29ED73', color: '#0a0a0a',
            border: 'none', borderRadius: 14,
            padding: '16px 0', width: '100%',
            fontSize: 16, fontWeight: 900,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
          지금 바로 만들러가기 →
        </button>
        <button onClick={() => navigate('/demo')}
          style={{
            background: 'rgba(255,255,255,0.05)', color: C.sub,
            border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '14px 0', width: '100%',
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
          데모 카드 보기
        </button>
      </div>

      {/* Features */}
      <div style={{
        width: '100%', maxWidth: 480,
        padding: '32px 24px 60px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {[
          { icon: '🎴', text: '3초 카드 생성' },
          { icon: '🏅', text: 'FDL 인증카드' },
          { icon: '📦', text: '실물 카드 배송' },
          { icon: '🎯', text: '맞춤형 코칭' },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '14px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.sub }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
