import { C, radius } from '../../tokens';

const META = {
  fdl1: { accent: '#37b57b', glow: 'rgba(55,181,123,0.35)' },
  fdl2: { accent: '#1fa561', glow: 'rgba(31,165,97,0.35)'  },
  fdl3: { accent: '#29a46b', glow: 'rgba(41,164,107,0.35)' },
  fdl4: { accent: '#269e65', glow: 'rgba(38,158,101,0.35)' },
};

export default function TemplateSelector({ templates, selected, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
      {templates.map((t, idx) => {
        const meta     = META[t.slug] || META.fdl1;
        const isActive = selected?.id === t.id;

        return (
          <button
            key={t.id}
            onClick={() => onSelect(t)}
            style={{
              background: isActive ? `${meta.accent}0C` : C.card,
              border: `2px solid ${isActive ? meta.accent : t.is_premium ? `${meta.accent}50` : C.border}`,
              borderRadius: radius.lg,
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.18s',
              boxShadow: isActive ? `0 0 22px ${meta.glow}` : 'none',
              textAlign: 'left',
              fontFamily: 'inherit',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = `${meta.accent}88`;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${meta.glow}`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = t.is_premium ? `${meta.accent}50` : C.border;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {/* PNG 썸네일 */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '420/560', overflow: 'hidden' }}>
              <img
                src={`/thumbnails/${t.slug}.png`}
                alt={t.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />

              {/* No.N 배지 */}
              <div style={{
                position: 'absolute', top: 7, left: 7, zIndex: 5,
                background: 'rgba(0,0,0,0.72)',
                color: meta.accent, fontSize: 9, fontWeight: 800,
                padding: '2px 7px', borderRadius: 6, letterSpacing: 0.5,
                border: `1px solid ${meta.accent}55`,
                backdropFilter: 'blur(4px)',
              }}>
                No.{idx + 1}
              </div>

              {/* PREMIUM 배지 */}
              {t.is_premium && (
                <div style={{
                  position: 'absolute', top: 7, right: 7, zIndex: 5,
                  background: `linear-gradient(135deg, ${meta.accent}ee, ${meta.accent}aa)`,
                  color: '#000', fontSize: 8, fontWeight: 900,
                  padding: '2px 7px', borderRadius: 10, letterSpacing: 0.5,
                }}>
                  ★ PREMIUM
                </div>
              )}

              {/* 선택 오버레이 */}
              {isActive && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 6,
                  border: `3px solid ${meta.accent}`,
                  boxShadow: `inset 0 0 20px ${meta.accent}22`,
                  pointerEvents: 'none',
                }} />
              )}
            </div>

            {/* 텍스트 */}
            <div style={{ padding: '10px 12px 11px' }}>
              <div style={{
                fontSize: 13, fontWeight: 800,
                color: isActive ? meta.accent : '#FFFFFF', lineHeight: 1.2,
              }}>
                {t.name}
              </div>
              <div style={{ fontSize: 10, marginTop: 3 }}>
                {t.is_premium ? (
                  <span style={{ color: meta.accent }}>PREMIUM · {t.price?.toLocaleString()}원</span>
                ) : isActive ? (
                  <span style={{ color: meta.accent }}>✓ 선택됨</span>
                ) : (
                  <span style={{ color: '#6B7280' }}>무료</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
