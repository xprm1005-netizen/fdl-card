import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Trophy, Zap, Package } from 'lucide-react';
import { C, ff, radius } from '../tokens';
import Btn from '../components/ui/Btn';

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

const STEPS = [
  { num: '01', title: '사진 업로드', desc: 'AI가 자동으로 배경을 제거합니다', icon: '📸' },
  { num: '02', title: '템플릿 선택', desc: 'FIFA 스타일 4가지 카드 중 선택', icon: '🎴' },
  { num: '03', title: '능력치 입력', desc: '슈팅, 패스, 스피드 등 직접 설정', icon: '⚡' },
  { num: '04', title: '주문 & 배송', desc: '7영업일 이내 실물 카드 배송', icon: '📦' },
];

const FEATURES = [
  { icon: <Zap size={28} color={C.gold} />, title: 'AI 누끼 처리', desc: '사진 업로드만 하면 AI가 배경을 자동으로 제거합니다' },
  { icon: <Star size={28} color={C.toty} />, title: '4가지 프리미엄 템플릿', desc: 'Gold, TOTY, Chrome, Legend — FIFA FUT 스타일 카드' },
  { icon: <Trophy size={28} color={C.legend} />, title: '실시간 미리보기', desc: '스탯을 입력하는 즉시 카드가 실시간으로 업데이트됩니다' },
  { icon: <Package size={28} color={C.green} />, title: '7일 배송', desc: '주문 확인 후 영업일 기준 7일 이내 실물 카드 배송' },
];

const PRICING = [
  { qty: '1장', price: '6,900원', sub: '6,900원/장', highlight: false },
  { qty: '5장', price: '24,900원', sub: '4,980원/장', highlight: false },
  { qty: '11장', price: '49,900원', sub: '4,536원/장 · 팀 구성', highlight: true },
  { qty: '20장', price: '89,000원', sub: '4,450원/장 · 최저가', highlight: false },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [heroRef, heroVisible] = useInView();
  const [stepsRef, stepsVisible] = useInView();
  const [featRef, featVisible] = useInView();
  const [pricRef, pricVisible] = useInView();

  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: ff.body, overflowX: 'hidden' }}>
      {/* Nav */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.bg}dd`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 800 }}>⚽ FDL CARD</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Btn variant="ghost" size="sm" onClick={() => navigate('/login')}>로그인</Btn>
          <Btn size="sm" onClick={() => navigate('/signup')}>시작하기</Btn>
        </div>
      </nav>

      {/* Hero */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '80px 24px 60px',
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,215,0,0.08), transparent)`,
          opacity: heroVisible ? 1 : 0,
          transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s, transform 0.8s',
        }}
      >
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 4, fontWeight: 700, marginBottom: 20, border: `1px solid ${C.goldMed}`, padding: '4px 16px', borderRadius: 20, display: 'inline-block' }}>
          유소년 축구 선수카드 플랫폼
        </div>
        <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(36px, 8vw, 72px)', fontWeight: 900, lineHeight: 1.1, fontFamily: ff.display, letterSpacing: 2 }}>
          아이들에게<br />
          <span style={{ color: C.gold, textShadow: `0 0 60px rgba(255,215,0,0.4)` }}>프로선수</span><br />
          경험을
        </h1>
        <p style={{ fontSize: 18, color: C.sub, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
          사진 업로드 → 템플릿 선택 → 능력치 입력 → 결제<br />
          단 4단계로 실물 선수카드가 7일 이내 배송됩니다
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Btn size="lg" onClick={() => navigate('/signup')}>
            무료로 시작하기 <ChevronRight size={20} />
          </Btn>
          <Btn variant="goldOutline" size="lg" onClick={() => navigate('/login')}>
            로그인
          </Btn>
        </div>
      </section>

      {/* Steps */}
      <section
        ref={stepsRef}
        style={{
          padding: '80px 24px', maxWidth: 1000, margin: '0 auto',
          opacity: stepsVisible ? 1 : 0,
          transform: stepsVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s 0.1s, transform 0.8s 0.1s',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48, fontFamily: ff.display, letterSpacing: 1 }}>
          이렇게 간단합니다
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          {STEPS.map((s) => (
            <div key={s.num} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.xl, padding: '28px 24px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>STEP {s.num}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>{s.title}</h3>
              <p style={{ margin: 0, color: C.sub, fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        ref={featRef}
        style={{
          padding: '80px 24px', maxWidth: 1000, margin: '0 auto',
          opacity: featVisible ? 1 : 0,
          transform: featVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s, transform 0.8s',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 48, fontFamily: ff.display, letterSpacing: 1 }}>
          FDL CARD의 특징
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.xl, padding: '28px',
            }}>
              <div style={{ marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700 }}>{f.title}</h3>
              <p style={{ margin: 0, color: C.sub, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section
        ref={pricRef}
        style={{
          padding: '80px 24px', maxWidth: 800, margin: '0 auto',
          opacity: pricVisible ? 1 : 0,
          transform: pricVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s, transform 0.8s',
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: 32, fontWeight: 800, marginBottom: 8, fontFamily: ff.display }}>가격 안내</h2>
        <p style={{ textAlign: 'center', color: C.sub, marginBottom: 40 }}>구독 없이 주문할 때만 결제하세요</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {PRICING.map((p) => (
            <div key={p.qty} style={{
              background: p.highlight ? `linear-gradient(135deg, ${C.goldSoft}, transparent)` : C.card,
              border: `2px solid ${p.highlight ? C.gold : C.border}`,
              borderRadius: radius.xl, padding: '24px', textAlign: 'center',
              boxShadow: p.highlight ? `0 0 30px ${C.goldMed}` : 'none',
            }}>
              {p.highlight && <div style={{ fontSize: 10, color: C.gold, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>BEST</div>}
              <div style={{ fontSize: 28, fontWeight: 900, color: C.white, fontFamily: ff.display }}>{p.qty}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.gold, margin: '8px 0' }}>{p.price}</div>
              <div style={{ fontSize: 12, color: C.sub }}>{p.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: `radial-gradient(ellipse 70% 60% at 50% 100%, rgba(255,215,0,0.06), transparent)`,
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 12, fontFamily: ff.display }}>지금 바로 시작하세요</h2>
        <p style={{ color: C.sub, marginBottom: 32 }}>아이들에게 평생 기억될 선물을 만들어주세요</p>
        <Btn size="lg" onClick={() => navigate('/signup')}>무료로 시작하기 →</Btn>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 700, marginBottom: 8 }}>FDL CARD</div>
        <div style={{ fontSize: 12, color: C.gray }}>© 2025 FDL CARD. All rights reserved.</div>
      </footer>
    </div>
  );
}
