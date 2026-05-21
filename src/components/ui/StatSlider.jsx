import { C } from '../../tokens';

const STAT_LABELS = {
  shooting:  '슈팅',
  passing:   '패스',
  speed:     '스피드',
  dribbling: '드리블',
  physical:  '피지컬',
};

function getColor(val) {
  if (val >= 85) return '#00E676';
  if (val >= 70) return '#FFD700';
  if (val >= 55) return '#FF9800';
  return '#FF5252';
}

export default function StatSlider({ statKey, value, onChange }) {
  const label = STAT_LABELS[statKey] || statKey;
  const color = getColor(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: C.sub, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
        <span style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: 1 }}>{value}</span>
      </div>
      <div style={{ position: 'relative', height: 6 }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: C.border, borderRadius: 3,
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0,
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}80, ${color})`,
          borderRadius: 3,
          transition: 'width 0.1s',
        }} />
        <input
          type="range"
          min={1}
          max={99}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            opacity: 0,
            cursor: 'pointer',
            margin: 0,
            height: '100%',
          }}
        />
      </div>
    </div>
  );
}
