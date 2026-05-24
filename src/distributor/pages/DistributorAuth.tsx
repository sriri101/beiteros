import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';
import { useIsDesktop } from '../hooks/useIsDesktop';
import imgBeiterOsLogo from 'figma:asset/61d9291ceabbdb26824c0e4f5dea212211a9627e.png';
import svgPaths from '../../imports/svg-expj8sor72';          // moon/globe/shield icons
import svgB from '../../imports/svg-6i2uu193i6';              // full BEITER wordmark
import { imgGroup } from '../../imports/svg-g7yg6';           // globe mask

/* ─────────── pill data ─────────── */
const ROW1 = ['📊 Sales Analytics','🛡️ Warranty Claims','📦 Stock Orders','👥 Customer Management','📈 Revenue Reports','🚚 Order Tracking','📊 Sales Analytics','🛡️ Warranty Claims','📦 Stock Orders','👥 Customer Management','📈 Revenue Reports','🚚 Order Tracking'];
const ROW2 = ['🏆 Partner Tiers','🔗 Dealer Network','💰 Margin Tracker','📋 Claims Processing','🗺️ Territory Map','🔧 Service Center','🏆 Partner Tiers','🔗 Dealer Network','💰 Margin Tracker','📋 Claims Processing','🗺️ Territory Map','🔧 Service Center'];
const ROW3 = ['🎯 KPI Dashboard','🏅 Gold Status','📱 Digital Catalog','📍 Stock Alerts','📤 Order Dispatch','📑 Invoice Vault','🎯 KPI Dashboard','🏅 Gold Status','📱 Digital Catalog','📍 Stock Alerts','📤 Order Dispatch','📑 Invoice Vault'];

const FF = "'Inter', sans-serif";

const LANGUAGES = [
  { code: 'en', label: 'English',  flag: '🇬🇧', available: true  },
  { code: 'fr', label: 'Français', flag: '🇫🇷', available: false },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪', available: false },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', available: false },
];

/* ─────────── shared tiny components ─────────── */
function Pill({ label }: { label: string }) {
  return (
    <div className="relative flex-shrink-0 flex items-center"
      style={{ height: 26.989, borderRadius: 99999, background: 'rgba(255,255,255,0.10)', paddingLeft: 15, paddingRight: 15 }}>
      <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 99999, border: '0.909px solid rgba(255,255,255,0.08)' }} />
      <span style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function PillRow({ pills, reverse = false }: { pills: string[]; reverse?: boolean }) {
  return (
    <div style={{ overflow: 'hidden', width: '100%', height: 27 }}>
      <div style={{ display: 'flex', gap: 8, width: 'max-content', animation: `${reverse ? 'pillRev' : 'pillFwd'} 30s linear infinite` }}>
        {pills.map((p, i) => <Pill key={i} label={p} />)}
      </div>
    </div>
  );
}

/* Full BEITER wordmark SVG (from Figma Layer_1) */
function BeiterWordmark() {
  return (
    <svg width="274" height="74" viewBox="0 0 274 74" fill="none" style={{ display: 'block', flexShrink: 0 }}>
      <g clipPath="url(#bwm_clip)">
        <path d={svgB.pfd4b700}  fill="white" />
        <path d={svgB.p3100ff80} fill="#EE252B" />
        <path d={svgB.p1f0fdd80} fill="white" />
        <path d={svgB.p1c70b100} fill="#EE252B" />
        <path d={svgB.p285afb40} fill="#EE252B" />
        <path d={svgB.p10928320} fill="#EE252B" />
        <path d={svgB.p2c1a0f00} fill="#EE252B" />
        <path d={svgB.pe16a040}  fill="#EE252B" />
        <path d={svgB.pdf9c580}  fill="#EE252B" />
        <path d={svgB.p3179b300} fill="#EE252B" />
        <path d={svgB.p3303b500} fill="#EE252B" />
        <path d={svgB.p25345a00} fill="#EE252B" />
        <path d={svgB.p4278000}  fill="#EE252B" />
        <path d={svgB.p30aac7c0} fill="#EE252B" />
        <path d={svgB.p3865fe80} fill="white" />
        <path d={svgB.p2a6e2c70} fill="white" />
        <path d={svgB.p2cf9c180} fill="white" />
        <path d={svgB.p2e8a9700} fill="white" />
        <path d={svgB.p27caa900} fill="white" />
        <path d={svgB.p190b0b00} fill="white" />
        <path d={svgB.p1073080}  fill="#EE252B" />
      </g>
      <defs>
        <clipPath id="bwm_clip"><rect width="274" height="74" fill="white" /></clipPath>
      </defs>
    </svg>
  );
}

