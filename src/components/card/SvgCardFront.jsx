import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

// Right stat section: x=100–400, 3 columns × 100px
const ROW1 = [
  { key: 'pac', icon: '🏃', label: 'PAC',   ix: 110, nx: 136, lx: 107 },
  { key: 'dri', icon: '⚽', label: 'DRI',   ix: 208, nx: 237, lx: 207 },
  { key: 'phy', icon: '🔥', label: 'PHY',   ix: 308, nx: 335, lx: 305 },
];
const ROW2 = [
  { key: 'acc', icon: '🎯', label: 'ACC',   ix: 110, nx: 138, lx: 107 },
  { key: 'tac', icon: '📋', label: 'TACT',  ix: 208, nx: 235, lx: 207 },
  { key: 'psy', icon: '💡', label: 'PSYCH', ix: 308, nx: 336, lx: 305 },
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
        <radialGradient id={`pg${uid}`} cx="200" cy="250" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e4a28" />
          <stop offset="0.55" stopColor="#0d2015" />
          <stop offset="1" stopColor="#050808" />
        </radialGradient>
        <radialGradient id={`bgN${uid}`} cx="200" cy="200" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0d2040" />
          <stop offset="0.6" stopColor="#040d1f" />
          <stop offset="1" stopColor="#020610" />
        </radialGradient>
        <radialGradient id={`bgF${uid}`} cx="200" cy="250" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4a1008" />
          <stop offset="0.5" stopColor="#2a0906" />
          <stop offset="1" stopColor="#080303" />
        </radialGradient>
        <radialGradient id={`bgSp${uid}`} cx="200" cy="250" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#041428" />
          <stop offset="0.6" stopColor="#020a18" />
          <stop offset="1" stopColor="#010306" />
        </radialGradient>
        <clipPath id={`cc${uid}`}>
          <rect width="400" height="700" rx="16" />
        </clipPath>
      </defs>

      <g clipPath={`url(#cc${uid})`}>
        {/* ── 카드 기본 배경 ── */}
        <rect width="400" height="700" rx="16" fill="black" />

        {/* ── 사진 배경 (y=0~500, 전체 상단) ── */}
        {bgStyle === 'night' ? (
          <>
            <rect x="-5" width="405" height="500" fill={`url(#bgN${uid})`} />
            {[...Array(28)].map((_, i) => {
              const sx = (i * 137 + 13) % 400;
              const sy = (i * 89 + 7) % 500;
              const sr = i % 3 === 0 ? 1.5 : 1;
              return <circle key={i} cx={sx} cy={sy} r={sr} fill="white" fillOpacity={0.25 + (i % 5) * 0.08} />;
            })}
          </>
        ) : bgStyle === 'fire' ? (
          <>
            <rect x="-5" width="405" height="500" fill={`url(#bgF${uid})`} />
            <line x1="70"  y1="500" x2="200" y2="0" stroke="#c04020" strokeWidth="1.5" strokeOpacity="0.18" />
            <line x1="130" y1="500" x2="220" y2="0" stroke="#e05030" strokeWidth="2"   strokeOpacity="0.12" />
            <line x1="200" y1="500" x2="200" y2="0" stroke="#e06040" strokeWidth="3"   strokeOpacity="0.08" />
            <line x1="270" y1="500" x2="180" y2="0" stroke="#c04020" strokeWidth="2"   strokeOpacity="0.12" />
            <line x1="330" y1="500" x2="200" y2="0" stroke="#e05030" strokeWidth="1.5" strokeOpacity="0.18" />
          </>
        ) : bgStyle === 'speed' ? (
          <>
            <rect x="-5" width="405" height="500" fill={`url(#bgSp${uid})`} />
            {[...Array(14)].map((_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const cx = 200, cy = 250;
              const x1 = cx + Math.cos(angle) * 35;
              const y1 = cy + Math.sin(angle) * 35;
              const x2 = cx + Math.cos(angle) * 400;
              const y2 = cy + Math.sin(angle) * 400;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00c8ff" strokeWidth="0.8" strokeOpacity="0.16" />;
            })}
            <circle cx="200" cy="250" r="30" fill="none" stroke="#00c8ff" strokeWidth="1" strokeOpacity="0.2" />
          </>
        ) : (
          <rect x="-5" width="405" height="500" fill={`url(#pg${uid})`} />
        )}

        {/* ── 선수 사진 (y=0~500) ── */}
        {photoUrl
          ? <image href={photoUrl} x="-5" y="0" width="405" height="500" preserveAspectRatio="xMidYMid slice" />
          : <text fontFamily={FF} fontSize="16" fill="white" fillOpacity="0.5">
              <tspan x="155" y="265">플레이어 사진</tspan>
            </text>
        }

        {/* ── 상단 그린 헤더 (사진 위에 오버레이, y=20, width=389) ── */}
        <rect x="0" y="20" width="389" height="102" fill="#29ED73" />

        {/* 카드 타입 */}
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

        {/* ── 정보 흰 바 (y=491, 사진 하단과 겹침) ── */}
        <rect x="-17" y="491" width="429" height="65" rx="8" fill="white" />

        {/* ── 아카데미 로고 박스 (100×100, y=456~556, 사진/흰바 경계에 걸침) ── */}
        <rect x="15" y="456" width="100" height="100" rx="6" fill="#F2F2F2" />
        {academyLogoUrl
          ? <image href={academyLogoUrl} x="15" y="456" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
          : <>
              <text fontFamily={FF} fontSize="9" fontWeight="bold" fill="#aaaaaa" textAnchor="middle">
                <tspan x="65" y="501">아카데미</tspan>
              </text>
              <text fontFamily={FF} fontSize="9" fontWeight="bold" fill="#aaaaaa" textAnchor="middle">
                <tspan x="65" y="514">로고</tspan>
              </text>
            </>
        }

        {/* 아카데미명 */}
        <text fontFamily={FF} fontSize="10" fill="#666666">
          <tspan x="125" y="510.636">{academyName}</tspan>
        </text>

        {/* 선수 이름 (한글) + 영문 */}
        <text fontFamily={FF} x="125" y="544.136" fill="black">
          <tspan fontSize="32" fontWeight="bold">{playerName}</tspan>
          {playerNameEn && (
            <tspan fontSize="13" fill="#666666" dx="8" dy="-2">{playerNameEn}</tspan>
          )}
        </text>

        {/* AGE */}
        <text fontFamily={FF} fontSize="9" fill="#666666">
          <tspan x="368" y="513.773" textAnchor="end">AGE</tspan>
        </text>
        <text fontFamily={FF} fontSize="22" fontWeight="bold" fill="black">
          <tspan x="368" y="540.5" textAnchor="end">{age}</tspan>
        </text>

        {/* ── 스탯 섹션 (y=566, height=134) ── */}
        <rect y="566" width="400" height="134" fill="#29ED73" />

        {/* MY STATS + hw (좌측 컬럼, x=0~100) */}
        <text fontFamily={FF} fontSize="11" fontWeight="bold" fill="black">
          <tspan x="14" y="583.5">👤 MY STATS</tspan>
        </text>
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="17" y="601.636">{hw}</tspan>
          </text>
        )}

        {/* ── 구분선 ── */}
        {/* 좌측 컬럼 세로선 */}
        <line x1="100" y1="566" x2="100" y2="675" stroke="black" strokeWidth="1" strokeOpacity="0.18" />
        {/* 우측 스탯 하단 가로선 */}
        <line x1="0" y1="675" x2="400" y2="675" stroke="black" strokeWidth="1" strokeOpacity="0.18" />

        {/* FDL 인증 로고 (좌측 컬럼 하단) */}
        <image
          href="/brand/fdl-logo.png"
          x="7" y="621"
          width="90" height="51"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ROW1 스탯 (PAC / DRI / PHY) */}
        {ROW1.map(({ key, icon, label, ix, nx, lx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="14" fill="black">
              <tspan x={ix} y="595.88">{icon}</tspan>
            </text>
            <text fontFamily={FF} fontSize="32" fontWeight="900" fill="black">
              <tspan x={nx} y="611">{vals[key]}</tspan>
            </text>
            <text fontFamily={FF} fontSize="10" fontWeight="bold" fill="black">
              <tspan x={lx} y="621">{label}</tspan>
            </text>
          </g>
        ))}

        {/* ROW2 스탯 (ACC / TACT / PSYCH) */}
        {ROW2.map(({ key, icon, label, ix, nx, lx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="14" fill="black">
              <tspan x={ix} y="645.88">{icon}</tspan>
            </text>
            <text fontFamily={FF} fontSize="32" fontWeight="900" fill="black">
              <tspan x={nx} y="661">{vals[key]}</tspan>
            </text>
            <text fontFamily={FF} fontSize="10" fontWeight="bold" fill="black">
              <tspan x={lx} y="671">{label}</tspan>
            </text>
          </g>
        ))}

        {/* ©FDL */}
        <text fontFamily={FF} fontSize="7" fill="black" fillOpacity="0.5">
          <tspan x="188" y="689.545">©FDL</tspan>
        </text>
      </g>
    </svg>
  );
}
