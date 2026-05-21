import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line } from 'react-konva';
import { calcOverall } from '../../lib/utils';

const STAT_ROWS = [
  ['pac', 'PAC', 'dri', 'DRI'],
  ['phy', 'PHY', 'acc', 'ACC'],
  ['tac', 'TAC', 'psy', 'PSY'],
];

const BAR_W = 110;
const BAR_H = 8;
const LEFT_X = 24;
const RIGHT_X = 216;
const ROW_H = 60;
const STATS_START_Y = 170;

function getBarColor(val, accent) {
  if (val >= 85) return '#00E676';
  if (val >= 70) return accent;
  if (val >= 55) return '#FF9800';
  return '#FF5252';
}

function StatBar({ x, abbr, val, accent }) {
  const barColor = getBarColor(val, accent);
  const fillW = Math.max(4, BAR_W * val / 99);
  const baseY = STATS_START_Y;

  return null; // rendered inline in component below
}

const CardBack = forwardRef(function CardBack({ template, player, stats, teamColor, scale = 1 }, ref) {
  const stageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));

  if (!template?.config) return null;

  const cfg = template.config;
  const overall = calcOverall(stats);
  const accent = cfg.border.color;
  const W = cfg.width;   // 400
  const H = cfg.height;  // 560

  const statItems = [];
  STAT_ROWS.forEach((row, rowIdx) => {
    const y0 = STATS_START_Y + rowIdx * ROW_H;
    [[row[0], row[1], LEFT_X], [row[2], row[3], RIGHT_X]].forEach(([key, abbr, cellX]) => {
      const val = stats?.[key] ?? 70;
      const barColor = getBarColor(val, accent);
      const fillW = Math.max(4, BAR_W * val / 99);
      statItems.push(
        // Abbreviation
        <Text
          key={`${key}-abbr`}
          text={abbr}
          x={cellX}
          y={y0 + 4}
          fontSize={11}
          fontFamily="Arial"
          fontStyle="bold"
          fill={accent}
        />,
        // Value
        <Text
          key={`${key}-val`}
          text={String(val)}
          x={cellX + BAR_W + 14}
          y={y0 + 4}
          fontSize={13}
          fontFamily="'Bebas Neue', Impact, sans-serif"
          fontStyle="bold"
          fill="#FFFFFF"
          align="right"
          width={20}
        />,
        // Bar track
        <Rect
          key={`${key}-track`}
          x={cellX}
          y={y0 + 22}
          width={BAR_W}
          height={BAR_H}
          fill="rgba(255,255,255,0.12)"
          cornerRadius={4}
        />,
        // Bar fill
        <Rect
          key={`${key}-fill`}
          x={cellX}
          y={y0 + 22}
          width={fillW}
          height={BAR_H}
          fill={barColor}
          cornerRadius={4}
          shadowColor={barColor}
          shadowBlur={4}
          shadowOpacity={0.5}
        />,
      );
    });
  });

  const cardId = player?.id?.slice(-6)?.toUpperCase() || 'FDLCRD';

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage
        ref={stageRef}
        width={W}
        height={H}
        style={{ borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 40px ${cfg.border.glowColor || 'rgba(255,215,0,0.3)'}` }}
      >
        <Layer>
          {/* Background */}
          <Rect
            x={0} y={0} width={W} height={H}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: H }}
            fillLinearGradientColorStops={cfg.background.colors.flatMap((c, i) => [i / (cfg.background.colors.length - 1), c])}
          />

          {/* Border glow */}
          <Rect
            x={0} y={0} width={W} height={H}
            stroke={cfg.border.color}
            strokeWidth={cfg.border.width}
            shadowColor={cfg.border.glowColor}
            shadowBlur={cfg.border.glowBlur}
            cornerRadius={16}
          />

          {/* Header bar */}
          <Rect x={0} y={0} width={W} height={56} fill={`${accent}18`} />
          <Text
            text="FDL CARD"
            x={0} y={16}
            width={W}
            align="center"
            fontSize={18}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            letterSpacing={4}
            fill={accent}
            shadowColor={accent}
            shadowBlur={8}
            shadowOpacity={0.4}
          />
          <Text
            text={template.slug?.toUpperCase() || 'STANDARD'}
            x={0} y={38}
            width={W}
            align="center"
            fontSize={10}
            fontFamily="Arial"
            letterSpacing={3}
            fill={`${accent}80`}
          />

          {/* OVR */}
          <Text
            text="OVR"
            x={0} y={68}
            width={W}
            align="center"
            fontSize={11}
            fontFamily="Arial"
            letterSpacing={3}
            fill="rgba(255,255,255,0.4)"
          />
          <Text
            text={String(overall)}
            x={0} y={82}
            width={W}
            align="center"
            fontSize={72}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={accent}
            shadowColor={accent}
            shadowBlur={20}
            shadowOpacity={0.5}
          />

          {/* Divider */}
          <Line
            points={[24, 162, W - 24, 162]}
            stroke={`${accent}30`}
            strokeWidth={1}
          />

          {/* Section label */}
          <Text
            text="ABILITY"
            x={0} y={148}
            width={W}
            align="center"
            fontSize={9}
            fontFamily="Arial"
            letterSpacing={3}
            fill="rgba(255,255,255,0.25)"
          />

          {/* Stats bars */}
          {statItems}

          {/* Divider */}
          <Line
            points={[24, STATS_START_Y + 3 * ROW_H + 4, W - 24, STATS_START_Y + 3 * ROW_H + 4]}
            stroke={`${accent}30`}
            strokeWidth={1}
          />

          {/* Center divider between left/right stats */}
          <Line
            points={[W / 2, STATS_START_Y - 8, W / 2, STATS_START_Y + 3 * ROW_H]}
            stroke={`${accent}15`}
            strokeWidth={1}
          />

          {/* Player name */}
          <Text
            text={(player?.name || 'PLAYER').toUpperCase()}
            x={0}
            y={STATS_START_Y + 3 * ROW_H + 16}
            width={W}
            align="center"
            fontSize={28}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fill="#FFFFFF"
            letterSpacing={2}
          />

          {/* Position · Jersey */}
          <Text
            text={`${player?.position || 'POS'}  ·  #${player?.jersey_number || '0'}`}
            x={0}
            y={STATS_START_Y + 3 * ROW_H + 50}
            width={W}
            align="center"
            fontSize={14}
            fontFamily="Arial"
            fill={accent}
            letterSpacing={2}
          />

          {/* Team color bar */}
          <Rect
            x={0}
            y={STATS_START_Y + 3 * ROW_H + 74}
            width={W}
            height={3}
            fill={teamColor || accent}
            opacity={0.7}
          />

          {/* Footer */}
          <Text
            text="FDL CARD"
            x={0} y={H - 64}
            width={W}
            align="center"
            fontSize={14}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            letterSpacing={4}
            fill={`${accent}60`}
          />
          <Text
            text={`#${cardId}`}
            x={0} y={H - 44}
            width={W}
            align="center"
            fontSize={10}
            fontFamily="Arial"
            letterSpacing={2}
            fill="rgba(255,255,255,0.2)"
          />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardBack;
