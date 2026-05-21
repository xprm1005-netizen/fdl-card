import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Package, Zap } from 'lucide-react';
import { C, ff, radius } from '../../tokens';
import Btn from '../../components/ui/Btn';

const SELF_PLANS = [
  { qty: '1장', total: '6,900원', per: '6,900원/장' },
  { qty: '5장', total: '24,900원', per: '4,980원/장' },
  { qty: '11장', total: '49,900원', per: '4,536원/장', badge: 'BEST' },
  { qty: '20장', total: '89,000원', per: '4,450원/장', badge: '최저가' },
];

const ONESTOP_PLANS = [
  { size: '5명', total: '69,000원', per: '13,800원/명', save: '' },
  { size: '11명', total: '143,000원', per: '13,000원/명', save: '6% 절감' },
  { size: '15명', total: '180,000원', per: '12,000원/명', save: '13% 절감', badge: 'BEST' },
  { size: '20명', total: '230,000원', per: '11,500원/명', save: '17% 절감' },
];

const SELF_INCLUDES = [
  'AI 배경 제거 (자동)',
  '3가지 프리미엄 템플릿',
  '실시간 카드 미리보기',
  '실물 인쇄 + 배송 (7영업일)',
];

const ONESTOP_INCLUDES = [
  '선수 정보 대신 입력',
  'AI 배경 제거 + 수동 보정',
  '능력치 기본값 설정',
  '카드 디자인 완성',
  '실물 인쇄 + 배송 (7영업일)',
  '아카데미 전용 고객지원',
];

export default function PricingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '0 20px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: `${C.bg}ee`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontFamily: 'inherit' }}>
          <ChevronLeft size={16} /> 뒤로
        </button>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 800 }}>⚽ FDL CARD</div>
        <div style={{ width: 60 }} />
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 20px 60px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 700, marginBottom: 12, border: `1px solid ${C.goldMed}`, padding: '4px 16px', borderRadius: 20, display: 'inline-block' }}>
            PRICING
          </div>
          <h1 style={{ margin: '0 0 12px', fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 900, fontFamily: ff.display, letterSpacing: 1 }}>
            두 가지 방식으로 선택하세요
          </h1>
          <p style={{ color: C.sub, fontSize: 15, margin: 0 }}>
            직접 만들거나, FDL이 모두 대신해드립니다
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* Track 1: Self Service */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: radius.xl, padding: '32px 28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,215,0,0.08)', borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={20} color={C.gold} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, fontWeight: 700 }}>셀프 서비스</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>직접 입력 + 인쇄</h2>
              </div>
            </div>
            <p style={{ color: C.sub, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
              앱에서 직접 선수 정보를 입력하고 AI 누끼 처리 후 인쇄를 주문합니다.
            </p>

            {/* Includes */}
            <div style={{ marginBottom: 24 }}>
              {SELF_INCLUDES.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Check size={14} color={C.gold} />
                  <span style={{ fontSize: 13, color: C.sub }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Plans */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {SELF_PLANS.map((p) => (
                <div key={p.qty} style={{
                  background: p.badge ? `linear-gradient(135deg, rgba(255,215,0,0.06), transparent)` : C.surface,
                  border: `1px solid ${p.badge ? C.goldMed : C.border}`,
                  borderRadius: radius.md, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{p.qty}</span>
                    {p.badge && <span style={{ fontSize: 9, color: C.gold, border: `1px solid ${C.goldMed}`, padding: '1px 6px', borderRadius: 10, letterSpacing: 1 }}>{p.badge}</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{p.total}</div>
                    <div style={{ fontSize: 11, color: C.gray }}>{p.per}</div>
                  </div>
                </div>
              ))}
            </div>

            <Btn fullWidth onClick={() => navigate('/signup')}>앱에서 시작하기</Btn>
          </div>

          {/* Track 2: One-stop Service */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,215,0,0.05), transparent)',
            border: `2px solid ${C.goldMed}`,
            borderRadius: radius.xl, padding: '32px 28px',
            boxShadow: `0 0 40px rgba(255,215,0,0.08)`,
            position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: C.gold, color: C.bg, fontSize: 10, fontWeight: 800, letterSpacing: 2, padding: '4px 16px', borderRadius: 20 }}>
              추천
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 40, height: 40, background: 'rgba(255,215,0,0.12)', borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} color={C.gold} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, fontWeight: 700 }}>원스톱 패키지</div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>완전 대행 서비스</h2>
              </div>
            </div>
            <p style={{ color: C.sub, fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
              사진과 선수 명단만 보내주시면 FDL이 모든 과정을 처리하고 실물 카드로 배송해드립니다.
            </p>

            {/* Includes */}
            <div style={{ marginBottom: 24 }}>
              {ONESTOP_INCLUDES.map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Check size={14} color={C.gold} />
                  <span style={{ fontSize: 13, color: C.sub }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Plans */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {ONESTOP_PLANS.map((p) => (
                <div key={p.size} style={{
                  background: p.badge ? `linear-gradient(135deg, rgba(255,215,0,0.08), transparent)` : C.surface,
                  border: `1px solid ${p.badge ? C.goldMed : C.border}`,
                  borderRadius: radius.md, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{p.size}</span>
                    {p.badge && <span style={{ fontSize: 9, color: C.gold, border: `1px solid ${C.goldMed}`, padding: '1px 6px', borderRadius: 10, letterSpacing: 1 }}>{p.badge}</span>}
                    {p.save && <span style={{ fontSize: 10, color: '#00E676' }}>{p.save}</span>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.gold }}>{p.total}</div>
                    <div style={{ fontSize: 11, color: C.gray }}>{p.per}</div>
                  </div>
                </div>
              ))}
            </div>

            <Btn fullWidth onClick={() => window.open('mailto:contact@fdlcard.com?subject=원스톱 패키지 문의', '_blank')}>
              도입 문의하기
            </Btn>
          </div>
        </div>

        {/* FAQ-style note */}
        <div style={{ marginTop: 40, background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.xl, padding: '24px 28px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>자주 묻는 질문</h3>
          {[
            { q: '배송은 얼마나 걸리나요?', a: '결제 확인 후 영업일 기준 7일 이내 배송됩니다.' },
            { q: '원스톱 패키지는 어떻게 신청하나요?', a: '도입 문의 버튼을 통해 이메일로 문의하시면 담당자가 안내해드립니다.' },
            { q: '스탯 수정이 가능한가요?', a: '셀프 서비스는 카드 생성 시 자유롭게 수정할 수 있습니다. 원스톱 패키지는 담당자와 협의합니다.' },
          ].map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4 }}>Q. {q}</div>
              <div style={{ fontSize: 13, color: C.sub, paddingLeft: 16 }}>A. {a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
