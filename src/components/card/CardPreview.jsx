import { calcOverall } from '../../lib/utils';

/*
 * CardPreview — 순수 HTML/CSS 카드 미리보기
 *
 * CardCanvas(Konva)와 동일한 ZONES 좌표를 사용한다.
 * 각 존은 템플릿 PNG 위에 solid-color div를 absolute 배치해
 * 샘플 데이터를 가리고 동적 데이터를 렌더링한다.
 *
 * 좌표는 420×560 기준.
 */

/* ── per-template zone definitions (CardCanvas ZONES와 동일) ─── */
const ZONES = {
  fdl1: {
    accent: '#06f185',
    ovr:  { left:155, top:6,   width:265, height:96  },
    info: { left:112, top:373, width:240, height:80  },
    age:  { left:350, top:373, width:66,  height:80  },
    logo: { left:4,   top:453, width:157, height:93  },
    S: [
      { k:'pac', left:165, top:453, width:46, height:37 },
      { k:'dri', left:261, top:453, width:46, height:37 },
      { k:'phy', left:355, top:453, width:59, height:37 },
      { k:'acc', left:165, top:505, width:46, height:37 },
      { k:'tac', left:261, top:505, width:46, height:37 },
      { k:'psy', left:355, top:505, width:59, height:37 },
    ],
  },
  fdl2: {
    accent: '#05f37c',
    ovr:  { left:155, top:6,   width:265, height:96  },
    info: { left:112, top:354, width:244, height:76  },
    age:  { left:354, top:354, width:62,  height:76  },
    logo: { left:4,   top:431, width:142, height:115 },
    S: [
      { k:'pac', left:150, top:431, width:52, height:40 },
      { k:'dri', left:254, top:431, width:52, height:40 },
      { k:'phy', left:358, top:431, width:56, height:40 },
      { k:'acc', left:150, top:485, width:52, height:40 },
      { k:'tac', left:254, top:485, width:52, height:40 },
      { k:'psy', left:358, top:485, width:56, height:40 },
    ],
  },
  fdl3: {
    accent: '#08f086',
    ovr:  { left:155, top:6,   width:265, height:96  },
    info: { left:112, top:350, width:244, height:70  },
    age:  { left:354, top:350, width:62,  height:70  },
    logo: { left:4,   top:420, width:116, height:126 },
    S: [
      { k:'pac', left:124, top:420, width:50, height:44 },
      { k:'dri', left:232, top:420, width:50, height:44 },
      { k:'phy', left:340, top:420, width:74, height:44 },
      { k:'acc', left:124, top:472, width:50, height:44 },
      { k:'tac', left:232, top:472, width:50, height:44 },
      { k:'psy', left:340, top:472, width:74, height:44 },
    ],
  },
  fdl4: {
    accent: '#08f383',
    ovr:   { left:155, top:6,   width:265, height:96  },
    info:  { left:172, top:342, width:184, height:76  },
    age:   { left:354, top:342, width:62,  height:76  },
    extra: { left:2,   top:416, width:175, height:122 },
    S: [
      { k:'pac', left:213, top:422, width:48, height:44 },
      { k:'dri', left:291, top:422, width:48, height:44 },
      { k:'phy', left:366, top:422, width:48, height:44 },
      { k:'acc', left:213, top:474, width:48, height:44 },
      { k:'tac', left:291, top:474, width:48, height:44 },
      { k:'psy', left:366, top:474, width:48, height:44 },
    ],
  },
};

const STAT_LABELS = { pac:'PAC', dri:'DRI', phy:'PHY', acc:'ACC', tac:'TAC', psy:'PSY' };
const W = 420, H = 560;

