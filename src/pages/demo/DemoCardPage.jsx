import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X } from 'lucide-react';
import { C, ff } from '../../tokens';

// 프리미엄: 앞면 + 뒷면 동시 발급
const PREMIUM = {
  id: 'fdl',
  front: '/thumbnails/fdl-cert.jpeg',
  back: '/thumbnails/fdl-cert2.jpeg',
  name: 'FDL 인증카드',
  desc: '앞면 + 뒷면 동시 발급되는 FDL 공식 인증 카드',
  badgeColor: '#FFD700',
  badgeBg: '#FFD70020',
  badgeBorder: '#FFD70050',
};

const LEVEL_CARDS = [
  { id: 'r6', src: '/thumbnails/r6.jpg', name: 'TOTY',          desc: '올해의 팀 레벨 인증카드',  badgeColor: '#00D4FF', badgeBg: '#00D4FF15', badgeBorder: '#00D4FF40' },
  { id: 'r5', src: '/thumbnails/r5.jpg', name: 'ICON',          desc: '아이콘 레벨 인증카드',    badgeColor: '#FF6B35', badgeBg: '#FF6B3515', badgeBorder: '#FF6B3540' },
  { id: 'r4', src: '/thumbnails/r4.jpg', name: 'LEGEND',        desc: '레전드 레벨 인증카드',   badgeColor: '#C8A951', badgeBg: '#C8A95115', badgeBorder: '#C8A95140' },
  { id: 'r3', src: '/thumbnails/r3.jpg', name: 'EPIC',          desc: '에픽 레벨 인증카드',     badgeColor: '#9B59B6', badgeBg: '#9B59B615', badgeBorder: '#9B59B640' },
  { id: 'r2', src: '/thumbnails/r2.jpg', name: 'RARE',          desc: '레어 레벨 인증카드',     badgeColor: '#4A90D9', badgeBg: '#4A90D915', badgeBorder: '#4A90D940' },
  { id: 'r1', src: '/thumbnails/r1.jpg', name: 'COMMON',        desc: '스탠다드 레벨 인증카드', badgeColor: '#8A9BB0', badgeBg: '#8A9BB015', badgeBorder: '#8A9BB040' },
];

