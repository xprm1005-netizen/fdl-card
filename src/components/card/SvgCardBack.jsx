import { useId } from 'react';
import { calcOverall } from '../../lib/utils';

// Exact coordinates from 뒷면.svg (400×700 viewBox)
// Field bounds for position indicator
const FIELD = { l: 62, r: 338, t: 237, b: 393 };

const BACK_STATS = [
  { key: 'pac', icon: '🏃', label: 'PAC',   ix: 25,  nx: 43  },
  { key: 'dri', icon: '⚽', label: 'DRI',   ix: 85,  nx: 103 },
  { key: 'phy', icon: '🔥', label: 'PHY',   ix: 145, nx: 163 },
  { key: 'acc', icon: '🎯', label: 'ACC',   ix: 205, nx: 223 },
  { key: 'tac', icon: '📋', label: 'TACT',  ix: 265, nx: 283 },
  { key: 'psy', icon: '💡', label: 'PSYCH', ix: 325, nx: 343 },
];

const POS_LABEL = {
  GK: 'GOAL KEEPER',    CB: 'CENTER - BACK',  LB: 'LEFT - BACK',
  RB: 'RIGHT - BACK',   CDM: 'DEFENSIVE MID', CM: 'CENTER - MID',
  CAM: 'ATTACKING MID', LW: 'LEFT WING',      RW: 'RIGHT WING',
  CF: 'CENTER FORWARD', ST: 'STRIKER',        FW: 'FORWARD',
  MF: 'MIDFIELDER',     DF: 'DEFENDER',
};

// Position ratios: [x (0=defense→1=attack), y (0=top→1=bottom)]
const POS_XY = {
  GK:  [0.05, 0.50], CB:  [0.35, 0.50], LB:  [0.25, 0.18],
  RB:  [0.25, 0.82], CDM: [0.45, 0.50], CM:  [0.50, 0.50],
  CAM: [0.60, 0.50], LW:  [0.72, 0.18], RW:  [0.72, 0.82],
  CF:  [0.80, 0.50], ST:  [0.88, 0.50], FW:  [0.80, 0.50],
  MF:  [0.50, 0.50], DF:  [0.25, 0.50],
};

const POS_TIP = {
  GK:  '반응 속도와 포지셔닝 훈련으로 골문을 더욱 안전하게 지켜보세요.',
  CB:  '달리기와 점프 운동으로 체력의 기초를 키워보세요.',
  LB:  '측면 드리블 훈련으로 공격 가담 능력을 높여보세요.',
  RB:  '측면 드리블 훈련으로 공격 가담 능력을 높여보세요.',
  CDM: '볼 탈취와 빌드업으로 중원 장악력을 높여보세요.',
  CM:  '패스와 드리블 훈련으로 중원의 핵심이 되어보세요.',
  CAM: '패스와 슈팅 훈련으로 득점 기회를 만들어보세요.',
  LW:  '1대1 드리블 훈련으로 측면 돌파력을 높여보세요.',
  RW:  '1대1 드리블 훈련으로 측면 돌파력을 높여보세요.',
  CF:  '움직임과 결정력 훈련으로 공격의 기점이 되어보세요.',
  ST:  '슈팅 훈련으로 득점력을 극대화해보세요.',
  FW:  '슈팅과 드리블로 득점 능력을 향상시켜보세요.',
  MF:  '패스와 체력 훈련으로 경기를 지배해보세요.',
  DF:  '포지셔닝 훈련으로 수비 안정성을 높여보세요.',
};

const FF = '"Inter", -apple-system, sans-serif';

