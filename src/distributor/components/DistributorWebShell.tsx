import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  LayoutDashboard, Users, ShieldCheck, Package, BarChart2,
  Bell, Sun, Moon, ChevronLeft, ChevronRight,
  Settings, LogOut, Star, Search, Megaphone, GraduationCap,
  Bot, Sparkles, ShoppingCart, Building2,
} from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';
import WebDashboard  from '../pages/WebDashboard';
import WebCustomers  from '../pages/WebCustomers';
import WebClaims     from '../pages/WebClaims';
import WebCatalog    from '../pages/WebCatalog';
import WebAnalytics  from '../pages/WebAnalytics';
import WebMediaHub   from '../pages/WebMediaHub';
import WebOrders     from '../pages/WebOrders';
import WebDistributors from '../pages/WebDistributors';
import { AdamAI }   from './AdamAI';
import CompanyLogo  from '../../imports/Layer1';

const FF = "'Inter', sans-serif";
const SIDEBAR_OPEN   = 252;
const SIDEBAR_CLOSED = 68;

const PAGE_MAP: Record<string, { Component: React.ComponentType; label: string }> = {
  '/dist/home':         { Component: WebDashboard,     label: 'Dashboard'      },
  '/dist/customers':    { Component: WebCustomers,     label: 'Customers'      },
  '/dist/distributors': { Component: WebDistributors,  label: 'Distributors'   },
  '/dist/claims':       { Component: WebClaims,        label: 'Claims'         },
  '/dist/catalog':      { Component: WebCatalog,       label: 'Catalog'        },
  '/dist/analytics':    { Component: WebAnalytics,     label: 'Analytics'      },
  '/dist/media':        { Component: WebMediaHub,      label: 'Marketing Hub'  },
  '/dist/orders':       { Component: WebOrders,        label: 'Orders'         },
};

const NAV_ITEMS = [
  { path: '/dist/home',         label: 'Dashboard',     Icon: LayoutDashboard },
  { path: '/dist/customers',    label: 'Customers',     Icon: Users            },
  { path: '/dist/distributors', label: 'Distributors',  Icon: Building2        },
  { path: '/dist/claims',       label: 'Claims',        Icon: ShieldCheck      },
  { path: '/dist/catalog',      label: 'Catalog',       Icon: Package          },
  { path: '/dist/analytics',    label: 'Analytics',     Icon: BarChart2        },
  { path: '/dist/orders',       label: 'Orders',        Icon: ShoppingCart     },
  { path: '/dist/media',        label: 'Marketing Hub', Icon: Megaphone        },
];

const TIER_CFG = {
  Silver:   { color: '#888888', darkBg: '#2A2A2A', lightBg: '#F0EFE9' },
  Gold:     { color: '#B8860B', darkBg: '#3A2800', lightBg: '#FFF3CD' },
  Platinum: { color: '#4F46E5', darkBg: '#1A1A3A', lightBg: '#EEEEFF' },
};

