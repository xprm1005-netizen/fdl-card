import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import { C, ff, radius } from '../../tokens';
import { Trophy, Users, BarChart2, TrendingUp } from 'lucide-react';

const PLANNED = [
  { icon: Users,      label: '포지션별 선수 랭킹',    desc: '포지션별 능력치 TOP 선수 순위' },
  { icon: Trophy,     label: '아카데미 팀 순위',       desc: '전국 아카데미 간 팀 비교' },
  { icon: TrendingUp, label: '능력치 성장 트래킹',     desc: '기간별 선수 성장 그래프' },
  { icon: BarChart2,  label: '통계 대시보드',          desc: '포지션·연령별 평균 능력치' },
];

export default function RankingPage() {
  return (
    <AppShell>
      <Topbar title="랭킹" />
      <div style={{ padding: '40px 20px', maxWidth: 600, margin: '0 auto', textAlign: 'center', fontFamily: ff.body }}>
        {/* Trophy icon */}
        <div style={{
          width: 88, height: 88, margin: '0 auto 24px',
          background: 'rgba(255,215,0,0.08)', borderRadius: '50%',
          border: '2px solid rgba(255,215,0,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Trophy size={40} color={C.gold} />
        </div>

        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, fontWeight: 700, marginBottom: 12 }}>COMING SOON</div>
        <h2 style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 800, color: C.white }}>랭킹 기능 출시 예정</h2>
        <p style={{ margin: '0 0 40px', fontSize: 14, color: C.sub, lineHeight: 1.7 }}>
          선수 능력치 기반 실시간 랭킹,<br />
          아카데미 간 비교 등 다양한 기능을 준비 중입니다.
        </p>

        {/* Planned features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
          {PLANNED.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.lg, padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              opacity: 0.7,
            }}>
              <div style={{
                width: 40, height: 40, background: 'rgba(255,215,0,0.08)',
                borderRadius: radius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={20} color={C.gold} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{label}</div>
                <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{desc}</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 10, color: C.gray, letterSpacing: 1, flexShrink: 0 }}>준비 중</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
