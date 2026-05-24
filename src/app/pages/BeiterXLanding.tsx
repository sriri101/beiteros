import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Scan, Shield, Receipt, Gift, Smartphone,
  ChevronDown, CheckCircle2, Sparkles, Mail, MessageCircle,
  QrCode, Package, ArrowRight, Bot, Bell, ChevronRight,
  Barcode, Download, UserCheck,
} from 'lucide-react';
import CompanyLogo from '../../imports/Layer1';
import beiterxImg from 'figma:asset/0907afa14beffe47307c9ef608f1b0efa0652477.png';
import screenHome from 'figma:asset/b2cce03e3723fb81fdb633d11b7a2c2ba45a0f7d.png';
import screenScan from 'figma:asset/4c597ccab05041a782cec6d5cee9dae389112ae0.png';
import screenReceipts from 'figma:asset/c8b58d7586d0ab0a06c62e926b8775ed545cff69.png';
import screenToolbox from 'figma:asset/ff77dc514872551b1ebe195434728c8f82bead97.png';
import screenWarranty from 'figma:asset/ee84e5edd50073c5e5959b082a5db1e3bfc1b4a9.png';
import screenRepairs from 'figma:asset/3781c2b5bed588ad78fe164cc911ad7f13a1de57.png';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-5c3450e9`;

/* ─────────────────────────────────────────────────────────────────────────────
   FORMSPREE INTEGRATION
   Sign up at formspree.io, create a form, and paste your endpoint URL
   into the /setup page. It will be saved to localStorage automatically.
   Format: https://formspree.io/f/xxxxxxxx
*/
const FORMSPREE_URL = localStorage.getItem('beiterx_formspree_url') || '';

/* ── Store buttons component ── */
function StoreButtons({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  const baseBtn = `group relative flex-1 sm:flex-initial flex items-center justify-center gap-2.5 h-[56px] px-4 sm:px-6 rounded-2xl overflow-hidden transition-all duration-300 active:scale-[0.97] ${
    dark
      ? 'bg-gradient-to-b from-white/[0.14] to-white/[0.06] border border-white/[0.14] hover:from-white/[0.18] hover:to-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]'
      : 'bg-gradient-to-b from-[#222] to-[#0a0a0a] border border-black/40 hover:from-[#2a2a2a] hover:to-[#111] shadow-[0_6px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]'
  }`;
  const sublabel = `block ${dark ? 'text-white/55' : 'text-white/55'}`;
  return (
    <div className={`flex flex-row items-stretch gap-2.5 sm:gap-3 w-full sm:w-auto ${className}`}>
      <a
        href="https://apps.apple.com/hk/app/beiter/id6765596572?l=en-GB"
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtn}
      >
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white" className="shrink-0 relative">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
        <div className="text-left relative">
          <span className={sublabel} style={{ fontSize: 10, fontWeight: 500, lineHeight: 1, letterSpacing: '0.02em' }}>
            Download on the
          </span>
          <span className="block text-white" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            App Store
          </span>
        </div>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.beiteros.albaos"
        target="_blank"
        rel="noopener noreferrer"
        className={baseBtn}
      >
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
        <svg width="20" height="22" viewBox="0 0 40 44" className="shrink-0 relative">
          <defs>
            <linearGradient id="gp-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00D2FF"/><stop offset="1" stopColor="#0091EA"/></linearGradient>
            <linearGradient id="gp-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFD93D"/><stop offset="1" stopColor="#FFA000"/></linearGradient>
            <linearGradient id="gp-c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FF5252"/><stop offset="1" stopColor="#D81B60"/></linearGradient>
            <linearGradient id="gp-d" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#00E676"/><stop offset="1" stopColor="#00B248"/></linearGradient>
          </defs>
          <path d="M2 2 L24 22 L2 42 Z" fill="url(#gp-a)" />
          <path d="M24 22 L32 14 L36 22 L32 30 Z" fill="url(#gp-b)" />
          <path d="M2 2 L32 14 L24 22 Z" fill="url(#gp-d)" />
          <path d="M2 42 L32 30 L24 22 Z" fill="url(#gp-c)" />
        </svg>
        <div className="text-left relative">
          <span className={sublabel} style={{ fontSize: 10, fontWeight: 500, lineHeight: 1, letterSpacing: '0.02em' }}>
            GET IT ON
          </span>
          <span className="block text-white" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            Google Play
          </span>
        </div>
      </a>

    </div>
  );
}

/* ── Animated section wrapper (respects prefers-reduced-motion) ── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduced = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── FAQ Item ── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        open
          ? 'bg-[#fafafa] border-[#E31E24]/12 shadow-[0_2px_12px_rgba(227,30,36,0.04)]'
          : 'bg-white border-black/[0.05] hover:border-black/[0.1] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]'
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31E24]"
        style={{ padding: 'clamp(16px, 3vw, 24px)' }}
        aria-expanded={open}
      >
        <span
          className="text-[#111]"
          style={{ fontSize: 'clamp(15px, 1.6vw, 17px)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.45 }}
        >
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: open ? 'rgba(227,30,36,0.06)' : 'rgba(0,0,0,0.03)' }}
        >
          <ChevronDown size={16} color={open ? '#E31E24' : '#999'} strokeWidth={2.5} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="text-[#666]"
              style={{
                padding: '0 clamp(16px, 3vw, 24px) clamp(16px, 3vw, 24px)',
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── App Screens Carousel ── */
function AppScreensCarousel({ large = false }: { large?: boolean }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const screens = [
    { img: screenHome, label: 'Dashboard' },
    { img: screenScan, label: 'Serial Scanner' },
    { img: screenReceipts, label: 'Receipt Vault' },
    { img: screenToolbox, label: 'My Tools' },
    { img: screenWarranty, label: 'Warranty Details' },
    { img: screenRepairs, label: 'Service Locator' },
  ];
  const total = screens.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((p) => (p + 1) % total), 4000);
  }, [total]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    resetTimer();
  }, [resetTimer]);

  /* Swipe support */
  const dragRef = useRef<{ x: number; t: number } | null>(null);

  return (
    <div className="relative select-none">
      {/* Main image area — all images preloaded, only opacity/transform changes */}
      <div
        className="relative overflow-hidden mx-auto"
        style={{ maxWidth: large ? 360 : 320, aspectRatio: '9/19.5' }}
        onPointerDown={(e) => { dragRef.current = { x: e.clientX, t: Date.now() }; }}
        onPointerUp={(e) => {
          if (!dragRef.current) return;
          const dx = e.clientX - dragRef.current.x;
          const dt = Date.now() - dragRef.current.t;
          if (Math.abs(dx) > 40 || (Math.abs(dx) > 15 && dt < 300)) {
            goTo((current + (dx < 0 ? 1 : -1) + total) % total);
          }
          dragRef.current = null;
        }}
      >
        {screens.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt={s.label}
            draggable={false}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover rounded-[28px]"
            style={{
              opacity: i === current ? 1 : 0,
              transform: i === current ? 'scale(1)' : 'scale(0.95)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
              willChange: 'opacity, transform',
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}
        {/* Border overlay */}
        <div className="absolute inset-0 rounded-[28px] pointer-events-none ring-1 ring-black/[0.06] ring-inset z-[2]" />
      </div>

      {/* Label + dots */}
      <div className="text-center mt-5 space-y-3">
        <p
          className="text-[#111]"
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            transition: 'opacity 0.2s ease',
          }}
        >
          {screens[current].label}
        </p>
        <div className="flex items-center justify-center gap-1.5">
          {screens.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to screen ${i + 1}`}
              className="p-1"
            >
              <div
                className="rounded-full"
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  background: i === current ? '#E31E24' : 'rgba(0,0,0,0.12)',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */

