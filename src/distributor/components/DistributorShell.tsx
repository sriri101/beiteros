import { CSSProperties } from 'react';
import { Outlet, Navigate } from 'react-router';
import { DistributorBottomNav } from './DistributorBottomNav';
import { DistributorWebShell }  from './DistributorWebShell';
import { useDistributorStore }  from '../store/useDistributorStore';
import { useIsDesktop }         from '../hooks/useIsDesktop';
import { Bell, Building2, Sun, Moon } from 'lucide-react';

const NAV = {
  light: {
    surface: '#ffffff',
    body:    '#f0f0f5',
    shadow:  '0 1px 0 rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)',
    iconBtn: 'rgba(0,0,0,0.06)',
  },
  dark: {
    surface: '#1c1c1e',
    body:    '#0d0d0f',
    shadow:  '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.60)',
    iconBtn: 'rgba(255,255,255,0.08)',
  },
} as const;

export function DistributorShell() {
  const isAuthenticated = useDistributorStore((s) => s.isAuthenticated);
  const profile         = useDistributorStore((s) => s.profile);
  const notifications   = useDistributorStore((s) => s.notifications);
  const markAllRead     = useDistributorStore((s) => s.markAllNotificationsRead);
  const darkMode        = useDistributorStore((s) => s.darkMode);
  const toggleDarkMode  = useDistributorStore((s) => s.toggleDarkMode);
  const isDesktop       = useIsDesktop(1024);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isAuthenticated) return <Navigate to="/dist/auth" replace />;

  /* ── Desktop: full sidebar shell ── */
  if (isDesktop) {
    return (
      <div
        className={darkMode ? 'dark' : ''}
        style={{ '--background': darkMode ? '#0d0d0f' : '#f0f0f5', '--card': darkMode ? '#1c1c1e' : '#ffffff' } as CSSProperties}
      >
        <DistributorWebShell />
      </div>
    );
  }

  /* ── Mobile: existing top-bar + bottom-nav layout ── */
  const nav  = darkMode ? NAV.dark : NAV.light;
  const tierColors: Record<string, { bg: string; text: string }> = darkMode
    ? {
        Silver:   { bg: '#2A2A2A', text: '#AAAAAA' },
        Gold:     { bg: '#3A2800', text: '#FFD700' },
        Platinum: { bg: '#1A1A3A', text: '#818CF8' },
      }
    : {
        Silver:   { bg: '#F0EFE9', text: '#888888' },
        Gold:     { bg: '#FFF3CD', text: '#B8860B' },
        Platinum: { bg: '#EEEEFF', text: '#4F46E5' },
      };
  const tier = tierColors[profile.partner_tier] || tierColors.Gold;

  return (
    <div
      className={darkMode ? 'dark' : ''}
      style={{
        '--background': nav.body,
        '--card':       nav.surface,
        background:     nav.body,
        minHeight:      '100svh',
        fontFamily:     "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      } as CSSProperties}
    >
      <div
        className="max-w-md mx-auto min-h-screen relative"
        style={{
          background: nav.body,
          boxShadow:  darkMode ? '0 0 60px rgba(0,0,0,0.60)' : '0 0 40px rgba(0,0,0,0.08)',
        }}
      >
        {/* ── Fixed Top Bar ── */}
        <div
          className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto"
          style={{ background: nav.surface, boxShadow: nav.shadow }}
        >
          <div style={{ height: 44 }} />
          <div className="flex items-center justify-between px-4 pb-3">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E31E24] flex items-center justify-center">
                <Building2 size={16} className="text-white" strokeWidth={2} />
              </div>
              <div>
                <p
                  className="text-foreground text-[15px] font-black leading-tight tracking-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  BEITER<span className="text-[#E31E24]">OS</span>
                  <span className="text-muted-foreground mx-1">·</span>
                  <span className="text-muted-foreground">DIST</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <p
                    className="text-muted-foreground text-[11px] leading-tight"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {profile.company}
                  </p>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: tier.bg, color: tier.text, fontFamily: "'Inter', sans-serif" }}
                  >
                    {profile.partner_tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Icon controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: nav.iconBtn }}
                aria-label="Toggle dark mode"
              >
                {darkMode
                  ? <Sun  size={16} strokeWidth={1.8} className="text-foreground" />
                  : <Moon size={16} strokeWidth={1.8} className="text-foreground" />
                }
              </button>

              <button
                onClick={markAllRead}
                className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: nav.iconBtn }}
              >
                <Bell size={18} strokeWidth={1.6} className="text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#E31E24] rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <main className="pt-[88px] pb-24">
          <Outlet />
        </main>

        <DistributorBottomNav />
      </div>
    </div>
  );
}
