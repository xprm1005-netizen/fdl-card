import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, UserCircle } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import EmptyState from '../../components/ui/EmptyState';
import BgRemovalStatus from '../../components/player/BgRemovalStatus';
import { C, radius } from '../../tokens';
import { useAuthStore } from '../../store/authStore';
import { getPlayers } from '../../services/players.service';

const POSITION_COLORS = {
  GK: '#FF9800', CB: '#2196F3', LB: '#2196F3', RB: '#2196F3',
  CDM: '#9C27B0', CM: '#9C27B0', CAM: '#E91E63',
  LW: '#4CAF50', RW: '#4CAF50', ST: '#F44336', CF: '#F44336',
};

export default function PlayersPage() {
  const { academy } = useAuthStore();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!academy) return;
    getPlayers(academy.id).then((p) => { setPlayers(p); setLoading(false); });
  }, [academy]);

  const filtered = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <Topbar
        title="선수 관리"
        right={<Btn size="sm" onClick={() => navigate('/players/new')}><Plus size={16} /> 선수 등록</Btn>}
      />
      <div style={{ padding: '20px', maxWidth: 960, margin: '0 auto' }}>
        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} color={C.gray} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="선수명 또는 포지션 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 40px',
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: radius.md, color: C.white, fontSize: 14,
              boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        {!loading && filtered.length === 0 ? (
          <EmptyState
            icon={<UserCircle size={48} color={C.gray} />}
            title={players.length === 0 ? '등록된 선수가 없습니다' : '검색 결과가 없습니다'}
            description={players.length === 0 ? '첫 번째 선수를 등록해보세요!' : undefined}
            action={players.length === 0 ? <Btn onClick={() => navigate('/players/new')}><Plus size={16} /> 선수 등록</Btn> : undefined}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {filtered.map((player) => (
              <div
                key={player.id}
                onClick={() => navigate(`/players/${player.id}`)}
                style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: radius.lg, overflow: 'hidden',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.goldMed; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ height: 140, background: C.card2, position: 'relative', overflow: 'hidden' }}>
                  {player.photo_bg_removed_url || player.photo_url ? (
                    <img
                      src={player.photo_bg_removed_url || player.photo_url}
                      alt={player.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <UserCircle size={60} color={C.dim} />
                    </div>
                  )}
                  <div style={{
                    position: 'absolute', top: 8, left: 8,
                    background: POSITION_COLORS[player.position] || C.gold,
                    color: '#fff', fontSize: 10, fontWeight: 700,
                    padding: '2px 7px', borderRadius: 4, letterSpacing: 0.5,
                  }}>
                    {player.position}
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <BgRemovalStatus status={player.bg_removal_status} />
                  </div>
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 2 }}>{player.name}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>#{player.jersey_number}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
