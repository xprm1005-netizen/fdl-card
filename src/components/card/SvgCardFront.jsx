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
  age = '', height = '', weight = '', foot = '',
  pac = 70, dri = 70, phy = 70,
  acc = 70, tac = 70, psy = 70,
  scale = 1, jerseyNumber, birthDate, nationality,
}) {
  const uid = useId().replace(/[^a-z0-9]/gi, '');
  const ovr = calcOverall({ pac, dri, phy, acc, tac, psy });
  const vals = { pac, dri, phy, acc, tac, psy };
  const words = (cardLabel || '').trim().split(/\s+/).filter(Boolean);
  const line2 = words[0] || '';
  const line3 = words.slice(1).join(' ');
  const footLabel = foot === 'left' ? '왼발' : foot === 'right' ? '오른발' : '';
  const hw = [height && `${height}cm`, weight && `${weight}kg`, footLabel].filter(Boolean).join(' · ');

  return (
    <svg width={400 * scale} height={700 * scale} viewBox="0 0 400 700" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
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

        {/* Background always visible */}
        <image href="/player-bg.svg" x="-5" y="0" width="405" height="500" preserveAspectRatio="xMidYMid slice" />
        {/* Player photo (background-removed) on top */}
        {photoUrl && (
          <image href={photoUrl} x="-5" y="0" width="405" height="500" preserveAspectRatio="xMidYMid slice" />
        )}

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

        {/* Height / Weight / Foot */}
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="14" y="601.636">{hw}</tspan>
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
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#fdlPill${uid})`}
        />

        {/* Dividers */}
        <line x1="100.27" y1="566" x2="100" y2="675" stroke="black" strokeOpacity="0.2" />
        <line x1="0" y1="675" x2="400" y2="675" stroke="black" strokeOpacity="0.2" />
      </g>
    </svg>
  );
}
