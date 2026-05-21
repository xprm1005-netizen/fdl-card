import { C, radius } from '../../tokens';

const variants = {
  primary: {
    background: C.gold,
    color: C.bg,
    border: 'none',
    boxShadow: `0 0 24px rgba(255,215,0,0.25)`,
  },
  ghost: {
    background: 'transparent',
    color: C.white,
    border: `1px solid ${C.border}`,
    boxShadow: 'none',
  },
  danger: {
    background: C.red,
    color: C.white,
    border: 'none',
    boxShadow: 'none',
  },
  goldOutline: {
    background: 'transparent',
    color: C.gold,
    border: `1px solid ${C.gold}`,
    boxShadow: `0 0 12px rgba(255,215,0,0.15)`,
  },
};

export default function Btn({ children, variant = 'primary', size = 'md', style = {}, disabled, loading, onClick, type = 'button', fullWidth }) {
  const v = variants[variant] || variants.primary;
  const sz = size === 'sm' ? { fontSize: 13, padding: '8px 16px' }
           : size === 'lg' ? { fontSize: 17, padding: '16px 32px' }
           : { fontSize: 15, padding: '12px 24px' };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...v,
        ...sz,
        borderRadius: radius.md,
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'inherit',
        ...style,
      }}
    >
      {loading ? <Spinner size={16} color={variant === 'primary' ? C.bg : C.gold} /> : children}
    </button>
  );
}

function Spinner({ size = 16, color = C.gold }) {
  return (
    <span style={{
      width: size, height: size,
      border: `2px solid rgba(255,255,255,0.2)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      display: 'inline-block',
    }} />
  );
}
