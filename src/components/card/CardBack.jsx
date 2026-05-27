import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Group } from 'react-konva';
import { calcOverall } from '../../lib/utils';

const GREEN   = '#3DFF7A';
const DARK    = '#0C1A0E';
const WHITE   = '#FFFFFF';
const BLACK   = '#111111';
const GRAY    = '#888888';
const DARK_BG = '#111A11';

/* ─── 포지션별 훈련 팁 ─── */
const TIPS = {
  GK:  '반응속도와 발 기술을 함께 훈련하면 현대적인 골키퍼로 성장할 수 있어요.',
  CB:  '달리기와 점프 운동으로 체력의 기초를 키워보세요.',
  LB:  '사이드 라인 질주와 크로스 정확도를 함께 키워보세요.',
  RB:  '사이드 라인 질주와 크로스 정확도를 함께 키워보세요.',
  CDM: '볼 탈취 훈련과 간단한 패스 연습으로 팀의 방패가 되어보세요.',
  CM:  '시야를 넓히는 패스 훈련과 체력 훈련을 병행해 보세요.',
  CAM: '드리블과 슈팅 정확도를 높이는 개인 훈련을 꾸준히 하세요.',
  LW:  '스피드와 1:1 드리블 훈련으로 측면 돌파 능력을 키워보세요.',
  RW:  '스피드와 1:1 드리블 훈련으로 측면 돌파 능력을 키워보세요.',
  CF:  '결정력을 높이는 슈팅 반복 훈련을 매일 실천해 보세요.',
  ST:  '골 결정력과 헤딩 훈련으로 최전방 공격수로 성장해 보세요.',
};

const POS_FULL = {
  GK: 'GOAL KEEPER', CB: 'CENTER BACK', LB: 'LEFT BACK', RB: 'RIGHT BACK',
  CDM: 'DEFENSIVE MID', CM: 'CENTER MID', CAM: 'ATTACKING MID',
  LW: 'LEFT WINGER', RW: 'RIGHT WINGER', CF: 'CENTER FORWARD', ST: 'STRIKER',
};

/* ─── 포지션 마커 좌표 (필드 내 비율 x, y) ─── */
const POS_XY = {
  GK:  [0.10, 0.50], CB: [0.24, 0.50], LB: [0.20, 0.22], RB: [0.20, 0.78],
  CDM: [0.40, 0.50], CM: [0.50, 0.50], CAM: [0.62, 0.50],
  LW:  [0.70, 0.18], RW: [0.70, 0.82], CF: [0.80, 0.50], ST: [0.88, 0.50],
};

