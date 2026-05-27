import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Sparkles } from 'lucide-react';
import { C, ff, radius } from '../../tokens';
import { GRADES, determineGrade } from '../../lib/utils';

/* ── 팩 타입 정의 ── */
const PACK_TYPES = [
  {
    id: 'standard',
    name: 'Standard Pack',
    desc: 'COMMON ~ RARE 등급',
    price: 1900,
    color: '#8A9BB0',
    glow: 'rgba(138,155,176,0.5)',
    icon: '🎴',
    probs: { common: 60, rare: 30, epic: 8, legend: 1.9, icon: 0.1, toty: 0, monster: 0 },
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    desc: 'RARE 이상 보장',
    price: 3900,
    color: '#9B59B6',
    glow: 'rgba(155,89,182,0.6)',
    icon: '💎',
    probs: { common: 0, rare: 50, epic: 38, legend: 10, icon: 2, toty: 0, monster: 0 },
  },
  {
    id: 'legend',
    name: 'Legend Pack',
    desc: 'EPIC 이상 보장',
    price: 7900,
    color: '#C8A951',
    glow: 'rgba(200,169,81,0.6)',
    icon: '👑',
    probs: { common: 0, rare: 0, epic: 40, legend: 50, icon: 9, toty: 0.9, monster: 0.1 },
  },
];

/* ── 확률 기반 등급 뽑기 ── */
function drawGrade(probs) {
  const r = Math.random() * 100;
  let acc = 0;
  const order = ['monster','toty','icon','legend','epic','rare','common'];
  for (const g of order) {
    acc += probs[g] || 0;
    if (r <= acc) return g;
  }
  return 'common';
}

/* ── 파티클 컴포넌트 ── */
function Particles({ color, count = 30, active }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 40 + Math.random() * 20,
    tx: (Math.random() - 0.5) * 300,
    ty: -(80 + Math.random() * 200),
    size: 4 + Math.random() * 8,
    delay: Math.random() * 0.4,
    duration: 0.8 + Math.random() * 0.6,
  }));

  if (!active) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map((p) => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`, bottom: '40%',
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 ${p.size * 2}px ${color}`,
          animation: `particle-fly ${p.duration}s ease-out ${p.delay}s both`,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
        }} />
      ))}
    </div>
  );
}

