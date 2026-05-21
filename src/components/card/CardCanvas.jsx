import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Text, Image, Line } from 'react-konva';
import useImage from 'use-image';
import { calcOverall } from '../../lib/utils';

const STAT_SHORT = { pac: 'PAC', dri: 'DRI', phy: 'PHY', acc: 'ACC', tac: 'TAC', psy: 'PSY' };

function GradientRect({ x, y, width, height, colors }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current.getLayer()?.canvas._canvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grad = ctx.createLinearGradient(x, y, x, y + height);
    colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
    ref.current.fill(grad);
    ref.current.getLayer()?.batchDraw();
  }, [x, y, width, height, colors]);

  return <Rect ref={ref} x={x} y={y} width={width} height={height} fillLinearGradientStartPoint={{ x: 0, y: 0 }} fillLinearGradientEndPoint={{ x: 0, y: height }} fillLinearGradientColorStops={colors.flatMap((c, i) => [i / (colors.length - 1), c])} />;
}

function PlayerImage({ src, cfg }) {
  const [img] = useImage(src, 'anonymous');
  if (!img) return null;
  return (
    <Image
      image={img}
      x={cfg.x}
      y={cfg.y}
      width={cfg.width}
      height={cfg.height}
      shadowColor={cfg.shadowColor || 'transparent'}
      shadowBlur={cfg.shadowBlur || 0}
      shadowOpacity={0.6}
    />
  );
}

function StatsRow({ cfg, stats, teamColor }) {
  const keys = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
  const cols = cfg.cols || 6;
  const colW = (400 - cfg.paddingX * 2) / cols;

  return keys.map((key, i) => {
    const x = cfg.paddingX + colW * i + colW / 2;
    return [
      <Text
        key={`val-${key}`}
        text={String(stats[key] || 0)}
        x={x - 20}
        y={cfg.y}
        width={40}
        align="center"
        fontSize={cfg.valueFontSize}
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fill={cfg.valueColor}
        fontStyle="bold"
      />,
      <Text
        key={`lbl-${key}`}
        text={STAT_SHORT[key]}
        x={x - 20}
        y={cfg.y + cfg.rowHeight}
        width={40}
        align="center"
        fontSize={cfg.labelFontSize}
        fontFamily="Arial"
        fill={cfg.labelColor}
      />,
    ];
  });
}

const CardCanvas = forwardRef(function CardCanvas({ template, player, stats, teamColor, scale = 1 }, ref) {
  const stageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));

  if (!template?.config) return null;
  const cfg = template.config;
  const overall = calcOverall(stats);
  const photoSrc = player?.photo_bg_removed_url || player?.photo_url;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage
        ref={stageRef}
        width={cfg.width}
        height={cfg.height}
        style={{ borderRadius: 16, overflow: 'hidden', boxShadow: `0 0 40px ${cfg.border?.glowColor || 'rgba(255,215,0,0.3)'}` }}
      >
        <Layer>
          {/* Background */}
          <GradientRect x={0} y={0} width={cfg.width} height={cfg.height} colors={cfg.background.colors} />

          {/* Border glow */}
          <Rect
            x={0} y={0}
            width={cfg.width} height={cfg.height}
            stroke={cfg.border.color}
            strokeWidth={cfg.border.width}
            shadowColor={cfg.border.glowColor}
            shadowBlur={cfg.border.glowBlur}
            cornerRadius={16}
          />

          {/* Player photo */}
          {photoSrc && <PlayerImage src={photoSrc} cfg={cfg.playerPhoto} />}

          {/* Overall */}
          <Text
            text={String(overall)}
            x={cfg.overall.x}
            y={cfg.overall.y}
            fontSize={cfg.overall.fontSize}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={cfg.overall.fill}
            shadowColor={cfg.overall.fill}
            shadowBlur={12}
            shadowOpacity={0.5}
          />

          {/* Position */}
          <Text
            text={player?.position || 'ST'}
            x={cfg.position.x}
            y={cfg.position.y}
            fontSize={cfg.position.fontSize}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fill={cfg.position.fill}
            letterSpacing={1}
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

          {/* Team color bar */}
          <Rect
            x={0}
            y={cfg.teamColorBar.y}
            width={cfg.width}
            height={cfg.teamColorBar.height}
            fill={teamColor || '#FFD700'}
            opacity={0.8}
          />

          {/* Stats */}
          <StatsRow cfg={cfg.stats} stats={stats} teamColor={teamColor} />

          {/* Separator lines between stats */}
          {[1, 2, 3, 4, 5].map((i) => {
            const colW = (cfg.width - cfg.stats.paddingX * 2) / (cfg.stats.cols || 6);
            const x = cfg.stats.paddingX + colW * i;
            return (
              <Line
                key={i}
                points={[x, cfg.stats.y, x, cfg.stats.y + cfg.stats.rowHeight * 2 + 4]}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth={1}
              />
            );
          })}

          {/* Watermark */}
          <Text
            text="FDL CARD"
            x={cfg.watermark.x - 60}
            y={cfg.watermark.y}
            width={120}
            align="center"
            fontSize={cfg.watermark.fontSize}
            fontFamily="Arial"
            fill={cfg.watermark.fill}
            letterSpacing={3}
          />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardCanvas;