export default function DemoCardPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null); // 'fdl' | card.id

  // 모달 데이터 계산
  const modalCard = selected === 'fdl'
    ? PREMIUM
    : LEVEL_CARDS.find((c) => c.id === selected);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>
      <style>{`
        @keyframes fade-in  { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
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

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '68px 20px 100px' }}>

        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 28, animation: 'slide-up 0.4s ease both' }}>
          <div style={{ fontSize: 11, color: '#29ED73', letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>
            CARD COLLECTION
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: C.white, letterSpacing: -0.5 }}>
            완성형 카드 미리보기
          </h2>
          <p style={{ margin: 0, fontSize: 13, color: C.sub }}>카드를 눌러 크게 확인하세요</p>
        </div>

        {/* ── 프리미엄 카드 (풀 너비, 앞면+뒷면) ── */}
        <div
          onClick={() => setSelected('fdl')}
          style={{
            cursor: 'pointer', marginBottom: 20,
            border: `1px solid ${PREMIUM.badgeBorder}`,
            background: PREMIUM.badgeBg,
            borderRadius: 18, overflow: 'hidden',
            animation: 'slide-up 0.4s ease both',
            transition: 'transform 0.15s, box-shadow 0.15s',
            position: 'relative',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = `0 12px 40px ${PREMIUM.badgeColor}35`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* 배지 */}
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            background: PREMIUM.badgeColor, borderRadius: 6, padding: '3px 10px',
            fontSize: 10, fontWeight: 900, color: '#0a0a0a', letterSpacing: 1,
          }}>
            ⭐ PREMIUM
          </div>

          {/* 앞면 + 뒷면 나란히 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <div style={{ position: 'relative' }}>
              <img src={PREMIUM.front} alt="FDL 인증카드 앞면"
                style={{ width: '100%', aspectRatio: '400/700', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center',
                fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: 1,
              }}>앞면</div>
            </div>
            <div style={{ position: 'relative' }}>
              <img src={PREMIUM.back} alt="FDL 인증카드 뒷면"
                style={{ width: '100%', aspectRatio: '400/700', objectFit: 'cover', display: 'block' }} />
              <div style={{
                position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center',
                fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600, letterSpacing: 1,
              }}>뒷면</div>
            </div>
          </div>

          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: PREMIUM.badgeColor, marginBottom: 3 }}>
              {PREMIUM.name}
            </div>
            <div style={{ fontSize: 12, color: C.sub }}>{PREMIUM.desc}</div>
          </div>
        </div>

        {/* 구분선 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 11, color: C.sub, letterSpacing: 1 }}>레벨 인증카드</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* ── 레벨 인증카드 2열 그리드 ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 40 }}>
          {LEVEL_CARDS.map((card, i) => (
            <div
              key={card.id}
              onClick={() => setSelected(card.id)}
              style={{
                cursor: 'pointer', borderRadius: 16, overflow: 'hidden',
                border: `1px solid ${card.badgeBorder}`,
                background: card.badgeBg, position: 'relative',
                animation: `slide-up 0.4s ${0.1 + i * 0.05}s ease both`,
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 8px 32px ${card.badgeColor}30`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{
                position: 'absolute', top: 10, left: 10, zIndex: 2,
                background: card.badgeBg, border: `1px solid ${card.badgeBorder}`,
                borderRadius: 6, padding: '3px 8px',
                fontSize: 9, fontWeight: 800, color: card.badgeColor, letterSpacing: 0.5,
              }}>
                레벨 인증카드
              </div>
              <img src={card.src} alt={card.name}
                style={{ width: '100%', aspectRatio: '400/700', objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: card.badgeColor, letterSpacing: 0.5 }}>{card.name}</div>
                <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{card.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{
          position: 'sticky', bottom: 16,
          background: `${C.bg}cc`, backdropFilter: 'blur(12px)',
          borderRadius: 16, padding: '16px',
          border: '1px solid #29ED7330', textAlign: 'center',
        }}>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 10 }}>
            지금 가입하면 바로 카드를 만들 수 있어요
          </div>
          <button onClick={() => navigate('/signup')} style={{
            width: '100%', padding: '14px 0',
            background: '#29ED73', color: '#0a0a0a',
            border: 'none', borderRadius: 12,
            fontSize: 15, fontWeight: 900,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            회원가입 후 주문하기 →
          </button>
        </div>
      </div>

      {/* 확대 모달 */}
      {modalCard && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, animation: 'fade-in 0.2s ease',
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            position: 'relative', maxWidth: 400, width: '100%',
            animation: 'fade-in 0.2s ease',
          }}>
            {/* 닫기 */}
            <button onClick={() => setSelected(null)} style={{
              position: 'absolute', top: -14, right: -14, zIndex: 10,
              width: 32, height: 32, borderRadius: '50%',
              background: C.card, border: `1px solid ${C.border}`,
              color: C.sub, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={15} />
            </button>

            {/* 배지 */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: selected === 'fdl' ? PREMIUM.badgeColor : modalCard.badgeBg,
              border: `1px solid ${selected === 'fdl' ? PREMIUM.badgeBorder : modalCard.badgeBorder}`,
              borderRadius: 8, padding: '4px 12px', marginBottom: 10,
              fontSize: 10, fontWeight: 800, letterSpacing: 1,
              color: selected === 'fdl' ? '#0a0a0a' : modalCard.badgeColor,
            }}>
              {selected === 'fdl' ? '⭐ PREMIUM' : '레벨 인증카드'}
            </div>

            {/* 프리미엄은 앞뒤 나란히, 일반은 단독 */}
            {selected === 'fdl' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <img src={PREMIUM.front} alt="앞면"
                    style={{ width: '100%', borderRadius: 12, display: 'block', boxShadow: `0 16px 60px ${PREMIUM.badgeColor}40` }} />
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6, letterSpacing: 1 }}>앞면</div>
                </div>
                <div>
                  <img src={PREMIUM.back} alt="뒷면"
                    style={{ width: '100%', borderRadius: 12, display: 'block', boxShadow: `0 16px 60px ${PREMIUM.badgeColor}40` }} />
                  <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6, letterSpacing: 1 }}>뒷면</div>
                </div>
              </div>
            ) : (
              <img src={modalCard.src} alt={modalCard.name}
                style={{ width: '100%', borderRadius: 16, display: 'block', boxShadow: `0 24px 80px ${modalCard.badgeColor}40` }} />
            )}

            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: selected === 'fdl' ? PREMIUM.badgeColor : modalCard.badgeColor, marginBottom: 4 }}>
                {selected === 'fdl' ? PREMIUM.name : modalCard.name}
              </div>
              <div style={{ fontSize: 12, color: C.sub, marginBottom: 16 }}>
                {selected === 'fdl' ? PREMIUM.desc : modalCard.desc}
              </div>
              <button onClick={() => navigate('/signup')} style={{
                width: '100%', padding: '13px 0',
                background: '#29ED73', color: '#0a0a0a',
                border: 'none', borderRadius: 12,
                fontSize: 14, fontWeight: 900,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                이 카드 만들러가기 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
