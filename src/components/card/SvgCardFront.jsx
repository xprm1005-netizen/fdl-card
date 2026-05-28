import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

const ROW1 = [
  { key: 'pac', icon: '🏃', label: 'PAC',   ix: 100, nx: 130 },
  { key: 'dri', icon: '⚽', label: 'DRI',   ix: 200, nx: 230 },
  { key: 'phy', icon: '🔥', label: 'PHY',   ix: 300, nx: 330 },
];
const ROW2 = [
  { key: 'acc', icon: '🎯', label: 'ACC',   ix: 100, nx: 130 },
  { key: 'tac', icon: '📋', label: 'TACT',  ix: 200, nx: 230 },
  { key: 'psy', icon: '💡', label: 'PSYCH', ix: 300, nx: 330 },
];
const FF = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif';
const FB = "'Arial Black', Impact, 'Helvetica Neue', sans-serif";

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

        {/* 사진 영역 */}
        <rect y="130" width="400" height="320" fill={`url(#pg${uid})`} />
        {photoUrl
          ? <image href={photoUrl} x="0" y="130" width="400" height="320" preserveAspectRatio="xMidYMid slice" />
          : <text fontFamily={FF} fontSize="16" fill="white" fillOpacity="0.5">
              <tspan x="165" y="300.32">플레이어 사진</tspan>
            </text>
        }

        {/* ── 정보 흰 바 (전체 너비) ── */}
        <rect x="0" y="450" width="400" height="100" fill="white" />

        {/* 로고 박스 */}
        <rect x="10" y="457" width="78" height="86" rx="6" fill="#F0F0F0" />
        {academyLogoUrl
          ? <image href={academyLogoUrl} x="10" y="457" width="78" height="86" preserveAspectRatio="xMidYMid meet" />
          : <image href="/brand/fdl-logo.svg" x="10" y="457" width="78" height="86" preserveAspectRatio="xMidYMid meet" />
        }

        {/* 아카데미명 */}
        <text fontFamily={FF} fontSize="10" fill="#666666">
          <tspan x="100" y="474">{academyName}</tspan>
        </text>

        {/* 선수 이름 (한국어) */}
        <text fontFamily={FF} fontSize="27" fontWeight="900" fill="black">
          <tspan x="100" y="507">{playerName}</tspan>
        </text>

        {/* 영문 이름 */}
        {playerNameEn && (
          <text fontFamily={FF} fontSize="11" fill="#888888">
            <tspan x="100" y="524">{playerNameEn}</tspan>
          </text>
        )}

        {/* 나이 */}
        <text fontFamily={FF} fontSize="9" fill="#666666">
          <tspan x="385" y="474" textAnchor="end">AGE</tspan>
        </text>
        <text fontFamily={FF} fontSize="28" fontWeight="900" fill="black">
          <tspan x="390" y="509" textAnchor="end">{age}</tspan>
        </text>

        {/* ── 스탯 섹션 (y=550~655) ── */}
        <rect y="550" width="400" height="105" fill="#29ED73" />
        <text fontFamily={FF} fontSize="11" fontWeight="bold" fill="black">
          <tspan x="15" y="568">👤 MY STATS</tspan>
        </text>
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="15" y="583">{hw}</tspan>
          </text>
        )}

        {ROW1.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="597">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="22" fontWeight="900" fill="black"><tspan x={nx} y="600">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="8" fontWeight="bold" fill="black"><tspan x={nx} y="613">{label}</tspan></text>
          </g>
        ))}
        {ROW2.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="636">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="22" fontWeight="900" fill="black"><tspan x={nx} y="639">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="8" fontWeight="bold" fill="black"><tspan x={nx} y="652">{label}</tspan></text>
          </g>
        ))}

        {/* ── FDL 인증 바 (y=655~700) ── */}
        <rect x="0" y="655" width="400" height="45" fill="#0d0d0d" />
        <line x1="0" y1="655" x2="400" y2="655" stroke="#29ED73" strokeWidth="0.8" strokeOpacity="0.5" />
        <text fontFamily={FB} fontSize="22" fontWeight="900" fill="white" textAnchor="middle" letterSpacing="5">
          <tspan x="200" y="675">FDL</tspan>
        </text>
        <text fontFamily={FB} fontSize="7" fontWeight="700" fill="#29ED73" textAnchor="middle" letterSpacing="3">
          <tspan x="200" y="689">FOOTBALLDATALAB</tspan>
        </text>
        <text fontFamily={FF} fontSize="5.5" fill="white" fillOpacity="0.35" textAnchor="middle" letterSpacing="2">
          <tspan x="200" y="699">CERTIFIED CARD</tspan>
        </text>
      </g>
    </svg>
  );
}