export function DistributorWebShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    profile, claims, notifications, darkMode, toggleDarkMode,
    markAllNotificationsRead, setAuthenticated, learnMode, toggleLearnMode,
  } = useDistributorStore();

  const [collapsed, setCollapsed]     = useState(false);
  const [showNotifs, setShowNotifs]   = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adamOpen, setAdamOpen]       = useState(false);

  const dm       = darkMode;
  const W        = collapsed ? SIDEBAR_CLOSED : SIDEBAR_OPEN;
  const SURFACE  = dm ? '#1c1c1e' : '#ffffff';
  const BG       = dm ? '#0d0d0f' : '#f0f0f5';
  const BORDER   = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT     = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED    = dm ? '#636366' : '#8E8E93';
  const ICON_BTN = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  const INPUT_BG = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';

  /* ── Sidebar always black ── */
  const SB_BG     = '#111111';
  const SB_BORDER = 'rgba(255,255,255,0.10)';
  const SB_TEXT   = '#f2f2f7';
  const SB_MUTED  = '#8E8E93';
  const SB_HOVER  = 'rgba(255,255,255,0.08)';
  const SB_CARD   = 'rgba(255,255,255,0.06)';

  const pendingCount = claims.filter(c => c.status === 'pending').length;
  const unreadNotifs = notifications.filter(n => !n.read);
  const tier         = TIER_CFG[profile.partner_tier] || TIER_CFG.Gold;

  const currentPath = location.pathname;
  const page        = PAGE_MAP[currentPath] || PAGE_MAP['/dist/home'];
  const { Component: PageComponent, label: pageLabel } = page;

  const initials = profile.contact.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = () => {
    setAuthenticated(false);
    navigate('/dist/auth');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: BG, fontFamily: FF, position: 'relative' }}>

      {/* ══════════════════════════ SIDEBAR ══════════════════════════ */}
      <aside style={{
        width: W, flexShrink: 0,
        background: SB_BG,
        borderRight: `1px solid ${SB_BORDER}`,
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 40, overflow: 'hidden',
        transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: '1px 0 0 rgba(255,255,255,0.06)',
      }}>

        {/* Brand */}
        <div style={{
          height: collapsed ? 68 : 116,
          display: 'flex', alignItems: 'center',
          padding: collapsed ? '0 16px' : '22px 18px 16px',
          gap: 10,
          borderBottom: `1px solid ${SB_BORDER}`,
          flexShrink: 0,
          overflow: 'hidden',
          transition: 'height 0.22s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {collapsed ? (
            /* ── Collapsed: show cropped left portion (icon mark) ── */
            <div style={{ width: 36, height: 36, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
              <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 108, height: 29 }}>
                <CompanyLogo />
              </div>
            </div>
          ) : (
            /* ── Expanded: full logo + company subtitle + tier badge ── */
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5 }}>
              {/* Logo — viewBox 274×74, rendered at 148px wide */}
              <div style={{ position: 'relative', width: 154, height: Math.round(154 * 74 / 274), flexShrink: 0 }}>
                <CompanyLogo />
              </div>
              {/* Company name */}
              <p style={{ fontSize: 13, color: SB_MUTED, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '0.01em' }}>
                {profile.company}
              </p>
              {/* Partner tier badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                alignSelf: 'flex-start',
                fontSize: 11, fontWeight: 800,
                padding: '4px 10px 4px 8px',
                borderRadius: 99,
                background: tier.darkBg,
                color: tier.color,
                border: `1px solid ${tier.color}55`,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                <Star size={10} fill={tier.color} style={{ color: tier.color, flexShrink: 0 }} />
                {profile.partner_tier} Partner
              </span>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '14px 8px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const isActive = currentPath === path || currentPath.startsWith(path + '/');
            const badge    = path === '/dist/claims' && pendingCount > 0 ? pendingCount : null;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                title={collapsed ? label : undefined}
                style={{
                  width: '100%', height: 48, borderRadius: 12, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '0' : '0 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? '#E31E24' : 'transparent',
                  transition: 'background 0.15s', position: 'relative',
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = SB_HOVER; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Icon size={20} strokeWidth={isActive ? 2.3 : 1.7} style={{ color: isActive ? '#fff' : SB_MUTED }} />
                  {badge && (
                    <span style={{ position: 'absolute', top: -5, right: -7, width: 18, height: 18, background: isActive ? '#fff' : '#E31E24', color: isActive ? '#E31E24' : '#fff', borderRadius: '50%', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {badge}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <span style={{ fontSize: 14, fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : SB_TEXT, whiteSpace: 'nowrap' }}>
                    {label}
                  </span>
                )}
              </button>
            );
          })}

          {/* ── Divider ── */}
          <div style={{ height: 1, background: SB_BORDER, margin: '10px 4px 8px' }} />

          {/* ── Adam AI button ── */}
          <button
            onClick={() => setAdamOpen(v => !v)}
            title={collapsed ? 'Ask Adam' : undefined}
            style={{
              width: '100%', height: 52, borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '0' : '0 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: adamOpen
                ? 'linear-gradient(135deg, rgba(227,30,36,0.22) 0%, rgba(124,10,13,0.18) 100%)'
                : 'linear-gradient(135deg, rgba(227,30,36,0.10) 0%, rgba(124,10,13,0.08) 100%)',
              border: `1px solid ${adamOpen ? 'rgba(227,30,36,0.45)' : 'rgba(227,30,36,0.22)'}`,
              transition: 'all 0.2s',
              position: 'relative',
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              if (!adamOpen) {
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(227,30,36,0.18) 0%, rgba(124,10,13,0.14) 100%)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(227,30,36,0.38)';
              }
            }}
            onMouseLeave={e => {
              if (!adamOpen) {
                (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(227,30,36,0.10) 0%, rgba(124,10,13,0.08) 100%)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(227,30,36,0.22)';
              }
            }}
          >
            {/* Adam avatar icon */}
            <div style={{
              width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #E31E24 0%, #7C0A0D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(227,30,36,0.4)',
            }}>
              <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>A</span>
            </div>

            {!collapsed && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#E31E24', margin: 0, lineHeight: 1.2 }}>Ask Adam</p>
                  <p style={{ fontSize: 11, color: 'rgba(227,30,36,0.65)', margin: '2px 0 0', fontWeight: 500 }}>AI Consultant</p>
                </div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Sparkles size={15} style={{ color: '#E31E24' }} />
                </motion.div>
              </div>
            )}

            {/* Live pulse dot */}
            {collapsed && (
              <motion.div
                style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: '50%', background: '#E31E24' }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </button>

          {/* ── Learn Mode toggle — only on Analytics ── */}
          {currentPath === '/dist/analytics' && (
            <>
              <div style={{ height: 1, background: SB_BORDER, margin: '8px 4px 6px' }} />
              <button
                onClick={toggleLearnMode}
                title={collapsed ? (learnMode ? 'Learning Mode: ON' : 'Learning Mode: OFF') : undefined}
                style={{
                  width: '100%', height: 48, borderRadius: 12,
                  border: learnMode ? `1.5px solid rgba(227,30,36,0.5)` : '1.5px solid transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '0' : '0 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: learnMode ? 'rgba(227,30,36,0.12)' : 'transparent',
                  transition: 'all 0.2s', position: 'relative',
                }}
                onMouseEnter={e => { if (!learnMode) (e.currentTarget as HTMLButtonElement).style.background = SB_HOVER; }}
                onMouseLeave={e => { if (!learnMode) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <GraduationCap size={20} strokeWidth={learnMode ? 2.3 : 1.7} style={{ color: learnMode ? '#E31E24' : SB_MUTED }} />
                  {learnMode && (
                    <span style={{ position: 'absolute', top: -3, right: -4, width: 7, height: 7, borderRadius: '50%', background: '#E31E24', border: `1.5px solid ${SB_BG}` }} />
                  )}
                </div>
                {!collapsed && (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
                    <span style={{ fontSize: 14, fontWeight: learnMode ? 700 : 500, color: learnMode ? '#E31E24' : SB_TEXT, whiteSpace: 'nowrap' }}>
                      Learn Dashboard
                    </span>
                    <div style={{ width: 38, height: 22, borderRadius: 99, background: learnMode ? '#E31E24' : 'rgba(255,255,255,0.15)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', top: 3, left: learnMode ? 19 : 3, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
                    </div>
                  </div>
                )}
              </button>
            </>
          )}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: SB_BORDER, margin: '0 12px' }} />

        {/* Bottom section */}
        <div style={{ padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Settings */}
          <button
            title={collapsed ? 'Settings' : undefined}
            style={{ width: '100%', height: 44, borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '0' : '0 14px', justifyContent: collapsed ? 'center' : 'flex-start', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = SB_HOVER; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <Settings size={19} strokeWidth={1.7} style={{ color: SB_MUTED, flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 14, color: SB_MUTED, fontWeight: 500 }}>Settings</span>}
          </button>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            title={collapsed ? (dm ? 'Light Mode' : 'Dark Mode') : undefined}
            style={{ width: '100%', height: 44, borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '0' : '0 14px', justifyContent: collapsed ? 'center' : 'flex-start', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = SB_HOVER; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {dm ? <Sun size={19} strokeWidth={1.7} style={{ color: SB_MUTED, flexShrink: 0 }} /> : <Moon size={19} strokeWidth={1.7} style={{ color: SB_MUTED, flexShrink: 0 }} />}
            {!collapsed && <span style={{ fontSize: 14, color: SB_MUTED, fontWeight: 500 }}>{dm ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : undefined}
            style={{ width: '100%', height: 44, borderRadius: 11, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: collapsed ? '0' : '0 14px', justifyContent: collapsed ? 'center' : 'flex-start', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(227,30,36,0.10)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <LogOut size={19} strokeWidth={1.7} style={{ color: '#E31E24', flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 14, color: '#E31E24', fontWeight: 600 }}>Sign Out</span>}
          </button>

          {/* Profile card */}
          {!collapsed && (
            <div style={{ margin: '10px 0 4px', padding: '12px 14px', borderRadius: 13, background: SB_CARD, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>{initials}</span>
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: SB_TEXT, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile.contact}</p>
                <div className="flex items-center gap-1" style={{ marginTop: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: tier.darkBg, color: tier.color }}>
                    {profile.partner_tier}
                  </span>
                </div>
              </div>
            </div>
          )}
          {collapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 4 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} title={profile.contact}>
                <span style={{ color: '#fff', fontSize: 14, fontWeight: 900 }}>{initials}</span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(v => !v)}
          style={{ position: 'absolute', top: 22, right: -13, width: 26, height: 26, borderRadius: '50%', background: SB_BG, border: `1px solid ${SB_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', zIndex: 50 }}
        >
          {collapsed ? <ChevronRight size={14} style={{ color: SB_MUTED }} /> : <ChevronLeft size={14} style={{ color: SB_MUTED }} />}
        </button>
      </aside>

      {/* ══════════════════════════ ADAM AI ══════════════════════════ */}
      <AdamAI open={adamOpen} onClose={() => setAdamOpen(false)} />

      {/* ══════════════════════════ MAIN ══════════════════════════ */}
      <div style={{ marginLeft: W, flex: 1, display: 'flex', flexDirection: 'column', transition: 'margin-left 0.22s cubic-bezier(0.4,0,0.2,1)', minWidth: 0 }}>

        {/* Top Header */}
        <header style={{ height: 72, background: SURFACE, borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 18, position: 'sticky', top: 0, zIndex: 30, flexShrink: 0, boxShadow: dm ? '0 1px 0 rgba(255,255,255,0.05)' : '0 1px 0 rgba(0,0,0,0.06)' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>DIST</span>
            <ChevronRight size={14} style={{ color: MUTED }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{pageLabel}</span>
          </div>

          {/* Search */}
          <div style={{ flex: 1, maxWidth: 460, display: 'flex', alignItems: 'center', gap: 10, background: searchFocus ? (dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)') : INPUT_BG, borderRadius: 11, padding: '10px 14px', border: searchFocus ? `1px solid ${dm ? 'rgba(227,30,36,0.5)' : 'rgba(227,30,36,0.4)'}` : '1px solid transparent', transition: 'all 0.15s' }}>
            <Search size={15} style={{ color: MUTED, flexShrink: 0 }} />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              placeholder={`Search ${pageLabel.toLowerCase()}…`}
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: TEXT, flex: 1, fontFamily: FF }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexShrink: 0 }}>
            {/* Adam quick-access button in header */}
            <button
              onClick={() => setAdamOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px', height: 42, borderRadius: 11, border: `1px solid ${adamOpen ? 'rgba(227,30,36,0.5)' : dm ? 'rgba(227,30,36,0.25)' : 'rgba(227,30,36,0.3)'}`,
                background: adamOpen ? 'rgba(227,30,36,0.12)' : dm ? 'rgba(227,30,36,0.08)' : 'rgba(227,30,36,0.06)',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(227,30,36,0.15)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = adamOpen ? 'rgba(227,30,36,0.12)' : dm ? 'rgba(227,30,36,0.08)' : 'rgba(227,30,36,0.06)'; }}
            >
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#E31E24,#7C0A0D)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>A</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#E31E24' }}>Adam</span>
              <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}>
                <Sparkles size={13} style={{ color: '#E31E24' }} />
              </motion.div>
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => { setShowNotifs(v => !v); if (unreadNotifs.length) markAllNotificationsRead(); }}
                style={{ width: 42, height: 42, borderRadius: '50%', background: ICON_BTN, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
              >
                <Bell size={19} strokeWidth={1.7} style={{ color: TEXT }} />
                {unreadNotifs.length > 0 && (
                  <span style={{ position: 'absolute', top: 0, right: 0, width: 19, height: 19, background: '#E31E24', borderRadius: '50%', fontSize: 10, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${SURFACE}` }}>
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 380, background: SURFACE, borderRadius: 18, border: `1px solid ${BORDER}`, boxShadow: dm ? '0 16px 48px rgba(0,0,0,0.6)' : '0 16px 40px rgba(0,0,0,0.14)', overflow: 'hidden', zIndex: 60 }}
                  >
                    <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Notifications</span>
                      <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={16} style={{ color: MUTED }} />
                      </button>
                    </div>
                    {notifications.slice(0, 7).map(n => (
                      <div key={n.id} style={{ padding: '13px 20px', borderBottom: `1px solid ${BORDER}`, background: n.read ? 'transparent' : (dm ? 'rgba(227,30,36,0.06)' : 'rgba(227,30,36,0.03)') }}>
                        <div className="flex items-start gap-3">
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.read ? 'transparent' : '#E31E24', marginTop: 6, flexShrink: 0 }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{n.title}</p>
                            <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.body}</p>
                          </div>
                          <span style={{ fontSize: 11, color: MUTED, flexShrink: 0, marginTop: 2 }}>{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dark mode */}
            <button
              onClick={toggleDarkMode}
              style={{ width: 42, height: 42, borderRadius: '50%', background: ICON_BTN, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {dm ? <Sun size={19} strokeWidth={1.7} style={{ color: TEXT }} /> : <Moon size={19} strokeWidth={1.7} style={{ color: TEXT }} />}
            </button>

            {/* Profile pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 14px 6px 7px', borderRadius: 99, background: ICON_BTN, cursor: 'default' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: 13, fontWeight: 900 }}>{initials}</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.2 }}>{profile.contact}</p>
                <div className="flex items-center gap-1" style={{ marginTop: 2 }}>
                  <Star size={10} style={{ color: tier.color }} fill={tier.color} />
                  <span style={{ fontSize: 11, color: tier.color, fontWeight: 700 }}>{profile.partner_tier}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {showNotifs && <div style={{ position: 'fixed', inset: 0, zIndex: 55 }} onClick={() => setShowNotifs(false)} />}
          <PageComponent />
        </main>

        {/* Footer */}
        <footer style={{ height: 44, borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', padding: '0 28px', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: MUTED }}>
            BeiterOS v1.0 · Distributor Portal · {profile.company} · {profile.territory}
          </span>
        </footer>
      </div>
    </div>
  );
}