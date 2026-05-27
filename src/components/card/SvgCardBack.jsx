import { calcOverall, determineGrade } from '../../lib/utils';

const W = 400;
const H = 700;

const STAT_KEYS = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
const STAT_LABELS = ['PAC', 'DRI', 'PHY', 'ACC', 'TAC', 'PSY'];

const POS_XY_MAP = {
  GK:  [0.10, 0.50], CB:  [0.24, 0.50], LB:  [0.20, 0.22], RB:  [0.20, 0.78],
  CDM: [0.40, 0.50], CM:  [0.50, 0.50], CAM: [0.62, 0.50],
  LW:  [0.70, 0.18], RW:  [0.70, 0.82], CF:  [0.80, 0.50], ST:  [0.88, 0.50],
  FW:  [0.80, 0.50], MF:  [0.50, 0.50], DF:  [0.24, 0.50],
};

// Pitch area bounds within the 400×700 card
const PITCH = { x: 16, y: 196, w: 368, h: 278 };

export default function SvgCardBack({
  jerseyNumber = '',
  position = '',
  pac = 75, dri = 70, phy = 70, acc = 75, tac = 70, psy = 70,
  prevPac = 0, prevDri = 0, prevPhy = 0, prevAcc = 0, prevTac = 0, prevPsy = 0,
  playerName = '',
  description = '',
  height = '',
  weight = '',
  academyName = '',
  scale = 1,
}) {
  const stats = { pac, dri, phy, acc, tac, psy };
  const prevStats = { pac: prevPac, dri: prevDri, phy: prevPhy, acc: prevAcc, tac: prevTac, psy: prevPsy };

  const ovr = calcOverall(stats);
  const grade = determineGrade(ovr);

  // NEXT GOAL: find single lowest stat, boost by 2, recalculate OVR
  const sortedEntries = STAT_KEYS.map(k => [k, stats[k]]).sort(([, a], [, b]) => a - b);
  const [lowestKey, lowestVal] = sortedEntries[0];
  const nextStats = { ...stats, [lowestKey]: Math.min(lowestVal + 2, 99) };
  const nextOvr = calcOverall(nextStats);

  // Pitch indicator position
  const [px, py] = POS_XY_MAP[position] || POS_XY_MAP.CM;
  const indLeft = PITCH.x + PITCH.w * px;
  const indTop = PITCH.y + PITCH.h * py;

  const hasPrev = STAT_KEYS.some(k => prevStats[k] > 0);

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
        <img src="/card-back.svg" alt="" style={{ position: 'absolute', inset: 0, width: W, height: H, display: 'block', zIndex: 0 }} />

        {/* Top bar: NEXT GOAL */}
        <div style={{
          position: 'absolute', left: 15, top: 20, width: 370, height: 50, zIndex: 2,
          background: '#29ED73', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 14px', overflow: 'hidden',
        }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#0a0a0a', letterSpacing: 1 }}>NEXT GOAL</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(10,10,10,0.6)', letterSpacing: 1 }}>OVR</span>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#0a0a0a', letterSpacing: -1 }}>{nextOvr}</span>
            <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(10,10,10,0.5)' }}>{jerseyNumber ? `#${jerseyNumber}` : ''} {position}</span>
          </div>
        </div>

        {/* Current stats bar */}
        <div style={{
          position: 'absolute', left: 15, top: 75, width: 370, height: 50, zIndex: 2,
          background: '#fff', borderRadius: 8, overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}>
          {STAT_KEYS.map((key, i) => (
            <div key={key} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              borderRight: i < 5 ? '1px solid #f0f0f0' : 'none', height: '100%', gap: 1,
            }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#0a0a0a', lineHeight: 1 }}>{stats[key]}</span>
              <span style={{ fontSize: 8, fontWeight: 700, color: '#888', letterSpacing: 1 }}>{STAT_LABELS[i]}</span>
            </div>
          ))}
        </div>

        {/* Prev stats bar */}
        <div style={{
          position: 'absolute', left: 15, top: 130, width: 370, height: 50, zIndex: 2,
          background: '#fff', borderRadius: 8, overflow: 'hidden',
          display: 'flex', alignItems: 'center',
        }}>
          {STAT_KEYS.map((key, i) => (
            <div key={key} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              borderRight: i < 5 ? '1px solid #f0f0f0' : 'none', height: '100%', gap: 1,
            }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#999', lineHeight: 1 }}>
                {hasPrev ? prevStats[key] : '—'}
              </span>
              <span style={{ fontSize: 7, fontWeight: 700, color: '#aaa', letterSpacing: 0.5 }}>PREV</span>
            </div>
          ))}
        </div>

        {/* Position indicator on pitch */}
        <div style={{
          position: 'absolute',
          left: indLeft,
          top: indTop,
          zIndex: 2,
          transform: 'translate(-50%, -50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: '#29ED73', opacity: 0.9,
          border: '2px solid #0a0a0a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 8, fontWeight: 900, color: '#0a0a0a', letterSpacing: 0.5 }}>{position}</span>
        </div>

        {/* Player info */}
        <div style={{
          position: 'absolute', left: 16, top: 491, width: 368, height: 88, zIndex: 2,
          background: '#0a0a0a', border: '1.5px solid #29ED73',
          borderRadius: 8, padding: '12px 14px', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{playerName}</div>
          <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 5, lineHeight: 1.5 }}>
            {description || <span style={{ fontStyle: 'italic' }}>선수 소개를 입력해주세요</span>}
          </div>
        </div>

        {/* Card badge */}
        <div style={{
          position: 'absolute', left: 16, top: 601, width: 368, height: 33, zIndex: 2,
          background: '#0a0a0a', border: '1.5px solid #29ED73',
          borderRadius: 16, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 16px', overflow: 'hidden',
        }}>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{playerName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#29ED73', letterSpacing: 1 }}>{grade.name}</span>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{ovr}</span>
          </div>
        </div>

        {/* Card footer */}
        <div style={{
          position: 'absolute', left: 16, top: 652, width: 368, height: 40, zIndex: 2,
          background: '#0a0a0a', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '0 4px',
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            {height && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>HEIGHT</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}>{height}cm</span>
              </div>
            )}
            {weight && (
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: 7, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 }}>WEIGHT</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}>{weight}kg</span>
              </div>
            )}
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>{academyName}</span>
        </div>
      </div>
    </div>
  );
}
