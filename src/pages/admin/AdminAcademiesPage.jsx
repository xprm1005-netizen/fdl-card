import { useEffect, useState } from 'react';
import AdminShell from '../../components/layout/AdminShell';
import Topbar from '../../components/layout/Topbar';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';
import { formatDate } from '../../lib/utils';

export default function AdminAcademiesPage() {
  const [academies, setAcademies] = useState([]);

  useEffect(() => {
    supabase.from('academies').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setAcademies(data || []));
  }, []);

  return (
    <AdminShell>
      <Topbar title="아카데미 목록" />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {academies.map((a) => (
            <div key={a.id} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.lg, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${a.primary_color}20`, border: `2px solid ${a.primary_color}60`, flexShrink: 0, overflow: 'hidden' }}>
                {a.logo_url ? <img src={a.logo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: a.primary_color }}>⚽</div>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{a.name}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>등록일 {formatDate(a.created_at)}</div>
              </div>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: a.primary_color }} />
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
