import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Moon, Sun, Globe, ChevronDown, X, Briefcase, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';
import img41 from 'figma:asset/61d9291ceabbdb26824c0e4f5dea212211a9627e.png';
import { imgRectangle } from '../../imports/svg-vnofc';

const BG      = 'linear-gradient(140.989deg, #111111 8.49%, #1A1A1A 50%, #E31E24 91.51%)';
const BG_DARK = 'linear-gradient(140.989deg, #0A0A0A 8.49%, #111111 50%, #B01018 91.51%)';

const LANGUAGES = [
  { code: 'en' as const, label: 'English', flag: '🇬🇧' },
  { code: 'de' as const, label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr' as const, label: 'Français', flag: '🇫🇷' },
  { code: 'ar' as const, label: 'العربية', flag: '🇸🇦' },
];

const PILL_ROWS = [
  ['🔒 Warranty Protection', '📱 QR Registration', '🏅 Earn Rewards', '🔧 Maintenance Tracker', '⚡ Tool Scanner'],
  ['🧾 Receipt Vault', '🤖 AI Tool Assistance', '🗺️ Repair Shops Map', '📊 Usage Stats', '🌟 Pro Features'],
  ['💡 Tips & Reminders', '🔗 Compatibility Guide', '🎯 Daily Challenges', '🛡️ Extended Warranty'],
];

const INDUSTRY_GROUPS = [
  {
    group: '🏠 Consumer & DIY',
    options: [
      { value: 'home_diy',        label: 'Home DIYer / Hobbyist',         icon: '🏠' },
      { value: 'home_renovation', label: 'Home Renovation & Remodelling',  icon: '🔨' },
      { value: 'interior_design', label: 'Interior Design & Decoration',   icon: '🎨' },
    ],
  },
  {
    group: '🏗️ Construction & Trades',
    options: [
      { value: 'general_contractor', label: 'General Contractor / Builder',    icon: '🏗️' },
      { value: 'carpentry',          label: 'Carpentry & Joinery',             icon: '🪵' },
      { value: 'masonry',            label: 'Masonry, Concrete & Tiling',      icon: '🧱' },
      { value: 'roofing',            label: 'Roofing & Waterproofing',         icon: '🏚️' },
      { value: 'flooring',           label: 'Flooring & Surface Finishing',    icon: '🪵' },
      { value: 'painting',           label: 'Painting & Surface Prep',         icon: '🖌️' },
      { value: 'scaffolding',        label: 'Scaffolding & Formwork',          icon: '🔩' },
    ],
  },
  {
    group: '⚡ Electrical, Mechanical & HVAC',
    options: [
      { value: 'electrician',  label: 'Electrician & Wiring',             icon: '⚡' },
      { value: 'plumbing',     label: 'Plumbing & Pipefitting',           icon: '🔧' },
      { value: 'hvac',         label: 'HVAC & Refrigeration',             icon: '❄️' },
      { value: 'automation',   label: 'Building Automation & Smart Home', icon: '🏠' },
    ],
  },
  {
    group: '🏭 Industrial & Manufacturing',
    options: [
      { value: 'metalworking',   label: 'Metalworking & Fabrication',     icon: '⚙️' },
      { value: 'welding',        label: 'Welding & Cutting',              icon: '🔥' },
      { value: 'manufacturing',  label: 'Industrial Manufacturing',       icon: '🏭' },
      { value: 'mining',         label: 'Mining & Heavy Industry',        icon: '⛏️' },
      { value: 'automotive',     label: 'Automotive & Vehicle Mechanics', icon: '🚗' },
      { value: 'aerospace',      label: 'Aerospace & Precision Eng.',     icon: '✈️' },
    ],
  },
  {
    group: '🛒 Trade & Distribution',
    options: [
      { value: 'tool_dealer',    label: 'Tool Dealer / Retailer',         icon: '🛒' },
      { value: 'tool_rental',    label: 'Equipment Rental',               icon: '📦' },
      { value: 'distributor',    label: 'Wholesale Distributor',          icon: '🚚' },
      { value: 'tool_repair',    label: 'Tool Repair & Service Tech',     icon: '🔧' },
    ],
  },
  {
    group: '📐 Design & Engineering',
    options: [
      { value: 'architecture',   label: 'Architecture & Structural Eng.', icon: '📐' },
      { value: 'civil_eng',      label: 'Civil & Infrastructure Eng.',    icon: '🌉' },
      { value: 'product_design', label: 'Product & Industrial Design',    icon: '✏️' },
    ],
  },
  {
    group: '📚 Education & Other',
    options: [
      { value: 'vocational',     label: 'Vocational Trainer / Teacher',   icon: '📚' },
      { value: 'landscaping',    label: 'Landscaping & Outdoor Work',     icon: '🌿' },
      { value: 'other',          label: 'Other',                          icon: '💼' },
    ],
  },
];

const ALL_OPTIONS = INDUSTRY_GROUPS.flatMap((g) => g.options);

/* ─── Logo icon (used in both splash and login) ──────────── */
function LogoIcon({ size = 80 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, flexShrink: 0, position: 'relative' }}>
      {/* Teal gradient rounded square */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size * 0.27,
          backgroundImage: 'linear-gradient(135deg, rgb(0,174,239) 0%, rgb(0,137,192) 100%)',
          boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* White blob logo — no black bg */}
        <img
          alt="BeiterOs Logo"
          src={img41}
          style={{
            position: 'absolute',
            top: '2.5%',
            left: '5%',
            width: '91%',
            height: '95%',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}

/* ─── Splash screen ──────────────────────────────────────── */
function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      key="splash"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      exit={{ opacity: 0, scale: 1.06 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Concentric pulse rings */}
      {[80, 130, 185, 245].map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: d,
            height: d,
            border: '1px solid rgba(255,255,255,0.18)',
          }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: [0, 0.7, 0], scale: [0.75, 1, 1.15] }}
          transition={{
            duration: 2.4,
            delay: 0.4 + i * 0.35,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Glow halo behind logo */}
      <motion.div
        className="absolute rounded-full"
        style={{ width: 160, height: 160, background: 'radial-gradient(circle, rgba(0,174,239,0.35) 0%, transparent 70%)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.8 }}
      />

      {/* Logo icon — spring in */}
      <motion.div
        initial={{ scale: 0.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.15 }}
        style={{ filter: 'drop-shadow(0 0 32px rgba(0,174,239,0.7))' }}
      >
        <LogoIcon size={110} />
      </motion.div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          marginTop: 30,
          fontSize: 42,
          fontWeight: 900,
          color: 'white',
          letterSpacing: -1.1,
          lineHeight: 1,
        }}
      >
        BeiterOs
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.0, duration: 0.4 }}
        style={{ fontSize: 13, color: 'white', marginTop: 10, textAlign: 'center' }}
      >
        By Beiter Power Tools
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35 }}
        style={{ display: 'flex', gap: 8, marginTop: 48 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'white' }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{
              duration: 0.85,
              delay: i * 0.22,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Feature pill marquee row ───────────────────────────── */
function PillRow({ pills, dir, speed = 22 }: { pills: string[]; dir: 'left' | 'right'; speed?: number }) {
  const doubled = [...pills, ...pills];
  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
        maskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <motion.div
        style={{ display: 'flex', gap: 8, whiteSpace: 'nowrap' }}
        animate={{ x: dir === 'left' ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      >
        {doubled.map((pill, i) => (
          <span
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 27,
              padding: '0 14px',
              borderRadius: 100,
              background: 'rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.80)',
              fontSize: 11,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {pill}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main Auth component ────────────────────────────────── */
export default function Auth() {
  const navigate = useNavigate();
  const {
    authMode, setAuthMode,
    setAuthenticated, setUser,
    darkMode, toggleDarkMode,
    language, setLanguage,
  } = useAppStore();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: 'timothy@beitertools.com',
    password: 'password123',
    userType: 'DIYer',
    industry: '',
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const t = useTranslation();
  const currentLang = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  const onSplashDone = useCallback(() => setSplashDone(true), []);

  const openSignIn = () => { setAuthMode('login'); setShowForm(true); };
  const openSignUp = () => { setAuthMode('signup'); setShowForm(true); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (authMode === 'signup') {
        setUser({ name: form.name || 'Timothy Ho', email: form.email, user_type: form.userType as 'DIYer' | 'Pro' });
      }
      setAuthenticated(true);
      setLoading(false);
      setShowForm(false);
      navigate('/app/home');
    }, 1200);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{
        background: darkMode ? BG_DARK : BG,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        transition: 'background 0.4s ease',
      }}
    >
      {/* Decorative blobs */}
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 288, height: 288, top: -86, right: -40, background: '#00AEEF', opacity: 0.10 }} />
      <div className="absolute rounded-full pointer-events-none"
        style={{ width: 224, height: 224, bottom: 28, left: -67, background: '#00AEEF', opacity: 0.10 }} />

      {/* ── Splash overlay ─────────────────────────────────── */}
      <AnimatePresence>
        {!splashDone && <SplashScreen onDone={onSplashDone} />}
      </AnimatePresence>

      {/* ── Main login screen ──────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: splashDone ? 1 : 0 }}
        transition={{ duration: 0.45, delay: splashDone ? 0.08 : 0 }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-end gap-2 px-4 pt-12 pb-2">
          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleDarkMode}
            className="flex items-center justify-center rounded-full flex-shrink-0"
            style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.10)' }}
          >
            {darkMode ? <Sun size={16} color="white" /> : <Moon size={16} color="white" />}
          </motion.button>

          {/* Language selector */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLangMenu((o) => !o)}
              className="flex items-center rounded-full"
              style={{ height: 36, padding: '0 12px', gap: 6, background: 'rgba(255,255,255,0.10)' }}
            >
              <Globe size={14} color="white" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                {currentLang.flag} {currentLang.label}
              </span>
              <ChevronDown size={12} color="rgba(255,255,255,0.6)" />
            </motion.button>

            <AnimatePresence>
              {showLangMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowLangMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 z-50 rounded-2xl overflow-hidden"
                    style={{
                      minWidth: 160,
                      background: 'rgba(0,43,73,0.95)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    {LANGUAGES.map((lang, i) => (
                      <button
                        key={lang.code}
                        onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left"
                        style={{
                          borderBottom: i < LANGUAGES.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                          background: language === lang.code ? 'rgba(0,174,239,0.15)' : 'transparent',
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{lang.flag}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: language === lang.code ? '#00AEEF' : 'rgba(255,255,255,0.85)' }}>
                          {lang.label}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Hero section ─────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Logo icon */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.85 }}
            animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : -16, scale: splashDone ? 1 : 0.85 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24, delay: 0.15 }}
            style={{ marginBottom: 20 }}
          >
            <LogoIcon size={80} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 14 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            style={{
              fontSize: 38,
              fontWeight: 900,
              color: 'white',
              letterSpacing: -0.95,
              lineHeight: 1.1,
              textAlign: 'center',
              marginBottom: 10,
            }}
          >
            BeiterOs
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: splashDone ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{ fontSize: 12, color: 'rgba(255,255,255,0.62)', textAlign: 'center', marginBottom: 44 }}
          >
            "The ecosystem that links it all the way it supposed to be"
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="w-full"
            style={{ maxWidth: 380 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: splashDone ? 1 : 0, y: splashDone ? 0 : 20 }}
            transition={{ delay: 0.38, duration: 0.5 }}
          >
            {/* Sign In */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openSignIn}
              className="w-full flex items-center justify-center text-white"
              style={{
                height: 56,
                borderRadius: 16,
                background: 'linear-gradient(171.616deg, #00AEEF 0%, #0089C0 100%)',
                fontSize: 17,
                fontWeight: 700,
                marginBottom: 12,
                boxShadow: '0 8px 24px rgba(0,174,239,0.35)',
              }}
            >
              {t.auth.signIn}
            </motion.button>

            {/* Create Account */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openSignUp}
              className="w-full flex items-center justify-center text-white"
              style={{
                height: 56,
                borderRadius: 16,
                background: 'transparent',
                border: '1.572px solid rgba(255,255,255,0.30)',
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              {t.auth.createAccount}
            </motion.button>
          </motion.div>
        </div>

        {/* ── Feature pill marquee ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 1 : 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
        >
          <PillRow pills={PILL_ROWS[0]} dir="left"  speed={24} />
          <PillRow pills={PILL_ROWS[1]} dir="right" speed={20} />
          <PillRow pills={PILL_ROWS[2]} dir="left"  speed={26} />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: splashDone ? 1 : 0 }}
          transition={{ delay: 0.6 }}
          className="text-center pb-8 pt-2"
        >
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.50)' }}>
            BeiterOS v1.0 · By Beiterools.com
          </p>
          <Link
            to="/dist/auth"
            style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: 1 }}
          >
            Distributor Portal →
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Form bottom sheet ───────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <div
            className="fixed inset-0 z-[100] flex items-end"
            style={{ background: 'rgba(0,0,0,0.65)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-full flex flex-col"
              style={{
                maxHeight: '90vh',
                background: darkMode ? '#0B1826' : '#FFFFFF',
                borderRadius: '24px 24px 0 0',
                border: darkMode ? '1px solid rgba(0,174,239,0.12)' : 'none',
                borderBottom: 'none',
              }}
            >
              {/* Handle + header */}
              <div
                className="relative flex-shrink-0 flex items-center justify-between px-5"
                style={{
                  paddingTop: 20,
                  paddingBottom: 16,
                  borderBottom: `1px solid ${darkMode ? 'rgba(0,174,239,0.12)' : '#F2F2F7'}`,
                }}
              >
                <div
                  className="absolute rounded-full"
                  style={{ width: 36, height: 4, top: 8, left: '50%', transform: 'translateX(-50%)', background: darkMode ? 'rgba(0,174,239,0.35)' : '#D1D5DB' }}
                />
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: darkMode ? '#FFFFFF' : '#1D1D1F' }}>
                    {authMode === 'login' ? t.auth.signIn : t.auth.createAccount}
                  </h3>
                  <p style={{ fontSize: 13, color: darkMode ? 'rgba(0,174,239,0.7)' : '#6C6C70', marginTop: 2 }}>
                    {authMode === 'login' ? 'Welcome back to BeiterOs' : 'Join the BeiterOs ecosystem'}
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 32, height: 32, background: darkMode ? 'rgba(0,174,239,0.12)' : '#F2F2F7' }}
                >
                  <X size={16} color={darkMode ? '#00AEEF' : '#8E8E93'} />
                </button>
              </div>

              {/* Segmented control */}
              <div className="flex-shrink-0 px-5 pt-4">
                <div className="flex rounded-2xl p-1" style={{ background: darkMode ? 'rgba(0,174,239,0.08)' : '#E5E5EA', border: darkMode ? '1px solid rgba(0,174,239,0.15)' : 'none' }}>
                  {(['login', 'signup'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAuthMode(mode)}
                      className="flex-1 py-2.5 rounded-xl transition-all"
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        background: authMode === mode
                          ? (darkMode ? 'linear-gradient(135deg, #00AEEF 0%, #0089C0 100%)' : 'linear-gradient(135deg, #00AEEF 0%, #0089C0 100%)')
                          : 'transparent',
                        color: authMode === mode ? '#FFFFFF' : (darkMode ? 'rgba(0,174,239,0.6)' : '#6C6C70'),
                        boxShadow: authMode === mode ? '0 2px 8px rgba(0,174,239,0.35)' : 'none',
                      }}
                    >
                      {mode === 'login' ? t.auth.signIn : t.auth.createAccount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 min-h-0">
                <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: darkMode ? 'rgba(0,174,239,0.8)' : '#6C6C70', marginBottom: 6 }}>
                        {t.auth.fullName}
                      </label>
                      <input
                        type="text" required placeholder={t.auth.fullNamePlaceholder} value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full focus:outline-none focus:ring-2 focus:ring-[#00AEEF] transition-all"
                        style={{ background: darkMode ? 'rgba(0,174,239,0.08)' : '#F2F2F7', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: darkMode ? '#FFFFFF' : '#1D1D1F', border: darkMode ? '1px solid rgba(0,174,239,0.15)' : 'none' }}
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: darkMode ? 'rgba(0,174,239,0.8)' : '#6C6C70', marginBottom: 6 }}>
                      {t.auth.emailAddress}
                    </label>
                    <input
                      type="email" required placeholder={t.auth.emailPlaceholder} value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full focus:outline-none focus:ring-2 focus:ring-[#00AEEF] transition-all"
                      style={{ background: darkMode ? 'rgba(0,174,239,0.08)' : '#F2F2F7', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: darkMode ? '#FFFFFF' : '#1D1D1F', border: darkMode ? '1px solid rgba(0,174,239,0.15)' : 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: darkMode ? 'rgba(0,174,239,0.8)' : '#6C6C70', marginBottom: 6 }}>
                      {t.auth.password}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'} required placeholder="••••••••" value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full focus:outline-none focus:ring-2 focus:ring-[#00AEEF] transition-all"
                        style={{ background: darkMode ? 'rgba(0,174,239,0.08)' : '#F2F2F7', borderRadius: 12, padding: '13px 48px 13px 16px', fontSize: 15, color: darkMode ? '#FFFFFF' : '#1D1D1F', border: darkMode ? '1px solid rgba(0,174,239,0.15)' : 'none' }}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: darkMode ? '#00AEEF' : '#8E8E93' }}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {authMode === 'signup' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: darkMode ? 'rgba(0,174,239,0.8)' : '#6C6C70', marginBottom: 6 }}>
                          {t.auth.iAmA}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['DIYer', 'Pro'].map((type) => (
                            <button key={type} type="button" onClick={() => setForm({ ...form, userType: type })}
                              style={{
                                padding: '12px 0', borderRadius: 12, fontSize: 14, fontWeight: 600, border: '2px solid',
                                background: form.userType === type
                                  ? 'linear-gradient(135deg, #00AEEF 0%, #0089C0 100%)'
                                  : 'transparent',
                                color: form.userType === type ? 'white' : (darkMode ? 'rgba(0,174,239,0.7)' : '#1D1D1F'),
                                borderColor: form.userType === type ? '#00AEEF' : (darkMode ? 'rgba(0,174,239,0.2)' : '#E5E5EA'),
                                boxShadow: form.userType === type ? '0 2px 8px rgba(0,174,239,0.35)' : 'none',
                              }}>
                              {type === 'DIYer' ? t.auth.diyerLabel : t.auth.proLabel}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ── Industry field ───────────────────────────── */}
                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: darkMode ? 'rgba(0,174,239,0.8)' : '#6C6C70', marginBottom: 6 }}>
                          Your Industry Background
                        </label>

                        {/* Trigger button */}
                        <button
                          type="button"
                          onClick={() => setShowIndustryDropdown((o) => !o)}
                          className="w-full flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#00AEEF] transition-all"
                          style={{
                            background: darkMode ? 'rgba(0,174,239,0.08)' : '#F2F2F7',
                            borderRadius: 12,
                            padding: '13px 16px',
                            fontSize: 15,
                            color: form.industry ? (darkMode ? '#FFFFFF' : '#1D1D1F') : (darkMode ? 'rgba(255,255,255,0.3)' : '#8E8E93'),
                            border: showIndustryDropdown
                              ? '1px solid #00AEEF'
                              : darkMode ? '1px solid rgba(0,174,239,0.15)' : 'none',
                          }}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {form.industry ? (
                              <>
                                <span>{ALL_OPTIONS.find((o) => o.value === form.industry)?.icon}</span>
                                <span className="truncate">{ALL_OPTIONS.find((o) => o.value === form.industry)?.label}</span>
                              </>
                            ) : (
                              <>
                                <Briefcase size={15} style={{ opacity: 0.45, flexShrink: 0 }} />
                                <span>Select your field…</span>
                              </>
                            )}
                          </span>
                          <motion.div
                            animate={{ rotate: showIndustryDropdown ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ flexShrink: 0 }}
                          >
                            <ChevronDown size={16} color={darkMode ? 'rgba(0,174,239,0.6)' : '#8E8E93'} />
                          </motion.div>
                        </button>

                        {/* Animated panel */}
                        <AnimatePresence>
                          {showIndustryDropdown && (
                            <motion.div
                              initial={{ opacity: 0, y: -8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -8, scale: 0.97 }}
                              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="overflow-y-auto"
                              style={{
                                marginTop: 6,
                                borderRadius: 14,
                                background: darkMode ? '#0E2035' : '#FFFFFF',
                                border: darkMode ? '1px solid rgba(0,174,239,0.18)' : '1px solid #E5E5EA',
                                boxShadow: darkMode
                                  ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,174,239,0.08)'
                                  : '0 8px 32px rgba(0,0,0,0.12)',
                                maxHeight: 280,
                                zIndex: 10,
                                position: 'relative',
                              }}
                            >
                              {INDUSTRY_GROUPS.map((group, gi) => (
                                <div key={gi}>
                                  {/* Group header */}
                                  <div
                                    style={{
                                      padding: '8px 14px 4px',
                                      fontSize: 10,
                                      fontWeight: 700,
                                      letterSpacing: 0.6,
                                      textTransform: 'uppercase',
                                      color: darkMode ? 'rgba(0,174,239,0.55)' : '#8E8E93',
                                      borderTop: gi > 0 ? `1px solid ${darkMode ? 'rgba(0,174,239,0.08)' : '#F2F2F7'}` : 'none',
                                    }}
                                  >
                                    {group.group}
                                  </div>
                                  {/* Options */}
                                  {group.options.map((opt, oi) => {
                                    const isSelected = form.industry === opt.value;
                                    return (
                                      <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => { setForm({ ...form, industry: opt.value }); setShowIndustryDropdown(false); }}
                                        className="w-full flex items-center gap-3 px-4 text-left transition-all"
                                        style={{
                                          height: 42,
                                          background: isSelected
                                            ? (darkMode ? 'rgba(0,174,239,0.14)' : 'rgba(0,174,239,0.07)')
                                            : 'transparent',
                                          borderBottom: oi < group.options.length - 1
                                            ? `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : '#F7F7F7'}`
                                            : 'none',
                                        }}
                                      >
                                        <span style={{ fontSize: 16, flexShrink: 0 }}>{opt.icon}</span>
                                        <span
                                          style={{
                                            flex: 1,
                                            fontSize: 14,
                                            fontWeight: isSelected ? 600 : 400,
                                            color: isSelected ? '#00AEEF' : (darkMode ? 'rgba(255,255,255,0.85)' : '#1D1D1F'),
                                          }}
                                        >
                                          {opt.label}
                                        </span>
                                        {isSelected && (
                                          <Check size={14} color="#00AEEF" style={{ flexShrink: 0 }} />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: darkMode ? 'rgba(0,174,239,0.8)' : '#6C6C70', marginBottom: 6 }}>
                          {t.auth.referralCode}
                        </label>
                        <input type="text" placeholder={t.auth.referralPlaceholder}
                          className="w-full focus:outline-none focus:ring-2 focus:ring-[#00AEEF] transition-all uppercase"
                          style={{ background: darkMode ? 'rgba(0,174,239,0.08)' : '#F2F2F7', borderRadius: 12, padding: '13px 16px', fontSize: 15, color: darkMode ? '#FFFFFF' : '#1D1D1F', border: darkMode ? '1px solid rgba(0,174,239,0.15)' : 'none' }} />
                      </div>
                    </>
                  )}
                </form>
              </div>

              {/* Sticky submit */}
              <div
                className="flex-shrink-0 px-5 pb-10 pt-3"
                style={{ borderTop: `1px solid ${darkMode ? 'rgba(0,174,239,0.12)' : '#F2F2F7'}`, background: darkMode ? '#0B1826' : '#FFFFFF' }}
              >
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  form="auth-form" type="submit" disabled={loading}
                  className="w-full flex items-center justify-center text-white"
                  style={{
                    height: 56, borderRadius: 16, fontSize: 17, fontWeight: 700,
                    background: loading ? (darkMode ? 'rgba(0,174,239,0.2)' : '#C7C7CC') : 'linear-gradient(172deg, #00AEEF 0%, #0089C0 100%)',
                    boxShadow: loading ? 'none' : '0 6px 20px rgba(0,174,239,0.35)',
                  }}
                >
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : authMode === 'login' ? t.auth.signIn : t.auth.createAccount}
                </motion.button>

                <p className="text-center mt-4" style={{ fontSize: 14, color: darkMode ? 'rgba(0,174,239,0.6)' : '#6C6C70' }}>
                  {authMode === 'login' ? t.auth.dontHave : t.auth.alreadyHave}{' '}
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    style={{ color: '#00AEEF', fontWeight: 600 }}>
                    {authMode === 'login' ? t.auth.signUp : t.auth.signIn}
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}