import { useEffect, useState } from 'react';
import AdminShell from '../../components/layout/AdminShell';
import Topbar from '../../components/layout/Topbar';
import Pill from '../../components/ui/Pill';
import { C, radius } from '../../tokens';
import { supabase } from '../../lib/supabase';
import { formatDateTime } from '../../lib/utils';

export default function AdminPrintPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    supabase.from('print_jobs').select('*, orders(order_number, total_amount)').order('created_at', { ascending: false })
      .then(({ data }) => setJobs(data || []));
  }, []);

  return (
    <AdminShell>
      <Topbar title="인쇄 작업" />
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {jobs.length === 0 && <div style={{ color: C.sub, textAlign: 'center', padding: 40 }}>인쇄 작업이 없습니다.</div>}
          {jobs.map((job) => (
            <div key={job.id} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.lg, padding: '16px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{job.orders?.order_number}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{formatDateTime(job.created_at)}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {job.print_file_url && (
                  <a href={job.print_file_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: C.toty, textDecoration: 'none' }}>파일 다운로드</a>
                )}
                <Pill status={job.status} label={{ queued: '대기', sent_to_printer: '전송됨', printing: '인쇄중', done: '완료', failed: '실패' }[job.status]} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
