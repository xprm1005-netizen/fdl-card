export function calcOverall(stats) {
  if (!stats) return 0;
  const { pac = 0, dri = 0, phy = 0, acc = 0, tac = 0, psy = 0 } = stats;
  return Math.round((pac + dri + phy + acc + tac + psy) / 6);
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
