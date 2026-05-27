import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Stage, Layer, Rect, Text, Image, Group } from 'react-konva';
import useImage from 'use-image';
import { calcOverall } from '../../lib/utils';

/*
 * PNG overlay card system.
 *
 * Each template image (420×560) has sample data baked-in.
 * We cover each data zone with a matching solid rect, then render real data on top.
 *
 * Zones were measured by resampling each 1056×1408 template PNG at 420×560
 * and detecting text bounding boxes with PIL.
 */

/* ── photo zone (identical across all templates) ─────────────── */
const PZ = { x: 0, y: 95, w: 420, h: 245 };

/* ── per-template zone definitions ───────────────────────────── */
/*
 * All sizes use Konva prop names (width/height).
 * OVR.x=155 so the cover starts well left of the "8" glyph (≈x 201).
 * INFO/AGE y-starts are set ~10 px above each template's white panel.
 */
const ZONES = {
  fdl1: {
    green:  '#06f185',
    OVR:   { x: 155, y:  6, width: 261, height: 85 },
    INFO:  { x: 112, y: 373, width: 240, height: 80 },
    AGE:   { x: 350, y: 373, width:  66, height: 80 },
    S: [
      { k:'pac', x:165, y:453, width: 46, height:37 },
      { k:'dri', x:261, y:453, width: 46, height:37 },
      { k:'phy', x:355, y:453, width: 59, height:37 },
      { k:'acc', x:165, y:505, width: 46, height:37 },
      { k:'tac', x:261, y:505, width: 46, height:37 },
      { k:'psy', x:355, y:505, width: 59, height:37 },
    ],
  },
  fdl2: {
    green:  '#05f37c',
    OVR:   { x: 155, y:  6, width: 261, height: 85 },
    INFO:  { x: 112, y: 354, width: 244, height: 76 },
    AGE:   { x: 354, y: 354, width:  62, height: 76 },
    S: [
      { k:'pac', x:150, y:431, width: 52, height:40 },
      { k:'dri', x:254, y:431, width: 52, height:40 },
      { k:'phy', x:358, y:431, width: 56, height:40 },
      { k:'acc', x:150, y:485, width: 52, height:40 },
      { k:'tac', x:254, y:485, width: 52, height:40 },
      { k:'psy', x:358, y:485, width: 56, height:40 },
    ],
  },
  fdl3: {
    green:  '#08f086',
    OVR:   { x: 155, y:  6, width: 261, height: 85 },
    INFO:  { x: 112, y: 350, width: 244, height: 72 },
    AGE:   { x: 354, y: 350, width:  62, height: 72 },
    S: [
      { k:'pac', x:124, y:420, width: 50, height:44 },
      { k:'dri', x:232, y:420, width: 50, height:44 },
      { k:'phy', x:340, y:420, width: 74, height:44 },
      { k:'acc', x:124, y:472, width: 50, height:44 },
      { k:'tac', x:232, y:472, width: 50, height:44 },
      { k:'psy', x:340, y:472, width: 74, height:44 },
    ],
  },
  fdl4: {
    green:  '#08f383',
    OVR:   { x: 155, y:  6, width: 261, height: 85 },
    INFO:  { x: 172, y: 342, width: 184, height: 76 },
    AGE:   { x: 354, y: 342, width:  62, height: 76 },
    EXTRA: { x:   2, y: 416, width: 175, height: 122 },
    S: [
      { k:'pac', x:213, y:422, width: 48, height:44 },
      { k:'dri', x:291, y:422, width: 48, height:44 },
      { k:'phy', x:366, y:422, width: 48, height:44 },
      { k:'acc', x:213, y:474, width: 48, height:44 },
      { k:'tac', x:291, y:474, width: 48, height:44 },
      { k:'psy', x:366, y:474, width: 48, height:44 },
    ],
  },
};

