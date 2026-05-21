import { C, radius } from '../../tokens';

export default function Input({ label, error, style = {}, ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>{label}</span>}
      <input
        {...props}
        style={{
          background: C.card,
          border: `1px solid ${error ? C.red : C.border}`,
          borderRadius: radius.md,
          color: C.white,
          fontSize: 15,
          padding: '10px 14px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          transition: 'border-color 0.15s',
          ...style,
        }}
        onFocus={(e) => { e.target.style.borderColor = C.gold; props.onFocus?.(e); }}
        onBlur={(e)  => { e.target.style.borderColor = error ? C.red : C.border; props.onBlur?.(e); }}
      />
      {error && <span style={{ fontSize: 12, color: C.red }}>{error}</span>}
    </label>
  );
}

export function Select({ label, error, children, style = {}, ...props }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <span style={{ fontSize: 13, color: C.sub, fontWeight: 500 }}>{label}</span>}
      <select
        {...props}
        style={{
          background: C.card,
          border: `1px solid ${error ? C.red : C.border}`,
          borderRadius: radius.md,
          color: C.white,
          fontSize: 15,
          padding: '10px 14px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          fontFamily: 'inherit',
          cursor: 'pointer',
          ...style,
        }}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: 12, color: C.red }}>{error}</span>}
    </label>
  );
}