/* ─── 축구장 다이어그램 ─── */
function SoccerField({ x, y, fw, fh, position }) {
  const lc = GREEN;   // 라인 색
  const sw = 1.2;     // stroke width

  const cx = fw / 2;
  const cy = fh / 2;
  const pr = 5;       // 페널티 박스 두께
  const pb_w = fw * 0.17;   // 페널티 박스 너비
  const pb_h = fh * 0.55;   // 페널티 박스 높이
  const gb_w = fw * 0.06;   // 골 박스 너비
  const gb_h = fh * 0.28;   // 골 박스 높이
  const cr   = fh * 0.12;   // 센터 서클 반경

  const [px, py] = POS_XY[position] || POS_XY.CM;
  const markerX  = fw * px;
  const markerY  = fh * py;

  return (
    <Group x={x} y={y}>
      {/* 필드 배경 */}
      <Rect width={fw} height={fh} fill='#0D240D' cornerRadius={4} />

      {/* 외곽 라인 */}
      <Rect x={0} y={0} width={fw} height={fh} stroke={lc} strokeWidth={sw} cornerRadius={4} />

      {/* 센터 라인 */}
      <Line points={[cx, 0, cx, fh]} stroke={lc} strokeWidth={sw} />

      {/* 센터 서클 */}
      <Circle x={cx} y={cy} radius={cr} stroke={lc} strokeWidth={sw} />
      <Circle x={cx} y={cy} radius={2.5} fill={lc} />

      {/* 왼쪽 페널티 박스 */}
      <Rect x={0} y={(fh - pb_h) / 2} width={pb_w} height={pb_h} stroke={lc} strokeWidth={sw} />
      {/* 왼쪽 골 박스 */}
      <Rect x={0} y={(fh - gb_h) / 2} width={gb_w} height={gb_h} stroke={lc} strokeWidth={sw} />

      {/* 오른쪽 페널티 박스 */}
      <Rect x={fw - pb_w} y={(fh - pb_h) / 2} width={pb_w} height={pb_h} stroke={lc} strokeWidth={sw} />
      {/* 오른쪽 골 박스 */}
      <Rect x={fw - gb_w} y={(fh - gb_h) / 2} width={gb_w} height={gb_h} stroke={lc} strokeWidth={sw} />

      {/* 코너 아크 (왼쪽 위/아래, 오른쪽 위/아래) */}
      {[
        { x: 0,  y: 0,  r: 8, a1: 0,   a2: 90  },
        { x: 0,  y: fh, r: 8, a1: 270, a2: 360 },
        { x: fw, y: 0,  r: 8, a1: 90,  a2: 180 },
        { x: fw, y: fh, r: 8, a1: 180, a2: 270 },
      ].map((c, i) => (
        <Circle key={i} x={c.x} y={c.y} radius={c.r}
          stroke={lc} strokeWidth={sw} />
      ))}

      {/* 포지션 마커 */}
      <Circle x={markerX} y={markerY} radius={7} fill='rgba(61,255,122,0.25)' stroke={GREEN} strokeWidth={1.5} />
      <Circle x={markerX} y={markerY} radius={3} fill={GREEN} />
    </Group>
  );
}

