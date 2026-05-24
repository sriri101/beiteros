import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  Shield, Scan, BarChart3, Users, Globe,
  ArrowRight, ChevronRight, Menu, X, Mail,
  Smartphone, Monitor, Bot, MapPin, FileText,
  ShoppingCart, Image, Bell, Zap,
  CheckCircle2, Sparkles, ChevronDown,
  Factory, Truck, Wrench, XCircle, MinusCircle,
} from 'lucide-react';
import CompanyLogo from '../../imports/Layer1';
import heroImg from 'figma:asset/c72d1e0cdf1208a8945061adb220a707328ea449.png';
import mobileAppImg from 'figma:asset/0e3aac78a83cfadc1136b7b85b72935a79b1ea12.png';
import analyticsImg from 'figma:asset/6462c14618e8ee2a829979fb71fbf0d929812eeb.png';
import customersImg from 'figma:asset/0e1d53f0c5c8ceaac4578bb612275f5e9d0f2859.png';
import claimsImg from 'figma:asset/f4339601f123258ce59952ecefb811471ea5f3d3.png';
import territoryImg from 'figma:asset/60b82ab4a618ec8af6556282c2d0a7337ee1076f.png';
import adamImg from 'figma:asset/4235d8d325784525b0478c7cca83020976dff792.png';
import mobileShowcaseImg from 'figma:asset/c42afc29d52a33a91c3083d88fa6adf0ff7da7e4.png';
import distributorShowcaseImg from 'figma:asset/c72d1e0cdf1208a8945061adb220a707328ea449.png';
import beiterxShowcaseImg from 'figma:asset/0907afa14beffe47307c9ef608f1b0efa0652477.png';

import { projectId, publicAnonKey } from '/utils/supabase/info';