/* ── 카드 결과 표시 ── */
function RevealedCard({ grade: gradeSlug, packColor, onClose }) {
  const grade = GRADES[gradeSlug] || GRADES.common;
  const isLegendary = ['icon','toty','monster'].includes(gradeSlug);
  const isEpic      = gradeSlug === 'epic';
  const isLegend    = gradeSlug === 'legend';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: isLegendary
        ? `radial-gradient(ellipse 80% 60% at 50% 40%, ${grade.glow.replace(/[\d.]+\)$/, '0.35)')}, #060608)`
        : `${C.bg}f8`,
      backdropFilter: 'blur(8px)',
    }}>
      <style>{`
        @keyframes card-drop {
          0% { opacity:0; transform: scale(0.4) translateY(-120px) rotate(-15deg); }
          60% { transform: scale(1.08) translateY(10px) rotate(2deg); }
          80% { transform: scale(0.96) translateY(-4px) rotate(-1deg); }
          100% { opacity:1; transform: scale(1) translateY(0) rotate(0deg); }
        }
        @keyframes screen-flash {
          0%,100% { opacity:0; } 10%,30% { opacity:0.4; } 20%,40% { opacity:0; }
        }
        @keyframes particle-fly {
          0% { opacity:1; transform: translate(0,0) scale(1); }
          100% { opacity:0; transform: translate(var(--tx), var(--ty)) scale(0.2); }
        }
        @keyframes title-in {
          0% { opacity:0; transform: translateY(20px); }
          100% { opacity:1; transform: translateY(0); }
        }
        @keyframes monster-shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>

      {/* MONSTER/TOTY: 화면 번쩍임 */}
      {isLegendary && (
        <div style={{ position: 'fixed', inset: 0, background: grade.color, animation: 'screen-flash 0.6s ease', pointerEvents: 'none', zIndex: 201 }} />
      )}

      <Particles color={grade.color} count={isLegendary ? 60 : isLegend ? 40 : isEpic ? 25 : 0} active />

      {/* 카드 본체 */}
      <div style={{
        animation: `card-drop 0.7s cubic-bezier(0.34,1.56,0.64,1) both${gradeSlug === 'monster' ? ', monster-shake 0.4s ease 0.8s' : ''}`,
        position: 'relative',
      }}>
        {/* 카드 모양 */}
        <div style={{
          width: 220, height: 308, borderRadius: 18,
          background: `linear-gradient(145deg, ${grade.color}20, #060608 60%)`,
          border: `3px solid ${grade.color}`,
          boxShadow: `0 0 ${isLegendary ? 80 : isLegend ? 50 : 30}px ${grade.glow}, 0 30px 60px rgba(0,0,0,0.8)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 8, position: 'relative', overflow: 'hidden',
        }}>
          {/* 홀로그램 오버레이 (LEGEND 이상) */}
          {(isLegend || isLegendary) && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, transparent 30%, ${grade.color}15 50%, transparent 70%)`,
              animation: isLegendary ? 'shimmer 2s linear infinite' : 'shimmer 4s linear infinite',
            }} />
          )}

          <div style={{ fontSize: 64 }}>
            {gradeSlug === 'monster' ? '⚡' : gradeSlug === 'toty' ? '🌟' : gradeSlug === 'icon' ? '🔥' : gradeSlug === 'legend' ? '👑' : gradeSlug === 'epic' ? '💜' : gradeSlug === 'rare' ? '💙' : '⚽'}
          </div>

          <div style={{
            fontSize: 72, fontWeight: 900, fontFamily: ff.display, lineHeight: 0.9,
            color: grade.color,
            textShadow: `0 0 ${isLegendary ? 40 : 20}px ${grade.glow}`,
          }}>
            {gradeSlug === 'monster' ? 99 : gradeSlug === 'toty' ? 96 : gradeSlug === 'icon' ? 91 : gradeSlug === 'legend' ? 85 : gradeSlug === 'epic' ? 77 : gradeSlug === 'rare' ? 68 : 60}
          </div>

          <div style={{
            fontSize: 13, fontWeight: 900, color: grade.color,
            letterSpacing: 2, textTransform: 'uppercase',
          }}>
            {grade.name}
          </div>

          {/* 테두리 반짝임 */}
          <div style={{ position: 'absolute', inset: 0, border: `3px solid ${grade.color}`, borderRadius: 18, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* 등급 제목 */}
      <div style={{
        textAlign: 'center', marginTop: 28,
        animation: 'title-in 0.5s ease 0.4s both',
      }}>
        <div style={{
          fontSize: isLegendary ? 28 : 20, fontWeight: 900,
          color: grade.color, fontFamily: ff.display,
          textShadow: `0 0 20px ${grade.glow}`,
          letterSpacing: 2,
        }}>
          {gradeSlug === 'monster' ? '🎉 MONSTER CLASS!' :
           gradeSlug === 'toty' ? '🌟 TOTY 획득!' :
           gradeSlug === 'icon' ? '🔥 ICON 획득!' :
           gradeSlug === 'legend' ? '👑 LEGEND 획득!' :
           gradeSlug === 'epic' ? 'EPIC 등급!' :
           gradeSlug === 'rare' ? 'RARE 등급' : 'COMMON'}
        </div>
        <div style={{ fontSize: 13, color: C.sub, marginTop: 6 }}>
          {isLegendary ? '전설적인 카드를 획득했습니다!' :
           isLegend ? '놀라운 등급입니다!' :
           isEpic ? '훌륭합니다!' : '계속 성장하세요!'}
        </div>
      </div>

      <button onClick={onClose}
        style={{
          marginTop: 28, background: `linear-gradient(135deg, ${grade.color}, ${grade.color}aa)`,
          color: C.bg, border: 'none', borderRadius: 14,
          padding: '14px 40px', fontSize: 15, fontWeight: 800,
          cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: `0 0 30px ${grade.glow}`,
          animation: 'title-in 0.5s ease 0.6s both',
        }}>
        확인
      </button>
    </div>
  );
}

