import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { C, ff } from '../../tokens';

const CARDS = [
  {
    id: 'fdl',
    src: '/thumbnails/fdl-cert.jpeg',
    name: 'FDL 인증카드',
    desc: 'FDL이 직접 발행하는 공식 인증 카드',
    badge: 'PREMIUM',
    badgeColor: '#FFD700',
    badgeBg: '#FFD70020',
    badgeBorder: '#FFD70050',
  },
  {
    id: 'r7',
    src: '/thumbnails/r7.png',
    name: 'MONSTER CLASS',
    desc: '최고 등급 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#FF0044',
    badgeBg: '#FF004415',
    badgeBorder: '#FF004440',
  },
  {
    id: 'r6',
    src: '/thumbnails/r6.png',
    name: 'TOTY',
    desc: '올해의 팀 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#00D4FF',
    badgeBg: '#00D4FF15',
    badgeBorder: '#00D4FF40',
  },
  {
    id: 'r5',
    src: '/thumbnails/r5.png',
    name: 'ICON',
    desc: '아이콘 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#FF6B35',
    badgeBg: '#FF6B3515',
    badgeBorder: '#FF6B3540',
  },
  {
    id: 'r4',
    src: '/thumbnails/r4.png',
    name: 'LEGEND',
    desc: '레전드 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#C8A951',
    badgeBg: '#C8A95115',
    badgeBorder: '#C8A95140',
  },
  {
    id: 'r3',
    src: '/thumbnails/r3.png',
    name: 'EPIC',
    desc: '에픽 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#9B59B6',
    badgeBg: '#9B59B615',
    badgeBorder: '#9B59B640',
  },
  {
    id: 'r2',
    src: '/thumbnails/r2.png',
    name: 'RARE',
    desc: '레어 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#4A90D9',
    badgeBg: '#4A90D915',
    badgeBorder: '#4A90D940',
  },
  {
    id: 'r1',
    src: '/thumbnails/r1.png',
    name: 'COMMON',
    desc: '스탠다드 레벨 인증카드',
    badge: '레벨 인증카드',
    badgeColor: '#8A9BB0',
    badgeBg: '#8A9BB015',
    badgeBorder: '#8A9BB040',
  },
];

export default function DemoCardPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const selectedCard = selected ? CARDS.find((c) => c.id === selected) : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
        @keyframes slide-up { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* 네비 */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 20px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.bg}ee`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', color: C.sub, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontFamily: 'inherit',
        }}>
          <ChevronLeft size={15} /> 홈
        </button>
        <div style={{ fontSize: 11, color: '#29ED73', letterSpacing: 3, fontWeight: 800 }}>
          ⚽ FDL CARD 컬렉션
        </div>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ paddingTop: 68, paddingBottom: 80, maxWidth: 640, margin: '0 auto', padding: '68px 20px 80px' }}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 32, animation: 'slide-up 0.4s ease both' }}>
          <div style={{ fontSize: 11, color: '#29ED73', letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>
            CARD COLLECTION
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 900, color: C.white, letterSpacing: -0.5 }}>
            완성형 카드 미리보기
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: C.sub, lineHeight: 1.6 }}>
            카드를 눌러 크게 확인하세요
          </p>
        </div>

        {/* 카드 그리드 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 14,
          marginBottom: 40,
        }}>
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              onClick={() => setSelected(card.id)}
              style={{
                cursor: 'pointer',
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid ${card.badgeBorder}`,
                background: card.badgeBg,
                animation: `slide-up 0.4s ${i * 0.05}s ease both`,
                transition: 'transform 0.15s, box-shadow 0.15s',
                position: 'relative',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 8px 32px ${card.badgeColor}30`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* 배지 */}
              <div style={{
                position: 'absolute', top: 10, left: 10, zIndex: 2,
                background: card.id === 'fdl' ? card.badgeColor : card.badgeBg,
                border: `1px solid ${card.badgeBorder}`,
                borderRadius: 6, padding: '3px 8px',
                fontSize: 9, fontWeight: 800,
                color: card.id === 'fdl' ? '#0a0a0a' : card.badgeColor,
                letterSpacing: 0.5,
              }}>
                {card.badge}
              </div>

              {/* 카드 이미지 */}
              <img
                src={card.src}
                alt={card.name}
                style={{
                  width: '100%',
                  aspectRatio: '400/700',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />

              {/* 카드 이름 */}
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: card.badgeColor, letterSpacing: 0.5 }}>
                  {card.name}
                </div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>
                  {card.desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          position: 'sticky', bottom: 16,
          background: `${C.bg}cc`, backdropFilter: 'blur(12px)',
          borderRadius: 16, padding: '16px',
          border: '1px solid #29ED7330',
          textAlign: 'center',
          animation: 'slide-up 0.5s 0.3s ease both',
        }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 10 }}>
            지금 가입하면 바로 카드를 만들 수 있어요
          </div>
          <button
            onClick={() => navigate('/signup')}
            style={{
              width: '100%', padding: '14px 0',
              background: '#29ED73', color: '#0a0a0a',
              border: 'none', borderRadius: 12,
              fontSize: 15, fontWeight: 900,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            회원가입 후 주문하기 →
          </button>
        </div>
      </div>

      {/* 카드 확대 모달 */}
      {selectedCard && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
            animation: 'fade-in 0.2s ease',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              maxWidth: 340, width: '100%',
              animation: 'fade-in 0.2s ease',
            }}
          >
            {/* 닫기 */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute', top: -14, right: -14, zIndex: 10,
                width: 32, height: 32, borderRadius: '50%',
                background: C.card, border: `1px solid ${C.border}`,
                color: C.sub, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={15} />
            </button>

            {/* 배지 */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: selectedCard.id === 'fdl' ? selectedCard.badgeColor : selectedCard.badgeBg,
              border: `1px solid ${selectedCard.badgeBorder}`,
              borderRadius: 8, padding: '4px 12px', marginBottom: 10,
              fontSize: 10, fontWeight: 800,
              color: selectedCard.id === 'fdl' ? '#0a0a0a' : selectedCard.badgeColor,
              letterSpacing: 1,
            }}>
              {selectedCard.id === 'fdl' && '⭐ '}{selectedCard.badge}
            </div>

            <img
              src={selectedCard.src}
              alt={selectedCard.name}
              style={{ width: '100%', borderRadius: 16, display: 'block', boxShadow: `0 24px 80px ${selectedCard.badgeColor}40` }}
            />

            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: selectedCard.badgeColor, marginBottom: 4 }}>
                {selectedCard.name}
              </div>
              <div style={{ fontSize: 12, color: C.sub, marginBottom: 16 }}>
                {selectedCard.desc}
              </div>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  width: '100%', padding: '13px 0',
                  background: '#29ED73', color: '#0a0a0a',
                  border: 'none', borderRadius: 12,
                  fontSize: 14, fontWeight: 900,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                이 카드 만들러가기 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
