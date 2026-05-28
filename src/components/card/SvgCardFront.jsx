import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

// Stat columns: icon (ix) and number (nx) x positions
// Left column (x=0-120) reserved for FDL logo
const ROW1 = [
  { key: 'pac', icon: '🏃', label: 'PAC',   ix: 128, nx: 152 },
  { key: 'dri', icon: '⚽', label: 'DRI',   ix: 209, nx: 233 },
  { key: 'phy', icon: '🔥', label: 'PHY',   ix: 290, nx: 314 },
];
const ROW2 = [
  { key: 'acc', icon: '🎯', label: 'ACC',   ix: 128, nx: 152 },
  { key: 'tac', icon: '📋', label: 'TACT',  ix: 209, nx: 233 },
  { key: 'psy', icon: '💡', label: 'PSYCH', ix: 290, nx: 314 },
];
const FF = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

export default function SvgCardFront({
  cardType = 'THE',
  cardLabel = '',
  position = 'FW',
  photoUrl = '',
  academyLogoUrl = '',
  academyName = '',
  playerName = '',
  playerNameEn = '',
  age = '',
  height = '',
  weight = '',
  pac = 70, dri = 70, phy = 70,
  acc = 70, tac = 70, psy = 70,
  scale = 1,
  jerseyNumber,
  birthDate,
  nationality,
  bgStyle = 'stadium',
}) {
  const uid  = useId().replace(/[^a-z0-9]/gi, '');
  const ovr  = calcOverall({ pac, dri, phy, acc, tac, psy });
  const vals = { pac, dri, phy, acc, tac, psy };

  const words = (cardLabel || '').trim().split(/\s+/).filter(Boolean);
  const line2 = words[0] || '';
  const line3 = words.slice(1).join(' ');
  const hw    = [height && `${height}cm`, weight && `${weight}kg`].filter(Boolean).join(' · ');

  return (
    <svg
      width={400 * scale}
      height={700 * scale}
      viewBox="0 0 400 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* BG1: Stadium / dark green */}
        <radialGradient id={`pg${uid}`} cx="200" cy="320" r="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e4a28" />
          <stop offset="0.55" stopColor="#0d2015" />
          <stop offset="1" stopColor="#050808" />
        </radialGradient>
        {/* BG2: Night sky */}
        <radialGradient id={`bgN${uid}`} cx="200" cy="200" r="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0d2040" />
          <stop offset="0.6" stopColor="#040d1f" />
          <stop offset="1" stopColor="#020610" />
        </radialGradient>
        {/* BG3: Fire / passion */}
        <radialGradient id={`bgF${uid}`} cx="200" cy="450" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4a1008" />
          <stop offset="0.5" stopColor="#2a0906" />
          <stop offset="1" stopColor="#080303" />
        </radialGradient>
        {/* BG4: Speed / dark blue */}
        <radialGradient id={`bgSp${uid}`} cx="200" cy="290" r="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#041428" />
          <stop offset="0.6" stopColor="#020a18" />
          <stop offset="1" stopColor="#010306" />
        </radialGradient>
        <clipPath id={`cc${uid}`}>
          <rect width="400" height="700" rx="16" />
        </clipPath>
      </defs>

      <g clipPath={`url(#cc${uid})`}>
        <rect width="400" height="700" rx="16" fill="black" />
        <rect width="400" height="200" fill="#29ED73" />

        {/* 카드 타입 - 3줄 */}
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="white">
          <tspan x="20" y="50.18">{cardType}</tspan>
        </text>
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="white">
          <tspan x="20" y="80.18">{line2}</tspan>
        </text>
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="white">
          <tspan x="20" y="110.18">{line3}</tspan>
        </text>

        {/* OVR */}
        <text fontFamily={FF} fontSize="90" fontWeight="900" fill="black">
          <tspan x="240" y="107.23">{ovr}</tspan>
        </text>

        {/* 포지션 */}
        <text fontFamily={FF} fontSize="24" fontWeight="bold" fill="black">
          <tspan x="355" y="103.23">{position}</tspan>
        </text>

        {/* ── 사진 배경 (bgStyle 선택) ── */}
        {bgStyle === 'night' ? (
          <>
            <rect x="0" y="130" width="400" height="320" fill={`url(#bgN${uid})`} />
            {[...Array(28)].map((_, i) => {
              const sx = (i * 137 + 13) % 400;
              const sy = 130 + (i * 89 + 7) % 320;
              const sr = i % 3 === 0 ? 1.5 : 1;
              return <circle key={i} cx={sx} cy={sy} r={sr} fill="white" fillOpacity={0.25 + (i % 5) * 0.08} />;
            })}
            {/* spotlight from top */}
            <ellipse cx="200" cy="130" rx="100" ry="60" fill="white" fillOpacity="0.04" />
          </>
        ) : bgStyle === 'fire' ? (
          <>
            <rect x="0" y="130" width="400" height="320" fill={`url(#bgF${uid})`} />
            <line x1="70"  y1="450" x2="200" y2="130" stroke="#c04020" strokeWidth="1.5" strokeOpacity="0.18" />
            <line x1="130" y1="450" x2="220" y2="130" stroke="#e05030" strokeWidth="2"   strokeOpacity="0.12" />
            <line x1="200" y1="450" x2="200" y2="130" stroke="#e06040" strokeWidth="3"   strokeOpacity="0.08" />
            <line x1="270" y1="450" x2="180" y2="130" stroke="#c04020" strokeWidth="2"   strokeOpacity="0.12" />
            <line x1="330" y1="450" x2="200" y2="130" stroke="#e05030" strokeWidth="1.5" strokeOpacity="0.18" />
          </>
        ) : bgStyle === 'speed' ? (
          <>
            <rect x="0" y="130" width="400" height="320" fill={`url(#bgSp${uid})`} />
            {[...Array(14)].map((_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const cx = 200, cy = 290;
              const x1 = cx + Math.cos(angle) * 35;
              const y1 = cy + Math.sin(angle) * 35;
              const x2 = cx + Math.cos(angle) * 320;
              const y2 = cy + Math.sin(angle) * 320;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00c8ff" strokeWidth="0.8" strokeOpacity="0.16" />;
            })}
            <circle cx="200" cy="290" r="30" fill="none" stroke="#00c8ff" strokeWidth="1" strokeOpacity="0.2" />
          </>
        ) : (
          /* stadium (default) */
          <rect x="0" y="130" width="400" height="320" fill={`url(#pg${uid})`} />
        )}

        {/* 선수 사진 (항상 배경 위에) */}
        {photoUrl
          ? <image href={photoUrl} x="0" y="130" width="400" height="320" preserveAspectRatio="xMidYMid slice" />
          : <text fontFamily={FF} fontSize="16" fill="white" fillOpacity="0.5">
              <tspan x="165" y="300.32">플레이어 사진</tspan>
            </text>
        }

        {/* ── 정보 흰 바 (풀너비) ── */}
        <rect x="0" y="460" width="400" height="75" fill="white" />

        {/* 로고 박스 */}
        <rect x="18" y="465" width="66" height="64" rx="6" fill="#F0F0F0" />
        {academyLogoUrl
          ? <image href={academyLogoUrl} x="18" y="465" width="66" height="64" preserveAspectRatio="xMidYMid meet" />
          : <>
              <text fontFamily={FF} fontSize="7" fontWeight="bold" fill="#aaaaaa" textAnchor="middle">
                <tspan x="51" y="492">아카데미</tspan>
              </text>
              <text fontFamily={FF} fontSize="7" fontWeight="bold" fill="#aaaaaa" textAnchor="middle">
                <tspan x="51" y="503">로고</tspan>
              </text>
            </>
        }

        {/* 아카데미명 */}
        <text fontFamily={FF} fontSize="10" fill="#666666">
          <tspan x="96" y="483">{academyName}</tspan>
        </text>

        {/* 선수 이름 */}
        <text fontFamily={FF} fontSize="26" fontWeight="900" fill="black">
          <tspan x="96" y="510">{playerName}</tspan>
        </text>

        {/* 영문 이름 */}
        {playerNameEn && (
          <text fontFamily={FF} fontSize="10" fill="#888888">
            <tspan x="96" y="525">{playerNameEn}</tspan>
          </text>
        )}

        {/* AGE */}
        <text fontFamily={FF} fontSize="9" fill="#666666">
          <tspan x="383" y="483" textAnchor="end">AGE</tspan>
        </text>
        <text fontFamily={FF} fontSize="24" fontWeight="900" fill="black">
          <tspan x="388" y="511" textAnchor="end">{age}</tspan>
        </text>

        {/* ── 스탯 섹션 (y=535, height=165) ── */}
        <rect y="535" width="400" height="165" fill="#29ED73" />

        {/* FDL 인증 로고 — 좌측 전체 컬럼 */}
        <image
          href="/brand/fdl-logo.png"
          x="0" y="535"
          width="120" height="159"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* MY STATS + hw (우측 컬럼 상단) */}
        <text fontFamily={FF} fontSize="11" fontWeight="bold" fill="black">
          <tspan x="128" y="554">👤 MY STATS</tspan>
        </text>
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="128" y="570">{hw}</tspan>
          </text>
        )}

        {/* ROW1 스탯 */}
        {ROW1.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="593">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="40" fontWeight="900" fill="black"><tspan x={nx} y="597">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="15" fontWeight="bold" fill="black"><tspan x={nx} y="614">{label}</tspan></text>
          </g>
        ))}

        {/* ROW2 스탯 */}
        {ROW2.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="649">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="40" fontWeight="900" fill="black"><tspan x={nx} y="653">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="15" fontWeight="bold" fill="black"><tspan x={nx} y="670">{label}</tspan></text>
          </g>
        ))}

        {/* ©FDL */}
        <text fontFamily={FF} fontSize="7" fill="black" fillOpacity="0.5">
          <tspan x="188" y="694">©FDL</tspan>
        </text>
      </g>
    </svg>
  );
}
