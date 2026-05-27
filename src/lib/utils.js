export function calcOverall(stats) {
  if (!stats) return 0;
  const { pac = 0, dri = 0, phy = 0, acc = 0, tac = 0, psy = 0 } = stats;
  return Math.round((pac + dri + phy + acc + tac + psy) / 6);
}

export const GRADES = {
  monster: { slug: 'monster', name: 'MONSTER CLASS', minOvr: 99, maxOvr: 99, color: '#FF0044', glow: 'rgba(255,0,68,0.7)',   rank: 7 },
  toty:    { slug: 'toty',    name: 'TOTY',          minOvr: 95, maxOvr: 98, color: '#00D4FF', glow: 'rgba(0,212,255,0.6)',  rank: 6 },
  icon:    { slug: 'icon',    name: 'ICON',           minOvr: 89, maxOvr: 94, color: '#FF6B35', glow: 'rgba(255,107,53,0.6)', rank: 5 },
  legend:  { slug: 'legend',  name: 'LEGEND',         minOvr: 81, maxOvr: 88, color: '#C8A951', glow: 'rgba(200,169,81,0.5)', rank: 4 },
  epic:    { slug: 'epic',    name: 'EPIC',           minOvr: 73, maxOvr: 80, color: '#9B59B6', glow: 'rgba(155,89,182,0.5)', rank: 3 },
  rare:    { slug: 'rare',    name: 'RARE',           minOvr: 63, maxOvr: 72, color: '#4A90D9', glow: 'rgba(74,144,217,0.5)', rank: 2 },
  common:  { slug: 'common',  name: 'COMMON',         minOvr: 0,  maxOvr: 62, color: '#8A9BB0', glow: 'rgba(138,155,176,0.4)',rank: 1 },
};

export function determineGrade(ovr) {
  if (ovr >= 99) return GRADES.monster;
  if (ovr >= 95) return GRADES.toty;
  if (ovr >= 89) return GRADES.icon;
  if (ovr >= 81) return GRADES.legend;
  if (ovr >= 73) return GRADES.epic;
  if (ovr >= 63) return GRADES.rare;
  return GRADES.common;
}

export function formatKRW(amount) {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

export function formatDate(iso) {
  if (!iso) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}

export function formatDateTime(iso) {
  if (!iso) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function useWindowWidth() {
  const [w, setW] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return w;
}

import React from 'react';

export function useIsMd() {
  const w = useWindowWidth();
  return w >= 768;
}