/* ── 팩 선택 카드 ── */
function PackCard({ pack, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onOpen(pack)}
      style={{
        background: hover ? `${pack.color}12` : C.card,
        border: `2px solid ${hover ? pack.color : `${pack.color}40`}`,
        borderRadius: radius.xl, padding: '24px 20px',
        cursor: 'pointer', textAlign: 'center',
        transition: 'all 0.2s',
        boxShadow: hover ? `0 0 30px ${pack.glow}` : 'none',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
      }}>
      <div style={{ fontSize: 44, marginBottom: 12 }}>{pack.icon}</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: C.white, marginBottom: 4 }}>{pack.name}</div>
      <div style={{ fontSize: 12, color: C.sub, marginBottom: 14 }}>{pack.desc}</div>

      {/* 확률 미니 바 */}
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 16, height: 6 }}>
        {Object.entries(pack.probs).filter(([, v]) => v > 0).map(([g, v]) => (
          <div key={g} style={{
            height: '100%', width: `${Math.max(v * 0.8, 4)}%`,
            background: GRADES[g]?.color || C.border,
            borderRadius: 3, opacity: 0.8,
          }} />
        ))}
      </div>

      <div style={{
        fontSize: 18, fontWeight: 900, color: pack.color,
        fontFamily: ff.display,
      }}>
        {pack.price.toLocaleString()}원
      </div>
      <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>카드 1장 포함</div>
    </div>
  );
}

