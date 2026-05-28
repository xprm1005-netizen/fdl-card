import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

// 3 stat columns, x=120 to x=400 (280px ÷ 3 = ~93px each)
// Dividers at x=120, x=196, x=277
const ROW1 = [
  { key: 'pac', icon: '🏃', label: 'PAC',   ix: 128, nx: 150 },
  { key: 'dri', icon: '⚽', label: 'DRI',   ix: 210, nx: 232 },
  { key: 'phy', icon: '🔥', label: 'PHY',   ix: 292, nx: 314 },
];
const ROW2 = [
  { key: 'acc', icon: '🎯', label: 'ACC',   ix: 128, nx: 150 },
  { key: 'tac', icon: '📋', label: 'TACT',  ix: 210, nx: 232 },
  { key: 'psy', icon: '💡', label: 'PSYCH', ix: 292, nx: 314 },
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
        <radialGradient id={`pg${uid}`} cx="200" cy="320" r="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1e4a28" />
          <stop offset="0.55" stopColor="#0d2015" />
          <stop offset="1" stopColor="#050808" />
        </radialGradient>
        <radialGradient id={`bgN${uid}`} cx="200" cy="200" r="260" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0d2040" />
          <stop offset="0.6" stopColor="#040d1f" />
          <stop offset="1" stopColor="#020610" />
        </radialGradient>
        <radialGradient id={`bgF${uid}`} cx="200" cy="450" r="300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4a1008" />
          <stop offset="0.5" stopColor="#2a0906" />
          <stop offset="1" stopColor="#080303" />
        </radialGradient>
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

        {/* ── 사진 배경 (height=330, y=130~460, 흰 바와 틈 없이 붙음) ── */}
        {bgStyle === 'night' ? (
          <>
            <rect x="0" y="130" width="400" height="330" fill={`url(#bgN${uid})`} />
            {[...Array(28)].map((_, i) => {
              const sx = (i * 137 + 13) % 400;
              const sy = 130 + (i * 89 + 7) % 330;
              const sr = i % 3 === 0 ? 1.5 : 1;
              return <circle key={i} cx={sx} cy={sy} r={sr} fill="white" fillOpacity={0.25 + (i % 5) * 0.08} />;
            })}
            <ellipse cx="200" cy="130" rx="100" ry="60" fill="white" fillOpacity="0.04" />
          </>
        ) : bgStyle === 'fire' ? (
          <>
            <rect x="0" y="130" width="400" height="330" fill={`url(#bgF${uid})`} />
            <line x1="70"  y1="460" x2="200" y2="130" stroke="#c04020" strokeWidth="1.5" strokeOpacity="0.18" />
            <line x1="130" y1="460" x2="220" y2="130" stroke="#e05030" strokeWidth="2"   strokeOpacity="0.12" />
            <line x1="200" y1="460" x2="200" y2="130" stroke="#e06040" strokeWidth="3"   strokeOpacity="0.08" />
            <line x1="270" y1="460" x2="180" y2="130" stroke="#c04020" strokeWidth="2"   strokeOpacity="0.12" />
            <line x1="330" y1="460" x2="200" y2="130" stroke="#e05030" strokeWidth="1.5" strokeOpacity="0.18" />
          </>
        ) : bgStyle === 'speed' ? (
          <>
            <rect x="0" y="130" width="400" height="330" fill={`url(#bgSp${uid})`} />
            {[...Array(14)].map((_, i) => {
              const angle = (i / 14) * Math.PI * 2;
              const cx = 200, cy = 295;
              const x1 = cx + Math.cos(angle) * 35;
              const y1 = cy + Math.sin(angle) * 35;
              const x2 = cx + Math.cos(angle) * 320;
              const y2 = cy + Math.sin(angle) * 320;
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#00c8ff" strokeWidth="0.8" strokeOpacity="0.16" />;
            })}
            <circle cx="200" cy="295" r="30" fill="none" stroke="#00c8ff" strokeWidth="1" strokeOpacity="0.2" />
          </>
        ) : (
          <rect x="0" y="130" width="400" height="330" fill={`url(#pg${uid})`} />
        )}

        {/* 선수 사진 (height=330, 흰 바와 빈틈 없음) */}
        {photoUrl
          ? <image href={photoUrl} x="0" y="130" width="400" height="330" preserveAspectRatio="xMidYMid slice" />
          : <text fontFamily={FF} fontSize="16" fill="white" fillOpacity="0.5">
              <tspan x="165" y="300.32">플레이어 사진</tspan>
            </text>
        }

        {/* ── 정보 흰 바 (y=460, height=75) ── */}
        <rect x="0" y="460" width="400" height="75" fill="white" />

        {/* 아카데미 로고 박스 (y=465, bottom=529) */}
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

        {/* 아카데미명 — 로고 상단 기준 */}
        <text fontFamily={FF} fontSize="10" fill="#666666">
          <tspan x="96" y="479">{academyName}</tspan>
        </text>

        {/* 선수 이름 + 영문 — 로고 하단(y=529)에 맞춰 정렬 */}
        <text fontFamily={FF} x="96" y="527" fill="black">
          <tspan fontSize="29" fontWeight="900">{playerName}</tspan>
          {playerNameEn && (
            <tspan fontSize="12" fontWeight="700" fill="#444444" dx="8" dy="-5">{playerNameEn}</tspan>
          )}
        </text>

        {/* AGE — 우측, 로고 상단/하단 기준 정렬 */}
        <text fontFamily={FF} fontSize="9" fill="#666666">
          <tspan x="368" y="479" textAnchor="end">AGE</tspan>
        </text>
        <text fontFamily={FF} fontSize="24" fontWeight="900" fill="black">
          <tspan x="368" y="527" textAnchor="end">{age}</tspan>
        </text>

        {/* ── 스탯 섹션 (y=535, height=165) ── */}
        <rect y="535" width="400" height="165" fill="#29ED73" />

        {/* MY STATS + hw (좌측 상단, 로고 위) */}
        <text fontFamily={FF} fontSize="11" fontWeight="bold" fill="black">
          <tspan x="15" y="551">👤 MY STATS</tspan>
        </text>
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="15" y="565">{hw}</tspan>
          </text>
        )}

        {/* ── 그리드 구분선 ── */}
        {/* 세로선: FDL|PAC, PAC|DRI, DRI|PHY */}
        <line x1="120" y1="574" x2="120" y2="694" stroke="black" strokeWidth="1" strokeOpacity="0.18" />
        <line x1="196" y1="574" x2="196" y2="694" stroke="black" strokeWidth="1" strokeOpacity="0.18" />
        <line x1="277" y1="574" x2="277" y2="694" stroke="black" strokeWidth="1" strokeOpacity="0.18" />
        {/* 가로선: ROW1 | ROW2 */}
        <line x1="0" y1="636" x2="400" y2="636" stroke="black" strokeWidth="1" strokeOpacity="0.18" />

        {/* FDL 인증 로고 — 좌측 그리드 전체 */}
        <image
          href="/brand/fdl-logo.png"
          x="0" y="574"
          width="120" height="120"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* ROW1 스탯 (상단 그리드) */}
        {ROW1.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="610">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="40" fontWeight="900" fill="black"><tspan x={nx} y="614">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="14" fontWeight="bold" fill="black"><tspan x={nx} y="629">{label}</tspan></text>
          </g>
        ))}

        {/* ROW2 스탯 (하단 그리드) */}
        {ROW2.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="660">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="40" fontWeight="900" fill="black"><tspan x={nx} y="664">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="14" fontWeight="bold" fill="black"><tspan x={nx} y="679">{label}</tspan></text>
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