/* ── TemplateCard ─────────────────────────────────────────────── */
function TemplateCard({ slug, player, stats, academy, W, H }) {
  const z   = ZONES[slug] || ZONES.fdl1;
  const ovr = calcOverall(stats);
  const pos  = player?.position  || 'ST';
  const name = player?.name      || '선수 이름';
  const age  = player?.age       ?? '--';
  const club = (academy?.name    || 'FDL FC').toUpperCase();
  const photoSrc = player?.photo_bg_removed_url || player?.photo_url || '';

  const [tpl]   = useImage(`/thumbnails/${slug}.png`, 'anonymous');
  const [photo] = useImage(photoSrc, 'anonymous');

  /* object-fit: cover for photo */
  const photoProps = (() => {
    if (!photo) return null;
    const pW = photo.width  || 400;
    const pH = photo.height || 400;
    const sc = Math.max(PZ.w / pW, PZ.h / pH);
    const sw = pW * sc, sh = pH * sc;
    return { x: PZ.x + (PZ.w - sw) / 2, y: PZ.y + (PZ.h - sh) / 2, width: sw, height: sh };
  })();

  return (
    <>
      {/* ① 검정 기본 배경 */}
      <Rect x={0} y={0} width={W} height={H} fill='#080808' cornerRadius={18} />

      {/* ② 선수 사진 (photo zone clip) */}
      {photoProps && (
        <Group clipX={PZ.x} clipY={PZ.y} clipWidth={PZ.w} clipHeight={PZ.h}>
          <Image image={photo} {...photoProps} />
        </Group>
      )}

      {/* ③ 템플릿 PNG 오버레이 */}
      {tpl  && <Image image={tpl} x={0} y={0} width={W} height={H} cornerRadius={18} />}
      {!tpl && <Rect  x={0} y={0} width={W} height={H} fill='rgba(0,0,0,0.55)' cornerRadius={18} />}

      {/* ④ 샘플 데이터 커버 + 실제 데이터 렌더링 ─────────────── */}

      {/* OVR 커버 */}
      <Rect {...z.OVR} fill={z.green} />
      <Text
        x={z.OVR.x} y={z.OVR.y - 2}
        width={z.OVR.width - 6} height={z.OVR.height}
        text={String(ovr)}
        fontSize={68} fontFamily='Arial Black, Arial' fontStyle='bold'
        fill='#0A0A0A' align='right' verticalAlign='middle'
      />
      <Text
        x={z.OVR.x} y={z.OVR.y + z.OVR.height - 22}
        width={z.OVR.width - 6} height={20}
        text={pos}
        fontSize={14} fontFamily='Arial Black, Arial' fontStyle='bold'
        fill='#0A0A0A' align='right'
      />

      {/* INFO 커버 (이름·소속) */}
      <Rect {...z.INFO} fill='#ffffff' />
      <Text
        x={z.INFO.x + 5} y={z.INFO.y + 5}
        width={z.INFO.width - 8}
        text={club}
        fontSize={10} fontFamily='Arial' fontStyle='bold'
        fill='#666666' letterSpacing={0.8}
      />
      <Text
        x={z.INFO.x + 4} y={z.INFO.y + 18}
        width={z.INFO.width - 6}
        text={name}
        fontSize={24} fontFamily='Arial Black, Arial' fontStyle='bold'
        fill='#0A0A0A'
      />

      {/* AGE 커버 */}
      <Rect {...z.AGE} fill='#ffffff' />
      <Text
        x={z.AGE.x} y={z.AGE.y + 5}
        width={z.AGE.width}
        text='AGE'
        fontSize={10} fontFamily='Arial' fontStyle='bold'
        fill='#888888' align='center' letterSpacing={1}
      />
      <Text
        x={z.AGE.x} y={z.AGE.y + 18}
        width={z.AGE.width}
        text={String(age)}
        fontSize={28} fontFamily='Arial Black, Arial' fontStyle='bold'
        fill='#0A0A0A' align='center'
      />

      {/* fdl4 전용: MY STATS 섹션 커버 */}
      {z.EXTRA && <Rect {...z.EXTRA} fill={z.green} />}

      {/* STATS 숫자 커버 + 실제 값 */}
      {z.S.map((s) => {
        const val = stats[s.k] ?? 0;
        return (
          <Group key={s.k}>
            <Rect x={s.x} y={s.y} width={s.width} height={s.height} fill={z.green} />
            <Text
              x={s.x} y={s.y - 1}
              width={s.width} height={s.height}
              text={String(val)}
              fontSize={28} fontFamily='Arial Black, Arial' fontStyle='bold'
              fill='#0A0A0A' align='center' verticalAlign='middle'
            />
          </Group>
        );
      })}
    </>
  );
}

/* ── CardCanvas (forwardRef) ──────────────────────────────────── */
const CardCanvas = forwardRef(function CardCanvas(
  { template, player, stats, academy, scale = 1 },
  ref,
) {
  const stageRef = useRef(null);
  useImperativeHandle(ref, () => ({
    toDataURL: (opts) => stageRef.current?.toDataURL(opts),
  }));
  if (!template?.config) return null;

  const W = template.config.width  || 420;
  const H = template.config.height || 560;
  const slug = template.slug || 'fdl1';
  const safeStats = stats || { pac:75, dri:70, phy:70, acc:75, tac:70, psy:70 };

  return (
    <div style={{
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      display: 'inline-block',
    }}>
      <Stage
        ref={stageRef}
        width={W} height={H}
        style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.75)' }}
      >
        <Layer>
          <TemplateCard
            slug={slug}
            player={player}
            stats={safeStats}
            academy={academy}
            W={W} H={H}
          />
        </Layer>
      </Stage>
    </div>
  );
});

export default CardCanvas;
