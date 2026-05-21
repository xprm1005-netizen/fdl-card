import { useEffect, useState } from 'react';
import AdminShell from '../../components/layout/AdminShell';
import Topbar from '../../components/layout/Topbar';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';

const TEMPLATE_COLORS = { gold: '#FFD700', toty: '#00E5FF', chrome: '#B0C4DE', legend: '#E040FB' };

export default function AdminTemplatesPage() {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    supabase.from('card_templates').select('*').order('sort_order').then(({ data }) => setTemplates(data || []));
  }, []);

  async function toggleActive(t) {
    await supabase.from('card_templates').update({ is_active: !t.is_active }).eq('id', t.id);
    setTemplates((ts) => ts.map((x) => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
  }

  return (
    <AdminShell>
      <Topbar title="카드 템플릿 관리" />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {templates.map((t) => {
            const color = TEMPLATE_COLORS[t.slug] || C.gold;
            return (
              <div key={t.id} style={{
                background: C.card, border: `1px solid ${t.is_active ? color + '40' : C.border}`,
                borderRadius: radius.lg, overflow: 'hidden', opacity: t.is_active ? 1 : 0.5,
              }}>
                <div style={{ height: 120, background: `linear-gradient(135deg, ${color}15, transparent)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 28, fontFamily: "'Bebas Neue', Impact, sans-serif", color }}>{t.name}</span>
                </div>
                <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: C.sub }}>sort: {t.sort_order}</div>
                  </div>
                  <button
                    onClick={() => toggleActive(t)}
                    style={{
                      padding: '5px 14px', borderRadius: 20,
                      background: t.is_active ? C.green : C.border,
                      color: t.is_active ? '#000' : C.sub,
                      border: 'none', cursor: 'pointer',
                      fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                    }}
                  >
                    {t.is_active ? '활성' : '비활성'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
