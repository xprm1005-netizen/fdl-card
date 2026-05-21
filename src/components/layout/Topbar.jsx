import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { C } from '../../tokens';

export default function Topbar({ title, back, right }) {
  const navigate = useNavigate();
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: `${C.surface}ee`,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${C.border}`,
      padding: '0 16px',
      height: 56,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {back && (
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: C.sub, cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <h1 style={{ flex: 1, margin: 0, fontSize: 17, fontWeight: 700, color: C.white }}>{title}</h1>
      {right}
    </header>
  );
}
