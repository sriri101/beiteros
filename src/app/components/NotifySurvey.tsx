import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, MessageCircle, ArrowRight, ArrowLeft,
  Star, CheckCircle2, Sparkles, Bell, Loader2,
  Globe, ShoppingBag,
  TreePine, Layers, Building2, Zap, Droplets, Home, Car, HardHat,
  type LucideIcon,
} from 'lucide-react';

/* ── Constants ─────────────────────────────────────────────────────────── */
const FORMSPREE_KEY = 'beiterx_formspree_url';

const TOOLS = [
  'Drill / Driver',
  'Angle Grinder',
  'Circular Saw',
  'Jigsaw',
  'Orbital Sander',
  'Impact Wrench',
  'Router',
  'Laser Level',
  'Quantum Battery',
  'Other…',
];

const USER_TYPES: { id: string; label: string; Icon: LucideIcon }[] = [
  { id: 'woodwork',     label: 'Woodworking',  Icon: TreePine   },
  { id: 'metalwork',    label: 'Metalwork',    Icon: Layers     },
  { id: 'construction', label: 'Construction', Icon: Building2  },
  { id: 'electrical',   label: 'Electrical',   Icon: Zap        },
  { id: 'plumbing',     label: 'Plumbing',     Icon: Droplets   },
  { id: 'diy',          label: 'DIY / Home',   Icon: Home       },
  { id: 'automotive',   label: 'Automotive',   Icon: Car        },
  { id: 'contractor',   label: 'Contractor',   Icon: HardHat    },
];

const RATING_LABELS = ['', 'Very poor', 'Poor', 'OK', 'Good', 'Excellent'];

/* ── Types ─────────────────────────────────────────────────────────────── */
type Step = 'contact' | 'tool' | 'channel' | 'source' | 'rating' | 'usertype' | 'done';

interface SurveyData {
  method: 'email' | 'whatsapp';
  contact: string;
  tool: string;
  customTool: string;
  channel: 'online' | 'store' | '';
  source: string;
  rating: number;
  userType: string;
}

const STEP_ORDER: Step[] = ['contact', 'tool', 'channel', 'source', 'rating', 'usertype', 'done'];
const SURVEY_STEPS: Step[] = ['tool', 'channel', 'source', 'rating', 'usertype'];

/* ── Sub-components ──────────────────────────────────────────────────────*/
function StepHeader({
  n, total, title, onBack,
}: { n: number; total: number; title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onBack}
        aria-label="Go back"
        className="w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] active:scale-95 flex items-center justify-center transition-all shrink-0"
      >
        <ArrowLeft size={15} color="#555" />
      </button>
      <div className="min-w-0">
        <p className="text-[#bbb] uppercase" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }}>
          Question {n} of {total}
        </p>
        <h3 className="text-[#111]" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {title}
        </h3>
      </div>
    </div>
  );
}

function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-[#bbb] hover:text-[#888] transition-colors mx-auto block"
      style={{ fontSize: 13, fontWeight: 500 }}
    >
      Skip this question
    </button>
  );
}

function ContinueBtn({
  onClick, disabled = false, label = 'Continue',
}: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[48px] rounded-xl bg-[#E31E24] text-white flex items-center justify-center gap-2 hover:bg-[#c9191e] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_2px_12px_rgba(227,30,36,0.18)]"
      style={{ fontSize: 14, fontWeight: 700 }}
    >
      {label} <ArrowRight size={15} />
    </motion.button>
  );
}

/* ── Main component ──────────────────────────────────────────────────────*/
interface Props {
  compact?: boolean;
  onComplete?: () => void;
}

