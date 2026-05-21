import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Image } from 'react-konva';
import useImage from 'use-image';
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
const STATS_START_Y = 176;

function getBarColor(val, accent) {
  if (val >= 85) return '#00E676';
  if (val >= 70) return accent;
  if (val >= 55) return '#FF9800';
  return '#FF5252';
}

function AcademyLogoSmall({ academy, x, y, size, accentColor }) {
  const [img, status] = useImage(academy?.logo_url || '', 'anonymous');
  if (academy?.logo_url && status === 'loaded' && img) {
    return <Image image={img} x={x} y={y} width={size} height={size} cornerRadius={6} />;
  }
  return (
    <>
      <Rect x={x} y={y} width={size} height={size}
        fill={`${accentColor}1A`} stroke={`${accentColor}4D`}
        strokeWidth={1} cornerRadius={6}
      />
      <Text
        text="F" x={x} y={y + Math.round(size * 0.1)}
        width={size} align="center"
        fontSize={Math.round(size * 0.6)}
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fill={accentColor} opacity={0.6}
      />
    </>
  );
}

const CardBack = forwardRef(function CardBack(
  { template, player, stats, academy, teamColor, scale = 1 },
  ref,
) {
  const stageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));

  if (!template?.config) return null;

  const cfg = template.config;
  const overall = calcOverall(stats);
  const accent = cfg.border.color;
  const W = cfg.width;
  const H = cfg.height;

  const statItems = [];
  STAT_ROWS.forEach((row, rowIdx) => {
    const y0 = STATS_START_Y + rowIdx * ROW_H;
    [[row[0], row[1], LEFT_X], [row[2], row[3], RIGHT_X]].forEach(([key, abbr, cellX]) => {
      const val = stats?.[key] ?? 70;
      const barColor = getBarColor(val, accent);
      const fillW = Math.max(4, BAR_W * val / 99);
      statItems.push(
        <Text key={`${key}-abbr`} text={abbr} x={cellX} y={y0 + 4}
          fontSize={11} fontFamily="Arial" fontStyle="bold" fill={accent} />,
        <Text key={`${key}-val`} text={String(val)}
          x={cellX + BAR_W + 14} y={y0 + 4}
          fontSize={13} fontFamily="'Bebas Neue', Impact, sans-serif"
          fontStyle="bold" fill="#FFFFFF" align="right" width={20} />,
        <Rect key={`${key}-track`} x={cellX} y={y0 + 22}
          width={BAR_W} height={BAR_H}
          fill="rgba(255,255,255,0.12)" cornerRadius={4} />,
        <Rect key={`${key}-fill`} x={cellX} y={y0 + 22}
          width={fillW} height={BAR_H}
          fill={barColor} cornerRadius={4}
          shadowColor={barColor} shadowBlur={4} shadowOpacity={0.5} />,
      );
    });
  });

  const cardId = player?.id?.slice(-6)?.toUpperCase() || 'FDLCRD';
  const academyName = (academy?.name || 'FDL FC').toUpperCase();

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage
        ref={stageRef} width={W} height={H}
        style={{ borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 40px ${cfg.border.glowColor || 'rgba(255,215,0,0.3)'}` }}
      >
        <Layer>
          {/* Background */}
          <Rect x={0} y={0} width={W} height={H}
            fillLinearGradientStartPoint={{ x: 0, y: 0 }}
            fillLinearGradientEndPoint={{ x: 0, y: H }}
            fillLinearGradientColorStops={cfg.background.colors.flatMap((c, i) => [i / (cfg.background.colors.length - 1), c])}
          />

          {/* Border */}
          <Rect x={0} y={0} width={W} height={H}
            stroke={cfg.border.color} strokeWidth={cfg.border.width}
            shadowColor={cfg.border.glowColor} shadowBlur={cfg.border.glowBlur}
            cornerRadius={16}
          />

          {/* Header bar */}
          <Rect x={0} y={0} width={W} height={58} fill={`${accent}18`} />

          {/* Academy logo in header */}
          <AcademyLogoSmall academy={academy} x={16} y={13} size={32} accentColor={accent} />

          {/* Header title */}
          <Text text="FDL CARD"
            x={0} y={16} width={W} align="center"
            fontSize={18} fontFamily="'Bebas Neue', Impact, sans-serif"
            letterSpacing={4} fill={accent}
            shadowColor={accent} shadowBlur={8} shadowOpacity={0.4}
          />
          <Text text={template.slug?.toUpperCase() || 'STANDARD'}
            x={0} y={38} width={W} align="center"
            fontSize={10} fontFamily="Arial" letterSpacing={3}
            fill={`${accent}80`}
          />

          {/* OVR section */}
          <Text text="OVR"
            x={0} y={70} width={W} align="center"
            fontSize={11} fontFamily="Arial" letterSpacing={3}
            fill="rgba(255,255,255,0.35)"
          />
          <Text text={String(overall)}
            x={0} y={84} width={W} align="center"
            fontSize={72} fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold" fill={accent}
            shadowColor={accent} shadowBlur={22} shadowOpacity={0.5}
          />

          {/* Divider */}
          <Line points={[24, 168, W - 24, 168]} stroke={`${accent}30`} strokeWidth={1} />
          <Text text="ABILITY"
            x={0} y={154} width={W} align="center"
            fontSize={9} fontFamily="Arial" letterSpacing={3}
            fill="rgba(255,255,255,0.22)"
          />

          {/* Stats bars */}
          {statItems}

          {/* Divider */}
          <Line
            points={[24, STATS_START_Y + 3 * ROW_H + 4, W - 24, STATS_START_Y + 3 * ROW_H + 4]}
            stroke={`${accent}30`} strokeWidth={1}
          />
          <Line
            points={[W / 2, STATS_START_Y - 8, W / 2, STATS_START_Y + 3 * ROW_H]}
            stroke={`${accent}15`} strokeWidth={1}
          />

          {/* Player name */}
          <Text text={(player?.name || 'PLAYER').toUpperCase()}
            x={0} y={STATS_START_Y + 3 * ROW_H + 16}
            width={W} align="center"
            fontSize={28} fontFamily="'Bebas Neue', Impact, sans-serif"
            fill="#FFFFFF" letterSpacing={2}
          />

          {/* Position · Jersey */}
          <Text text={`${player?.position || 'POS'}  ·  #${player?.jersey_number || '0'}`}
            x={0} y={STATS_START_Y + 3 * ROW_H + 50}
            width={W} align="center"
            fontSize={14} fontFamily="Arial" fill={accent} letterSpacing={2}
          />

          {/* Academy name */}
          <Text text={academyName}
            x={0} y={STATS_START_Y + 3 * ROW_H + 72}
            width={W} align="center"
            fontSize={11} fontFamily="Arial" letterSpacing={2}
            fill={`${accent}70`}
          />

          {/* Team color bar */}
          <Rect
            x={0} y={STATS_START_Y + 3 * ROW_H + 90}
            width={W} height={3}
            fill={teamColor || accent} opacity={0.7}
          />

          {/* Footer */}
          <Text text="FDL CARD"
            x={0} y={H - 58} width={W} align="center"
            fontSize={14} fontFamily="'Bebas Neue', Impact, sans-serif"
            letterSpacing={4} fill={`${accent}60`}
          />
          <Text text={`#${cardId}`}
            x={0} y={H - 38} width={W} align="center"
            fontSize={10} fontFamily="Arial" letterSpacing={2}
            fill="rgba(255,255,255,0.18)"
          />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardBack;