const FF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ── Animated section wrapper ── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Numbered image placeholder ── */
function Placeholder({ num, label, height = 400, dark = false }: { num: number; label: string; height?: number | string; dark?: boolean }) {
  return (
    <div style={{
      width: '100%', height, borderRadius: 16, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12,
      background: dark ? 'rgba(255,255,255,0.04)' : '#f5f5f7',
      border: `2px dashed ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Large number */}
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: dark ? 'rgba(227,30,36,0.15)' : 'rgba(227,30,36,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize: 28, fontWeight: 900, color: '#E31E24',
          fontFamily: FF, fontVariantNumeric: 'tabular-nums',
        }}>
          {num}
        </span>
      </div>
      {/* Label */}
      <span style={{
        fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em',
        color: dark ? 'rgba(255,255,255,0.5)' : '#888',
        textAlign: 'center', padding: '0 16px', maxWidth: 240,
      }}>
        {label}
      </span>
      {/* Corner tag */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        borderRadius: 6, padding: '3px 10px',
      }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: dark ? '#636366' : '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Image #{num}
        </span>
      </div>
    </div>
  );
}

/* ── FAQ accordion item ── */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: open ? '#fafafa' : '#fff',
        borderRadius: 16,
        border: `1px solid ${open ? 'rgba(227,30,36,0.12)' : 'rgba(0,0,0,0.06)'}`,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, padding: 'clamp(16px, 2vw, 22px) clamp(18px, 2.5vw, 28px)',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: FF,
        }}
      >
        <span style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', fontWeight: 600, color: '#111', letterSpacing: '-0.01em', lineHeight: 1.4 }}>{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} style={{ flexShrink: 0 }}>
          <ChevronDown size={18} color={open ? '#E31E24' : '#999'} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 clamp(18px, 2.5vw, 28px) clamp(16px, 2vw, 22px)', fontSize: 15, color: '#666', lineHeight: 1.7 }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Scroll listener for nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'Products', href: '#products' },
    { label: 'Benefits', href: '#benefits' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Waitlist', href: '#waitlist' },
  ];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5c3450e9/waitlist`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error('Waitlist error:', data);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist network error:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Waitlist input component ── */
  const WaitlistInput = ({ dark = false }: { dark?: boolean }) => {
    if (submitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: dark ? 'rgba(52,199,89,0.12)' : 'rgba(52,199,89,0.08)', borderRadius: 99, border: `1px solid rgba(52,199,89,${dark ? 0.3 : 0.15})` }}
        >
          <CheckCircle2 size={18} color="#34C759" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#34C759' }}>You're on the list! We'll be in touch.</span>
        </motion.div>
      );
    }
    return (
      <form onSubmit={handleWaitlist} style={{ display: 'flex', gap: 8, width: '100%', maxWidth: 480, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Mail size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: dark ? '#636366' : '#999' }} />
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: '100%', height: 56, borderRadius: 99, border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
              background: dark ? 'rgba(255,255,255,0.06)' : '#f5f5f7', padding: '0 16px 0 44px',
              fontSize: 15, fontWeight: 500, color: dark ? '#f2f2f7' : '#111', outline: 'none',
              fontFamily: FF, transition: 'border-color 0.2s',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = '#E31E24')}
            onBlur={e => (e.currentTarget.style.borderColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)')}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          style={{
            height: 56, borderRadius: 99, background: '#E31E24', border: 'none',
            padding: '0 28px', fontSize: 15, fontWeight: 700, color: '#fff',
            cursor: submitting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'transform 0.2s, box-shadow 0.2s', whiteSpace: 'nowrap', fontFamily: FF,
            opacity: submitting ? 0.7 : 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(227,30,36,0.3)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {submitting ? 'Joining...' : 'Join Waitlist'} <ArrowRight size={16} />
        </button>
      </form>
    );
  };

  return (
    <div style={{ fontFamily: FF, background: '#ffffff', overflowX: 'hidden' }}>

      {/* ════════════════════  NAV  ════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 120, height: 32, position: 'relative', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{ width: '100%', height: '100%', '--fill-0': '#111111' } as React.CSSProperties}>
              <CompanyLogo />
            </div>
          </div>

          <div className="hidden md:flex items-center" style={{ gap: 32 }}>
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#555', letterSpacing: '-0.01em', padding: 0, transition: 'color 0.2s', fontFamily: FF }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>{l.label}</button>
            ))}
          </div>

          <div className="hidden md:flex items-center" style={{ gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDemoOpen(!demoOpen)} style={{ height: 36, borderRadius: 99, background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', padding: '0 20px', fontSize: 13, fontWeight: 600, color: '#111', cursor: 'pointer', fontFamily: FF, display: 'flex', alignItems: 'center', gap: 6 }}>
                Try Demo <ChevronRight size={14} style={{ transform: demoOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>
              {demoOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setDemoOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0, width: 260,
                      background: '#fff', borderRadius: 16, padding: 8,
                      boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
                      zIndex: 200,
                    }}
                  >
                    {[
                      { label: 'BeiterOS Mobile', desc: 'Distributor app', icon: Smartphone, url: 'https://www.beiterdist.online', color: '#E31E24' },
                      { label: 'BeiterX', desc: 'End-user app', icon: Zap, url: 'https://www.beiterx.online', color: '#FF9500' },
                      { label: 'Distributor Portal', desc: 'Desktop command center', icon: Monitor, url: 'https://beiterdash.online', color: '#6366F1' },
                    ].map(d => (
                      <button
                        key={d.label}
                        onClick={() => { window.open(d.url, '_blank'); setDemoOpen(false); }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 12px',
                          background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer',
                          fontFamily: FF, transition: 'background 0.15s', textAlign: 'left',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f7')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${d.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <d.icon size={18} color={d.color} />
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{d.label}</div>
                          <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>{d.desc}</div>
                        </div>
                        <ArrowRight size={14} color="#ccc" style={{ marginLeft: 'auto' }} />
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
            <button onClick={() => scrollTo('#waitlist')} style={{ height: 36, borderRadius: 99, background: '#111111', border: 'none', padding: '0 20px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: FF }}>
              Join Waitlist
            </button>
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}>
            {menuOpen ? <X size={22} color="#111" /> : <Menu size={22} color="#111" />}
          </button>
        </div>

        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="md:hidden"
            style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', padding: '16px 24px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            {NAV_LINKS.map(l => (
              <button key={l.label} onClick={() => scrollTo(l.href)} style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '12px 0', fontSize: 16, fontWeight: 500, color: '#111', cursor: 'pointer', borderBottom: '1px solid rgba(0,0,0,0.04)', fontFamily: FF }}>{l.label}</button>
            ))}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 10px', paddingLeft: 2 }}>Try a Demo</p>
            {[
              { label: 'BeiterOS Mobile', desc: 'Distributor app', icon: Smartphone, url: 'https://www.beiterdist.online', color: '#E31E24' },
              { label: 'BeiterX', desc: 'End-user app', icon: Zap, url: 'https://www.beiterx.online', color: '#FF9500' },
              { label: 'Distributor Portal', desc: 'Desktop command center', icon: Monitor, url: 'https://beiterdash.online', color: '#6366F1' },
            ].map(d => (
              <button
                key={d.label}
                onClick={() => { window.open(d.url, '_blank'); setMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '10px 4px',
                  background: 'none', border: 'none', borderBottom: '1px solid rgba(0,0,0,0.04)',
                  cursor: 'pointer', fontFamily: FF, textAlign: 'left',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${d.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <d.icon size={18} color={d.color} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{d.label}</div>
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 500 }}>{d.desc}</div>
                </div>
                <ArrowRight size={14} color="#ccc" style={{ marginLeft: 'auto' }} />
              </button>
            ))}
            <div style={{ marginTop: 16 }}>
              <button onClick={() => scrollTo('#waitlist')} style={{ width: '100%', height: 44, borderRadius: 99, background: '#111', border: 'none', fontSize: 14, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: FF }}>Join Waitlist</button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ════════════════════  HERO  ════════════════════ */}
      <section style={{ paddingTop: 140, paddingBottom: 80, background: '#ffffff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative' }}>
          <FadeIn>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f5f5f7', borderRadius: 99, padding: '6px 16px 6px 8px', marginBottom: 28 }}>
              <span style={{ background: '#E31E24', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, letterSpacing: '0.05em' }}>PRE-LAUNCH</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#555', letterSpacing: '-0.01em' }}>BeiterOS is coming soon. Join the early access waitlist</span>
              <ChevronRight size={14} color="#888" />
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 style={{ fontSize: 'clamp(40px, 6.5vw, 76px)', fontWeight: 800, color: '#111111', margin: '0 auto', lineHeight: 1.04, letterSpacing: '-0.04em', maxWidth: 900, textTransform: 'none' }}>
              The operating system<br />
              for <span style={{ color: '#E31E24' }}>power tools</span>.
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p style={{ fontSize: 'clamp(17px, 2vw, 21px)', color: '#666', maxWidth: 620, margin: '24px auto 0', lineHeight: 1.55, fontWeight: 400, letterSpacing: '-0.01em' }}>
              Register, manage warranties, track claims, and unlock your tools' full potential. One platform for professionals, one portal for distributors. This is a pre-launch demo. Be the first to get access.
            </p>
          </FadeIn>

          {/* Waitlist + Demo CTAs */}
          <FadeIn delay={0.3}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 40 }}>
              <WaitlistInput />
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <button onClick={() => window.open('https://www.beiterdist.online', '_blank')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s', fontFamily: FF }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  <Smartphone size={15} /> Try Mobile Demo
                </button>
                <button onClick={() => window.open('https://www.beiterx.online', '_blank')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s', fontFamily: FF }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  <Zap size={15} /> Try BeiterX Demo
                </button>
                <button onClick={() => window.open('https://beiterdash.online', '_blank')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s', fontFamily: FF }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                  <Monitor size={15} /> Try Distributor Demo
                </button>
              </div>
            </div>
          </FadeIn>

          {/* ── PLACEHOLDER #1: Hero dashboard screenshot ── */}
          <FadeIn delay={0.45}>
            <div style={{ marginTop: 64, maxWidth: 1060, marginLeft: 'auto', marginRight: 'auto' }}>
              <img src={heroImg} alt="BeiterOS Distributor Dashboard and Portal overview" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block' }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════  TRUSTED BY  ════════════════════ */}
      

      {/* ════════════════════  DEEP FEATURES  ════════════════════ */}
      <section id="features" style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 80px)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Features</p>
              <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, color: '#111', margin: '0 auto 16px', lineHeight: 1.1, letterSpacing: '-0.035em', maxWidth: 750, textTransform: 'none' }}>
                Everything your tools need. Nothing they don't.
              </h2>
              <p style={{ fontSize: 17, color: '#888', margin: '0 auto', maxWidth: 600, lineHeight: 1.6 }}>
                BeiterOS replaces spreadsheets, paper warranties, and disconnected workflows with a single intelligent platform purpose-built for the power tools industry.
              </p>
            </div>
          </FadeIn>

          {/* Feature 1: Instant Registration */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
            <FadeIn>
              <div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(227,30,36,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Scan size={24} color="#E31E24" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#111', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Instant Tool Registration</h3>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                  Every BEITER tool ships with a unique QR code. Open the app, point your camera, and the tool is registered in under 3 seconds. Serial number, model, purchase date, and warranty period are all captured automatically. No typing. No forms. No friction.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['QR scanning with instant verification', 'Automatic warranty activation from scan date', 'Full tool history from day one', 'Works offline and syncs when connected'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#555' }}>
                      <CheckCircle2 size={16} color="#E31E24" style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            {/* ── PLACEHOLDER #2 ── */}
            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <img src={mobileAppImg} alt="BeiterOS Mobile App Serial Scanner and Tool Registration" style={{ width: '100%', maxWidth: 304, height: 'auto', display: 'block' }} />
              </div>
            </FadeIn>
          </div>

          {/* Feature 2: Real-time Analytics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
            {/* ── PLACEHOLDER #3 ── */}
            <FadeIn delay={0.15} className="order-2 md:order-1">
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <img src={analyticsImg} alt="Distributor Portal Analytics Dashboard" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }} />
              </div>
            </FadeIn>
            <FadeIn className="order-1 md:order-2">
              <div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,149,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <BarChart3 size={24} color="#FF9500" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#111', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Real-time Analytics</h3>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                  Your distributor dashboard surfaces every metric that matters. Revenue by region, product category mix, monthly trends, customer health scores, and claim resolution rates, all updating in real-time. No more waiting for end-of-month reports.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Revenue breakdowns by city, region, and product line', 'Product mix analysis with trend indicators', 'Customer warranty health scoring (green/amber/red)', 'Exportable reports for quarterly business reviews'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#555' }}>
                      <CheckCircle2 size={16} color="#FF9500" style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Feature 3: Customer Intelligence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
            <FadeIn>
              <div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(52,199,89,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Users size={24} color="#34C759" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#111', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Customer Intelligence</h3>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                  Every shop and contractor in your territory has a living profile. See which tools they've registered, how their warranties are tracking, whether they've filed claims, and when they last ordered. It's the CRM that power tool distributors actually need.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Deep customer profiles with full tool histories', 'Warranty health scores per customer and tool', 'Claim history with resolution tracking', 'Contact details with +49 German phone formatting'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#555' }}>
                      <CheckCircle2 size={16} color="#34C759" style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            {/* ── PLACEHOLDER #4 ── */}
            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <img src={customersImg} alt="Distributor Portal Customer Profiles" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }} />
              </div>
            </FadeIn>
          </div>

          {/* Feature 4: Claims Management */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
            {/* ── PLACEHOLDER #5 ── */}
            <FadeIn delay={0.15} className="order-2 md:order-1">
              <img src={claimsImg} alt="Distributor Portal Claims Management" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }} />
            </FadeIn>
            <FadeIn className="order-1 md:order-2">
              <div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Shield size={24} color="#6366F1" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#111', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Claims & Warranty Management</h3>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                  Process warranty claims from submission to resolution in one place. Customers file directly from the app with photos and descriptions. Distributors review, approve, and track shipments. Full audit trail, zero paperwork.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['End-to-end claim lifecycle tracking', 'Photo and description attachments from the field', 'Status pipeline: Submitted → Under Review → Approved → Shipped', 'Proactive warranty expiration alerts (30/60/90 days)'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#555' }}>
                      <CheckCircle2 size={16} color="#6366F1" style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Feature 5: Territory Maps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center', marginBottom: 'clamp(64px, 10vw, 120px)' }}>
            <FadeIn>
              <div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(227,30,36,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <MapPin size={24} color="#E31E24" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#111', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Territory Activation Maps</h3>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                  Visualize tool density, warranty health, and claim urgency across your entire territory on an interactive map powered by CARTO basemaps. Identify underserved areas, spot clusters of expiring warranties, and prioritize your field visits with data, not gut feel.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Interactive CARTO-powered territory heatmaps', 'Filter by tool density, claim urgency, or warranty health', 'Priority sidebar ranking underperforming zones', 'Responsive layout that works on tablets in the field'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#555' }}>
                      <CheckCircle2 size={16} color="#E31E24" style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            {/* ── PLACEHOLDER #6 ── */}
            <FadeIn delay={0.15}>
              <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <img src={territoryImg} alt="Distributor Portal Territory Activation Map" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }} />
              </div>
            </FadeIn>
          </div>

          {/* Feature 6: Adam AI */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))', gap: 'clamp(32px, 5vw, 64px)', alignItems: 'center' }}>
            {/* ── PLACEHOLDER #7 ── */}
            <FadeIn delay={0.15} className="order-2 md:order-1">
              <img src={adamImg} alt="Adam AI Chat Assistant Drawer" style={{ width: '100%', height: 'auto', borderRadius: 16, display: 'block', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }} />
            </FadeIn>
            <FadeIn className="order-1 md:order-2">
              <div>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: 'linear-gradient(135deg, rgba(227,30,36,0.12), rgba(255,106,106,0.12))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Bot size={24} color="#E31E24" />
                </div>
                <h3 style={{ fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#111', margin: '0 0 16px', letterSpacing: '-0.03em' }}>Adam AI Assistant</h3>
                <p style={{ fontSize: 16, color: '#666', margin: '0 0 20px', lineHeight: 1.7 }}>
                  Adam is your always-available territory analyst. Ask natural-language questions like "Which customers have expiring warranties?" or "Show me my top-selling product this quarter" and get instant, actionable answers. No dashboards to dig through, no reports to run.
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Natural language queries about your territory', 'Surfaces insights from revenue, claims, and customer data', 'Accessible as a slide-out drawer from any screen', 'Context-aware: knows your customers, products, and trends'].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 15, color: '#555' }}>
                      <CheckCircle2 size={16} color="#E31E24" style={{ marginTop: 3, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════  MORE FEATURES GRID  ════════════════════ */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px', background: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, color: '#111', margin: '0 0 clamp(32px, 4vw, 48px)', textAlign: 'center', letterSpacing: '-0.03em', textTransform: 'none' }}>
              And so much more.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
            {[
              { icon: ShoppingCart, title: 'Order Management', desc: 'A 4-step wizard to place, review, and track orders. Real-time stock levels. Full order history with receipt generation.', accent: '#E31E24' },
              { icon: Image, title: 'Marketing Hub', desc: 'Download pre-approved campaigns, point-of-sale materials, social media assets, and product photography. Always on-brand.', accent: '#6366F1' },
              { icon: FileText, title: 'Receipt Vault', desc: 'Every purchase receipt stored digitally. Searchable, exportable, and linked to the registered tool. No more lost paperwork.', accent: '#FF9500' },
              { icon: Globe, title: 'Multi-language (i18n)', desc: 'Full support for English, German, French, and Arabic, including right-to-left layout. Serve the EU and South Asian markets.', accent: '#34C759' },
              { icon: Bell, title: 'Smart Notifications', desc: 'Warranty expiration alerts, claim status updates, low-stock warnings, and partner milestone notifications. Configurable per-user.', accent: '#E31E24' },
              { icon: MapPin, title: 'Service Locator', desc: 'Customers find the nearest authorized service center with a real-time map. Filterable by city, distance, and service type.', accent: '#6366F1' },
            ].map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.06}>
                <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px, 2.5vw, 32px)', border: '1px solid rgba(0,0,0,0.05)', height: '100%', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: `${f.accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <f.icon size={20} style={{ color: f.accent }} />
                  </div>
                  <h4 style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 8px', letterSpacing: '-0.01em' }}>{f.title}</h4>
                  <p style={{ fontSize: 14, color: '#888', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════  PRODUCTS SECTION  ════════════════════ */}
      <section id="products" style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#111111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 72px)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Three Apps, One Ecosystem</p>
              <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, color: '#ffffff', margin: '0 auto', lineHeight: 1.1, letterSpacing: '-0.035em', maxWidth: 750, textTransform: 'none' }}>
                Built for everyone in the chain.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 24 }}>
            {/* BeiterOS App Mobile */}
            <FadeIn delay={0.1}>
              <div style={{ background: '#1A1A1A', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'clamp(24px, 3vw, 36px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #E31E24, #FF6A6A)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>BeiterOS App</h3>
                      <p style={{ fontSize: 12, color: '#636366', margin: 0, fontWeight: 500 }}>For distributors on the go</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6, margin: '0 0 20px' }}>
                    Your distributor dashboard, rebuilt for mobile. Monitor revenue, manage customers, process claims, and track orders from anywhere. The full power of the Distributor Portal, optimized for your phone.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Full analytics dashboard in your pocket', 'Customer & warranty management on the go', 'Review and process claims from the field', 'Track orders and real-time stock levels', 'Syncs seamlessly with the desktop portal'].map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#888' }}>
                        <CheckCircle2 size={14} color="#E31E24" style={{ marginTop: 2, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <button onClick={() => window.open('https://www.beiterdist.online', '_blank')} style={{ height: 42, borderRadius: 99, background: '#E31E24', border: 'none', padding: '0 20px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                      Explore Mobile Demo <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '8px 20px 0' }}>
                  <img src={mobileShowcaseImg} alt="BeiterOS Mobile App Multi-screen Showcase" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
            </FadeIn>

            {/* BeiterX End User */}
            <FadeIn delay={0.15}>
              <div style={{ background: '#1A1A1A', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'clamp(24px, 3vw, 36px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #FF9500, #FFCC02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>BeiterX</h3>
                      <p style={{ fontSize: 12, color: '#636366', margin: 0, fontWeight: 500 }}>For end users & customers</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6, margin: '0 0 20px' }}>
                    The direct line between BEITER and the people who use the tools. Scan to register, claim warranties, find nearby repair shops, and receive daily pro tips, while giving distributors real-time insight into their end-user base.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Scan & register tools instantly', 'File warranty claims with photos', 'Find authorized repair shops nearby', 'Daily tips & maintenance reminders', 'Bridges distributors to end users'].map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#888' }}>
                        <CheckCircle2 size={14} color="#FF9500" style={{ marginTop: 2, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <button onClick={() => window.open('https://www.beiterx.online', '_blank')} style={{ height: 42, borderRadius: 99, background: '#FF9500', border: 'none', padding: '0 20px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                      Try BeiterX Demo <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                {/* ── PLACEHOLDER #10 ── */}
                <div style={{ padding: '8px 20px 0' }}>
                  <img src={beiterxShowcaseImg} alt="BeiterX End User App Multi-screen Showcase" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
            </FadeIn>

            {/* Distributor Portal */}
            <FadeIn delay={0.2}>
              <div style={{ background: '#1A1A1A', borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: 'clamp(24px, 3vw, 36px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366F1, #A5B4FC)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Monitor size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Distributor Portal</h3>
                      <p style={{ fontSize: 12, color: '#636366', margin: 0, fontWeight: 500 }}>For partners & distributors</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: '#999', lineHeight: 1.6, margin: '0 0 20px' }}>
                    The desktop command center for authorized distributors. Manage analytics, customers, claims, orders, and territory maps from a single dashboard, with Adam AI ready to answer any question about your business.
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {['Full revenue & territory analytics', 'Customer profiles with warranty health', 'End-to-end claims processing pipeline', 'Order wizard with real-time stock levels', 'Adam AI assistant on every screen'].map(item => (
                      <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#888' }}>
                        <CheckCircle2 size={14} color="#6366F1" style={{ marginTop: 2, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div style={{ marginTop: 'auto' }}>
                    <button onClick={() => window.open('https://beiterdash.online', '_blank')} style={{ height: 42, borderRadius: 99, background: '#6366F1', border: 'none', padding: '0 20px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')} onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
                      Explore Distributor Demo <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
                <div style={{ padding: '8px 20px 0' }}>
                  <img src={distributorShowcaseImg} alt="Distributor Portal Full Desktop Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════  BENEFITS FOR ALL  ════════════════════ */}
      <section id="benefits" style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 72px)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Benefits</p>
              <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, color: '#111', margin: '0 auto 16px', lineHeight: 1.1, letterSpacing: '-0.035em', maxWidth: 750, textTransform: 'none' }}>
                Everyone wins with BeiterOS.
              </h2>
              <p style={{ fontSize: 17, color: '#888', margin: '0 auto', maxWidth: 620, lineHeight: 1.6 }}>
                From the factory floor to the job site, BeiterOS creates value at every link in the power tools supply chain.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
            {/* Manufacturers */}
            <FadeIn delay={0.05}>
              <div style={{ background: '#fafafa', borderRadius: 24, padding: 'clamp(28px, 3vw, 40px)', border: '1px solid rgba(0,0,0,0.05)', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, rgba(227,30,36,0.1), rgba(227,30,36,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Factory size={26} color="#E31E24" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' }}>For BEITER (Manufacturer)</h3>
                <p style={{ fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.6 }}>Gain unprecedented visibility into your entire distribution network and end-user base.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Real-time product activation data across all markets',
                    'Direct feedback loop from end users to R&D',
                    'Warranty cost reduction through fraud detection',
                    'Brand loyalty through seamless digital experiences',
                    'Data-driven decisions on inventory and production',
                    'Competitive intelligence from market penetration maps',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#555' }}>
                      <CheckCircle2 size={15} color="#E31E24" style={{ marginTop: 2, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Distributors */}
            <FadeIn delay={0.12}>
              <div style={{ background: '#111', borderRadius: 24, padding: 'clamp(28px, 3vw, 40px)', border: '1px solid rgba(255,255,255,0.08)', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(227,30,36,0.12)', borderRadius: 99, padding: '4px 12px', marginBottom: 20 }}>
                  <Sparkles size={12} color="#E31E24" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#E31E24', letterSpacing: '0.04em' }}>MOST IMPACTED</span>
                </div>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Truck size={26} color="#6366F1" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>For Distributors</h3>
                <p style={{ fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.6 }}>Replace spreadsheets and phone calls with a unified command center for your territory.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Complete territory analytics and revenue tracking',
                    'Customer profiles with warranty health scores',
                    'Claims pipeline from submission to resolution',
                    'Order management with real-time stock visibility',
                    'Adam AI assistant for instant business insights',
                    'Mobile app for managing your territory on the go',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#bbb' }}>
                      <CheckCircle2 size={15} color="#6366F1" style={{ marginTop: 2, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* End Users */}
            <FadeIn delay={0.19}>
              <div style={{ background: '#fafafa', borderRadius: 24, padding: 'clamp(28px, 3vw, 40px)', border: '1px solid rgba(0,0,0,0.05)', height: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,149,0,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ width: 56, height: 56, borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,149,0,0.1), rgba(255,149,0,0.04))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <Wrench size={26} color="#FF9500" />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111', margin: '0 0 8px', letterSpacing: '-0.02em' }}>For End Users</h3>
                <p style={{ fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.6 }}>The easiest way to protect your investment and get the most out of every BEITER tool.</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Register tools in 3 seconds with a QR scan',
                    'Automatic warranty activation and tracking',
                    'File claims with photos directly from the app',
                    'Find nearest authorized repair shops on a map',
                    'Daily tips and maintenance reminders',
                    'Complete digital tool inventory in your pocket',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#555' }}>
                      <CheckCircle2 size={15} color="#FF9500" style={{ marginTop: 2, flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════  COMPARISON TABLE  ════════════════════ */}
      <section style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#fafafa', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Comparison</p>
              <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, color: '#111', margin: '0 auto 16px', lineHeight: 1.1, letterSpacing: '-0.035em', maxWidth: 750, textTransform: 'none' }}>
                Why BeiterOS wins.
              </h2>
              <p style={{ fontSize: 17, color: '#888', margin: '0 auto', maxWidth: 620, lineHeight: 1.6 }}>
                See how BeiterOS stacks up against the traditional way of managing tools, warranties, and distribution.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', background: '#fff' }}>
              {/* Table header */}
              <div className="grid grid-cols-3" style={{ background: '#111', padding: '16px 0' }}>
                <div style={{ padding: '0 clamp(16px, 2vw, 28px)', fontSize: 13, fontWeight: 700, color: '#888' }}>Feature</div>
                <div style={{ padding: '0 clamp(16px, 2vw, 28px)', fontSize: 13, fontWeight: 700, color: '#888', textAlign: 'center' }}>Traditional</div>
                <div style={{ padding: '0 clamp(16px, 2vw, 28px)', fontSize: 13, fontWeight: 700, color: '#E31E24', textAlign: 'center' }}>BeiterOS</div>
              </div>
              {/* Table rows */}
              {[
                { feature: 'Tool Registration', traditional: 'Manual serial entry, paper forms', beiter: 'QR scan in 3 seconds', tradStatus: 'bad' },
                { feature: 'Warranty Tracking', traditional: 'Spreadsheets, email chains', beiter: 'Automated lifecycle tracking', tradStatus: 'bad' },
                { feature: 'Claims Processing', traditional: 'Phone calls, faxes, weeks of waiting', beiter: 'Digital pipeline, real-time status', tradStatus: 'bad' },
                { feature: 'Territory Analytics', traditional: 'Quarterly PDF reports', beiter: 'Real-time dashboards and AI insights', tradStatus: 'partial' },
                { feature: 'Customer Intelligence', traditional: 'Scattered contacts in CRM/email', beiter: 'Unified profiles with warranty health', tradStatus: 'bad' },
                { feature: 'End-User Connection', traditional: 'No direct relationship', beiter: 'Direct app with tips, repairs, claims', tradStatus: 'bad' },
                { feature: 'Order Management', traditional: 'Phone/email orders, manual stock checks', beiter: '4-step wizard, real-time stock', tradStatus: 'partial' },
                { feature: 'Multi-language Support', traditional: 'Varies by region', beiter: 'EN, DE, FR, AR with RTL support', tradStatus: 'partial' },
                { feature: 'AI Assistant', traditional: 'Not available', beiter: 'Adam AI on every screen', tradStatus: 'none' },
                { feature: 'Mobile Access', traditional: 'Desktop-only or no software', beiter: 'Native mobile + desktop apps', tradStatus: 'partial' },
              ].map((row, i) => (
                <div key={row.feature} className="grid grid-cols-3" style={{ padding: '14px 0', borderBottom: i < 9 ? '1px solid rgba(0,0,0,0.04)' : 'none', alignItems: 'center' }}>
                  <div style={{ padding: '0 clamp(16px, 2vw, 28px)', fontSize: 14, fontWeight: 600, color: '#111' }}>{row.feature}</div>
                  <div style={{ padding: '0 clamp(16px, 2vw, 28px)', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      {row.tradStatus === 'none' ? (
                        <XCircle size={15} color="#E31E24" />
                      ) : row.tradStatus === 'bad' ? (
                        <XCircle size={15} color="#FF9500" />
                      ) : (
                        <MinusCircle size={15} color="#FFB800" />
                      )}
                      <span className="hidden md:inline" style={{ fontSize: 13, color: '#888' }}>{row.traditional}</span>
                    </div>
                  </div>
                  <div style={{ padding: '0 clamp(16px, 2vw, 28px)', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={15} color="#34C759" />
                      <span className="hidden md:inline" style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{row.beiter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button onClick={() => scrollTo('#waitlist')} style={{ height: 52, borderRadius: 99, background: '#E31E24', border: 'none', padding: '0 32px', fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: FF, transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(227,30,36,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                Get Early Access <ArrowRight size={16} />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════  FAQ  ════════════════════ */}
      <section id="faq" style={{ padding: 'clamp(60px, 10vw, 120px) 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 64px)' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#E31E24', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>FAQ</p>
              <h2 style={{ fontSize: 'clamp(30px, 4.5vw, 52px)', fontWeight: 800, color: '#111', margin: '0 auto 16px', lineHeight: 1.1, letterSpacing: '-0.035em', maxWidth: 750, textTransform: 'none' }}>
                Frequently asked questions.
              </h2>
              <p style={{ fontSize: 17, color: '#888', margin: '0 auto', maxWidth: 560, lineHeight: 1.6 }}>
                Everything you need to know about BeiterOS and how it transforms your power tools business.
              </p>
            </div>
          </FadeIn>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { q: 'What is BeiterOS?', a: 'BeiterOS is a complete digital ecosystem for the power tools industry. It includes a mobile distributor app (BeiterOS), an end-user app (BeiterX), and a full desktop command center (Distributor Portal). Together, they digitize tool registration, warranty management, claims processing, and territory analytics.' },
              { q: 'Who is BeiterOS built for?', a: 'BeiterOS serves three audiences: BEITER as the manufacturer gains real-time visibility into product activations and market data. Distributors get a powerful command center with analytics, customer profiles, and AI insights. End users get effortless tool registration, warranty claims, and repair shop discovery.' },
              { q: 'How does the QR code registration work?', a: 'Every BEITER tool ships with a unique QR code. End users open the BeiterX app, point their camera at the code, and the tool is registered in under 3 seconds. Serial number, model, purchase date, and warranty period are all captured automatically with no manual data entry required.' },
              { q: 'Is BeiterOS available now?', a: 'BeiterOS is currently in pre-launch. You can explore our live demos for all three apps right now. Join the waitlist to get early access when we launch and help shape the product with your feedback.' },
              { q: 'What languages does BeiterOS support?', a: 'BeiterOS supports English, German, French, and Arabic, including full right-to-left (RTL) layout support. This makes it ready for European, Middle Eastern, and North African markets from day one.' },
              { q: 'How much does BeiterOS cost?', a: 'Pricing will be announced closer to launch. Join the waitlist to be the first to learn about pricing plans and early-bird offers for founding distributors.' },
              { q: 'What is Adam AI?', a: 'Adam is an AI-powered assistant built into the Distributor Portal. You can ask natural language questions like "Which customers have expiring warranties?" or "Show me my top-selling product this quarter" and get instant, data-driven answers without digging through dashboards.' },
              { q: 'Can I use BeiterOS on my phone?', a: 'Absolutely. The BeiterOS mobile app gives distributors the full power of their desktop dashboard on their phone. The BeiterX app is designed mobile-first for end users. The Distributor Portal is a desktop-optimized web application that also works on tablets.' },
            ].map((item, i) => (
              <FadeIn key={item.q} delay={i * 0.04}>
                <FAQItem question={item.q} answer={item.a} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════  WAITLIST CTA  ════════════════════ */}
      <section id="waitlist" style={{ padding: 'clamp(80px, 12vw, 140px) 24px', background: '#ffffff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(227,30,36,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: 660, margin: '0 auto' }}>
          <FadeIn>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(227,30,36,0.06)', borderRadius: 99, padding: '6px 16px', marginBottom: 24 }}>
              <Sparkles size={14} color="#E31E24" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E31E24' }}>Pre-Launch Demo</span>
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#111', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-0.04em', textTransform: 'none' }}>
              Be the first to power up.
            </h2>
            <p style={{ fontSize: 18, color: '#888', margin: '0 0 36px', lineHeight: 1.6 }}>
              BeiterOS is in active development. Join the waitlist to get early access, shape the product with your feedback, and be among the first distributors on the platform.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <WaitlistInput />
            </div>
            <p style={{ fontSize: 12, color: '#bbb', marginTop: 16 }}>No spam. We'll only email you when it's time to get started.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 24 }}>
              <button onClick={() => window.open('https://www.beiterdist.online', '_blank')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                <Smartphone size={15} /> Explore Mobile Demo
              </button>
              <button onClick={() => window.open('https://www.beiterx.online', '_blank')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                <Zap size={15} /> Explore BeiterX Demo
              </button>
              <button onClick={() => window.open('https://beiterdash.online', '_blank')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#555', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF }}
                onMouseEnter={e => (e.currentTarget.style.color = '#111')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
                <Monitor size={15} /> Explore Distributor Demo
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════  FOOTER  ════════════════════ */}
      <footer style={{ padding: '48px 24px 32px', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, marginBottom: 48 }}>
            <div>
              <div style={{ width: 100, height: 28, position: 'relative', marginBottom: 16, '--fill-0': '#ffffff' } as React.CSSProperties}>
                <CompanyLogo />
              </div>
              <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>
                The operating system for power tools. Made in Germany. Currently in pre-launch.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Mobile App', 'BeiterX', 'Distributor Portal', 'Changelog'] },
              { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Support', 'Status'] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>{col.title}</p>
                {col.links.map(link => (
                  <p key={link} style={{ margin: '0 0 10px' }}>
                    <a href="#" style={{ fontSize: 13, color: '#888', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#fff')} onMouseLeave={e => (e.currentTarget.style.color = '#888')}>{link}</a>
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#555', margin: 0 }}>© 2026 BEITER Tools GmbH. All rights reserved. Pre-launch demo.</p>
            <div style={{ display: 'flex', gap: 20 }}>
              {['Privacy', 'Terms', 'Cookies'].map(link => (
                <a key={link} href="#" style={{ fontSize: 12, color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#aaa')} onMouseLeave={e => (e.currentTarget.style.color = '#555')}>{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}