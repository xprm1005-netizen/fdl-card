import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Group, Image } from 'react-konva';
import useImage from 'use-image';
import { calcOverall } from '../../lib/utils';

const BLACK = '#070807';
const PANEL = '#0B100D';
const WHITE = '#F8FAF4';
const FDL_LOGO_URL = '/brand/fdl-logo.png';

const VARIANTS = {
  gold: { accent: '#62FF7E', panel: '#0B100D', tip: '스피드가 살아나는 첫 터치와 방향 전환을 키워보세요.' },
  chrome: { accent: '#DCE7EF', panel: '#0B1013', tip: '시야를 넓히고 패스 선택 속도를 높여보세요.' },
  legend: { accent: '#C77DFF', panel: '#120A16', tip: '팀을 움직이는 콜과 위치 선정 감각을 키워보세요.' },
  rising: { accent: '#BFFF35', panel: '#111407', tip: '다음 측정까지 가장 높은 성장폭을 노려보세요.' },
  matchday: { accent: '#31E6C5', panel: '#061310', tip: '경기 당일의 집중 루틴과 첫 플레이를 준비하세요.' },
};

function getVariant(slug) {
  return VARIANTS[slug] || VARIANTS.gold;
}

const STAT_ITEMS = [
  ['pac', 'PAC', '스피드, 순발력'],
  ['dri', 'DRI', '드리블 능력'],
  ['phy', 'PHY', '점프력, 지구력'],
  ['acc', 'ACC', '정확도, 결정력'],
  ['tac', 'TACT', '전술 이해도'],
  ['psy', 'PSYCH', '멘탈 능력'],
];

const STAT_FULL = Object.fromEntries(STAT_ITEMS.map(([key, short, desc]) => [key, { short, desc }]));

function getNextGoal(stats = {}) {
  const keys = ['pac', 'dri', 'phy', 'acc', 'tac', 'psy'];
  const key = keys.reduce((lowest, current) => {
    const lowestValue = Number(stats[lowest] ?? 0);
    const currentValue = Number(stats[current] ?? 0);
    return currentValue < lowestValue ? current : lowest;
  }, keys[0]);
  const current = Number(stats[key] ?? 0);
  return {
    key,
    current,
    target: Math.min(99, current + 2),
    ...STAT_FULL[key],
  };
}

function SmallStat({ x, y, label, value }) {
  return (
    <Group x={x} y={y}>
      <Text text={String(value ?? 0)} x={0} y={0} width={34} align="center" fontSize={21} fontFamily="'Bebas Neue', Impact, sans-serif" fontStyle="bold" fill={BLACK} />
      <Text text={label} x={36} y={5} width={36} fontSize={10} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
    </Group>
  );
}

function Bullet({ x, y, text }) {
  return (
    <Group x={x} y={y}>
      <Circle x={4} y={5} radius={2} fill={BLACK} />
      <Text text={text} x={12} y={0} width={138} fontSize={7.5} fontFamily="Arial" fill={BLACK} />
    </Group>
  );
}