/* ── helpers ────────────────────────────────────────────────────── */
function Cover({ z, bg, children, style }) {
  return (
    <div style={{
      position: 'absolute',
      left: z.left, top: z.top,
      width: z.width, height: z.height,
      zIndex: 2,
      background: bg,
      overflow: 'hidden',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── CardPreview ─────────────────────────────────────────────────── */
export default function CardPreview({ template, player, stats, academy, scale = 1 }) {
  const slug   = template?.slug || 'fdl1';
  const z      = ZONES[slug] || ZONES.fdl1;
  const ovr    = calcOverall(stats);
  const pos    = (player?.position  || 'ST').toUpperCase();
  const name   = player?.name       || '선수 이름';
  const age    = player?.age        ?? '--';
  const club   = (academy?.name     || 'FDL FC').toUpperCase();
  const photo  = player?.photo_bg_removed_url || player?.photo_url || null;

  /* stat cell font size — height에 비례 */
  const statNumFs = (h) => h >= 44 ? 26 : h >= 40 ? 24 : 22;

  return (
    /* 외부 박스: 스케일된 크기를 문서 흐름에 반영 */
    <div style={{
      width:  W * scale,
      height: H * scale,
      position: 'relative',
      flexShrink: 0,
      borderRadius: 18 * scale,
      overflow: 'hidden',
      boxShadow: '0 24px 64px rgba(0,0,0,0.75)',
    }}>
      {/* 실제 카드 — 420×560 기준으로 그린 뒤 scale 적용 */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: W, height: H,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        borderRadius: 18,
        overflow: 'hidden',
        background: '#080808',
        fontFamily: '"Arial Black", Arial, sans-serif',
        userSelect: 'none',
      }}>

        {/* ① 템플릿 PNG 배경 (zIndex 0) */}
        <img
          src={`/thumbnails/${slug}.png`}
          alt=""
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {/* ② 선수 사진 — 포토존 y=95~340 (zIndex 1) */}
        {photo && (
          <div style={{
            position: 'absolute',
            left: 0, top: 95,
            width: W, height: 245,
            overflow: 'hidden',
            zIndex: 1,
          }}>
            <img
              src={photo} alt=""
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
              }}
            />
          </div>
        )}

        {/* ── zIndex 2 커버들 (샘플 데이터 가리기 + 실제 데이터 렌더링) ── */}

        {/* ③ OVR 커버 */}
        <Cover z={z.ovr} bg={z.accent} style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'flex-end', justifyContent: 'center',
          paddingRight: 10, boxSizing: 'border-box',
        }}>
          {/* 숫자: whiteSpace nowrap + parent overflow:hidden으로 침범 차단 */}
          <span style={{
            fontSize: 62, fontWeight: 900,
            color: '#0a0a0a',
            lineHeight: 1, letterSpacing: -2,
            whiteSpace: 'nowrap',
          }}>
            {ovr}
          </span>
          <span style={{
            fontSize: 13, fontWeight: 900,
            color: '#0a0a0a', letterSpacing: 2,
            whiteSpace: 'nowrap',
          }}>
            {pos}
          </span>
        </Cover>

        {/* ④ INFO 커버 (아카데미 + 선수 이름) */}
        <Cover z={z.info} bg="#ffffff" style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '4px 8px', boxSizing: 'border-box',
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: '#666', letterSpacing: 1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {club}
          </span>
          <span style={{
            fontSize: 22, fontWeight: 900,
            color: '#0a0a0a', lineHeight: 1.1,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            marginTop: 2,
          }}>
            {name}
          </span>
        </Cover>

        {/* ⑤ AGE 커버 */}
        <Cover z={z.age} bg="#ffffff" style={{
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: '#888', letterSpacing: 1,
          }}>
            AGE
          </span>
          <span style={{
            fontSize: 26, fontWeight: 900,
            color: '#0a0a0a', lineHeight: 1,
          }}>
            {age}
          </span>
        </Cover>

        {/* ⑥ STATS — 개별 셀 커버 (CardCanvas ZONES.S와 동일 좌표) */}
        {z.S.map((s) => (
          <Cover key={s.k} z={s} bg={z.accent} style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 1,
          }}>
            <span style={{
              fontSize: 9, fontWeight: 700,
              color: '#0a0a0a', letterSpacing: 1,
              lineHeight: 1,
            }}>
              {STAT_LABELS[s.k]}
            </span>
            <span style={{
              fontSize: statNumFs(s.height),
              fontWeight: 900, color: '#0a0a0a',
              lineHeight: 1, whiteSpace: 'nowrap',
            }}>
              {stats?.[s.k] ?? 0}
            </span>
          </Cover>
        ))}

        {/* ⑦ FDL 로고 커버 — 스탯 좌측 로고 존 (fdl4 제외) */}
        {!z.extra && z.logo && (
          <Cover z={z.logo} bg={z.accent} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/brand/fdl-logo.png" alt="FDL"
              style={{ width: 60, height: 60, objectFit: 'contain' }}
            />
          </Cover>
        )}

        {/* ⑧ fdl4 전용: EXTRA 커버 (좌측 MY STATS 패널) */}
        {z.extra && (
          <Cover z={z.extra} bg={z.accent} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src="/brand/fdl-logo.png" alt="FDL"
              style={{ width: 70, height: 70, objectFit: 'contain' }}
            />
          </Cover>
        )}

      </div>
    </div>
  );
}
