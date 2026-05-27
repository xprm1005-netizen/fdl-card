import { C, radius } from '../../tokens';

const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'CF', 'ST', 'FW'];

const inputStyle = {
  width: '100%', background: '#1a1a1a', border: `1px solid rgba(255,255,255,0.12)`,
  borderRadius: radius.md, padding: '10px 12px', color: '#fff',
  fontSize: 14, fontFamily: 'inherit', outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: 12, fontWeight: 600, color: C.sub, letterSpacing: 0.5,
  display: 'block', marginBottom: 6,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={labelStyle}>{label}</span>
      {children}
    </div>
  );
}

export default function CardInfoInputPanel({ info, onChange }) {
  function set(key, val) {
    onChange({ ...info, [key]: val });
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Field label="카드 타입 (예: THE)">
          <input
            style={inputStyle}
            value={info.cardType}
            onChange={e => set('cardType', e.target.value)}
            placeholder="THE"
            maxLength={20}
          />
        </Field>
        <Field label="카드 라벨 (예: SPEED KING)">
          <input
            style={inputStyle}
            value={info.cardLabel}
            onChange={e => set('cardLabel', e.target.value)}
            placeholder="SPEED KING"
            maxLength={30}
          />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Field label="등번호">
          <input
            style={inputStyle}
            type="number"
            value={info.jerseyNumber}
            onChange={e => set('jerseyNumber', e.target.value)}
            placeholder="7"
            min={1} max={99}
          />
        </Field>
        <Field label="포지션">
          <select
            style={{ ...inputStyle, cursor: 'pointer' }}
            value={info.position}
            onChange={e => set('position', e.target.value)}
          >
            {POSITIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="선수 소개 (뒷면에 표시)">
        <textarea
          style={{ ...inputStyle, height: 80, resize: 'vertical', lineHeight: 1.5 }}
          value={info.description}
          onChange={e => set('description', e.target.value)}
          placeholder="선수의 특징이나 장점을 입력하세요"
          maxLength={120}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Field label="키 (cm)">
          <input
            style={inputStyle}
            type="number"
            value={info.height}
            onChange={e => set('height', e.target.value)}
            placeholder="170"
            min={100} max={220}
          />
        </Field>
        <Field label="몸무게 (kg)">
          <input
            style={inputStyle}
            type="number"
            value={info.weight}
            onChange={e => set('weight', e.target.value)}
            placeholder="65"
            min={30} max={150}
          />
        </Field>
      </div>
    </div>
  );
}
