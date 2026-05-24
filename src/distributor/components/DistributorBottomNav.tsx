import { LayoutDashboard, Users, ShieldCheck, Building2, Megaphone } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useDistributorStore } from '../store/useDistributorStore';

/*
  Bottom nav uses the same surface / shadow palette as the top bar so
  both chrome layers are visually on the same elevation plane:

  LIGHT  surface #ffffff  |  upward shadow: hairline + 20px soft bloom
  DARK   surface #1c1c1e  |  upward shadow: rgba(255,255,255,0.06) seam + 24px deep bloom
*/

const NAV_SURFACE = {
  light: {
    surface: '#ffffff',
    shadow:  '0 -1px 0 rgba(0,0,0,0.08), 0 -4px 20px rgba(0,0,0,0.06)',
  },
  dark: {
    surface: '#1c1c1e',
    shadow:  '0 -1px 0 rgba(255,255,255,0.06), 0 -4px 24px rgba(0,0,0,0.60)',
  },
} as const;

export function DistributorBottomNav() {
  const navigate     = useNavigate();
  const location     = useLocation();
  const setActiveTab = useDistributorStore((s) => s.setActiveTab);
  const claims       = useDistributorStore((s) => s.claims);
  const darkMode     = useDistributorStore((s) => s.darkMode);
  const pendingCount = claims.filter((c) => c.status === 'pending').length;

  const ns = darkMode ? NAV_SURFACE.dark : NAV_SURFACE.light;
  const inactiveColor = darkMode ? '#636366' : '#8E8E93';

  const tabs = [
    { id: 'home',         label: 'Dashboard',    icon: LayoutDashboard, path: '/dist/home'         },
    { id: 'customers',    label: 'Customers',    icon: Users,           path: '/dist/customers'    },
    { id: 'distributors', label: 'Distributors', icon: Building2,       path: '/dist/distributors' },
    { id: 'claims',       label: 'Claims',       icon: ShieldCheck,     path: '/dist/claims'       },
    { id: 'media',        label: 'Marketing',    icon: Megaphone,       path: '/dist/media'        },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div
        className="max-w-md mx-auto"
        style={{
          background:   ns.surface,
          boxShadow:    ns.shadow,
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="flex items-center justify-around px-1 pt-2">
          {tabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              location.pathname.startsWith(tab.path + '/');
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); navigate(tab.path); }}
                className="flex flex-col items-center gap-[3px] flex-1 pb-1 active:opacity-60 transition-opacity relative"
              >
                <div className="relative">
                  <tab.icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.5}
                    style={{ color: isActive ? '#E31E24' : inactiveColor }}
                  />
                  {tab.id === 'claims' && pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-[#E31E24] rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <span
                  className="text-[10px] transition-colors duration-200"
                  style={{
                    color:      isActive ? '#E31E24' : inactiveColor,
                    fontWeight: isActive ? 700 : 400,
                    fontFamily: "'Inter', sans-serif",
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