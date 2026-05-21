import { C } from '../../tokens';

export default function Spinner({ size = 32, color = C.gold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <div style={{
        width: size, height: size,
        border: `3px solid ${C.border}`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
