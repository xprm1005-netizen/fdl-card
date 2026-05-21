import { C } from '../../tokens';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useIsMd } from '../../lib/utils';

export default function AppShell({ children }) {
  const isMd = useIsMd();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      {isMd && <Sidebar />}
      <main style={{
        flex: 1,
        marginLeft: isMd ? 220 : 0,
        paddingBottom: isMd ? 0 : 70,
        minHeight: '100vh',
      }}>
        {children}
      </main>
      {!isMd && <BottomNav />}
    </div>
  );
}
