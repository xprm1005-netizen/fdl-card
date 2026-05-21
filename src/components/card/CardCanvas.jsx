import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Text, Image, Line, Circle } from 'react-konva';
import useImage from 'use-image';
import { calcOverall } from '../../lib/utils';

const STAT_SHORT = { pac: 'PAC', dri: 'DRI', phy: 'PHY', acc: 'ACC', tac: 'TAC', psy: 'PSY' };
const PLACEHOLDER_URL = '/player-placeholder.svg';

function BgGradient({ width, height, colors }) {
  const stops = colors.flatMap((c, i) => [i / (colors.length - 1), c]);
  return (
    <Rect
      x={0} y={0} width={width} height={height}
      fillLinearGradientStartPoint={{ x: 0, y: 0 }}
      fillLinearGradientEndPoint={{ x: 0, y: height }}
      fillLinearGradientColorStops={stops}
    />
  );
}

function PlayerPhoto({ src, cfg }) {
  const effectiveSrc = src || PLACEHOLDER_URL;
  const [img] = useImage(effectiveSrc, 'anonymous');
  if (!img) return null;
  return (
    <Image
      image={img}
      x={cfg.x}
      y={cfg.y}
      width={cfg.width}
      height={cfg.height}
      shadowColor="rgba(0,0,0,0.4)"
      shadowBlur={12}
      shadowOpacity={0.6}
      shadowOffsetY={4}
    />
  );
}

function AcademyLogo({ academy, x, y, size, accentColor }) {
  const [img, status] = useImage(academy?.logo_url || '', 'anonymous');

  if (academy?.logo_url && status === 'loaded' && img) {
    return (
      <Image
        image={img}
        x={x}
        y={y}
        width={size}
        height={size}
        cornerRadius={8}
      />
    );
  }

  return (
    <>
      <Rect
        x={x} y={y} width={size} height={size}
        fill={`${accentColor}1A`}
        stroke={`${accentColor}4D`}
        strokeWidth={1.5}
        cornerRadius={8}
      />
      <Text
        text="F"
        x={x} y={y + Math.round(size * 0.12)}
        width={size} align="center"
        fontSize={Math.round(size * 0.58)}
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fill={accentColor}
        opacity={0.65}
      />
    </>
  );
}

function Decorations({ decorations }) {
  if (!decorations?.length) return null;
  return decorations.map((d, i) => {
    if (d.type === 'rect') {
      return (
        <Rect
          key={i}
          x={d.x} y={d.y}
          width={d.width} height={d.height}
          fill={d.fill}
          rotation={d.rotation || 0}
        />
      );
    }
    if (d.type === 'circle') {
      return <Circle key={i} x={d.x} y={d.y} radius={d.radius} fill={d.fill} />;
    }
    if (d.type === 'line') {
      return (
        <Line
          key={i}
          points={d.points}
          stroke={d.stroke}
          strokeWidth={d.strokeWidth || 1}
        />
      );
    }
    return null;
  });
}

function StatsRow({ cfg, stats }) {
  const keys = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
  const cols = cfg.cols || 6;
  const colW = (400 - cfg.paddingX * 2) / cols;

  return keys.map((key, i) => {
    const cx = cfg.paddingX + colW * i + colW / 2;
    return [
      <Text
        key={`val-${key}`}
        text={String(stats[key] || 0)}
        x={cx - 22} y={cfg.y}
        width={44} align="center"
        fontSize={cfg.valueFontSize}
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fontStyle="bold"
        fill={cfg.valueColor}
      />,
      <Text
        key={`lbl-${key}`}
        text={STAT_SHORT[key]}
        x={cx - 22} y={cfg.y + cfg.rowHeight}
        width={44} align="center"
        fontSize={cfg.labelFontSize}
        fontFamily="Arial"
        fill={cfg.labelColor}
      />,
    ];
  });
}

