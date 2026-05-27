const W = 400;
const H = 700;

const STAT_DEFS = [
  { key: 'pac', label: 'PAC', left: 116, top: 586 },
  { key: 'dri', label: 'DRI', left: 216, top: 586 },
  { key: 'phy', label: 'PHY', left: 316, top: 586 },
  { key: 'acc', label: 'ACC', left: 116, top: 632 },
  { key: 'tac', label: 'TAC', left: 216, top: 632 },
  { key: 'psy', label: 'PSY', left: 316, top: 632 },
];

export default function SvgCardFront({
  cardType = 'THE',
  cardLabel = '',
  jerseyNumber = '',
  position = '',
  photoUrl = '',
  academyLogoUrl = '',
  playerName = '',
  academyName = '',
  age = '',
  birthDate = '',
  nationality = '',
  pac = 75, dri = 70, phy = 70, acc = 75, tac = 70, psy = 70,
  scale = 1,
}) {
  const stats = { pac, dri, phy, acc, tac, psy };
  const metaParts = [academyName, age ? `${age}세` : null, birthDate, nationality].filter(Boolean);

  return (
    <div style={{ width: W * scale, height: H * scale, flexShrink: 0, position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: W, height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: 16,
        overflow: 'hidden',
        fontFamily: "'Arial Black', Arial, sans-serif",
        userSelect: 'none',
      }}>
        <img src="/card-front.svg" alt="" style={{ position: 'absolute', inset: 0, width: W, height: H, display: 'block', zIndex: 0 }} />

        {/* Photo zone */}
        <div style={{ position: 'absolute', left: 0, top: 130, width: 400, height: 320, zIndex: 1, overflow: 'hidden' }}>
          {photoUrl && (
            <img src={photoUrl} alt={playerName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
          )}
        </div>

        {/* Header label (left) */}
        <div style={{
          position: 'absolute', left: 12, top: 12, width: 226, height: 178, zIndex: 2,
          background: '#29ED73', display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end', padding: '0 10px 14px', gap: 3,
        }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(10,10,10,0.6)', letterSpacing: 3, textTransform: 'uppercase' }}>{cardType}</span>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.0, letterSpacing: '-0.5px', textTransform: 'uppercase' }}>{cardLabel}</span>
        </div>

        {/* Header jersey (right) */}
        <div style={{
          position: 'absolute', right: 6, top: 4, width: 168, height: 192, zIndex: 2,
          background: '#29ED73', display: 'flex', flexDirection: 'column',
          alignItems: 'flex-end', justifyContent: 'flex-end', padding: '0 10px 6px',
        }}>
          <span style={{ fontSize: 108, fontWeight: 900, color: '#0a0a0a', lineHeight: 0.88, letterSpacing: -6 }}>{jerseyNumber}</span>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#0a0a0a', letterSpacing: 3, marginTop: 4 }}>{position}</span>
        </div>

        {/* Info bar */}
        <div style={{
          position: 'absolute', left: 15, top: 460, width: 370, height: 75, zIndex: 2,
          background: '#ffffff', borderRadius: 8, overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{ width: 71, height: 75, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' }}>
            {academyLogoUrl ? (
              <img src={academyLogoUrl} alt={academyName} style={{ width: 55, height: 60, borderRadius: 6, background: '#F2F2F2', objectFit: 'contain', display: 'block' }} />
            ) : (
              <div style={{ width: 55, height: 60, borderRadius: 6, background: '#F2F2F2' }} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0, padding: '8px 10px 8px 0' }}>
            <div style={{ fontSize: 21, fontWeight: 900, color: '#0a0a0a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>{playerName}</div>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, fontWeight: 700, color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 4, letterSpacing: 0.3 }}>
              {metaParts.join(' · ')}
            </div>
          </div>
        </div>

        {/* Stat left cover */}
        <div style={{ position: 'absolute', left: 12, top: 556, width: 90, height: 44, zIndex: 2, background: '#29ED73' }} />

        {/* Stats */}
        {STAT_DEFS.map(({ key, label, left, top }) => (
          <div key={key} style={{
            position: 'absolute', left, top, width: 72, height: 43, zIndex: 2,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
            background: '#29ED73', padding: '1px 2px 2px',
          }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#0a0a0a', lineHeight: 1 }}>{stats[key]}</span>
            <span style={{ fontSize: 9, fontWeight: 900, color: 'rgba(10,10,10,0.75)', letterSpacing: 1.5, marginTop: 1 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
