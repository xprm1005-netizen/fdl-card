import { C, radius } from '../../tokens';

const STATUS = {
  pending:    { color: C.yellow,  bg: C.yellowSoft,  label: '결제 대기' },
  paid:       { color: C.toty,    bg: C.totySoft,    label: '결제 완료' },
  confirmed:  { color: C.gold,    bg: C.goldSoft,    label: '확인 완료' },
  printing:   { color: '#FF9800', bg: 'rgba(255,152,0,0.1)', label: '인쇄 중' },
  shipped:    { color: C.green,   bg: C.greenSoft,   label: '배송 중' },
  delivered:  { color: C.sub,     bg: 'rgba(160,160,160,0.1)', label: '배송 완료' },
  cancelled:  { color: C.red,     bg: C.redSoft,     label: '취소' },
  refunded:   { color: C.red,     bg: C.redSoft,     label: '환불' },
  done:       { color: C.green,   bg: C.greenSoft,   label: '완료' },
  failed:     { color: C.red,     bg: C.redSoft,     label: '실패' },
  processing: { color: '#FF9800', bg: 'rgba(255,152,0,0.1)', label: '처리 중' },
  none:       { color: C.sub,     bg: 'rgba(160,160,160,0.1)', label: '미처리' },
};

export default function Pill({ status, label, style = {} }) {
  const s = STATUS[status] || { color: C.sub, bg: 'rgba(160,160,160,0.1)', label: status };
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: radius.sm,
      fontSize: 12,
      fontWeight: 600,
      color: s.color,
      background: s.bg,
      border: `1px solid ${s.color}40`,
      ...style,
    }}>
      {label || s.label}
    </span>
  );
}