const CardCanvas = forwardRef(function CardCanvas(
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
  const photoSrc = player?.photo_bg_removed_url || player?.photo_url || null;
  const accentColor = cfg.border?.color || '#FFD700';
  const W = cfg.width;
  const H = cfg.height;

  // Derived positions
  const ph = cfg.playerPhoto;
  const jerseyX = ph.x + ph.width - 42;
  const jerseyY = ph.y + ph.height - 28;
  const logoX = W - 14 - 66;
  const logoY = 14;
  const nameBarY = cfg.playerName.y - 8;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage
        ref={stageRef}
        width={W}
        height={H}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: `0 0 48px ${cfg.border?.glowColor || 'rgba(255,215,0,0.3)'}`,
        }}
      >
        <Layer>
          {/* Background gradient */}
          <BgGradient width={W} height={H} colors={cfg.background.colors} />

          {/* Template decorations (behind player) */}
          <Decorations decorations={cfg.decorations} />

          {/* Border glow */}
          <Rect
            x={0} y={0} width={W} height={H}
            stroke={cfg.border.color}
            strokeWidth={cfg.border.width}
            shadowColor={cfg.border.glowColor}
            shadowBlur={cfg.border.glowBlur}
            cornerRadius={16}
          />

          {/* Top watermark */}
          <Text
            text="FDL CARD"
            x={0} y={5} width={W} align="center"
            fontSize={8} fontFamily="Arial"
            fill="rgba(255,255,255,0.10)"
            letterSpacing={4}
          />

          {/* OVR number */}
          <Text
            text={String(overall)}
            x={cfg.overall.x} y={cfg.overall.y}
            fontSize={cfg.overall.fontSize}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={cfg.overall.fill}
            shadowColor={cfg.overall.fill}
            shadowBlur={16}
            shadowOpacity={0.45}
          />
          {/* OVR label */}
          <Text
            text="OVR"
            x={cfg.overall.x}
            y={cfg.overall.y + cfg.overall.fontSize - 10}
            fontSize={10}
            fontFamily="Arial"
            fill={`${accentColor}80`}
            letterSpacing={2}
          />

          {/* Position */}
          <Text
            text={player?.position || 'ST'}
            x={cfg.position.x} y={cfg.position.y}
            fontSize={cfg.position.fontSize}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fill={cfg.position.fill}
            letterSpacing={2}
          />

          {/* Top band divider */}
          <Line
            points={[0, 100, W, 100]}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />

          {/* Academy logo (top-right) */}
          <AcademyLogo
            academy={academy}
            x={logoX} y={logoY}
            size={66}
            accentColor={accentColor}
          />

          {/* Player photo or placeholder */}
          <PlayerPhoto src={photoSrc} cfg={ph} />

          {/* Jersey number badge */}
          <Rect
            x={jerseyX} y={jerseyY}
            width={40} height={22}
            fill={`${accentColor}CC`}
            cornerRadius={4}
          />
          <Text
            text={`#${player?.jersey_number || '0'}`}
            x={jerseyX} y={jerseyY + 4}
            width={40} align="center"
            fontSize={12}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill="#000000"
          />

          {/* Name bar background */}
          <Rect
            x={0} y={nameBarY}
            width={W} height={46}
            fill="rgba(0,0,0,0.62)"
          />

          {/* Player name */}
          <Text
            text={(player?.name || 'PLAYER').toUpperCase()}
            x={cfg.playerName.x - (cfg.playerName.width || 340) / 2}
            y={cfg.playerName.y}
            width={cfg.playerName.width || 340}
            align="center"
            fontSize={cfg.playerName.fontSize}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fill={cfg.playerName.fill}
            letterSpacing={2}
          />

          {/* Team color accent bar */}
          <Rect
            x={0} y={cfg.teamColorBar.y}
            width={W} height={cfg.teamColorBar.height}
            fill={teamColor || accentColor}
            opacity={0.9}
          />

          {/* Stats */}
          <StatsRow cfg={cfg.stats} stats={stats} />

          {/* Stat column separators */}
          {[1, 2, 3, 4, 5].map((i) => {
            const cW = (W - cfg.stats.paddingX * 2) / (cfg.stats.cols || 6);
            const sx = cfg.stats.paddingX + cW * i;
            return (
              <Line
                key={i}
                points={[sx, cfg.stats.y - 6, sx, cfg.stats.y + cfg.stats.rowHeight + cfg.stats.labelFontSize + 4]}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
});

export default CardCanvas;
