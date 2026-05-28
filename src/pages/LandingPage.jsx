import { useNavigate } from 'react-router-dom';
import { C, ff } from '../tokens';

const STEPS = [
  { num: '01', title: '선수 등록', desc: 'AI가 누끼\n자동 처리' },
  { num: '02', title: '카드 제작', desc: '등급·능력치\n직접 설정' },
  { num: '03', title: '실물 배송', desc: '인쇄 후\n아카데미 직배' },
];

const CARD_SAMPLES = [
  { src: '/thumbnails/r1.jpg',         rotate: '-8deg',  translate: '-22px', z: 1, scale: 0.88 },
  { src: '/thumbnails/fdl-cert.jpeg',  rotate: '0deg',   translate: '0px',   z: 3, scale: 1    },
  { src: '/thumbnails/r2.jpg',         rotate: '8deg',   translate: '22px',  z: 1, scale: 0.88 },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(41,237,115,0.10) 0%, ${C.bg} 60%)`,
      color: C.white,
      fontFamily: ff.body,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        width: '100%', maxWidth: 480,
        padding: '20px 24px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: '#29ED73', fontFamily: ff.display, letterSpacing: 3 }}>
          FDL CARD
        </span>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'none', border: `1px solid ${C.border}`,
            borderRadius: 8, padding: '6px 16px',
            color: C.sub, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          로그인
        </button>
      </div>

      {/* ── Hero headline ── */}
      <div style={{
        textAlign: 'center', padding: '32px 24px 0',
        animation: 'fade-up 0.5s ease both',
      }}>
        <div style={{
          display: 'inline-block',
          background: 'rgba(41,237,115,0.1)', border: '1px solid rgba(41,237,115,0.3)',
          borderRadius: 20, padding: '4px 14px',
          fontSize: 11, fontWeight: 700, color: '#29ED73', letterSpacing: 2,
          marginBottom: 16,
        }}>
          ⚽ 유소년 선수카드 전문 플랫폼
        </div>
        <h1 style={{
          margin: 0, fontSize: 30, fontWeight: 900, lineHeight: 1.25,
          color: C.white, letterSpacing: -0.5,
        }}>
          내 선수의 카드를<br />
          <span style={{ color: '#29ED73' }}>지금 바로</span> 만드세요
        </h1>
        <p style={{
          margin: '12px 0 0', fontSize: 13, color: C.sub, lineHeight: 1.6,
        }}>
          선수 정보 입력부터 실물 카드 발급까지<br />
          아카데미 전용 선수카드 제작·배송 서비스
        </p>
      </div>

      {/* ── Card showcase ── */}
      <div style={{
        position: 'relative',
        width: '100%', maxWidth: 480,
        height: 260,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginTop: 32,
        animation: 'fade-up 0.5s 0.1s ease both',
      }}>
        {CARD_SAMPLES.map(({ src, rotate, translate, z, scale }, i) => (
          <img
            key={i}
            src={src}
            alt="card sample"
            style={{
              position: 'absolute',
              height: 220,
              width: 'auto',
              borderRadius: 12,
              boxShadow: z === 3
                ? '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(41,237,115,0.2)'
                : '0 10px 30px rgba(0,0,0,0.5)',
              transform: `rotate(${rotate}) translateX(${translate}) scale(${scale})`,
              zIndex: z,
              animation: z === 3 ? 'float 4s ease-in-out infinite' : 'none',
              objectFit: 'cover',
            }}
          />
        ))}
      </div>

      {/* ── Steps ── */}
      <div style={{
        width: '100%', maxWidth: 480,
        padding: '28px 24px 0',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
        animation: 'fade-up 0.5s 0.2s ease both',
      }}>
        {STEPS.map(({ num, title, desc }) => (
          <div key={num} style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '16px 12px',
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <div style={{
              fontSize: 10, fontWeight: 900, color: '#29ED73', letterSpacing: 1,
            }}>{num}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: C.white }}>{title}</div>
            <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{
        width: '100%', maxWidth: 360,
        padding: '24px 24px 0',
        display: 'flex', flexDirection: 'column', gap: 12,
        animation: 'fade-up 0.5s 0.3s ease both',
      }}>
        <button
          onClick={() => navigate('/signup')}
          style={{
            background: '#29ED73', color: '#0a0a0a',
            border: 'none', borderRadius: 14,
            padding: '16px 0', width: '100%',
            fontSize: 16, fontWeight: 900,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          무료로 카드 만들기 →
        </button>
        <button
          onClick={() => navigate('/demo')}
          style={{
            background: 'rgba(255,255,255,0.05)', color: C.sub,
            border: `1px solid ${C.border}`,
            borderRadius: 14, padding: '14px 0', width: '100%',
            fontSize: 14, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          카드 샘플 보기
        </button>
      </div>

      {/* ── Bottom note ── */}
      <div style={{
        padding: '28px 24px 48px',
        textAlign: 'center',
        animation: 'fade-up 0.5s 0.4s ease both',
      }}>
        <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.2)', lineHeight: 1.6 }}>
          FDL CARD는 풋볼데이터랩이 운영하는<br />유소년 선수카드 제작 전문 서비스입니다
        </p>
      </div>
    </div>
  );
}