/* Language dropdown */
function LangDropdown({ fireToast }: { fireToast: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger — matches Figma Button4 */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          height: 35.994, borderRadius: 99999,
          background: 'rgba(255,255,255,0.10)',
          border: '0.909px solid rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center', gap: 6,
          paddingLeft: 12, paddingRight: 10, cursor: 'pointer',
        }}
      >
        {/* Globe icon using mask (matches Figma Svg2) */}
        <div style={{
          width: 13.991, height: 13.991, position: 'relative', overflow: 'hidden', borderRadius: 'inherit', flexShrink: 0,
          maskImage: `url('${imgGroup}')`, maskSize: '100% 100%',
        }}>
          <svg width="100%" height="100%" viewBox="0 0 12.8213 12.8213" fill="none" style={{ position: 'absolute', inset: '-5%', width: '110%', height: '110%' }}>
            <path d={svgB.p1117a780} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.165" />
            <path d={svgB.p1e889a50} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.165" />
            <path d="M0.582645 6.41065H12.2386" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.165" />
          </svg>
        </div>
        <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap' }}>🇬🇧 English</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d={svgB.pe1a76e0} stroke="rgba(255,255,255,0.6)" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 200, borderRadius: 18, background: 'rgba(22,8,8,0.97)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 16px 48px rgba(0,0,0,0.55)', overflow: 'hidden', zIndex: 99 }}
          >
            <div style={{ padding: '12px 16px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <p style={{ fontFamily: FF, fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', margin: 0 }}>Language</p>
            </div>
            {LANGUAGES.map((lang, i) => (
              <button key={lang.code}
                onClick={() => { if (!lang.available) { setOpen(false); fireToast(); } else setOpen(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: 'none', border: 'none', borderBottom: i < LANGUAGES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                <span style={{ fontFamily: FF, fontSize: 14, fontWeight: lang.available ? 700 : 500, color: lang.available ? '#fff' : 'rgba(255,255,255,0.70)', flex: 1 }}>{lang.label}</span>
                {lang.available
                  ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 5" stroke="#E31E24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  : <span style={{ fontFamily: FF, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: '#B8860B', backgroundColor: '#FFF3CD', padding: '2px 6px', borderRadius: 6, flexShrink: 0 }}>SOON</span>
                }
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Dark mode toggle (matches Figma Button3) */
function DarkBtn({ darkMode, toggle }: { darkMode: boolean; toggle: () => void }) {
  return (
    <button onClick={toggle}
      style={{ width: 35.994, height: 35.994, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d={darkMode ? 'M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' : svgB.p3c84c140}
          stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.333" />
      </svg>
    </button>
  );
}

/* Toast */
function Toast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.22 }}
          style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 200, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', borderRadius: 16, background: 'rgba(22,8,8,0.97)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 12px 40px rgba(0,0,0,0.50)', backdropFilter: 'blur(20px)', whiteSpace: 'nowrap' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="9" cy="9" r="7.5" stroke="#FFD700" strokeWidth="1.4" />
            <path d="M9 5.5V9l2.5 2" stroke="#FFD700" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p style={{ fontFamily: FF, fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Coming soon</p>
            <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.50)', margin: 0 }}>This language will be available shortly.</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════
   MOBILE — original bottom-sheet flow
   ═══════════════════════════════════════════ */
function LoginSheet({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const setAuthenticated = useDistributorStore((s) => s.setAuthenticated);
  const [email, setEmail]       = useState('k.muller@beitertools.com');
  const [password, setPassword] = useState('Demo1234');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const submit = () => {
    if (!email || !password) { setError('Please enter email and password.'); return; }
    setError(''); setLoading(true);
    setTimeout(() => { setLoading(false); setAuthenticated(true); navigate('/dist/home'); }, 1400);
  };

  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 32, stiffness: 300 }}
      className="absolute inset-x-0 bottom-0 z-50 overflow-hidden"
      style={{ borderRadius: '28px 28px 0 0', background: 'rgba(16,4,4,0.95)', backdropFilter: 'blur(28px)', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12, paddingBottom: 4 }}>
        <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.20)' }} />
      </div>
      <div style={{ padding: '12px 24px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <p style={{ fontFamily: FF, fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>Sign In</p>
            <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.40)', marginTop: 2 }}>Distributor Partner Portal</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.10)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        {error && <div style={{ background: 'rgba(227,30,36,0.22)', border: '1px solid rgba(227,30,36,0.40)', borderRadius: 16, padding: '12px 16px', marginBottom: 16 }}><p style={{ fontFamily: FF, fontSize: 13, color: '#fff', margin: 0 }}>{error}</p></div>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontFamily: FF, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@company.de"
              style={{ width: '100%', borderRadius: 16, padding: '14px 16px', fontSize: 15, color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none', boxSizing: 'border-box', fontFamily: FF, caretColor: '#E31E24' }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(243,26,26,0.65)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: FF, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="••••••••"
                style={{ width: '100%', borderRadius: 16, padding: '14px 48px 14px 16px', fontSize: 15, color: '#fff', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none', boxSizing: 'border-box', fontFamily: FF, caretColor: '#E31E24' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(243,26,26,0.65)')} onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')} />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(255,255,255,0.35)' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button onClick={submit} disabled={loading}
            style={{ width: '100%', height: 56, borderRadius: 16, backgroundImage: 'linear-gradient(178.63deg, rgb(243,26,26) 5.476%, rgb(255,106,106) 94.524%)', boxShadow: '0px 8px 24px rgba(29,29,31,0.32)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? <div style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              : <p style={{ fontFamily: FF, fontWeight: 700, fontSize: 17, color: '#fff', margin: 0 }}>Sign In</p>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function MobileAuth({ darkMode, toggleDarkMode, fireToast }: { darkMode: boolean; toggleDarkMode: () => void; fireToast: () => void }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <div style={{ position: 'relative', minHeight: '100svh', overflow: 'hidden', backgroundImage: darkMode ? 'linear-gradient(104.685deg, rgb(45,23,23) 46%, rgb(63,0,0) 82%)' : 'linear-gradient(119.657deg, rgb(103,49,49) 45%, rgb(132,0,0) 88%)', display: 'flex', flexDirection: 'column', fontFamily: FF }}>
      <div style={{ position: 'absolute', width: 288, height: 288, left: 145, top: -86, borderRadius: '50%', background: '#ff6a6a', opacity: 0.10, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 224, height: 224, left: -67, top: 600, borderRadius: '50%', background: '#ff6a6a', opacity: 0.10, pointerEvents: 'none' }} />
      <div style={{ height: 44, flexShrink: 0 }} />
      <div style={{ position: 'absolute', top: 52, right: 16, display: 'flex', alignItems: 'center', gap: 8, zIndex: 50 }}>
        <DarkBtn darkMode={darkMode} toggle={toggleDarkMode} />
        <LangDropdown fireToast={fireToast} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 88, paddingBottom: 170, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: 21.6, backgroundImage: 'linear-gradient(135deg, rgb(243,26,26) 0%, rgb(255,106,106) 100%)', boxShadow: '0px 25px 50px rgba(0,0,0,0.25)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={imgBeiterOsLogo} alt="BeiterOS" style={{ width: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
        </div>
        <p style={{ fontFamily: FF, fontWeight: 900, fontSize: 38, lineHeight: '41.8px', letterSpacing: '-0.95px', color: '#fff', textAlign: 'center', margin: 0, marginTop: 20 }}>BeiterOs</p>
        <p style={{ fontFamily: FF, fontSize: 12, lineHeight: '19.5px', color: 'rgba(255,255,255,0.62)', textAlign: 'center', margin: '10px 0 0', maxWidth: 328 }}>
          {`"The partner ecosystem that connects every sale, claim, and customer"`}
        </p>
        <div style={{ width: '100%', maxWidth: 345, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 23 }}>
          <button onClick={() => setShowForm(true)}
            style={{ width: '100%', height: 56, borderRadius: 16, backgroundImage: 'linear-gradient(178.63deg, rgb(243,26,26) 5.476%, rgb(255,106,106) 94.524%)', boxShadow: '0px 8px 24px rgba(29,29,31,0.32)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: FF, fontWeight: 700, fontSize: 17, color: '#fff', margin: 0 }}>Sign In</p>
          </button>
          <button onClick={() => window.open('https://beitertools.com', '_blank')}
            style={{ position: 'relative', width: '100%', height: 56, borderRadius: 16, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: 16, border: '1px solid rgba(255,255,255,0.30)', pointerEvents: 'none' }} />
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" style={{ flexShrink: 0 }}>
              <path d={svgPaths.p384b4b00} stroke="white" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              <path d={svgPaths.p48f2210}  stroke="white" strokeOpacity="0.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            </svg>
            <p style={{ fontFamily: FF, fontWeight: 600, fontSize: 17, color: '#fff', margin: 0 }}>Apply as a Partner</p>
          </button>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 50, display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden', height: 97 }}>
        <PillRow pills={ROW1} reverse={false} />
        <PillRow pills={ROW2} reverse={true}  />
        <PillRow pills={ROW3} reverse={false} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: FF, fontSize: 12, color: 'rgba(255,255,255,0.50)', textAlign: 'center', margin: 0 }}>BeiterOS v1.0 · Distributor Portal · By Beitertools.com</p>
      </div>
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.50)', zIndex: 40 }}
              onClick={() => setShowForm(false)} />
            <LoginSheet key="sheet" onClose={() => setShowForm(false)} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESKTOP — Figma-faithful split-screen
   ═══════════════════════════════════════════ */
function DesktopAuth({ darkMode, toggleDarkMode, fireToast }: { darkMode: boolean; toggleDarkMode: () => void; fireToast: () => void }) {
  const navigate = useNavigate();
  const setAuthenticated = useDistributorStore((s) => s.setAuthenticated);
  const [email, setEmail]       = useState('k.muller@beitertools.com');
  const [password, setPassword] = useState('Demo1234');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const submit = () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError(''); setLoading(true);
    setTimeout(() => { setLoading(false); setAuthenticated(true); navigate('/dist/home'); }, 1400);
  };

  return (
    /* Page shell */
    <div style={{
      minHeight: '100svh', fontFamily: FF,
      background: 'radial-gradient(ellipse at 28% 38%, rgba(110,25,25,0.55) 0%, rgba(60,14,14,0.775) 38%, rgba(35,8,8,0.89) 57%, rgba(10,2,2,1) 75%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '28px 40px', boxSizing: 'border-box',
    }}>

      {/* ── 1440px box ── */}
      <div style={{
        width: '100%', maxWidth: 1440,
        height: 'min(88vh, 840px)', minHeight: 600,
        borderRadius: 22, overflow: 'hidden', display: 'flex',
        boxShadow: '0px 48px 120px 0px rgba(0,0,0,0.80), 0px 0px 0px 1px rgba(255,255,255,0.05)',
        position: 'relative',
      }}>

        {/* ══ LEFT PANEL — red brand side ══ */}
        <div style={{
          flex: '0 0 58%', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(134.836deg, rgb(107,49,49) 0%, rgb(132,0,0) 100%)',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Decorative radial orbs (Figma Container2/3/4) */}
          <div style={{ position: 'absolute', width: 500, height: 500, left: -80, top: -120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,106,106,0.18) 0%, rgba(128,53,53,0.09) 35%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 350, height: 350, left: '65%', top: '57%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', width: 200, height: 200, left: '60%', top: '47%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Main content */}
          <div style={{ flex: 1, position: 'relative', zIndex: 1, padding: '0 56px' }}>

            {/* Logo + brand name (Figma Container6 @ top:88px) */}
            <div style={{ position: 'absolute', top: 88, left: 56, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 51.989, height: 51.989, borderRadius: 14, backgroundImage: 'linear-gradient(135deg, rgb(243,26,26) 0%, rgb(255,106,106) 100%)', boxShadow: '0px 8px 24px rgba(227,30,36,0.35)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={imgBeiterOsLogo} alt="BeiterOS" style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }} />
              </div>
              <div>
                <p style={{ fontFamily: FF, fontWeight: 900, fontSize: 22, color: '#fff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  Beiter<span style={{ color: 'rgba(255,255,255,0.5)' }}>OS</span>
                </p>
                <p style={{ fontFamily: FF, fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Distributor Portal</p>
              </div>
            </div>

            {/* Hero headline (Figma H @ top:172px) */}
            <div style={{ position: 'absolute', top: 172, left: 56 }}>
              <p style={{ fontFamily: FF, fontWeight: 900, fontSize: 42, color: '#fff', margin: 0, letterSpacing: '-1.26px', textTransform: 'uppercase', lineHeight: '46.2px' }}>
                Your entire channel,
              </p>
              <p style={{ fontFamily: FF, fontWeight: 900, fontSize: 42, color: 'rgba(255,255,255,0.42)', margin: 0, letterSpacing: '-1.26px', textTransform: 'uppercase', lineHeight: '46.2px' }}>
                In one place.
              </p>
            </div>

            {/* Subtitle (Figma P2 @ top:313px) */}
            <p style={{ position: 'absolute', top: 313, left: 56, fontFamily: FF, fontSize: 14, color: 'rgba(255,255,255,0.52)', lineHeight: '23.1px', margin: 0, maxWidth: 396 }}>
              The partner ecosystem that connects every sale, claim, and customer.
            </p>

            {/* Feature cards 2×2 (Figma Container9 @ top:401px) */}
            <div style={{ position: 'absolute', top: 401, left: 56, display: 'grid', gridTemplateColumns: '235px 235px', gridTemplateRows: 'auto auto', gap: '10px' }}>
              {/* Card 1 — Sales Analytics */}
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.909px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 16px 14px' }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>📊</span>
                <p style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 2px' }}>Sales Analytics</p>
                <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.42)', margin: 0, lineHeight: '16.5px', maxWidth: 137 }}>Real-time revenue, units & registrations</p>
              </div>
              {/* Card 2 — Warranty Management */}
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.909px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 16px 14px' }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>🛡️</span>
                <p style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 2px' }}>Warranty Management</p>
                <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.42)', margin: 0, lineHeight: '16.5px', maxWidth: 177 }}>Claim tracking from submission to resolution</p>
              </div>
              {/* Card 3 — Stock & Orders */}
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.909px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 16px 12px' }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>📦</span>
                <p style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 2px' }}>Stock & Orders</p>
                <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.42)', margin: 0, lineHeight: '16.5px' }}>Live inventory levels & order dispatch</p>
              </div>
              {/* Card 4 — Customer Network */}
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '0.909px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '13px 16px 12px' }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 6 }}>👥</span>
                <p style={{ fontFamily: FF, fontWeight: 700, fontSize: 13, color: '#fff', margin: '0 0 2px' }}>Customer Network</p>
                <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.42)', margin: 0, lineHeight: '16.5px' }}>End-customer profiles & tool history</p>
              </div>
            </div>
          </div>

          {/* Pill rows — pinned to bottom of left panel */}
          <div style={{ position: 'relative', zIndex: 1, paddingBottom: 28, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <PillRow pills={ROW1} reverse={false} />
            <PillRow pills={ROW2} reverse={true}  />
            <PillRow pills={ROW3} reverse={false} />
          </div>
        </div>

        {/* ══ RIGHT PANEL — dark form side ══ */}
        <div style={{
          flex: '0 0 42%', position: 'relative', overflow: 'hidden',
          background: '#0f0404',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Decorative orbs (Figma Container94/95) */}
          <div style={{ position: 'absolute', left: '57%', top: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: -40, top: '64%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,106,106,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

          {/* Controls — top right (Figma Container107 @ left:417.8, top:23.99) */}
          <div style={{ position: 'absolute', top: 24, right: 24, display: 'flex', alignItems: 'center', gap: 8, zIndex: 10 }}>
            <DarkBtn darkMode={darkMode} toggle={toggleDarkMode} />
            <LangDropdown fireToast={fireToast} />
          </div>

          {/* Centered form area (Figma Container96) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 40px 44px', position: 'relative', zIndex: 1 }}>
            <div style={{ width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* BEITER full wordmark SVG (Figma Layer @ top 0, mb -44px) */}
              <div style={{ marginBottom: -44 }}>
                <BeiterWordmark />
              </div>

              {/* WELCOME BACK + subtitle */}
              <div style={{ marginBottom: 24, textAlign: 'center', width: '100%', marginTop: 44 }}>
                <h2 className="px-[0px] py-[1px] px-[0px] py-[2px] px-[0px] py-[3px] px-[0px] py-[4px] px-[0px] py-[5px] px-[0px] py-[6px] px-[0px] py-[7px] px-[0px] py-[8px] px-[0px] py-[9px] px-[0px] py-[10px] px-[0px] py-[11px] px-[0px] py-[12px] px-[0px] py-[13px] px-[0px] py-[14px]" style={{ fontFamily: FF, fontWeight: 900, fontSize: 28, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.7px', textTransform: 'uppercase', lineHeight: '33.6px' }}>
                  Welcome back
                </h2>
                <p style={{ fontFamily: FF, fontSize: 13, color: 'rgba(255,255,255,0.40)', margin: 0, lineHeight: '19.5px' }}>
                  Sign in to your Distributor Partner Portal
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ background: 'rgba(227,30,36,0.18)', border: '1px solid rgba(227,30,36,0.40)', borderRadius: 14, padding: '12px 16px', marginBottom: 14, width: '100%', boxSizing: 'border-box' }}>
                    <p style={{ fontFamily: FF, fontSize: 13, color: '#fff', margin: 0 }}>{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email field */}
              <div style={{ width: '100%', marginBottom: 14 }}>
                <label style={{ display: 'block', fontFamily: FF, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.9px', color: 'rgba(255,255,255,0.57)', marginBottom: 7, lineHeight: '15px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@company.de"
                    style={{ width: '100%', height: 50.781, borderRadius: 14, padding: '14px 16px', fontSize: 14, color: '#fff', background: 'rgba(255,255,255,0.15)', border: '0.909px solid rgba(255,255,255,0.10)', outline: 'none', boxSizing: 'border-box', fontFamily: FF, caretColor: '#E31E24', transition: 'border-color 0.15s' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(227,30,36,0.60)')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')} />
                </div>
              </div>

              {/* Password field */}
              <div style={{ width: '100%', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                  <label style={{ fontFamily: FF, fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.9px', color: 'rgba(255,255,255,0.57)', lineHeight: '15px' }}>
                    Password
                  </label>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF, fontWeight: 600, fontSize: 11, color: '#E31E24', padding: 0, lineHeight: '16.5px' }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="••••••••"
                    style={{ width: '100%', height: 50.781, borderRadius: 14, padding: '14px 48px 14px 16px', fontSize: 14, color: '#fff', background: 'rgba(255,255,255,0.15)', border: '0.909px solid rgba(255,255,255,0.10)', outline: 'none', boxSizing: 'border-box', fontFamily: FF, caretColor: '#E31E24', transition: 'border-color 0.15s' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(227,30,36,0.60)')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)')} />
                  <button onClick={() => setShowPw(!showPw)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {/* Eye icon from Figma */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      {showPw
                        ? <path d="M1 1l14 14M6.5 6.6A2.67 2.67 0 0 0 8 10.67a2.67 2.67 0 0 0 2.67-2.67M8 5.33A6.89 6.89 0 0 1 14.67 8M1.33 8A6.89 6.89 0 0 0 8 10.67" stroke="rgba(255,255,255,0.44)" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
                        : <>
                          <path d={svgB.p19e4580} stroke="rgba(255,255,255,0.44)" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="7.33" cy="5.33" r="1.99" stroke="rgba(255,255,255,0.44)" strokeWidth="1.333" />
                        </>
                      }
                    </svg>
                  </button>
                </div>
              </div>

              {/* Sign In button (Figma MotionButton) */}
              <motion.button
                onClick={submit} disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{ width: '100%', height: 51.989, borderRadius: 14, backgroundImage: 'linear-gradient(179.813deg, rgb(243,26,26) 6%, rgb(255,80,80) 93%)', boxShadow: '0px 8px 28px 0px rgba(227,30,36,0.30)', border: 'none', cursor: loading ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.75 : 1, transition: 'opacity 0.15s', marginBottom: 18 }}
              >
                {loading
                  ? <div style={{ width: 20, height: 20, border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  : <span style={{ fontFamily: FF, fontWeight: 700, fontSize: 16, color: '#fff' }}>Sign In</span>
                }
              </motion.button>

              {/* OR divider (Figma Container104) */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <div style={{ flex: 1, height: 0.994, background: 'rgba(255,255,255,0.30)' }} />
                <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>OR</span>
                <div style={{ flex: 1, height: 0.994, background: 'rgba(255,255,255,0.30)' }} />
              </div>

              {/* Apply as a Partner (Figma Button2) */}
              <button
                onClick={() => window.open('https://beitertools.com', '_blank')}
                style={{ width: '100%', height: 50, borderRadius: 14, background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '0.909px', boxSizing: 'border-box', position: 'relative', transition: 'opacity 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ position: 'absolute', inset: 0, borderRadius: 14, border: '0.909px solid rgba(255,255,255,0.30)', pointerEvents: 'none' }} />
                {/* Shield/partner icon */}
                <svg width="18" height="18" viewBox="0 0 17.997 17.997" fill="none" style={{ flexShrink: 0 }}>
                  <path d={svgB.p3ec34400} stroke="white" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" />
                  <path d={svgB.p11f0c6c0} stroke="white" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.9" />
                </svg>
                <span style={{ fontFamily: FF, fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: '21px' }}>Apply as a Partner</span>
              </button>
            </div>
          </div>

          {/* Footer (Figma P12) */}
          <div style={{ padding: '0 40px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: FF, fontSize: 11, color: 'rgba(255,255,255,0.30)', margin: 0, lineHeight: '16.5px' }}>
              BeiterOS v1.0 · Distributor Portal · By Beitertools.com
            </p>
          </div>
        </div>
        {/* end box */}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT — routes to desktop or mobile
   ═══════════════════════════════════════════ */
export default function DistributorAuth() {
  const isDesktop      = useIsDesktop();
  const toggleDarkMode = useDistributorStore((s) => s.toggleDarkMode);
  const darkMode       = useDistributorStore((s) => s.darkMode);
  const [toast, setToast] = useState(false);
  const fireToast = () => { setToast(true); setTimeout(() => setToast(false), 3000); };

  return (
    <>
      <style>{`
        @keyframes pillFwd { from { transform: translateX(0);    } to { transform: translateX(-50%); } }
        @keyframes pillRev { from { transform: translateX(-50%); } to { transform: translateX(0);    } }
        @keyframes spin    { to   { transform: rotate(360deg);  } }
      `}</style>

      {isDesktop
        ? <DesktopAuth darkMode={darkMode} toggleDarkMode={toggleDarkMode} fireToast={fireToast} />
        : <MobileAuth  darkMode={darkMode} toggleDarkMode={toggleDarkMode} fireToast={fireToast} />
      }

      <Toast show={toast} />
    </>
  );
}