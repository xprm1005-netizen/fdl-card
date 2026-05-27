import { useNavigate } from 'react-router-dom';
import { C, ff } from '../tokens';
import SvgCardFront from '../components/card/SvgCardFront';

const GRADE_CHIPS = [
  { name: 'COMMON',  color: '#8A9BB0' },
  { name: 'RARE',    color: '#4A90D9' },
  { name: 'EPIC',    color: '#9B59B6' },
  { name: 'LEGEND',  color: '#C8A951' },
  { name: 'ICON',    color: '#FF6B35' },
  { name: 'TOTY',    color: '#00D4FF' },
  { name: 'MONSTER', color: '#FF0044' },
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
        @keyframes card-float { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-12px) rotate(-2deg)} }
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
          ⚽ 선수 카드를 직접 만드세요
        </div>
        <h1 style={{
          margin: 0, fontSize: 28, fontWeight: 900, lineHeight: 1.25,
          color: C.white, letterSpacing: -0.5,
        }}>
          우리 팀 선수의<br />프로 카드를 지금 바로
        </h1>
      </div>

      {/* Card showcase */}
      <div style={{
        marginTop: 28, marginBottom: 20,
        animation: 'card-float 4s ease-in-out infinite',
        filter: 'drop-shadow(0 20px 40px rgba(41,237,115,0.22))',
      }}>
        <SvgCardFront
          cardType="THE"
          cardLabel="SPEED KING"
          jerseyNumber="10"
          position="FW"
          playerName="내 선수"
          academyName="내 팀"
          age="15"
          pac={88} dri={85} phy={79}
          acc={90} tac={72} psy={84}
          scale={0.62}
        />
      </div>

      {/* Grade chips */}
      <div style={{
        display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center',
        padding: '0 24px', marginBottom: 28,
        animation: 'fade-up 0.5s 0.15s ease both',
      }}>
        {GRADE_CHIPS.map(({ name, color }) => (
          <div key={name} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: `${color}14`, border: `1px solid ${color}44`,
            borderRadius: 20, padding: '4px 10px',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
            <span style={{ fontSize: 9, fontWeight: 800, color, letterSpacing: 0.5 }}>{name}</span>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      <div style={{
        width: '100%', maxWidth: 360, padding: '0 24px',
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
          무료로 시작하기 →
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
          { icon: '🏆', text: '7단계 등급' },
          { icon: '📤', text: '1탭 SNS 공유' },
          { icon: '📦', text: '실물 카드 배송' },
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
