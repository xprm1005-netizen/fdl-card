import { useRef, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Rect, Text, Image, Line, Circle, Group } from 'react-konva';
import useImage from 'use-image';
import { calcOverall } from '../../lib/utils';

const PLACEHOLDER_URL = '/player-placeholder.svg';
const FDL_LOGO_URL = '/brand/fdl-logo.png';
const BLACK = '#070807';
const WHITE = '#F8FAF4';

const VARIANTS = {
  gold: {
    title: ['THE', 'SPEED', 'STAR'],
    accent: '#62FF7E',
    panel: '#62FF7E',
    paper: '#F1F3ED',
    photoA: '#EBEEE8',
    photoB: '#C7CCC6',
    photoC: '#F2F4EF',
    marker: '#203E2A',
    label: '#31402D',
    glow: 'rgba(98,255,126,0.16)',
  },
  chrome: {
    title: ['THE', 'PLAY', 'MAKER'],
    accent: '#DCE7EF',
    panel: '#DCE7EF',
    paper: '#F4F7F8',
    photoA: '#EEF3F4',
    photoB: '#B8C4CA',
    photoC: '#F6FAFB',
    marker: '#26343A',
    label: '#334048',
    glow: 'rgba(220,231,239,0.16)',
  },
  legend: {
    title: ['THE', 'TEAM', 'LEADER'],
    accent: '#C77DFF',
    panel: '#C77DFF',
    paper: '#F5EFFA',
    photoA: '#F3EAF9',
    photoB: '#CDB7DD',
    photoC: '#FAF6FD',
    marker: '#35213E',
    label: '#43294D',
    glow: 'rgba(199,125,255,0.2)',
  },
  rising: {
    title: ['RISING', 'PRO', 'CARD'],
    accent: '#BFFF35',
    panel: '#BFFF35',
    paper: '#F3F8E7',
    photoA: '#F4F8EA',
    photoB: '#D2E2A8',
    photoC: '#FAFDF2',
    marker: '#334410',
    label: '#34420F',
    glow: 'rgba(191,255,53,0.28)',
  },
  matchday: {
    title: ['MATCH', 'DAY', 'HERO'],
    accent: '#31E6C5',
    panel: '#31E6C5',
    paper: '#EAF8F5',
    photoA: '#ECF8F5',
    photoB: '#9FD8CD',
    photoC: '#F6FFFC',
    marker: '#0E4138',
    label: '#0C443A',
    glow: 'rgba(49,230,197,0.24)',
  },
};

function getVariant(slug) {
  return VARIANTS[slug] || VARIANTS.gold;
}

function PlayerPhoto({ src, x, y, width, height }) {
  const [img] = useImage(src || PLACEHOLDER_URL, 'anonymous');
  if (!img) {
    return (
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#D7DBD2"
      />
    );
  }

  const ratio = img.width / img.height;
  const boxRatio = width / height;
  const drawW = ratio > boxRatio ? width : height * ratio;
  const drawH = ratio > boxRatio ? width / ratio : height;

  return (
    <Image
      image={img}
      x={x + (width - drawW) / 2}
      y={y + height - drawH}
      width={drawW}
      height={drawH}
      shadowColor="rgba(0,0,0,0.24)"
      shadowBlur={10}
      shadowOpacity={0.45}
      shadowOffsetY={5}
    />
  );
}

function AcademyMark({ academy, x, y, size }) {
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
    <Group x={x} y={y}>
      <Rect width={size} height={size} fill={WHITE} cornerRadius={8} />
      <Circle x={size * 0.5} y={size * 0.34} radius={size * 0.22} fill="#2B65C9" opacity={0.9} />
      <Circle x={size * 0.34} y={size * 0.52} radius={size * 0.16} fill="#53B47A" opacity={0.95} />
      <Circle x={size * 0.64} y={size * 0.58} radius={size * 0.12} fill="#79D0FF" opacity={0.95} />
      <Text
        text="FOOTBALL"
        x={2}
        y={size - 22}
        width={size - 4}
        align="center"
        fontSize={7}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#295A7C"
      />
      <Text
        text="DATALAB"
        x={2}
        y={size - 13}
        width={size - 4}
        align="center"
        fontSize={7}
        fontFamily="Arial"
        fontStyle="bold"
        fill="#2D2F32"
      />
    </Group>
  );
}

function FdlLogo({ x, y, width, height }) {
  const [img] = useImage(FDL_LOGO_URL, 'anonymous');
  if (!img) {
    return (
      <Text text="FDL" x={x} y={y} width={width} align="center" fontSize={24} fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing={4} fill={BLACK} />
    );
  }

  return (
    <Image
      image={img}
      x={x}
      y={y}
      width={width}
      height={height}
      crop={{ x: 300, y: 365, width: 680, height: 285 }}
    />
  );
}

function StatCell({ x, y, label, value, labelColor }) {
  return (
    <Group x={x} y={y}>
      <Text
        text={String(value ?? 0)}
        x={0}
        y={0}
        width={44}
        align="center"
        fontSize={25}
        fontFamily="'Bebas Neue', Impact, sans-serif"
        fontStyle="bold"
        fill={BLACK}
      />
      <Text
        text={label}
        x={0}
        y={27}
        width={44}
        align="center"
        fontSize={10}
        fontFamily="Arial"
        fontStyle="bold"
        fill={labelColor}
      />
    </Group>
  );
}

