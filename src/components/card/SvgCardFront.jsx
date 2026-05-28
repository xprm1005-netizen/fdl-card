import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

const ROW1 = [
  { key: 'pac', icon: '🏃', label: 'PAC',   ix: 110, nx: 136, lx: 107 },
  { key: 'dri', icon: '⚽', label: 'DRI',   ix: 208, nx: 237, lx: 207 },
  { key: 'phy', icon: '🔥', label: 'PHY',   ix: 308, nx: 335, lx: 305 },
];
const ROW2 = [
  { key: 'acc', icon: '🎯', label: 'ACC',   ix: 110, nx: 138, lx: 106 },
  { key: 'tac', icon: '📋', label: 'TACT',  ix: 208, nx: 235, lx: 202 },
  { key: 'psy', icon: '💡', label: 'PSYCH', ix: 308, nx: 336, lx: 298 },
];
const FF = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';

export default function SvgCardFront({
  cardType = 'THE', cardLabel = '', position = 'FW',
  photoUrl = '', academyLogoUrl = '', academyName = '',
  playerName = '', playerNameEn = '',
  age = '', height = '', weight = '',
  pac = 70, dri = 70, phy = 70,
  acc = 70, tac = 70, psy = 70,
  scale = 1, jerseyNumber, birthDate, nationality,
  bgStyle = 'stadium',
}) {
  const uid = useId().replace(/[^a-z0-9]/gi, '');
  const ovr = calcOverall({ pac, dri, phy, acc, tac, psy });
  const vals = { pac, dri, phy, acc, tac, psy };
  const words = (cardLabel || '').trim().split(/\s+/).filter(Boolean);
  const line2 = words[0] || '';
  const line3 = words.slice(1).join(' ');
  const hw = [height && `${height}cm`, weight && `${weight}kg`].filter(Boolean).join(' · ');

  return (
    <svg width={400 * scale} height={700 * scale} viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`bgSt${uid}`} cx="200" cy="250" r="300" gradientUnits="userSpaceOnUse">
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
        <clipPath id={`fdlPill${uid}`}>
          <rect x="7" y="621" width="90" height="51" rx="25.5" />
        </clipPath>
        <clipPath id={`cc${uid}`}>
          <rect width="400" height="700" rx="16" />
        </clipPath>
      </defs>

      <g clipPath={`url(#cc${uid})`}>
        {/* Card base */}
        <rect width="400" height="700" rx="16" fill="black" />

        {/* Photo background (y=0 to y=500) */}
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
            <line x1="70" y1="500" x2="200" y2="0" stroke="#c04020" strokeWidth="1.5" strokeOpacity="0.18" />
            <line x1="130" y1="500" x2="220" y2="0" stroke="#e05030" strokeWidth="2" strokeOpacity="0.12" />
            <line x1="200" y1="500" x2="200" y2="0" stroke="#e06040" strokeWidth="3" strokeOpacity="0.08" />
            <line x1="270" y1="500" x2="180" y2="0" stroke="#c04020" strokeWidth="2" strokeOpacity="0.12" />
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
          <rect x="-5" width="405" height="500" fill={`url(#bgSt${uid})`} />
        )}

        {/* Player photo */}
        {photoUrl
          ? <image href={photoUrl} x="-5" y="0" width="405" height="500" preserveAspectRatio="xMidYMid slice" />
          : <text fontFamily={FF} fontSize="16" fill="white" fillOpacity="0.5"><tspan x="153" y="303.318">플레이어 사진</tspan></text>
        }

        {/* Green header overlay (x=0, y=20, w=389, h=102) */}
        <rect y="20" width="389" height="102" fill="#29ED73" />

        {/* Card type + label text — BLACK on green */}
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="black">
          <tspan x="20" y="50.1818">{cardType}</tspan>
        </text>
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="black">
          <tspan x="20" y="80.1818">{line2}</tspan>
        </text>
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="black">
          <tspan x="20" y="110.182">{line3}</tspan>
        </text>

        {/* OVR */}
        <text fontFamily={FF} fontSize="90" fontWeight="900" fill="black">
          <tspan x="236" y="107.227">{ovr}</tspan>
        </text>

        {/* Position */}
        <text fontFamily={FF} fontSize="24" fontWeight="bold" fill="black">
          <tspan x="351" y="103.227">{position}</tspan>
        </text>

        {/* White info bar */}
        <rect x="-17" y="491" width="429" height="65" rx="8" fill="white" />

        {/* Academy logo box (x=0, y=456, 100×100) */}
        <rect x="0" y="456" width="100" height="100" rx="6" fill="#F2F2F2" />
        {academyLogoUrl
          ? <image href={academyLogoUrl} x="0" y="456" width="100" height="100" preserveAspectRatio="xMidYMid meet" />
          : (
            <text fontFamily={FF} fontSize="15" fontWeight="bold" fill="black">
              <tspan x="21.9" y="505.955">아카데미</tspan>
              <tspan x="35.7" dy="18">로고</tspan>
            </text>
          )
        }

        {/* Academy name */}
        <text fontFamily={FF} fontSize="10" fill="#666666">
          <tspan x="108" y="510.636">{academyName}</tspan>
        </text>

        {/* Player name */}
        <text fontFamily={FF} fontSize="32" fontWeight="bold" fill="black">
          <tspan x="102" y="544.136">{playerName}</tspan>
        </text>

        {/* English name (separate element) */}
        {playerNameEn && (
          <text fontFamily={FF} fontSize="13" fill="#666666">
            <tspan x="195" y="545.727">{playerNameEn}</tspan>
          </text>
        )}

        {/* AGE label + value */}
        <text fontFamily={FF} fontSize="9" fill="#666666">
          <tspan x="345" y="513.773">AGE</tspan>
        </text>
        <text fontFamily={FF} fontSize="22" fontWeight="bold" fill="black">
          <tspan x="342" y="540.5">{age}</tspan>
        </text>

        {/* Stats section (green bar y=566, h=134) */}
        <rect y="566" width="400" height="134" fill="#29ED73" />

        {/* MY STATS label */}
        <text fontFamily={FF} fontSize="11" fontWeight="bold" fill="black">
          <tspan x="14" y="583.5">👤 MY STATS</tspan>
        </text>

        {/* Height / Weight */}
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="17" y="601.636">{hw}</tspan>
          </text>
        )}

        {/* ROW 1 stats */}
        {ROW1.map(({ key, icon, label, ix, nx, lx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="595.88">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="32" fontWeight="900" fill="black"><tspan x={nx} y="608.136">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="10" fontWeight="bold" fill="black"><tspan x={lx} y="611.636">{label}</tspan></text>
          </g>
        ))}

        {/* ROW 2 stats */}
        {ROW2.map(({ key, icon, label, ix, nx, lx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="645.88">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="32" fontWeight="900" fill="black"><tspan x={nx} y="659.136">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="10" fontWeight="bold" fill="black"><tspan x={lx} y="660.636">{label}</tspan></text>
          </g>
        ))}

        {/* Copyright */}
        <text fontFamily={FF} fontSize="7" fill="black" fillOpacity="0.5">
          <tspan x="188" y="689.545">©FDL</tspan>
        </text>

        {/* FDL logo in pill shape */}
        <image
          href="/brand/fdl-logo.png"
          x="7" y="621" width="90" height="51"
          preserveAspectRatio="xMidYMid meet"
          clipPath={`url(#fdlPill${uid})`}
        />

        {/* Dividers */}
        <line x1="100.27" y1="566" x2="100" y2="675" stroke="black" strokeOpacity="0.2" />
        <line x1="0" y1="675" x2="400" y2="675" stroke="black" strokeOpacity="0.2" />
      </g>
    </svg>
  );
}
