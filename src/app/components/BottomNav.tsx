import { Home, Wrench, QrCode, MessageCircle, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const setScanStep = useAppStore((s) => s.setScanStep);
  const t = useTranslation();

  const tabs = [
    { id: 'home',    label: t.nav.home,    icon: Home,          path: '/app/home' },
    { id: 'tools',   label: t.nav.tools,   icon: Wrench,        path: '/app/tools' },
    { id: 'scan',    label: t.nav.scan,    icon: QrCode,        path: '/app/scan' },
    { id: 'support', label: t.nav.support, icon: MessageCircle, path: '/app/support' },
    { id: 'profile', label: t.nav.profile, icon: User,          path: '/app/profile' },
  ];

  const handleNav = (tab: typeof tabs[0]) => {
    setActiveTab(tab.id);
    if (tab.id === 'scan') setScanStep('choose');
    navigate(tab.path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-xl"
        style={{
          boxShadow: '0 -1px 0 rgba(0,0,0,0.12)',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex items-end justify-around px-4 pt-2">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              location.pathname.startsWith(tab.path + '/');

            if (tab.id === 'scan') {
              return (
                <button
                  key="scan"
                  onClick={() => handleNav(tab)}
                  className="flex flex-col items-center gap-1 flex-1 active:opacity-80 transition-opacity"
                  aria-label={tab.label}
                  style={{ marginTop: '-28px' }}
                >
                  {/* Elevated red circle */}
                  <div
                    className="w-[62px] h-[62px] rounded-full bg-[#E31E24] flex items-center justify-center"
                    style={{
                      boxShadow: '0 4px 16px rgba(227,30,36,0.45), 0 0 0 5px white',
                    }}
                  >
                    <QrCode size={28} className="text-white" strokeWidth={1.8} />
                  </div>
                  <span
                    className="text-[11px] font-semibold pb-0.5"
                    style={{ color: '#E31E24' }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleNav(tab)}
                className="flex flex-col items-center gap-[4px] flex-1 pb-1 active:opacity-60 transition-opacity"
                aria-label={tab.label}
              >
                <tab.icon
                  size={24}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{ color: isActive ? '#E31E24' : '#8E8E93' }}
                  className="transition-colors duration-200"
                />
                <span
                  className="text-[11px] transition-colors duration-200"
                  style={{
                    color: isActive ? '#E31E24' : '#8E8E93',
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}