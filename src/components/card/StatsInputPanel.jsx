import StatSlider from '../ui/StatSlider';
import { C, radius } from '../../tokens';
import { calcOverall } from '../../lib/utils';

const STAT_KEYS = ['shooting', 'passing', 'speed', 'dribbling', 'physical'];

function getOverallColor(val) {
  if (val >= 85) return '#00E676';
  if (val >= 70) return '#FFD700';
  if (val >= 55) return '#FF9800';
  return '#FF5252';
}

export default function StatsInputPanel({ stats, onChange }) {
  const overall = calcOverall(stats);
  const color = getOverallColor(overall);

  function setStat(key, val) {
    onChange({ ...stats, [key]: val });
  }

  return (
    <div>
      {/* OVR display */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 12, marginBottom: 24,
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: radius.lg, padding: '16px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: C.sub, letterSpacing: 2, fontWeight: 600, marginBottom: 2 }}>종합 능력치</div>
          <div style={{ fontSize: 56, fontWeight: 900, color, fontFamily: "'Bebas Neue', Impact, sans-serif", lineHeight: 1 }}>{overall}</div>
          <div style={{ fontSize: 10, color: C.sub }}>OVR</div>
        </div>
      </div>

      {/* Sliders */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {STAT_KEYS.map((key) => (
          <StatSlider
            key={key}
            statKey={key}
            value={stats[key] || 70}
            onChange={(val) => setStat(key, val)}
          />
        ))}
      </div>
    </div>
  );
}
