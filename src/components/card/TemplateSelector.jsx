import { C, radius } from '../../tokens';

const TEMPLATE_COLORS = {
  gold:   { accent: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  toty:   { accent: '#00E5FF', glow: 'rgba(0,229,255,0.3)' },
  chrome: { accent: '#B0C4DE', glow: 'rgba(176,196,222,0.2)' },
  legend: { accent: '#E040FB', glow: 'rgba(224,64,251,0.3)' },
};

export default function TemplateSelector({ templates, selected, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {templates.map((t) => {
        const tc = TEMPLATE_COLORS[t.slug] || TEMPLATE_COLORS.gold;
        const isActive = selected?.id === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            style={{
              background: isActive ? `linear-gradient(135deg, ${tc.accent}15, ${tc.accent}08)` : C.card,
              border: `2px solid ${isActive ? tc.accent : C.border}`,
              borderRadius: radius.lg,
              padding: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: isActive ? `0 0 20px ${tc.glow}` : 'none',
              textAlign: 'left',
              fontFamily: 'inherit',
            }}
          >
            {t.thumbnail_url ? (
              <img src={t.thumbnail_url} alt={t.name} style={{ width: '100%', aspectRatio: '400/560', objectFit: 'cover', borderRadius: 8, marginBottom: 10 }} />
            ) : (
              <div style={{
                width: '100%', aspectRatio: '400/560',
                background: `linear-gradient(160deg, ${tc.accent}20, transparent)`,
                borderRadius: 8, marginBottom: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${tc.accent}30`,
              }}>
                <span style={{ fontSize: 32, fontFamily: "'Bebas Neue', Impact, sans-serif", color: tc.accent, opacity: 0.7 }}>{t.name.toUpperCase()}</span>
              </div>
            )}
            <div style={{ fontSize: 14, fontWeight: 700, color: isActive ? tc.accent : C.white }}>{t.name}</div>
            {isActive && <div style={{ fontSize: 11, color: tc.accent, marginTop: 2 }}>✓ 선택됨</div>}
          </button>
        );
      })}
    </div>
  );
}