/* ── 팩 개봉 애니메이션 ── */
function PackOpening({ pack, onReveal }) {
  const [phase, setPhase] = useState('idle'); // idle > shake > tear > reveal
  const shakeRef = useRef(null);

  useEffect(() => {
    // 자동 진행
    const t1 = setTimeout(() => setPhase('shake'), 300);
    const t2 = setTimeout(() => setPhase('tear'), 1400);
    const t3 = setTimeout(() => {
      setPhase('reveal');
      onReveal();
    }, 2200);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [onReveal]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 150,
      background: C.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <style>{`
        @keyframes pack-shake {
          0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-8deg)} 40%{transform:rotate(8deg)} 60%{transform:rotate(-6deg)} 80%{transform:rotate(6deg)}
        }
        @keyframes pack-tear {
          0%{transform:scale(1) rotate(0deg);opacity:1}
          50%{transform:scale(1.2) rotate(5deg);opacity:0.5}
          100%{transform:scale(0.3) rotate(20deg);opacity:0}
        }
        @keyframes pack-glow {
          0%,100%{box-shadow:0 0 30px ${pack.glow}} 50%{box-shadow:0 0 80px ${pack.glow},0 0 120px ${pack.glow}}
        }
      `}</style>

      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: pack.color, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
          {phase === 'shake' ? '두근두근...' : phase === 'tear' ? '개봉 중!' : '팩을 개봉합니다'}
        </div>
        <div style={{ fontSize: 11, color: C.sub }}>
          {phase === 'idle' ? '잠시만 기다려주세요' : phase === 'shake' ? '어떤 카드일까요?' : ''}
        </div>
      </div>

      {/* 팩 박스 */}
      <div
        ref={shakeRef}
        style={{
          width: 160, height: 200, borderRadius: 16,
          background: `linear-gradient(145deg, ${pack.color}30, ${pack.color}10)`,
          border: `3px solid ${pack.color}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontSize: 60,
          animation: phase === 'shake'
            ? 'pack-shake 0.2s ease-in-out infinite, pack-glow 0.5s ease-in-out infinite'
            : phase === 'tear'
            ? 'pack-tear 0.6s ease-in forwards'
            : 'pack-glow 2s ease-in-out infinite',
          boxShadow: `0 0 40px ${pack.glow}`,
        }}>
        {pack.icon}
        <div style={{ fontSize: 12, fontWeight: 800, color: pack.color, letterSpacing: 1.5, marginTop: 8 }}>
          {pack.name.toUpperCase()}
        </div>
      </div>

      {/* 도트 인디케이터 */}
      <div style={{ display: 'flex', gap: 8, marginTop: 36 }}>
        {['idle','shake','tear'].map((p) => (
          <div key={p} style={{
            width: 8, height: 8, borderRadius: '50%',
            background: ['idle','shake','tear'].indexOf(phase) >= ['idle','shake','tear'].indexOf(p) ? pack.color : C.border,
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── 메인 페이지 ── */
export default function PackOpenPage() {
  const navigate = useNavigate();
  const [opening, setOpening]   = useState(null);   // 현재 개봉 중인 팩
  const [revealGrade, setRevealGrade] = useState(null); // 결과 등급
  const [history, setHistory]   = useState([]);

  function handleOpen(pack) {
    setOpening(pack);
  }

  function handleReveal() {
    if (!opening) return;
    const grade = drawGrade(opening.probs);
    setRevealGrade(grade);
    setHistory((h) => [{ pack: opening.id, grade, ts: Date.now() }, ...h.slice(0, 9)]);
  }

  function handleClose() {
    setOpening(null);
    setRevealGrade(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes particle-fly {
          0%{opacity:1;transform:translate(0,0) scale(1)}
          100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0.2)}
        }
      `}</style>

      {/* 네비 */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 20px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.bg}f0`, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid rgba(255,215,0,0.07)`,
      }}>
        <button onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontFamily: 'inherit' }}>
          <ChevronLeft size={16} /> 뒤로
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 900, color: C.gold, fontFamily: ff.display, letterSpacing: 2 }}>
          <Sparkles size={16} /> CARD PACK
        </div>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ padding: '24px 20px 60px', maxWidth: 600, margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #FFD700, #C8A951)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            카드팩 개봉
          </h1>
          <p style={{ color: C.sub, fontSize: 14, margin: 0 }}>어떤 등급의 카드가 나올까요?</p>
        </div>

        {/* 팩 선택 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 32 }}>
          {PACK_TYPES.map((pack) => (
            <PackCard key={pack.id} pack={pack} onOpen={handleOpen} />
          ))}
        </div>

        {/* 확률표 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: '18px 20px', marginBottom: 24 }}>
          <div style={{ fontSize: 12, color: C.sub, fontWeight: 700, marginBottom: 14, letterSpacing: 0.5 }}>등급 확률</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(GRADES).reverse().map(([slug, g]) => (
              <div key={slug} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: `${g.color}12`, border: `1px solid ${g.color}35`,
                borderRadius: 8, padding: '4px 9px',
              }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: g.color }} />
                <span style={{ fontSize: 9, fontWeight: 800, color: g.color }}>{g.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 개봉 히스토리 */}
        {history.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: C.sub, fontWeight: 600, marginBottom: 10, letterSpacing: 0.5 }}>최근 개봉 기록</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {history.map(({ grade, ts }) => {
                const g = GRADES[grade] || GRADES.common;
                return (
                  <div key={ts} style={{
                    background: `${g.color}15`, border: `1px solid ${g.color}50`,
                    borderRadius: 8, padding: '4px 10px',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: g.color }} />
                    <span style={{ fontSize: 10, fontWeight: 800, color: g.color }}>{g.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 개봉 애니메이션 */}
      {opening && !revealGrade && (
        <PackOpening pack={opening} onReveal={handleReveal} />
      )}

      {/* 결과 표시 */}
      {revealGrade && (
        <RevealedCard grade={revealGrade} packColor={opening?.color} onClose={handleClose} />
      )}
    </div>
  );
}