export default function SvgCardBack({
  position = 'CM',
  pac = 70, dri = 70, phy = 70,
  acc = 70, tac = 70, psy = 70,
  description = '',
  height = '',
  weight = '',
  jerseyNumber = '',
  issueDate = '',
  scale = 1,
  // unused props accepted for API compatibility
  playerName,
  academyName,
}) {
  const uid   = useId().replace(/[^a-z0-9]/gi, '');
  const stats = { pac, dri, phy, acc, tac, psy };
  const ovr   = calcOverall(stats);

  // NEXT GOAL: boost the single lowest stat by +2
  const lowestKey = Object.keys(stats).reduce((a, b) => stats[a] <= stats[b] ? a : b);
  const nextStats = { ...stats, [lowestKey]: Math.min(stats[lowestKey] + 2, 99) };
  const nextOvr   = calcOverall(nextStats);

  // Position indicator
  const [prx, pry] = POS_XY[position] || [0.5, 0.5];
  const indX = FIELD.l + (FIELD.r - FIELD.l) * prx;
  const indY = FIELD.t + (FIELD.b - FIELD.t) * pry;

  const posLabel = POS_LABEL[position] || position;
  const tip      = description || POS_TIP[position] || '';
  const cardNo   = jerseyNumber ? String(jerseyNumber) : '—';
  const date     = issueDate || new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).replace(/\. /g, '.').replace(/\.$/, '');

  return (
    <svg
      width={400 * scale}
      height={700 * scale}
      viewBox="0 0 400 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={`bc${uid}`}>
          <rect width="400" height="700" rx="16" />
        </clipPath>
      </defs>

      <g clipPath={`url(#bc${uid})`}>
        <rect width="400" height="700" rx="16" fill="black" />

        {/* ── NEXT GOAL 바 ── */}
        <rect x="15" y="20" width="370" height="50" rx="8" fill="#29ED73" />
        <text fontFamily={FF} fontSize="13" fontWeight="bold" fill="black">
          <tspan x="30" y="50.73">🚀 NEXT GOAL</tspan>
        </text>
        <text fontFamily={FF} fontSize="24" fontWeight="900" fill="black">
          <tspan x="305" y="55.23">{nextOvr}</tspan>
        </text>
        <text fontFamily={FF} fontSize="10" fontWeight="bold" fill="black">
          <tspan x="345" y="51.64">(▲2)</tspan>
        </text>

        {/* ── 현재 스탯 바 ── */}
        <rect x="15" y="75" width="370" height="50" rx="8" fill="white" />
        {BACK_STATS.map(({ key, icon, label, ix, nx }) => (
          <g key={key}>
            <text fontFamily={FF} fontSize="12">
              <tspan x={ix} y="98.16">{icon}</tspan>
            </text>
            <text fontFamily={FF} fontSize="18" fontWeight="900" fill="black">
              <tspan x={nx} y="102.55">{stats[key]}</tspan>
            </text>
            <text fontFamily={FF} fontSize="7" fontWeight="bold" fill="black" fillOpacity="0.6">
              <tspan x={ix} y="114.55">{label}</tspan>
            </text>
            {key === lowestKey && (
              <text fontFamily={FF} fontSize="7" fontWeight="bold" fill="black">
                <tspan x={nx} y="114.55">(▲2)</tspan>
              </text>
            )}
          </g>
        ))}

        {/* ── 스탯 설명 바 ── */}
        <rect x="15" y="130" width="370" height="50" rx="8" fill="white" />
        <text fontFamily={FF} fontSize="7" fill="black"><tspan x="25"  y="148.55">• PAC - 스피드·순발력</tspan></text>
        <text fontFamily={FF} fontSize="7" fill="black"><tspan x="150" y="148.55">• DRI - 드리블 능력</tspan></text>
        <text fontFamily={FF} fontSize="7" fill="black"><tspan x="275" y="148.55">• PHY - 점프력·지구력</tspan></text>
        <text fontFamily={FF} fontSize="7" fill="black"><tspan x="25"  y="166.55">• ACC - 정확도·결정력</tspan></text>
        <text fontFamily={FF} fontSize="7" fill="black"><tspan x="150" y="166.55">• TACT - 전술 능력</tspan></text>
        <text fontFamily={FF} fontSize="7" fill="black"><tspan x="275" y="166.55">• PSYCH - 멘탈 능력</tspan></text>

        {/* ── 피치 컨테이너 ── */}
        <rect x="15.75" y="195.75" width="368.5" height="278.5" rx="7.25" fill="black" stroke="#29ED73" strokeWidth="1.5" />
        <text fontFamily={FF} fontSize="12" fontWeight="bold" fill="#29ED73">
          <tspan x="30" y="221.86">🏆 TRAINING POINT</tspan>
        </text>

        {/* 피치 라인 (뒷면.svg 원본 path 그대로) */}
        <path d="M338 237H62V393H338V237Z" stroke="#29ED73" strokeWidth="2" />
        <path d="M200 237V393" stroke="#29ED73" strokeWidth="2" />
        <path d="M200 340C213.807 340 225 328.807 225 315C225 301.193 213.807 290 200 290C186.193 290 175 301.193 175 315C175 328.807 186.193 340 200 340Z" stroke="#29ED73" strokeWidth="2" />
        <path d="M200 317C201.105 317 202 316.105 202 315C202 313.895 201.105 313 200 313C198.895 313 198 313.895 198 315C198 316.105 198.895 317 200 317Z" fill="#29ED73" />
        <path d="M102 270H62V360H102V270Z" stroke="#29ED73" strokeWidth="2" />
        <path d="M77 290H62V340H77V290Z" stroke="#29ED73" strokeWidth="2" />
        <path d="M338 270H298V360H338V270Z" stroke="#29ED73" strokeWidth="2" />
        <path d="M338 290H323V340H338V290Z" stroke="#29ED73" strokeWidth="2" />

        {/* 포지션 인디케이터 */}
        <circle cx={indX} cy={indY} r="13" fill="#888888" fillOpacity="0.7" />

        {/* 포지션 텍스트 */}
        <text fontFamily={FF} fontSize="22" fontWeight="900" fill="#29ED73" textAnchor="middle">
          <tspan x="200" y="436.5">{posLabel}</tspan>
        </text>

        {/* 구분선 */}
        <line x1="30" y1="459.5" x2="370" y2="459.5" stroke="#29ED73" strokeOpacity="0.3" />

        {/* ── TIP 박스 ── */}
        <rect x="15.75" y="490.75" width="368.5" height="88.5" rx="7.25" fill="black" stroke="#29ED73" strokeWidth="1.5" />
        <text fontFamily={FF} fontSize="12" fontWeight="bold" fill="#29ED73">
          <tspan x="30" y="516.86">📍 TIP</tspan>
        </text>
        <text fontFamily={FF} fontSize="11" fill="white">
          <tspan x="30" y="550.5">{tip}</tspan>
        </text>

        {/* ── 카드 번호 바 ── */}
        <rect x="15.75" y="600.75" width="368.5" height="33.5" rx="16.75" fill="black" stroke="#29ED73" strokeWidth="1.5" />
        <text fontFamily={FF} fontSize="9" fontWeight="bold" fill="#29ED73">
          <tspan x="35" y="620.77">NO.</tspan>
        </text>
        <text fontFamily={FF} fontSize="10" fill="white">
          <tspan x="65" y="621.64">{cardNo}</tspan>
        </text>
        <text fontFamily={FF} fontSize="9" fontWeight="bold" fill="#29ED73">
          <tspan x="270" y="620.77">DATE</tspan>
        </text>
        <text fontFamily={FF} fontSize="10" fill="white">
          <tspan x="305" y="621.64">{date}</tspan>
        </text>

        {/* ── FDL 푸터 ── */}
        <text fontFamily={FF} fontSize="20" fontWeight="900" fill="#29ED73">
          <tspan x="181.11" y="674.27">FDL</tspan>
        </text>
        <text fontFamily={FF} fontSize="6" fontWeight="bold" fill="white" fillOpacity="0.5">
          <tspan x="168.62" y="685.68">FOOTBALL DATA LAB</tspan>
        </text>
      </g>
    </svg>
  );
}
