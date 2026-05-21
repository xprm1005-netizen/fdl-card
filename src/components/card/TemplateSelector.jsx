import { C, radius } from '../../tokens';

const TEMPLATE_COLORS = {
  gold:   { accent: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  chrome: { accent: '#B0C4DE', glow: 'rgba(176,196,222,0.2)' },
  legend: { accent: '#E040FB', glow: 'rgba(224,64,251,0.3)' },
  fire:   { accent: '#FF4500', glow: 'rgba(255,69,0,0.4)' },
  ice:    { accent: '#00CFFF', glow: 'rgba(0,207,255,0.35)' },
};

export default function TemplateSelector({ templates, selected, onSelect, onPremiumClick }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {templates.map((t) => {
        const tc = TEMPLATE_COLORS[t.slug] || TEMPLATE_COLORS.gold;
        const isActive = selected?.id === t.id;
        const isPremium = t.is_premium;

        function handleClick() {
          if (isPremium) {
            onPremiumClick ? onPremiumClick(t) : alert('프리미엄 템플릿입니다.');
          } else {
            onSelect(t);
          }
        }

        return (
          <button
            key={t.id}
            onClick={handleClick}
            style={{
              background: isActive ? `linear-gradient(135deg, ${tc.accent}15, ${tc.accent}08)` : C.card,
              border: `2px solid ${isActive ? tc.accent : isPremium ? `${tc.accent}50` : C.border}`,
              borderRadius: radius.lg,
              padding: '16px',
              cursor: isPremium ? 'default' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: isActive ? `0 0 20px ${tc.glow}` : 'none',
              textAlign: 'left',
              fontFamily: 'inherit',
              position: 'relative',
              opacity: isPremium ? 0.75 : 1,
            }}
          >
            {/* Premium badge */}
            {isPremium && (
              <div style={{
                position: 'absolute',
                top: 8, right: 8,
                background: `linear-gradient(135deg, ${tc.accent}, ${tc.accent}cc)`,
                color: '#000',
                fontSize: 9,
                fontWeight: 800,
                padding: '2px 7px',
                borderRadius: 10,
                letterSpacing: 0.5,
                lineHeight: 1.4,
              }}>
                🔒 PREMIUM
              </div>
            )}

            {t.thumbnail_url ? (
              <img
                src={t.thumbnail_url}
                alt={t.name}
                style={{ width: '100%', aspectRatio: '400/560', objectFit: 'cover', borderRadius: 8, marginBottom: 10 }}
              />
            ) : (
              <div style={{
                width: '100%', aspectRatio: '400/560',
                background: `linear-gradient(160deg, ${tc.accent}20, transparent)`,
                borderRadius: 8, marginBottom: 10,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                border: `1px solid ${tc.accent}30`,
              }}>
                <span style={{
                  fontSize: 28, fontFamily: "'Bebas Neue', Impact, sans-serif",
                  color: tc.accent, opacity: 0.75, letterSpacing: 2,
                }}>
                  {t.name.toUpperCase()}
                </span>
                {isPremium && (
                  <span style={{ fontSize: 11, color: tc.accent, opacity: 0.6 }}>
                    {(t.price / 1000).toLocaleString()}원~
                  </span>
                )}
              </div>
            )}

            <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? tc.accent : C.white }}>
              {t.name}
            </div>
            {isPremium ? (
              <div style={{ fontSize: 11, color: tc.accent, marginTop: 2, opacity: 0.8 }}>
                {t.price?.toLocaleString()}원 · 잠금 해제 필요
              </div>
            ) : isActive ? (
              <div style={{ fontSize: 11, color: tc.accent, marginTop: 2 }}>✓ 선택됨</div>
            ) : (
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>무료</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