export function NotifySurvey({ compact = false, onComplete }: Props) {
  const [step, setStep]             = useState<Step>('contact');
  const [dir, setDir]               = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData]             = useState<SurveyData>({
    method: 'email', contact: '',
    tool: '', customTool: '',
    channel: '', source: '',
    rating: 0, userType: '',
  });

  /* Navigation */
  const goTo = useCallback((next: Step, direction = 1) => {
    setDir(direction);
    setStep(next);
  }, []);

  const goBack = useCallback(() => {
    const idx = STEP_ORDER.indexOf(step);
    if (idx <= 1) { goTo('contact', -1); return; }
    goTo(STEP_ORDER[idx - 1], -1);
  }, [step, goTo]);

  const skipTo = useCallback((next: Step) => goTo(next, 1), [goTo]);

  /* Submit */
  const submit = useCallback(async () => {
    setSubmitting(true);
    const url      = localStorage.getItem(FORMSPREE_KEY) || '';
    const toolName = data.tool === 'Other…' ? data.customTool : data.tool;
    const payload  = {
      _subject:             `New BeiterX signup — ${data.method} — ${toolName || 'tool N/A'}`,
      Contact:              data.contact,
      Method:               data.method,
      Tool:                 toolName        || '—',
      'Purchase channel':   data.channel    || '—',
      'Source / Store':     data.source     || '—',
      'Buying experience':  data.rating ? `${data.rating}/5 — ${RATING_LABELS[data.rating]}` : '—',
      'User type':          data.userType   || '—',
      Source:               'BeiterX Landing Page',
    };
    try {
      if (url) {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch { /* silent */ }
    setSubmitting(false);
    goTo('done');
    onComplete?.();
  }, [data, goTo, onComplete]);

  /* Animation */
  const variants = {
    enter:  (d: number) => ({ x: d > 0 ?  32 : -32, opacity: 0 }),
    center:             () => ({ x: 0,                opacity: 1 }),
    exit:   (d: number) => ({ x: d > 0 ? -32 :  32, opacity: 0 }),
  };
  const t = { duration: 0.26, ease: [0.22, 1, 0.36, 1] as const };

  /* Progress */
  const surveyIdx    = SURVEY_STEPS.indexOf(step);
  const progressPct  = surveyIdx >= 0 ? ((surveyIdx + 1) / SURVEY_STEPS.length) * 100 : 0;
  const pad          = compact ? 'p-4' : 'p-5';

  return (
    <motion.div
      layout
      className="bg-[#fafafa] border border-black/[0.05] rounded-2xl overflow-hidden"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Progress bar */}
      <div className="h-[3px] bg-black/[0.04]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: step === 'done' ? '#22c55e' : '#E31E24' }}
          animate={{ width: step === 'done' ? '100%' : `${progressPct}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className={pad}>
        <AnimatePresence mode="wait" custom={dir}>

          {/* ══ STEP 0 — Contact ════════════════════════════════════════ */}
          {step === 'contact' && (
            <motion.div key="contact" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <Bell size={15} color="#E31E24" />
                <span className="text-[#555]" style={{ fontSize: 13, fontWeight: 600 }}>
                  Claim your 1,000 free AI Tokens
                </span>
              </div>

              <div className="flex rounded-xl bg-white border border-black/[0.06] p-1 gap-1">
                {(['email', 'whatsapp'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setData(d => ({ ...d, method: m, contact: '' }))}
                    className={`flex-1 flex items-center justify-center gap-2 h-[44px] rounded-lg transition-all duration-300 ${
                      data.method === m
                        ? m === 'email'
                          ? 'bg-[#E31E24] text-white shadow-[0_2px_8px_rgba(227,30,36,0.25)]'
                          : 'bg-[#25D366] text-white shadow-[0_2px_8px_rgba(37,211,102,0.25)]'
                        : 'text-[#888] hover:text-[#555]'
                    }`}
                  >
                    {m === 'email' ? <Mail size={15} /> : <MessageCircle size={15} />}
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {m === 'email' ? 'Email' : 'WhatsApp'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type={data.method === 'email' ? 'email' : 'tel'}
                  placeholder={data.method === 'email' ? 'your@email.com' : '+212 6XX XXX XXX'}
                  value={data.contact}
                  onChange={(e) => setData(d => ({ ...d, contact: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && data.contact.trim() && goTo('tool')}
                  className="flex-1 min-w-0 h-[48px] px-4 rounded-xl bg-white border border-black/[0.08] text-[#111] placeholder-[#bbb] outline-none focus:border-[#E31E24]/40 focus:shadow-[0_0_0_3px_rgba(227,30,36,0.06)] transition-all"
                  style={{ fontSize: 15 }}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={() => data.contact.trim() && goTo('tool')}
                  disabled={!data.contact.trim()}
                  className="h-[48px] px-5 rounded-xl bg-[#E31E24] text-white flex items-center gap-2 hover:bg-[#c9191e] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_2px_10px_rgba(227,30,36,0.2)] shrink-0"
                  style={{ fontSize: 14, fontWeight: 600 }}
                >
                  Next <ArrowRight size={14} />
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <Sparkles size={13} color="#E31E24" />
                <span className="text-[#999]" style={{ fontSize: 12, fontWeight: 500 }}>
                  Sign up and receive{' '}
                  <span className="text-[#E31E24]" style={{ fontWeight: 700 }}>1,000 free AI Tokens</span> in the app
                </span>
              </div>
            </motion.div>
          )}

          {/* ══ STEP 1 — Tool ═══════════════════════════════════════════ */}
          {step === 'tool' && (
            <motion.div key="tool" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="space-y-4"
            >
              <StepHeader n={1} total={5} title="Which BEITER tool do you want to register?" onBack={goBack} />

              <div className="grid grid-cols-2 gap-2">
                {TOOLS.map((label) => {
                  const selected = data.tool === label;
                  return (
                    <motion.button
                      key={label}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setData(d => ({ ...d, tool: label, customTool: '' }))}
                      className={`flex items-center h-[48px] px-3 rounded-xl border text-left transition-all duration-200 ${
                        selected
                          ? 'bg-[#E31E24] border-[#E31E24] shadow-[0_2px_10px_rgba(227,30,36,0.2)]'
                          : 'bg-white border-black/[0.07] hover:border-[#E31E24]/30 hover:bg-[#fff5f5]'
                      }`}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: selected ? 'white' : '#333' }}>
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {data.tool === 'Other…' && (
                  <motion.input
                    key="customtool"
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    type="text"
                    placeholder="Type your tool name…"
                    value={data.customTool}
                    onChange={(e) => setData(d => ({ ...d, customTool: e.target.value }))}
                    className="w-full h-[44px] px-4 rounded-xl bg-white border border-black/[0.08] text-[#111] placeholder-[#bbb] outline-none focus:border-[#E31E24]/40 focus:shadow-[0_0_0_3px_rgba(227,30,36,0.06)] transition-all"
                    style={{ fontSize: 14 }}
                    autoFocus
                  />
                )}
              </AnimatePresence>

              <ContinueBtn
                onClick={() => goTo('channel')}
                disabled={!data.tool || (data.tool === 'Other…' && !data.customTool.trim())}
              />
              <SkipButton onClick={() => skipTo('channel')} />
            </motion.div>
          )}

          {/* ══ STEP 2 — Channel ════════════════════════════════════════ */}
          {step === 'channel' && (
            <motion.div key="channel" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="space-y-4"
            >
              <StepHeader n={2} total={5} title="Where did you purchase it?" onBack={goBack} />

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'online', label: 'Online',       sub: 'Website or app',  Icon: Globe       },
                  { id: 'store',  label: 'From a store', sub: 'Physical shop',    Icon: ShoppingBag },
                ].map(({ id, label, sub, Icon }) => {
                  const selected = data.channel === id;
                  return (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setData(d => ({ ...d, channel: id as 'online' | 'store', source: '' }))}
                      className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all duration-200 ${
                        selected
                          ? 'bg-[#E31E24] border-[#E31E24] shadow-[0_4px_16px_rgba(227,30,36,0.22)]'
                          : 'bg-white border-black/[0.07] hover:border-[#E31E24]/30 hover:bg-[#fff5f5]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        selected ? 'bg-white/20' : 'bg-black/[0.04]'
                      }`}>
                        <Icon size={20} color={selected ? 'white' : '#666'} strokeWidth={1.75} />
                      </div>
                      <div className="text-center">
                        <p style={{ fontSize: 14, fontWeight: 700, color: selected ? 'white' : '#111' }}>
                          {label}
                        </p>
                        <p style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.6)' : '#aaa', marginTop: 2 }}>
                          {sub}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <ContinueBtn onClick={() => goTo('source')} disabled={!data.channel} />
              <SkipButton onClick={() => skipTo('rating')} />
            </motion.div>
          )}

          {/* ══ STEP 3 — Source ═════════════════════════════════════════ */}
          {step === 'source' && (
            <motion.div key="source" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="space-y-4"
            >
              <StepHeader
                n={3} total={5}
                title={data.channel === 'online' ? 'Which website did you use?' : 'Which store did you visit?'}
                onBack={goBack}
              />

              <div className="relative">
                {data.channel === 'online'
                  ? <Globe size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" color="#bbb" />
                  : <ShoppingBag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" color="#bbb" />
                }
                <input
                  type={data.channel === 'online' ? 'url' : 'text'}
                  placeholder={
                    data.channel === 'online'
                      ? 'e.g. https://amazon.com'
                      : 'e.g. BricoStore, Al Mada…'
                  }
                  value={data.source}
                  onChange={(e) => setData(d => ({ ...d, source: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && goTo('rating')}
                  className="w-full h-[50px] pl-11 pr-4 rounded-xl bg-white border border-black/[0.08] text-[#111] placeholder-[#ccc] outline-none focus:border-[#E31E24]/40 focus:shadow-[0_0_0_3px_rgba(227,30,36,0.06)] transition-all"
                  style={{ fontSize: 14 }}
                  autoFocus
                />
              </div>

              <ContinueBtn onClick={() => goTo('rating')} />
              <SkipButton onClick={() => skipTo('rating')} />
            </motion.div>
          )}

          {/* ══ STEP 4 — Rating ═════════════════════════════════════════ */}
          {step === 'rating' && (
            <motion.div key="rating" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="space-y-4"
            >
              <StepHeader n={4} total={5} title="How was your buying experience?" onBack={goBack} />

              <div className="flex flex-col items-center gap-3 py-3">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setData(d => ({ ...d, rating: star }))}
                      className="p-1.5"
                      aria-label={`${star} stars`}
                    >
                      <Star
                        size={34}
                        fill={star <= data.rating ? '#E31E24' : 'none'}
                        color={star <= data.rating ? '#E31E24' : '#e0e0e0'}
                        strokeWidth={1.5}
                        style={{ transition: 'fill 0.15s ease, color 0.15s ease' }}
                      />
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {data.rating > 0 && (
                    <motion.div
                      key={data.rating}
                      initial={{ opacity: 0, y: 4, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.92 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{ background: 'rgba(227,30,36,0.06)' }}
                    >
                      {/* One-color star indicator */}
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star
                            key={s}
                            size={11}
                            fill={s <= data.rating ? '#E31E24' : 'none'}
                            color={s <= data.rating ? '#E31E24' : '#ddd'}
                            strokeWidth={1.5}
                          />
                        ))}
                      </div>
                      <span className="text-[#E31E24]" style={{ fontSize: 13, fontWeight: 700 }}>
                        {RATING_LABELS[data.rating]}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ContinueBtn onClick={() => goTo('usertype')} disabled={!data.rating} />
              <SkipButton onClick={() => skipTo('usertype')} />
            </motion.div>
          )}

          {/* ══ STEP 5 — User type ══════════════════════════════════════ */}
          {step === 'usertype' && (
            <motion.div key="usertype" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="space-y-4"
            >
              <StepHeader n={5} total={5} title="What best describes your work?" onBack={goBack} />

              <div className="grid grid-cols-2 gap-2">
                {USER_TYPES.map(({ id, label, Icon }) => {
                  const selected = data.userType === label;
                  return (
                    <motion.button
                      key={id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setData(d => ({ ...d, userType: label }))}
                      className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl border transition-all duration-200 ${
                        selected
                          ? 'bg-[#E31E24] border-[#E31E24] shadow-[0_2px_10px_rgba(227,30,36,0.2)]'
                          : 'bg-white border-black/[0.07] hover:border-[#E31E24]/30 hover:bg-[#fff5f5]'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        selected ? 'bg-white/20' : 'bg-black/[0.04]'
                      }`}>
                        <Icon size={16} color={selected ? 'white' : '#666'} strokeWidth={1.75} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: selected ? 'white' : '#333', lineHeight: 1.2, textAlign: 'center' }}>
                        {label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={submit}
                disabled={!data.userType || submitting}
                className="w-full h-[52px] rounded-xl bg-[#E31E24] text-white flex items-center justify-center gap-2 hover:bg-[#c9191e] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_4px_16px_rgba(227,30,36,0.22)]"
                style={{ fontSize: 15, fontWeight: 700 }}
              >
                {submitting
                  ? <Loader2 size={18} className="animate-spin" />
                  : <><Sparkles size={15} /> Submit & Claim My Tokens</>
                }
              </motion.button>

              <button
                onClick={submit}
                disabled={submitting}
                className="text-[#bbb] hover:text-[#888] transition-colors mx-auto block disabled:opacity-50"
                style={{ fontSize: 13, fontWeight: 500 }}
              >
                Skip & submit
              </button>
            </motion.div>
          )}

          {/* ══ DONE ════════════════════════════════════════════════════ */}
          {step === 'done' && (
            <motion.div key="done" custom={dir} variants={variants}
              initial="enter" animate="center" exit="exit" transition={t}
              className="text-center space-y-4 py-2"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFF0F0] to-[#FFE8E8] flex items-center justify-center mx-auto"
              >
                <CheckCircle2 size={30} color="#E31E24" />
              </motion.div>

              <div>
                <h3 className="text-[#111] mb-1" style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>
                  You're all set!
                </h3>
                <p className="text-[#888]" style={{ fontSize: 14, lineHeight: 1.6 }}>Thanks for sharing&nbsp;&nbsp;download BeiterX from the App Store or Google Play and your 1,000 AI Tokens will be waiting in your account.</p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl bg-gradient-to-br from-[#FFFBF5] via-[#FFF8F0] to-[#FFF0F0] border border-[#E31E24]/[0.08] p-5 space-y-3"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Sparkles size={14} color="#E31E24" />
                  <span className="text-[#E31E24] uppercase" style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>
                    Welcome Gift
                  </span>
                </div>
                <div className="text-[#111]" style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  1,000 <span className="text-[#E31E24]">AI Tokens</span>
                </div>
                <p className="text-[#999]" style={{ fontSize: 12, lineHeight: 1.65 }}>
                  Check warranty status, get troubleshooting help, and ask anything about your BEITER tools.
                </p>
                <div className="flex flex-wrap gap-1.5 justify-center pt-1">
                  {['Warranty Checks', 'Troubleshooting', 'Maintenance', 'Tool Advice'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white border border-black/[0.05] text-[#777]"
                      style={{ fontSize: 11, fontWeight: 600 }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}