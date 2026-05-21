import { C, radius } from '../../tokens';
import Spinner from '../ui/Spinner';

export default function BgRemovalStatus({ status, onRetry }) {
  if (status === 'done') return (
    <span style={{ fontSize: 12, color: C.green, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
      ✓ 누끼 완료
    </span>
  );

  if (status === 'processing' || status === 'pending') return (
    <span style={{ fontSize: 12, color: C.yellow, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
      <Spinner size={14} color={C.yellow} />
      누끼 처리 중...
    </span>
  );

  if (status === 'failed') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>누끼 처리 실패</span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            fontSize: 11, color: C.gold,
            background: C.goldSoft, border: `1px solid ${C.goldMed}`,
            borderRadius: radius.sm, padding: '2px 8px',
            cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          재시도
        </button>
      )}
    </div>
  );

  return null;
}