export default function BeiterXLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [heroOut, setHeroOut] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setHeroOut(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: QrCode, title: 'Scan QR to Download', desc: 'Scan the QR code on any BEITER tool box to instantly download the BeiterX app on your phone.', bullets: ['One scan to download', 'Works on iOS & Android', 'No searching required'] },
    { icon: Barcode, title: 'Register via Serial Number', desc: 'Scan the serial number on your tool to register it in your digital toolbox and activate your warranty.', bullets: ['Instant registration', 'Automatic warranty activation', 'No manual entry'] },
    { icon: Receipt, title: 'Never Lose a Receipt Again', desc: 'Scan and store purchase receipts securely in your digital vault.', bullets: ['Protect proof of purchase', 'Paperless warranty process', 'Easy access anytime'] },
    { icon: Package, title: 'Your Digital Toolbox', desc: 'Keep all your Beiter tools organized in one simple dashboard.', bullets: ['View your full tool collection', 'Track tool information', 'Manage tools easily'] },
    { icon: Gift, title: 'Rewards & Easy Repairs', desc: 'Earn rewards for registering tools and quickly find authorized repair centers.', bullets: ['Loyalty rewards', 'Official service locations', 'Reliable repairs'] },
    { icon: Bot, title: 'AI Tool Assistant', desc: 'Check warranty status in real time, get troubleshooting help, and ask questions about any tool in your toolbox.', bullets: ['Real-time warranty checks', 'Answers about your tools', 'Maintenance guidance'] },
  ];

  const faqs = [
    { q: 'Is BeiterX free to use?', a: 'Yes, BeiterX is completely free for all BEITER tool owners. Download, register your tools, and enjoy all features at no cost.' },
    { q: 'How do I register my tools?', a: 'Scan the serial number on your BEITER tool with the BeiterX app. Registration takes less than 3 seconds and automatically activates your warranty.' },
    { q: 'What are AI Tokens?', a: 'AI Tokens let you interact with your Professional Tool Assistant -- check warranty status in real time, get troubleshooting help, and ask questions about any tool in your toolbox.' },
    { q: 'Which tools are supported?', a: 'All BEITER power tools with a serial number are supported. This includes drills, saws, grinders, and the full professional range.' },
    { q: 'Where can I download BeiterX?', a: 'BeiterX is available now on the App Store and Google Play. Tap any download button on this page to get the app on your device.' },
  ];

  return (
    <div className="min-h-screen bg-[#f2f2f5] text-[#111] overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>

      {/* ── Sticky Nav ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,0.06),0_4px_20px_rgba(0,0,0,0.03)]'
            : 'bg-white/80 backdrop-blur-lg'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-[72px]">
          <div className="w-[104px] h-7 relative" style={{ '--fill-0': '#111' } as React.CSSProperties}>
            <CompanyLogo />
          </div>
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'FAQ', href: '#faq' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-[#555] hover:text-[#111] hover:bg-black/[0.03] transition-all"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://apps.apple.com/hk/app/beiter/id6765596572?l=en-GB"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 px-6 h-[44px] flex items-center rounded-full bg-[#E31E24] text-white hover:bg-[#c9191e] active:scale-[0.97] transition-all shadow-[0_2px_8px_rgba(227,30,36,0.25)]"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Download
            </a>
          </div>
          <a
            href="https://apps.apple.com/hk/app/beiter/id6765596572?l=en-GB"
            target="_blank"
            rel="noopener noreferrer"
            className="md:hidden h-[40px] px-5 flex items-center rounded-full bg-[#E31E24] text-white active:scale-[0.96] transition-transform"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            Download
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ── HERO — First fold: headline + notification CTA + app image ── */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="pt-[104px] md:pt-[120px] px-5 md:px-8" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Two-column layout on md+: left = text+CTA, right = phone */}
          <div className="flex flex-col md:flex-row md:items-center md:gap-12 lg:gap-16">

            {/* ── Left column ── */}
            <div className="flex-1 text-center md:text-left">
              {/* Pre-launch pill */}
              <FadeIn>
                <div className="inline-flex items-center gap-2.5 mb-6 md:mb-7">
                  <span className="relative flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31E24] opacity-50" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E31E24]" />
                    </span>
                    <span className="text-[#E31E24] text-[11px] tracking-[0.08em] uppercase" style={{ fontWeight: 800 }}>
                      Now Live
                    </span>
                  </span>
                </div>
              </FadeIn>

              {/* Headline */}
              <FadeIn delay={0.06}>
                <h1
                  style={{
                    fontSize: 'clamp(32px, 6.5vw, 64px)',
                    fontWeight: 900,
                    lineHeight: 1.05,
                    letterSpacing: '-0.035em',
                  }}
                  className="mb-4 md:mb-5"
                >
                  The companion app{' '}
                  <br className="hidden md:block" />
                  for <span className="text-[#E31E24]">BEITER tools.</span>
                </h1>
              </FadeIn>

              {/* Subtitle */}
              <FadeIn delay={0.12}>
                <p
                  className="text-[#777] max-w-md mx-auto md:mx-0 mb-7 md:mb-8"
                  style={{ fontSize: 'clamp(15px, 1.6vw, 17px)', lineHeight: 1.7, letterSpacing: '-0.005em' }}
                >Register tools, manage warranties, store receipts, and get AI-powered support -- all in one place. Built for professionals who rely on BEITER every day.</p>
              </FadeIn>

              {/* ── Mobile-only carousel (between subtitle and CTA) ── */}
              <FadeIn delay={0.15} className="md:hidden mb-8">
                <div className="relative mx-auto" style={{ width: 'min(75vw, 320px)' }}>
                  <div className="absolute -inset-12 bg-[#E31E24]/[0.03] rounded-full blur-3xl pointer-events-none" />
                  <AppScreensCarousel large={false} />
                </div>
              </FadeIn>

              {/* ── Download CTA — the main first-fold action ── */}
              <FadeIn delay={0.18}>
                <div className="max-w-[420px] mx-auto md:mx-0">
                  <StoreButtons className="justify-center md:justify-start" />
                </div>
              </FadeIn>
            </div>

            {/* ── Right column — Phone mockup (desktop only) ── */}
            <FadeIn delay={0.3} className="flex-shrink-0 mt-10 md:mt-0 hidden md:block">
              <div className="relative mx-auto" style={{ width: 'clamp(280px, 45vw, 380px)' }}>
                <div className="absolute -inset-16 bg-[#E31E24]/[0.03] rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -inset-6 bg-gradient-to-b from-[#E31E24]/[0.06] via-transparent to-[#E31E24]/[0.02] rounded-[48px] blur-2xl pointer-events-none" />
                <AppScreensCarousel large />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-[#fafafa] border-t border-b border-black/[0.04]" style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <FadeIn>
            <div className="text-center mb-10 md:mb-14">
              <span
                className="inline-block text-[#E31E24] text-[11px] tracking-[0.14em] uppercase mb-3"
                style={{ fontWeight: 700 }}
              >
                Features
              </span>
              <h2
                style={{
                  fontSize: 'clamp(26px, 5vw, 44px)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                Everything you need.
                <br />
                <span className="text-[#E31E24]">Nothing you don't.</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
                  className="bg-white rounded-2xl border border-black/[0.04] p-6 md:p-7 h-full flex flex-col gap-4 cursor-default hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:border-black/[0.08] transition-[box-shadow,border-color] duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFF0F0] to-[#FFE8E8] flex items-center justify-center shrink-0">
                    <f.icon size={22} color="#E31E24" strokeWidth={1.8} />
                  </div>
                  <h3
                    className="text-[#111]"
                    style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-[#888] flex-1" style={{ fontSize: 14, lineHeight: 1.65 }}>
                    {f.desc}
                  </p>
                  <div className="space-y-2.5 pt-1">
                    {f.bullets.map((b, j) => (
                      <div key={j} className="flex items-center gap-2.5">
                        <div className="w-[18px] h-[18px] rounded-full bg-[#E31E24]/[0.07] flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} color="#E31E24" strokeWidth={2.5} />
                        </div>
                        <span className="text-[#555]" style={{ fontSize: 13, fontWeight: 500 }}>
                          {b}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <FadeIn>
            <div className="text-center mb-10 md:mb-16">
              <span
                className="inline-block text-[#E31E24] text-[11px] tracking-[0.14em] uppercase mb-3"
                style={{ fontWeight: 700 }}
              >
                How It Works
              </span>
              <h2
                style={{
                  fontSize: 'clamp(26px, 5vw, 44px)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                From box to <span className="text-[#E31E24]">protected.</span>
              </h2>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-[40px] left-[calc(16.66%+32px)] right-[calc(16.66%+32px)] h-px bg-gradient-to-r from-[#E31E24]/15 via-[#E31E24]/25 to-[#E31E24]/15" />

            <div className="flex flex-col gap-8 md:gap-0 md:grid md:grid-cols-3 md:gap-x-10">
              {[
                { num: '01', icon: QrCode, title: 'Scan QR Code', desc: 'Find the QR code on your BEITER tool box and scan it to download the BeiterX app.' },
                { num: '02', icon: Barcode, title: 'Register Your Tool', desc: 'Scan the serial number on your tool to add it to your digital toolbox and activate your warranty.' },
                { num: '03', icon: Shield, title: 'You\'re Protected', desc: 'Warranty activated, receipts stored, and AI assistant ready to help with all your tools.' },
              ].map((step, i) => (
                <FadeIn key={step.num} delay={i * 0.12}>
                  <div className="flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center">
                    <div className="relative shrink-0 md:mb-6">
                      <div className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-2xl bg-gradient-to-br from-[#FFF0F0] to-[#FFE8E8] flex items-center justify-center shadow-[0_4px_16px_rgba(227,30,36,0.08)]">
                        <step.icon size={26} color="#E31E24" strokeWidth={1.8} />
                      </div>
                      <span
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[#E31E24] text-white flex items-center justify-center text-[11px] shadow-[0_2px_8px_rgba(227,30,36,0.3)]"
                        style={{ fontWeight: 800 }}
                      >
                        {step.num}
                      </span>
                    </div>
                    <div>
                      <h3
                        className="text-[#111] mb-2"
                        style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em' }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-[#888]" style={{ fontSize: 14, lineHeight: 1.65 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: 'clamp(48px, 8vw, 96px) 0' }}>
        <div className="max-w-2xl mx-auto px-5 md:px-8">
          <FadeIn>
            <div className="text-center mb-10 md:mb-14">
              <span
                className="inline-block text-[#E31E24] text-[11px] tracking-[0.14em] uppercase mb-3"
                style={{ fontWeight: 700 }}
              >
                FAQ
              </span>
              <h2
                style={{
                  fontSize: 'clamp(26px, 5vw, 44px)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                Common <span className="text-[#E31E24]">questions.</span>
              </h2>
            </div>
          </FadeIn>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FadeIn key={faq.q} delay={i * 0.05}>
                <FAQItem question={faq.q} answer={faq.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─ CTA Banner ── */}
      <section className="bg-[#111] relative overflow-hidden" style={{ padding: 'clamp(48px, 8vw, 80px) 0' }}>
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#E31E24]/[0.06] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center px-5 md:px-8 relative">
          <FadeIn>
            <h2
              className="text-white mb-5"
              style={{
                fontSize: 'clamp(26px, 5vw, 44px)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.025em',
              }}
            >
              Built for builders.
            </h2>
            <p className="text-white/50 max-w-md mx-auto mb-8" style={{ fontSize: 16, lineHeight: 1.7 }}>
              Download BeiterX and take control of your tools. Warranties, receipts, support, and service -- all in your pocket.
            </p>
            <StoreButtons dark className="justify-center" />
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-black/[0.06]" style={{ padding: 'clamp(32px, 4vw, 48px) 0' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-5 md:px-8">
          <div className="w-24 h-7 relative opacity-25" style={{ '--fill-0': '#111' } as React.CSSProperties}>
            <CompanyLogo />
          </div>
          <p className="text-[#bbb]" style={{ fontSize: 13 }}>
            BeiterX v1.0 -- Available now on iOS and Android
          </p>
          <p className="text-[#ccc]" style={{ fontSize: 12 }}>
            &copy; {new Date().getFullYear()} BEITER. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ── Sticky Mobile CTA Bar ── */}
      <AnimatePresence>
        {heroOut && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-black/[0.06] shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-[#111] truncate" style={{ fontSize: 14, fontWeight: 700 }}>
                  BeiterX is now live
                </p>
                <p className="text-[#999] truncate" style={{ fontSize: 12 }}>
                  Download + 1,000 free AI Tokens
                </p>
              </div>
              <a
                href="https://apps.apple.com/hk/app/beiter/id6765596572?l=en-GB"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 h-[44px] px-5 flex items-center rounded-xl bg-[#E31E24] text-white active:scale-[0.96] transition-transform shadow-[0_2px_8px_rgba(227,30,36,0.25)]"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Get App <ArrowRight size={14} className="ml-1.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}