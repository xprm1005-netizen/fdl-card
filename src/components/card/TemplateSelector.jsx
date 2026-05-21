import { C, radius } from '../../tokens';

const TEMPLATE_COLORS = {
  gold:     { accent: '#62FF7E', glow: 'rgba(98,255,126,0.28)', title: ['THE', 'SPEED', 'STAR'] },
  chrome:   { accent: '#DCE7EF', glow: 'rgba(220,231,239,0.22)', title: ['THE', 'PLAY', 'MAKER'] },
  legend:   { accent: '#C77DFF', glow: 'rgba(199,125,255,0.30)', title: ['THE', 'TEAM', 'LEADER'] },
  rising:   { accent: '#BFFF35', glow: 'rgba(191,255,53,0.36)', title: ['RISING', 'PRO', 'CARD'] },
  matchday: { accent: '#31E6C5', glow: 'rgba(49,230,197,0.32)', title: ['MATCH', 'DAY', 'HERO'] },
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
                background: '#070807',
                borderRadius: 8, marginBottom: 10,
                display: 'flex', flexDirection: 'column',
                border: `1px solid ${tc.accent}50`,
                overflow: 'hidden',
                boxShadow: `inset 0 0 0 5px #1f221f`,
              }}>
                <div style={{
                  margin: '11px 9px 0',
                  height: '23%',
                  background: tc.accent,
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 10px',
                  color: '#070807',
                }}>
                  <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 17, lineHeight: 0.86, textAlign: 'left' }}>
                    {(tc.title || [t.name]).map((line) => <div key={line}>{line}</div>)}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 34, fontWeight: 900 }}>70</div>
                </div>
                <div style={{
                  margin: '0 9px',
                  flex: 1,
                  background: `linear-gradient(135deg, #eff2ed, ${tc.accent}18 45%, #c9cec7)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{ width: '42%', height: '68%', borderRadius: 999, background: `${tc.accent}38`, filter: 'blur(1px)' }} />
                </div>
                <div style={{ margin: '0 9px', height: '14%', background: '#F8FAF4' }} />
                <div style={{ margin: '0 9px 10px', height: '19%', background: tc.accent, borderRadius: '0 0 4px 4px' }} />
                {isPremium && (
                  <span style={{ position: 'absolute', left: 26, bottom: 63, fontSize: 10, color: '#070807', opacity: 0.65, fontWeight: 900 }}>
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
