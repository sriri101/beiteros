import { Outlet, Navigate } from 'react-router';
import { BottomNav } from './BottomNav';
import { useAppStore } from '../store/useAppStore';
import { RTL_LANGS } from '../i18n/translations';
import { Moon, Sun, Bell } from 'lucide-react';
import img41 from 'figma:asset/61d9291ceabbdb26824c0e4f5dea212211a9627e.png';

export function AppShell() {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const darkMode = useAppStore((s) => s.darkMode);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const language = useAppStore((s) => s.language);
  const tools = useAppStore((s) => s.tools);
  const isRTL = RTL_LANGS.includes(language);

  const alertCount = tools.filter((t) => t.maintenance_status !== 'ok').length;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div
      className={`min-h-screen ${darkMode ? 'dark' : ''}`}
      style={{
        background: darkMode ? '#111111' : '#F0F0F0',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-md mx-auto bg-[#F0F0F0] dark:bg-[#111111] min-h-screen relative shadow-2xl transition-colors duration-300">

        {/* ── Global Fixed Top Bar ── */}
        <div className="fixed top-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] transition-colors duration-300">
          {/* Status bar spacer */}
          <div style={{ height: 48 }} />
          {/* Nav row */}
          <div className="flex items-center justify-between px-4 pb-3">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E31E24] flex items-center justify-center overflow-hidden">
                <img
                  src={img41}
                  alt="BeiterOS logo"
                  style={{ width: '92%', height: '92%', objectFit: 'contain' }}
                />
              </div>
              <span
                className="text-[#111111] dark:text-white text-[17px] font-bold tracking-tight uppercase"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                BEITER<span className="text-[#E31E24]">OS</span>
              </span>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Bell */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F0F0F0] dark:bg-[#2A2A2A]">
                  <Bell size={18} strokeWidth={1.5} className="text-[#111111] dark:text-white" />
                </div>
                {alertCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E31E24] rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                    {alertCount}
                  </span>
                )}
              </div>
              {/* Dark mode */}
              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F0F0F0] dark:bg-[#2A2A2A] transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode
                  ? <Sun size={15} className="text-[#E31E24]" />
                  : <Moon size={15} className="text-[#6C6C70]" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* pt-[92px] = 48px status + 44px nav row */}
        <main className="pt-[92px] pb-24">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
