import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

// Exact coordinates from 앞면.svg (400×700 viewBox)
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
        {/* 흰색→투명 필터: 로고 PNG 배경을 제거해 그린에 스며들게 */}
        <filter id={`fdlF${uid}`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    -1 0 0 0 1" />
        </filter>
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

        {/* ── 정보 흰 바 (풀너비, 원본 높이 75px 유지) ── */}
        <rect x="0" y="460" width="400" height="75" fill="white" />

        {/* 로고 박스 (조금 더 크게: 55×60 → 66×64) */}
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

        {/* 선수 이름 (더 크고 굵게) */}
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

        {/* ── 스탯 섹션 (원본 좌표 그대로, 높이 150px) ── */}
        <rect y="550" width="400" height="150" fill="#29ED73" />
        <text fontFamily={FF} fontSize="11" fontWeight="bold" fill="black">
          <tspan x="15" y="572.5">👤 MY STATS</tspan>
        </text>
        {hw && (
          <text fontFamily={FF} fontSize="10" fill="black">
            <tspan x="15" y="591.64">{hw}</tspan>
          </text>
        )}

        {ROW1.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="605.88">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="22" fontWeight="900" fill="black"><tspan x={nx} y="609.5">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="8" fontWeight="bold" fill="black"><tspan x={nx} y="622.91">{label}</tspan></text>
          </g>
        ))}
        {ROW2.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="16" fill="black"><tspan x={ix} y="650.88">{icon}</tspan></text>
            <text fontFamily={FF} fontSize="22" fontWeight="900" fill="black"><tspan x={nx} y="654.5">{vals[key]}</tspan></text>
            <text fontFamily={FF} fontSize="8" fontWeight="bold" fill="black"><tspan x={nx} y="667.91">{label}</tspan></text>
          </g>
        ))}

        {/* FDL 로고 — 흰색 배지 없이 그린 배경에 직접 스며들게 */}
        <image
          href="/brand/fdl-logo.png"
          x="8" y="657"
          width="95" height="36"
          preserveAspectRatio="xMidYMid meet"
          filter={`url(#fdlF${uid})`}
        />

        {/* ©FDL (원본 유지) */}
        <text fontFamily={FF} fontSize="7" fill="black" fillOpacity="0.5">
          <tspan x="188" y="694.55">©FDL</tspan>
        </text>
      </g>
    </svg>
  );
}
