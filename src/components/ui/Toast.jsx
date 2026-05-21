import { useState, useCallback, createContext, useContext } from 'react';
import { C, radius } from '../../tokens';

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
  }, []);

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 360 }}>
        {toasts.map((t) => (
          <ToastItem key={t.id} {...t} onClose={() => setToasts((x) => x.filter((i) => i.id !== t.id))} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({ message, type, onClose }) {
  const bg = type === 'success' ? C.greenSoft : type === 'error' ? C.redSoft : 'rgba(255,215,0,0.08)';
  const border = type === 'success' ? C.green : type === 'error' ? C.red : C.gold;
  return (
    <div style={{
      background: C.card, border: `1px solid ${border}40`,
      borderLeft: `3px solid ${border}`,
      borderRadius: radius.md,
      padding: '12px 16px',
      color: C.white, fontSize: 14,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      animation: 'slideIn 0.2s ease',
    }}>
      {message}
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', fontSize: 16, padding: 0 }}>×</button>
      <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>
    </div>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