const CardCanvas = forwardRef(function CardCanvas(
  { template, player, stats, academy, scale = 1 },
  ref,
) {
  const stageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));

  if (!template?.config) return null;

  const cfg = template.config;
  const W = cfg.width;
  const H = cfg.height;
  const variant = getVariant(template.slug);
  const overall = calcOverall(stats);
  const photoSrc = player?.photo_bg_removed_url || player?.photo_url || null;
  const position = player?.position || 'CB';
  const playerName = player?.name || '손흥민';
  const academyName = academy?.name || 'ABCDE FG CLUB';

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage
        ref={stageRef}
        width={W}
        height={H}
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: `0 22px 60px rgba(0,0,0,0.65), 0 0 36px ${variant.glow}`,
        }}
      >
        <Layer>
          {/* outer black body */}
          <Rect x={0} y={0} width={W} height={H} fill={BLACK} cornerRadius={24} />
          <Rect x={11} y={11} width={W - 22} height={H - 22} fill={variant.paper} cornerRadius={12} />

          {/* subtle photo background */}
          <Rect
            x={11}
            y={72}
            width={W - 22}
            height={H - 168}
            fillLinearGradientStartPoint={{ x: 0, y: 72 }}
            fillLinearGradientEndPoint={{ x: W, y: H - 168 }}
            fillLinearGradientColorStops={[0, variant.photoA, 0.5, variant.photoB, 1, variant.photoC]}
          />
          <Line points={[40, 78, 212, 340]} stroke="rgba(255,255,255,0.45)" strokeWidth={20} />
          <Line points={[116, 78, 288, 340]} stroke="rgba(255,255,255,0.35)" strokeWidth={12} />
          <Line points={[260, 80, 120, 330]} stroke="rgba(0,0,0,0.05)" strokeWidth={28} />

          {/* top lime title band */}
          <Rect x={11} y={35} width={W - 22} height={96} fill={variant.accent} cornerRadius={[10, 10, 0, 0]} />
          <Text
            text={variant.title[0]}
            x={28}
            y={54}
            fontSize={24}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={BLACK}
          />
          <Text
            text={variant.title[1]}
            x={28}
            y={77}
            fontSize={24}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={BLACK}
          />
          <Text
            text={variant.title[2]}
            x={28}
            y={100}
            fontSize={24}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={BLACK}
          />
          <Text
            text={String(overall)}
            x={208}
            y={39}
            width={102}
            align="right"
            fontSize={74}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fontStyle="bold"
            fill={BLACK}
          />
          <Text
            text={position}
            x={317}
            y={81}
            width={50}
            fontSize={18}
            fontFamily="'Bebas Neue', Impact, sans-serif"
            fill={BLACK}
          />

          {/* player photo */}
          <PlayerPhoto src={photoSrc} x={42} y={108} width={288} height={270} />

          {/* lower white identity strip */}
          <Rect x={11} y={365} width={W - 22} height={78} fill={WHITE} />
          <AcademyMark academy={academy} x={32} y={376} size={64} />
          <Text
            text={academyName.toUpperCase()}
            x={113}
            y={380}
            fontSize={9}
            fontFamily="Arial"
            fontStyle="bold"
            fill="#4C4C4C"
          />
          <Text
            text={playerName}
            x={111}
            y={395}
            width={178}
            fontSize={24}
            fontFamily="'Pretendard Variable', 'Pretendard', Arial, sans-serif"
            fontStyle="900"
            fill={BLACK}
          />
          <Text
            text={playerName}
            x={235}
            y={414}
            width={80}
            fontSize={8}
            fontFamily="Arial"
            fill="#595959"
          />
          <Rect x={327} y={382} width={45} height={52} fill="#EEF1EA" cornerRadius={7} />
          <Text text="AGE" x={327} y={390} width={45} align="center" fontSize={9} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
          <Text text={String(player?.age || '10')} x={327} y={403} width={45} align="center" fontSize={24} fontFamily="'Bebas Neue', Impact, sans-serif" fontStyle="bold" fill={BLACK} />

          {/* stats panel */}
          <Rect x={11} y={443} width={W - 22} height={102} fill={variant.panel} cornerRadius={[0, 0, 12, 12]} />
          <Circle x={34} y={464} radius={11} fill={variant.marker} opacity={0.9} />
          <Text text="MY STATS" x={51} y={456} fontSize={9} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
          <Text text="150cm · 45kg · 9" x={51} y={468} fontSize={8} fontFamily="Arial" fill={variant.label} />
          <FdlLogo x={26} y={502} width={82} height={42} />

          <StatCell x={128} y={458} label="PAC" value={stats?.pac} labelColor={variant.label} />
          <StatCell x={183} y={458} label="DRI" value={stats?.dri} labelColor={variant.label} />
          <StatCell x={238} y={458} label="PHY" value={stats?.phy} labelColor={variant.label} />
          <StatCell x={128} y={507} label="ACC" value={stats?.acc} labelColor={variant.label} />
          <StatCell x={183} y={507} label="TACT" value={stats?.tac} labelColor={variant.label} />
          <StatCell x={238} y={507} label="PSYCH" value={stats?.psy} labelColor={variant.label} />

          <Text text="©FDL" x={0} y={535} width={W} align="center" fontSize={7} fontFamily="Arial" fill="#344432" />

          {/* glass and inner outline */}
          <Rect x={11} y={11} width={W - 22} height={H - 22} stroke="rgba(0,0,0,0.22)" strokeWidth={1} cornerRadius={12} />
          <Rect x={0} y={0} width={W} height={H} stroke="#1F221F" strokeWidth={12} cornerRadius={24} />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardCanvas;
