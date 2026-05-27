import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share2, ChevronRight } from 'lucide-react';
import SvgCardFront from '../../components/card/SvgCardFront';
import SvgCardBack from '../../components/card/SvgCardBack';
import { C, ff, radius } from '../../tokens';
import { getCardByToken } from '../../services/cards.service';
import { calcOverall, determineGrade } from '../../lib/utils';

export default function CardSharePage() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [card, setCard]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    getCardByToken(token)
      .then(setCard)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${card?.players?.name} — FDL CARD`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      await navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) return <LoadingScreen />;
  if (notFound) return <NotFoundScreen navigate={navigate} />;

  const player  = card.players;
  const stats   = card.stats;
  const ovr     = calcOverall(stats);
  const grade   = determineGrade(ovr);
  const academy = { name: player?.academy_name || 'FDL FC' };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.white, fontFamily: ff.body }}>
      <style>{`
        @keyframes card-reveal { 0%{opacity:0;transform:scale(0.88) translateY(24px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes glow-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        .share-btn:hover { opacity: 0.85 !important; transform: translateY(-1px); }
      `}</style>

      {/* 배경 글로우 */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${grade.glow.replace('0.', '0.06,').replace(')', '')} 0%, transparent 70%)`,
        animation: 'glow-pulse 4s ease-in-out infinite',
      }} />

      {/* 상단 바 */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px',
        background: `${C.bg}e0`, backdropFilter: 'blur(16px)',
        borderBottom: `1px solid rgba(255,215,0,0.07)`,
      }}>
        <div style={{ fontSize: 15, fontWeight: 900, color: C.gold, fontFamily: ff.display, letterSpacing: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}>
          ⚽ FDL CARD
        </div>
        <button onClick={() => navigate('/signup')}
          style={{ background: 'linear-gradient(135deg, #FFD700, #C8A951)', color: C.bg, border: 'none', borderRadius: 8, padding: '6px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
          나도 만들기 <ChevronRight size={13} />
        </button>
      </header>

      <div style={{ paddingTop: 68, paddingBottom: 60, position: 'relative', zIndex: 1 }}>
        {/* 등급 배너 */}
        <div style={{
          textAlign: 'center', padding: '18px 20px 10px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${grade.color}18`, border: `1px solid ${grade.color}55`,
            borderRadius: 20, padding: '5px 14px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: grade.color, boxShadow: `0 0 6px ${grade.color}` }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: grade.color, letterSpacing: 1.5 }}>
              {grade.name}
            </span>
            <span style={{ fontSize: 11, color: `${grade.color}88` }}>OVR {ovr}</span>
          </div>
          <div style={{ fontSize: 13, color: C.sub }}>
            {player?.name}의 FDL 선수카드
          </div>
        </div>

        {/* 카드 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, padding: '10px 20px 0' }}>
          {/* 앞/뒷면 토글 */}
          <div style={{
            display: 'flex', background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 20, padding: 3, gap: 2,
          }}>
            {['앞면', '뒷면'].map((label, i) => (
              <button key={label} onClick={() => setShowBack(i === 1)}
                style={{
                  background: showBack === (i === 1) ? grade.color : 'transparent',
                  color: showBack === (i === 1) ? C.bg : C.sub,
                  border: 'none', borderRadius: 16, padding: '5px 18px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* 카드 캔버스 */}
          <div style={{ animation: 'card-reveal 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            {showBack ? (
              <SvgCardBack
                jerseyNumber={player?.jersey_number ? String(player.jersey_number) : ''}
                position={player?.position || ''}
                pac={stats.pac} dri={stats.dri} phy={stats.phy}
                acc={stats.acc} tac={stats.tac} psy={stats.psy}
                playerName={player?.name || ''}
                academyName={academy?.name || 'FDL FC'}
                scale={0.78}
              />
            ) : (
              <SvgCardFront
                cardType="THE"
                cardLabel={(player?.name || '').toUpperCase()}
                jerseyNumber={player?.jersey_number ? String(player.jersey_number) : ''}
                position={player?.position || ''}
                photoUrl={player?.photo_url || ''}
                playerName={player?.name || ''}
                academyName={academy?.name || 'FDL FC'}
                age={player?.age || ''}
                pac={stats.pac} dri={stats.dri} phy={stats.phy}
                acc={stats.acc} tac={stats.tac} psy={stats.psy}
                scale={0.78}
              />
            )}
          </div>
        </div>

        {/* 선수 정보 */}
        <div style={{ padding: '20px 24px 0', maxWidth: 400, margin: '0 auto' }}>
          <div style={{
            background: C.card, border: `1px solid ${grade.color}30`,
            borderRadius: radius.xl, padding: '18px 20px',
            boxShadow: `0 0 30px ${grade.color}12`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.white }}>{player?.name}</div>
                <div style={{ fontSize: 13, color: C.sub, marginTop: 2 }}>
                  {player?.position} · No.{player?.jersey_number} · {player?.age}세
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: grade.color, fontFamily: ff.display, lineHeight: 1, textShadow: `0 0 20px ${grade.glow}` }}>
                  {ovr}
                </div>
                <div style={{ fontSize: 9, color: grade.color, fontWeight: 800, letterSpacing: 1 }}>OVERALL</div>
              </div>
            </div>

            {/* 스탯 6개 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 8px' }}>
              {[
                { label: 'PAC', val: stats.pac },
                { label: 'DRI', val: stats.dri },
                { label: 'PHY', val: stats.phy },
                { label: 'ACC', val: stats.acc },
                { label: 'TACT', val: stats.tac },
                { label: 'PSYCH', val: stats.psy },
              ].map(({ label, val }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 7, color: grade.color, fontWeight: 800, letterSpacing: 0.5, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: C.white, lineHeight: 1 }}>{val}</div>
                  <div style={{ height: 3, background: `${grade.color}22`, borderRadius: 2, marginTop: 3 }}>
                    <div style={{ height: '100%', width: `${val}%`, background: grade.color, borderRadius: 2, opacity: 0.8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div style={{ padding: '16px 24px 0', maxWidth: 400, margin: '0 auto' }}>
          <button className="share-btn" onClick={handleShare}
            style={{
              width: '100%', background: `linear-gradient(135deg, ${grade.color}22, ${grade.color}10)`,
              border: `1px solid ${grade.color}50`,
              borderRadius: radius.lg, padding: '13px 0',
              color: grade.color, fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'all 0.2s',
            }}>
            <Share2 size={16} />
            {copied ? '복사됨 ✓' : '링크 공유'}
          </button>
        </div>

        {/* 하단 CTA */}
        <div style={{
          margin: '28px 24px 0', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto',
          background: `linear-gradient(135deg, rgba(255,215,0,0.07), rgba(255,215,0,0.03))`,
          border: `1px solid rgba(255,215,0,0.2)`,
          borderRadius: radius.xl, padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 6 }}>
            나도 선수카드 만들기
          </div>
          <div style={{ fontSize: 12, color: C.sub, marginBottom: 14, lineHeight: 1.5 }}>
            우리 아카데미 선수들에게<br />프로선수 같은 감동을 선물하세요
          </div>
          <button onClick={() => navigate('/signup')}
            style={{
              width: '100%', background: 'linear-gradient(135deg, #FFD700, #C8A951)',
              color: C.bg, border: 'none', borderRadius: radius.md,
              padding: '12px 0', fontSize: 14, fontWeight: 800,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
            아카데미 무료로 시작하기 →
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: `3px solid rgba(255,215,0,0.15)`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ fontSize: 14, color: C.sub }}>카드를 불러오는 중...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function NotFoundScreen({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ fontSize: 52 }}>⚽</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: C.white }}>카드를 찾을 수 없습니다</div>
      <div style={{ fontSize: 14, color: C.sub, textAlign: 'center' }}>링크가 만료되었거나 잘못된 주소입니다.</div>
      <button onClick={() => navigate('/')}
        style={{ marginTop: 8, background: C.gold, color: C.bg, border: 'none', borderRadius: 10, padding: '11px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
        홈으로 돌아가기
      </button>
    </div>
  );
}