/* ══════════════════════════════════════
   FDL 카드 뒷면
══════════════════════════════════════ */
function FDLCardBack({ player, stats, W, H }) {
  const ovr = calcOverall(stats);

  /* 제일 낮은 2개 스탯 → 각각 +2 목표 */
  const statList = [
    { key: 'pac', label: 'PAC',   val: stats.pac },
    { key: 'dri', label: 'DRI',   val: stats.dri },
    { key: 'phy', label: 'PHY',   val: stats.phy },
    { key: 'acc', label: 'ACC',   val: stats.acc },
    { key: 'tac', label: 'TACT',  val: stats.tac },
    { key: 'psy', label: 'PSYCH', val: stats.psy },
  ].sort((a, b) => a.val - b.val);
  const [weak1, weak2] = statList;
  const nextOvr = calcOverall({
    ...stats,
    [weak1.key]: Math.min(weak1.val + 2, 99),
    [weak2.key]: Math.min(weak2.val + 2, 99),
  });
  const ovrDiff = nextOvr - ovr;

  const pos      = player?.position || 'ST';
  const posFull  = POS_FULL[pos] || pos;
  const tip      = TIPS[pos] || TIPS.CM;
  const cardId   = (player?.id || '0000000000').slice(-10).toUpperCase();
  const date     = new Date().toISOString().slice(0, 10).replace(/-/g, '.');

  const STAT_DEFS = [
    { key: 'pac', label: 'PAC', desc: '스피드, 순발력',   val: stats.pac },
    { key: 'dri', label: 'DRI', desc: '드리블 능력',      val: stats.dri },
    { key: 'phy', label: 'PHY', desc: '점프력, 지구력',   val: stats.phy },
    { key: 'acc', label: 'ACC', desc: '정확도, 결정력',   val: stats.acc },
    { key: 'tac', label: 'TACT', desc: '전술 능력',       val: stats.tac },
    { key: 'psy', label: 'PSYCH', desc: '멘탈 능력',      val: stats.psy },
  ];

  /* 레이아웃 */
  const HDR_H    = 56;   // NEXT GOAL 헤더
  const SROW_H   = 52;   // 스탯 숫자 행
  const DESC_H   = 82;   // 스탯 설명 행
  const TP_HDR_H = 30;   // TRAINING POINT 헤더
  const FIELD_H  = 148;  // 축구장
  const POS_H    = 28;   // 포지션 텍스트
  const TIP_HDR_H= 30;   // TIP 헤더
  const TIP_H    = 62;   // 팁 텍스트
  const BTM_H    = H - HDR_H - SROW_H - DESC_H - TP_HDR_H - FIELD_H - POS_H - TIP_HDR_H - TIP_H;

  let y = 0;
  const Y = {
    hdr:    y,
    srow:   (y += HDR_H),
    desc:   (y += SROW_H),
    tpHdr:  (y += DESC_H),
    field:  (y += TP_HDR_H),
    posLbl: (y += FIELD_H),
    tipHdr: (y += POS_H),
    tip:    (y += TIP_HDR_H),
    btm:    (y += TIP_H),
  };

  const FIELD_W  = 274;
  const FIELD_X  = (W - FIELD_W) / 2;
  const COL_W    = Math.floor(W / 6);

  return (
    <>
      {/* 전체 배경 */}
      <Rect x={0} y={0} width={W} height={H} fill={DARK_BG} cornerRadius={18} />

      {/* ── NEXT GOAL 헤더 ── */}
      <Rect x={0} y={Y.hdr} width={W} height={HDR_H} fill={GREEN} cornerRadius={[18, 18, 0, 0]} />
      <Text x={14} y={Y.hdr + 7}  text='🏆  NEXT GOAL'       fontSize={11} fontFamily='Arial' fontStyle='bold' fill={DARK} />
      <Text x={14} y={Y.hdr + 22} text={`${weak1.label}  ${weak1.val} → ${Math.min(weak1.val + 2, 99)}   ·   ${weak2.label}  ${weak2.val} → ${Math.min(weak2.val + 2, 99)}`} fontSize={9.5} fontFamily='Arial' fontStyle='bold' fill={DARK} />
      <Text x={0} y={Y.hdr + 4}   width={W - 14} text={String(nextOvr)} fontSize={40} fontFamily='Arial' fontStyle='bold' fill={DARK} align='right' />
      {ovrDiff > 0 && (
        <Text x={0} y={Y.hdr + 42} width={W - 14} text={`▲ ${ovrDiff}`} fontSize={11} fontFamily='Arial' fontStyle='bold' fill='rgba(0,0,0,0.50)' align='right' />
      )}

      {/* ── 스탯 숫자 행 ── */}
      <Rect x={0} y={Y.srow} width={W} height={SROW_H} fill='#F4F4F4' />
      {STAT_DEFS.map((s, i) => (
        <Group key={s.key} x={i * COL_W} y={Y.srow}>
          <Text x={0} y={6} width={COL_W} text={s.label} fontSize={7.5} fontFamily='Arial' fontStyle='bold' fill={GRAY} align='center' letterSpacing={0.3} />
          <Text x={0} y={16} width={COL_W} text={String(s.val)} fontSize={22} fontFamily='Arial' fontStyle='bold' fill={BLACK} align='center' />
          {/* 구분선 */}
          {i < 5 && <Line points={[COL_W - 0.5, 8, COL_W - 0.5, SROW_H - 8]} stroke='#DDDDDD' strokeWidth={0.8} />}
        </Group>
      ))}

      {/* ── 스탯 설명 행 ── */}
      <Rect x={0} y={Y.desc} width={W} height={DESC_H} fill='#F9F9F9' />
      {STAT_DEFS.map((s, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <Group key={s.key + '_d'} x={col * (W / 3)} y={Y.desc + row * 38 + 10}>
            <Text x={8} y={0} text={`• ${s.label}`} fontSize={9} fontFamily='Arial' fontStyle='bold' fill={GREEN} />
            <Text x={8} y={12} text={s.desc} fontSize={9} fontFamily='Arial' fill='#555555' />
          </Group>
        );
      })}
      <Rect x={0} y={Y.desc + DESC_H - 0.8} width={W} height={0.8} fill='#E0E0E0' />

      {/* ── TRAINING POINT 헤더 ── */}
      <Rect x={0} y={Y.tpHdr} width={W} height={TP_HDR_H} fill={DARK} />
      <Text x={14} y={Y.tpHdr + 8} text='🏆  TRAINING POINT' fontSize={11} fontFamily='Arial' fontStyle='bold' fill={GREEN} />

      {/* ── 축구장 ── */}
      <Rect x={0} y={Y.field} width={W} height={FIELD_H} fill='#0A1A0A' />
      <SoccerField x={FIELD_X} y={Y.field + (FIELD_H - 120) / 2} fw={FIELD_W} fh={120} position={pos} />

      {/* ── 포지션 텍스트 ── */}
      <Rect x={0} y={Y.posLbl} width={W} height={POS_H} fill='#0A1A0A' />
      <Text x={0} y={Y.posLbl + 6} width={W} text={posFull} fontSize={14} fontFamily='Arial' fontStyle='bold' fill={GREEN} align='center' letterSpacing={1.5} />

      {/* ── TIP 헤더 ── */}
      <Rect x={0} y={Y.tipHdr} width={W} height={TIP_HDR_H} fill={DARK} />
      <Text x={14} y={Y.tipHdr + 8} text='📍  TIP' fontSize={11} fontFamily='Arial' fontStyle='bold' fill={GREEN} />

      {/* ── 팁 텍스트 ── */}
      <Rect x={0} y={Y.tip} width={W} height={TIP_H} fill='#0F1F0F' />
      <Text x={18} y={Y.tip + 14} width={W - 36} text={tip} fontSize={12} fontFamily='Arial'
        fill='#CCCCCC' lineHeight={1.6} wrap='word' />

      {/* ── 하단 NO / DATE ── */}
      <Rect x={0} y={Y.btm} width={W} height={BTM_H} fill={DARK_BG} />
      <Rect x={16} y={Y.btm + 6} width={W - 32} height={0.8} fill={`${GREEN}55`} />
      <Text x={18} y={Y.btm + 14} text={`NO.  ${cardId}`} fontSize={9} fontFamily='Arial' fill={GRAY} letterSpacing={1} />
      <Text x={0}  y={Y.btm + 14} width={W - 18} text={`DATE  ${date}`} fontSize={9} fontFamily='Arial' fill={GRAY} letterSpacing={1} align='right' />

      {/* FDL 로고 (뒷면 하단) */}
      <Text x={0} y={Y.btm + 30} width={W} text='FDL' fontSize={22} fontFamily='Arial' fontStyle='bold' fill={WHITE} align='center' />
      <Text x={0} y={Y.btm + 54} width={W} text='FOOTBALL DATA LAB' fontSize={9} fontFamily='Arial' fill={GRAY} align='center' letterSpacing={1.5} />

      {/* 외곽 테두리 */}
      <Rect x={0} y={0} width={W} height={H} stroke={GREEN} strokeWidth={2.5} cornerRadius={18} listening={false} />
    </>
  );
}

const CardBack = forwardRef(function CardBack(
  { template, player, stats, academy, scale = 1 },
  ref,
) {
  const stageRef = useRef(null);
  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));

  if (!template?.config) return null;

  const W = template.config.width  || 400;
  const H = template.config.height || 560;

  return (
    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', display: 'inline-block' }}>
      <Stage ref={stageRef} width={W} height={H}
        style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 22px 60px rgba(0,0,0,0.65)' }}>
        <Layer>
          <FDLCardBack player={player} stats={stats || {pac:75,dri:70,phy:70,acc:75,tac:70,psy:70}} W={W} H={H} />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardBack;