function FdlLogo({ x, y, width, height }) {
  const [img] = useImage(FDL_LOGO_URL, 'anonymous');
  if (!img) {
    return <Text text="FDL" x={x} y={y} width={width} align="center" fontSize={24} fontFamily="'Bebas Neue', Impact, sans-serif" letterSpacing={4} fill={BLACK} />;
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

function Pitch({ x, y, w, h, accent }) {
  return (
    <Group x={x} y={y}>
      <Rect width={w} height={h} stroke={accent} strokeWidth={3} opacity={0.82} />
      <Line points={[w / 2, 0, w / 2, h]} stroke={accent} strokeWidth={2} opacity={0.7} />
      <Circle x={w / 2} y={h / 2} radius={24} stroke={accent} strokeWidth={2} opacity={0.7} />
      <Line points={[0, h * 0.18, 42, h * 0.18, 42, h * 0.82, 0, h * 0.82]} stroke={accent} strokeWidth={2} opacity={0.75} />
      <Line points={[w, h * 0.18, w - 42, h * 0.18, w - 42, h * 0.82, w, h * 0.82]} stroke={accent} strokeWidth={2} opacity={0.75} />
      <Line points={[0, h * 0.35, 20, h * 0.35, 20, h * 0.65, 0, h * 0.65]} stroke={accent} strokeWidth={2} opacity={0.7} />
      <Line points={[w, h * 0.35, w - 20, h * 0.35, w - 20, h * 0.65, w, h * 0.65]} stroke={accent} strokeWidth={2} opacity={0.7} />
      <Circle x={w * 0.24} y={h * 0.52} radius={17} fill={accent} opacity={0.18} />
      <Circle x={w * 0.76} y={h * 0.48} radius={17} fill={accent} opacity={0.18} />
    </Group>
  );
}

const CardBack = forwardRef(function CardBack(
  { template, player, stats, scale = 1 },
  ref,
) {
  const stageRef = useRef(null);

  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));

  if (!template?.config) return null;

  const W = template.config.width;
  const H = template.config.height;
  const variant = getVariant(template.slug);
  const nextGoal = getNextGoal(stats);
  const nextOverall = Math.min(99, calcOverall(stats) + 2);
  const cardId = player?.id?.slice(-10)?.toUpperCase() || '1234567890';
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '.');

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage
        ref={stageRef}
        width={W}
        height={H}
        style={{
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow: '0 22px 60px rgba(0,0,0,0.65), 0 0 36px rgba(191,255,53,0.16)',
        }}
      >
        <Layer>
          <Rect x={0} y={0} width={W} height={H} fill={BLACK} cornerRadius={24} />
          <Rect x={11} y={11} width={W - 22} height={H - 22} fill={variant.panel || PANEL} cornerRadius={12} />

          {/* next goal white board */}
          <Rect x={19} y={35} width={W - 38} height={142} fill={WHITE} cornerRadius={10} />
          <Text text="NEXT GOAL" x={36} y={50} fontSize={12} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
          <Text text={`${nextGoal.short} ${nextGoal.current} → ${nextGoal.target}`} x={35} y={67} width={170} fontSize={14} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
          <Text text={nextGoal.desc} x={35} y={86} width={170} fontSize={9} fontFamily="Arial" fill={BLACK} opacity={0.62} />
          <Text text={String(nextOverall)} x={270} y={41} width={70} align="right" fontSize={48} fontFamily="'Bebas Neue', Impact, sans-serif" fontStyle="bold" fill={BLACK} />
          <Text text="▲2" x={342} y={60} fontSize={11} fontFamily="Arial" fontStyle="bold" fill={BLACK} />

          {STAT_ITEMS.map(([key, label], i) => (
            <SmallStat
              key={key}
              x={35 + (i % 6) * 57}
              y={96}
              label={label}
              value={stats?.[key]}
            />
          ))}

          <Line points={[35, 130, W - 35, 130]} stroke="rgba(0,0,0,0.14)" strokeWidth={1} />
          <Bullet x={40} y={137} text="PAC - 스피드, 순발력" />
          <Bullet x={205} y={137} text="DRI - 드리블 능력" />
          <Bullet x={40} y={151} text="PHY - 점프력, 지구력" />
          <Bullet x={205} y={151} text="ACC - 정확도, 결정력" />
          <Bullet x={40} y={165} text="TACT - 전술 이해도" />
          <Bullet x={205} y={165} text="PSYCH - 멘탈 능력" />

          {/* training point panel */}
          <Rect x={19} y={190} width={W - 38} height={230} fill="#030503" stroke={variant.accent} opacity={0.98} strokeWidth={2} cornerRadius={10} />
          <Text text="🏆 TRAINING POINT" x={35} y={210} fontSize={11} fontFamily="Arial" fontStyle="bold" fill={variant.accent} />
          <Pitch x={104} y={244} w={190} h={108} accent={variant.accent} />
          <Text text={`${(player?.position || 'CENTER - BACK').toUpperCase()}`} x={0} y={369} width={W} align="center" fontSize={22} fontFamily="'Bebas Neue', Impact, sans-serif" fontStyle="bold" fill={variant.accent} />

          {/* tip panel */}
          <Line points={[19, 420, W - 19, 420]} stroke={variant.accent} opacity={0.35} strokeWidth={2} />
          <Text text="📍 TIP" x={36} y={444} fontSize={11} fontFamily="Arial" fontStyle="bold" fill={variant.accent} />
          <Text
            text={variant.tip}
            x={80}
            y={475}
            width={240}
            align="center"
            fontSize={9}
            fontFamily="Arial"
            fontStyle="bold"
            fill={variant.accent}
            opacity={0.85}
          />

          {/* footer strip */}
          <Rect x={19} y={502} width={W - 38} height={22} fill={variant.accent} cornerRadius={3} />
          <Text text={`NO. ${cardId}`} x={30} y={508} width={150} fontSize={8} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
          <Text text={`DATE ${date}`} x={236} y={508} width={130} align="right" fontSize={8} fontFamily="Arial" fontStyle="bold" fill={BLACK} />
          <Rect x={139} y={530} width={122} height={28} fill={variant.accent} cornerRadius={3} />
          <FdlLogo x={148} y={526} width={104} height={36} />

          <Rect x={11} y={11} width={W - 22} height={H - 22} stroke="rgba(98,255,126,0.12)" strokeWidth={1} cornerRadius={12} />
          <Rect x={0} y={0} width={W} height={H} stroke="#1F221F" strokeWidth={12} cornerRadius={24} />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardBack;
