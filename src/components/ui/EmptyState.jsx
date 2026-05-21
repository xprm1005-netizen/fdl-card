import { C } from '../../tokens';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: C.sub }}>
      {icon && <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>}
      <h3 style={{ margin: '0 0 8px', fontSize: 18, color: C.white }}>{title}</h3>
      {description && <p style={{ margin: '0 0 24px', fontSize: 14 }}>{description}</p>}
      {action}
    </div>
  );
}
