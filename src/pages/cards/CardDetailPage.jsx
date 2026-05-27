import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Edit3, Share2, Copy, Check } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import Topbar from '../../components/layout/Topbar';
import Btn from '../../components/ui/Btn';
import SvgCardFront from '../../components/card/SvgCardFront';
import SvgCardBack from '../../components/card/SvgCardBack';
import { C, ff, radius } from '../../tokens';
import { getCard } from '../../services/cards.service';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { calcOverall, determineGrade } from '../../lib/utils';

const PRICES = { 1: 6900, 5: 24900, 11: 49900, 20: 89000 };

export default function CardDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { academy } = useAuthStore();
  const addItem    = useCartStore((s) => s.addItem);
  const [card, setCard]         = useState(null);
  const [showBack, setShowBack] = useState(false);
  const [copied, setCopied]     = useState(false);

  useEffect(() => { getCard(id).then(setCard); }, [id]);

  async function handleCopyLink() {
    const token = card?.share_token;
    if (!token) return;
    const url = `${window.location.origin}/c/${token}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${card?.players?.name} — FDL CARD`, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      await navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!card) return (
    <AppShell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${C.border}`, borderTopColor: C.gold, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </AppShell>
  );

  const stats   = card.stats;
  const ovr     = calcOverall(stats);
  const grade   = determineGrade(ovr);
  const player  = card.players;
  const shareUrl = card.share_token ? `${window.location.origin}/c/${card.share_token}` : null;

  return (
    <AppShell>
      <Topbar title="카드 상세" back />
      <div style={{ padding: '20px 20px 40px', maxWidth: 520, margin: '0 auto' }}>

        {/* 등급 배지 */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: `${grade.color}18`, border: `1px solid ${grade.color}55`,
            borderRadius: 20, padding: '5px 14px',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: grade.color, boxShadow: `0 0 6px ${grade.color}` }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: grade.color, letterSpacing: 1.5 }}>{grade.name}</span>
            <span style={{ fontSize: 11, color: `${grade.color}88` }}>OVR {ovr}</span>
          </div>
        </div>

        {/* 앞/뒷면 토글 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 3, gap: 2 }}>
            {['앞면', '뒷면'].map((label, i) => (
              <button key={label} onClick={() => setShowBack(i === 1)}
                style={{
                  background: showBack === (i === 1) ? grade.color : 'transparent',
                  color: showBack === (i === 1) ? C.bg : C.sub,
                  border: 'none', borderRadius: 16, padding: '5px 20px',
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 카드 미리보기 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          {showBack ? (
            <SvgCardBack
              jerseyNumber={player?.jersey_number ? String(player.jersey_number) : ''}
              position={player?.position || ''}
              pac={stats.pac} dri={stats.dri} phy={stats.phy}
              acc={stats.acc} tac={stats.tac} psy={stats.psy}
              playerName={player?.name || ''}
              academyName={academy?.name || ''}
              scale={0.82}
            />
          ) : (
            <SvgCardFront
              cardType="THE"
              cardLabel={(player?.name || '').toUpperCase()}
              jerseyNumber={player?.jersey_number ? String(player.jersey_number) : ''}
              position={player?.position || ''}
              photoUrl={player?.photo_url || ''}
              academyLogoUrl={academy?.logo_url || '/brand/fdl-logo.svg'}
              playerName={player?.name || ''}
              academyName={academy?.name || ''}
              age={player?.age || ''}
              pac={stats.pac} dri={stats.dri} phy={stats.phy}
              acc={stats.acc} tac={stats.tac} psy={stats.psy}
              scale={0.82}
            />
          )}
        </div>

        {/* 공유 링크 박스 */}
        {shareUrl && (
          <div style={{
            background: C.card, border: `1px solid ${grade.color}30`,
            borderRadius: radius.lg, padding: '14px 16px',
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, color: C.sub, marginBottom: 8, letterSpacing: 0.5 }}>🔗 공개 공유 링크</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                flex: 1, background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: radius.sm, padding: '8px 10px',
                fontSize: 11, color: C.gray,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {shareUrl}
              </div>
              <button onClick={handleCopyLink}
                style={{
                  flexShrink: 0,
                  background: copied ? `${C.green}20` : `${grade.color}18`,
                  border: `1px solid ${copied ? C.green : grade.color}55`,
                  borderRadius: radius.sm, padding: '8px 14px',
                  color: copied ? C.green : grade.color,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.2s',
                }}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? '복사됨' : '복사'}
              </button>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <Btn variant="ghost" onClick={handleCopyLink} fullWidth>
              <Share2 size={15} />
              {copied ? '공유됨 ✓' : '공유하기'}
            </Btn>
          </div>
          <Btn onClick={() => { addItem(card, PRICES[1]); navigate('/cart'); }} fullWidth>
            <ShoppingCart size={17} /> 실물 카드 주문 — {PRICES[1].toLocaleString()}원/장
          </Btn>
          <Btn variant="ghost" onClick={() => navigate(`/cards/create/${card.player_id}`)} fullWidth>
            <Edit3 size={15} /> 새 카드 만들기
          </Btn>
        </div>

        {/* 가격 옵션 */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: radius.lg, padding: '16px', marginTop: 16 }}>
          <div style={{ fontSize: 11, color: C.sub, letterSpacing: 1, marginBottom: 12 }}>실물 카드 수량별 가격</div>
          {[
            { qty: 1, price: 6900 },
            { qty: 5, price: 24900, badge: '인기' },
            { qty: 11, price: 49900, badge: 'BEST' },
            { qty: 20, price: 89000, badge: '최저가' },
          ].map(({ qty, price, badge }) => (
            <div key={qty}
              onClick={() => { addItem(card, price, qty); navigate('/cart'); }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '9px 0', borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.white }}>{qty}장</span>
                {badge && <span style={{ fontSize: 9, color: C.gold, border: `1px solid ${C.goldMed}`, padding: '1px 6px', borderRadius: 8, letterSpacing: 0.5 }}>{badge}</span>}
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.gold }}>{price.toLocaleString()}원</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
