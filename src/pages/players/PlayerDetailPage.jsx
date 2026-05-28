import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2, Share2, ChevronRight } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import BgRemovalStatus from '../../components/player/BgRemovalStatus';
import { C, ff, radius } from '../../tokens';
import { getPlayer, deletePlayer } from '../../services/players.service';
import { calcOverall, determineGrade, formatDate } from '../../lib/utils';

const POSITION_COLORS = {
  GK:'#FF9800', CB:'#2196F3', LB:'#2196F3', RB:'#2196F3',
  CDM:'#9C27B0', CM:'#9C27B0', CAM:'#E91E63',
  LW:'#4CAF50', RW:'#4CAF50', ST:'#F44336', CF:'#F44336',
};

const STAT_LABELS = {
  pac: 'PAC', dri: 'DRI', phy: 'PHY',
  acc: 'ACC', tac: 'TACT', psy: 'PSYCH',
};

export default function PlayerDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [player, setPlayer]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlayer(id).then((p) => { setPlayer(p); setLoading(false); });
  }, [id]);

  async function handleDelete() {
    if (!confirm(`${player.name} 선수를 삭제하시겠습니까?`)) return;
    try {
      await deletePlayer(id);
      navigate('/players');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다: ' + err.message);
    }
  }

  if (loading) return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 14 }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </AppShell>
  );
  if (!player) return (
    <AppShell>
      <div style={{ padding: 40, textAlign: 'center', color: C.red }}>선수를 찾을 수 없습니다.</div>
    </AppShell>
  );

  const cards      = player.player_cards || [];
  const latestCard = cards[0];
  const latestStats = latestCard?.stats;
  const ovr         = latestStats ? calcOverall(latestStats) : 0;
  const grade       = ovr > 0 ? determineGrade(ovr) : null;

  return (
    <AppShell>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fade-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Topbar
        title={player.name}
        back
        right={
          <button onClick={handleDelete}
            style={{ background: 'none', border: 'none', color: C.red, cursor: 'pointer', padding: 8, opacity: 0.7 }}>
            <Trash2 size={18} />
          </button>
        }
      />

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* ── 히어로 프로필 카드 ── */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* 배경 글로우 */}
          {grade && (
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse 80% 60% at 30% 50%, ${grade.glow.replace(/[\d.]+\)$/, '0.12)')}, transparent)`,
            }} />
          )}

          <div style={{ padding: '20px 20px 0', display: 'flex', gap: 16, alignItems: 'flex-start', position: 'relative' }}>
            {/* 선수 사진 */}
            <div style={{
              width: 100, height: 130, borderRadius: radius.lg,
              overflow: 'hidden', flexShrink: 0,
              border: grade ? `2px solid ${grade.color}55` : `2px solid ${C.border}`,
              boxShadow: grade ? `0 0 20px ${grade.glow.replace(/[\d.]+\)$/, '0.25)')}` : 'none',
              background: C.card2,
            }}>
              {(player.photo_bg_removed_url || player.photo_url) ? (
                <img src={player.photo_bg_removed_url || player.photo_url} alt={player.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: C.dim }}>
                  ⚽
                </div>
              )}
            </div>

            {/* 선수 정보 */}
            <div style={{ flex: 1, paddingTop: 4 }}>
              {/* 등급 + 포지션 배지 행 */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  background: POSITION_COLORS[player.position] || C.gold,
                  color: '#fff', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 4,
                }}>{player.position}</span>
                {grade && (
                  <span style={{
                    background: `${grade.color}18`, border: `1px solid ${grade.color}55`,
                    color: grade.color, fontSize: 10, fontWeight: 800,
                    padding: '2px 8px', borderRadius: 4, letterSpacing: 0.5,
                  }}>{grade.name}</span>
                )}
                <span style={{ fontSize: 10, color: C.sub, padding: '2px 0' }}>#{player.jersey_number}</span>
              </div>

              <div style={{ fontSize: 24, fontWeight: 900, color: C.white, marginBottom: 4 }}>{player.name}</div>

              {/* OVR 크게 */}
              {ovr > 0 && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{
                    fontSize: 44, fontWeight: 900, fontFamily: ff.display, lineHeight: 1,
                    color: grade?.color || C.gold,
                    textShadow: grade ? `0 0 20px ${grade.glow}` : 'none',
                  }}>{ovr}</span>
                  <span style={{ fontSize: 11, color: C.sub, fontWeight: 700, letterSpacing: 1 }}>OVERALL</span>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {player.age && <span style={{ fontSize: 12, color: C.sub }}>{player.age}세</span>}
                <BgRemovalStatus status={player.bg_removal_status} />
              </div>
            </div>
          </div>

          {/* 스탯 바 (최신 카드 기준) */}
          {latestStats && (
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 16px' }}>
                {Object.entries(STAT_LABELS).map(([key, label]) => {
                  const val = latestStats[key] || 0;
                  return (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 9, color: grade?.color || C.sub, fontWeight: 800, letterSpacing: 0.5 }}>{label}</span>
                        <span style={{ fontSize: 12, fontWeight: 900, color: C.white }}>{val}</span>
                      </div>
                      <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${val}%`,
                          background: grade ? `linear-gradient(90deg, ${grade.color}88, ${grade.color})` : C.gold,
                          borderRadius: 2, transition: 'width 0.8s ease',
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── 빠른 액션 ── */}
        <div style={{ padding: '0 20px 20px', display: 'flex', gap: 10 }}>
          <Btn onClick={() => navigate(`/cards/create/${player.id}`)} style={{ flex: 2 }}>
            <Plus size={15} /> 카드 만들기
          </Btn>
          {latestCard?.share_token && (
            <Btn variant="ghost" onClick={() => navigate(`/c/${latestCard.share_token}`)} style={{ flex: 1 }}>
              <Share2 size={14} /> 공유
            </Btn>
          )}
        </div>

        {/* ── 카드 히스토리 ── */}
        <div style={{ padding: '0 20px 40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.sub, letterSpacing: 1 }}>
              발급된 카드 <span style={{ color: C.white, fontFamily: ff.display }}>{cards.length}</span>
            </div>
          </div>

          {cards.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '44px 20px',
              border: `2px dashed ${C.border}`, borderRadius: radius.xl,
            }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎴</div>
              <div style={{ color: C.sub, fontSize: 14, marginBottom: 16 }}>아직 카드가 없습니다</div>
              <Btn onClick={() => navigate(`/cards/create/${player.id}`)}>
                <Plus size={15} /> 첫 카드 만들기
              </Btn>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cards.map((card, idx) => {
                const cOvr   = card.overall || calcOverall(card.stats || {});
                const cGrade = cOvr > 0 ? determineGrade(cOvr) : null;
                return (
                  <div key={card.id}
                    onClick={() => navigate(`/cards/${card.id}`)}
                    style={{
                      background: C.card,
                      border: `1px solid ${cGrade ? `${cGrade.color}35` : C.border}`,
                      borderRadius: radius.lg, overflow: 'hidden',
                      cursor: 'pointer', display: 'flex', gap: 0,
                      boxShadow: cGrade ? `0 0 16px ${cGrade.glow.replace(/[\d.]+\)$/, '0.08)')}` : 'none',
                      transition: 'all 0.2s',
                      animation: `fade-up 0.3s ease ${idx * 0.06}s both`,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>

                    {/* 미리보기 이미지 or 카드 색 사이드바 */}
                    <div style={{
                      width: 64, background: cGrade ? `linear-gradient(180deg, ${cGrade.color}20, ${cGrade.color}08)` : C.card2,
                      borderRight: `1px solid ${cGrade ? `${cGrade.color}25` : C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {card.preview_url ? (
                        <img src={card.preview_url} alt="카드" style={{ width: 64, height: 90, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ fontSize: 24, fontWeight: 900, color: cGrade?.color || C.gold, fontFamily: ff.display }}>{cOvr}</div>
                      )}
                    </div>

                    {/* 카드 정보 */}
                    <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 3 }}>
                            {card.card_templates?.name || 'FDL 인증카드'}
                          </div>
                          <div style={{ fontSize: 11, color: C.sub }}>
                            {formatDate(card.created_at)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{
                            fontSize: 32, fontWeight: 900, fontFamily: ff.display, lineHeight: 1,
                            color: cGrade?.color || C.gold,
                          }}>{cOvr}</div>
                          {cGrade && (
                            <div style={{ fontSize: 8, color: cGrade.color, fontWeight: 800, letterSpacing: 0.5, marginTop: 2 }}>
                              {cGrade.name}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 미니 스탯 */}
                      {card.stats && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                          {Object.entries(STAT_LABELS).map(([key, label]) => (
                            <div key={key} style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 10, fontWeight: 800, color: C.white }}>{card.stats[key]}</div>
                              <div style={{ fontSize: 7, color: cGrade?.color || C.sub, fontWeight: 700 }}>{label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', paddingRight: 12 }}>
                      <ChevronRight size={16} color={C.dim} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
