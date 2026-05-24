import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2, Check, ExternalLink,
  Wifi, WifiOff, Loader2, ArrowRight, Mail,
  AlertCircle, Link2, Inbox,
} from 'lucide-react';
import CompanyLogo from '../../imports/Layer1';

const STORAGE_KEY = 'beiterx_formspree_url';

function StepBadge({ n, done }: { n: number; done: boolean }) {
  return (
    <motion.div
      animate={{ scale: done ? [1, 1.15, 1] : 1 }}
      transition={{ duration: 0.4 }}
      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500"
      style={{
        background: done ? '#22c55e' : '#E31E24',
        boxShadow: done
          ? '0 4px 12px rgba(34,197,94,0.35)'
          : '0 4px 12px rgba(227,30,36,0.35)',
      }}
    >
      {done
        ? <Check size={16} color="white" strokeWidth={3} />
        : <span className="text-white" style={{ fontSize: 14, fontWeight: 800 }}>{n}</span>
      }
    </motion.div>
  );
}

export default function SetupGuide() {
  const [inputVal, setInputVal] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ''
  );
  const [testState, setTestState] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [saved, setSaved] = useState(!!localStorage.getItem(STORAGE_KEY));

  const isValidUrl = inputVal.startsWith('https://formspree.io/f/');

  const handleSave = useCallback(() => {
    if (!isValidUrl) return;
    localStorage.setItem(STORAGE_KEY, inputVal);
    setSaved(true);
  }, [inputVal, isValidUrl]);

  const handleTest = useCallback(async () => {
    const url = inputVal || localStorage.getItem(STORAGE_KEY) || '';
    if (!url) return;
    setTestState('testing');
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '✅ BeiterX Setup Test',
          contact: 'test@beiterx.com',
          method: 'email',
          source: '⚙️ Setup Test — connection verified',
        }),
      });
      setTestState(res.ok ? 'ok' : 'fail');
    } catch {
      setTestState('fail');
    }
    setTimeout(() => setTestState('idle'), 5000);
  }, [inputVal]);

  const completedSteps = saved ? 3 : isValidUrl ? 2 : 0;

  return (
    <div
      className="min-h-screen bg-[#f2f2f5] overflow-x-hidden"
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-black/[0.05] sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[90px] h-6 relative" style={{ '--fill-0': '#111' } as React.CSSProperties}>
              <CompanyLogo />
            </div>
            <div className="h-4 w-px bg-black/[0.1]" />
            <span className="text-[#555]" style={{ fontSize: 13, fontWeight: 600 }}>
              Email Notifications Setup
            </span>
          </div>
          <a
            href="/"
            className="flex items-center gap-1.5 text-[#888] hover:text-[#111] transition-colors"
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            Landing page <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 md:px-8 py-10 md:py-14 space-y-6">

        {/* Hero */}
        <div className="text-center space-y-3 pb-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF0F0] to-[#FFE8E8] flex items-center justify-center mx-auto shadow-[0_4px_12px_rgba(227,30,36,0.12)]">
            <Mail size={24} color="#E31E24" strokeWidth={1.8} />
          </div>
          <h1
            className="text-[#111]"
            style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontWeight: 900, letterSpacing: '-0.02em' }}
          >
            Get emailed on every signup
          </h1>
          <p className="text-[#888] max-w-sm mx-auto" style={{ fontSize: 15, lineHeight: 1.6 }}>
            Takes 2 minutes. Uses <strong>Formspree</strong> — free, no coding, works instantly.
          </p>

          {/* Progress */}
          <div className="max-w-xs mx-auto pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[#999]" style={{ fontSize: 12, fontWeight: 500 }}>Progress</span>
              <span className="text-[#111]" style={{ fontSize: 12, fontWeight: 700 }}>{completedSteps} / 3 steps</span>
            </div>
            <div className="h-2 rounded-full bg-black/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: saved ? '#22c55e' : '#E31E24' }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedSteps / 3) * 100}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>

        {/* ── Step 1 ── */}
        {[
          {
            n: 1,
            done: completedSteps >= 1,
            title: 'Create a free Formspree account',
            body: (
              <div className="space-y-3">
                <p className="text-[#666]" style={{ fontSize: 14, lineHeight: 1.65 }}>
                  Go to <strong>formspree.io</strong>, click <strong>Get Started</strong>, and sign up with your email.
                  The free plan allows up to <strong>50 submissions/month</strong> — more than enough to start.
                </p>
                <a
                  href="https://formspree.io/register"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.97] shadow-[0_4px_12px_rgba(227,30,36,0.2)]"
                  style={{ background: '#E31E24', fontSize: 14, fontWeight: 600 }}
                >
                  Open Formspree
                  <ExternalLink size={14} />
                </a>
              </div>
            ),
          },
          {
            n: 2,
            done: completedSteps >= 2,
            title: 'Create a new form & copy its link',
            body: (
              <div className="space-y-4">
                <p className="text-[#666]" style={{ fontSize: 14, lineHeight: 1.65 }}>
                  After logging in, follow these steps inside Formspree:
                </p>
                <div className="rounded-2xl border border-black/[0.06] overflow-hidden">
                  {[
                    { step: '①', text: 'Click "+ New Form"' },
                    { step: '②', text: 'Name it "BeiterX Signups" (or anything you like)' },
                    { step: '③', text: 'Click "Create Form"' },
                    { step: '④', text: 'Copy the endpoint URL shown — it looks like: https://formspree.io/f/xxxxxxxx' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 px-4 py-3 border-b border-black/[0.04] last:border-0 bg-white">
                      <span className="shrink-0 text-[#E31E24]" style={{ fontSize: 15, fontWeight: 800, minWidth: 24 }}>
                        {item.step}
                      </span>
                      <span className="text-[#444]" style={{ fontSize: 13, lineHeight: 1.55 }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-[#fffbf0] border border-amber-200 p-3 flex items-start gap-2.5">
                  <span style={{ fontSize: 16 }}>💡</span>
                  <p className="text-[#92400e]" style={{ fontSize: 13, lineHeight: 1.55 }}>
                    The URL is on the <strong>Integration</strong> tab of your form, under "HTML" — it starts with <code className="bg-amber-100 px-1 rounded">https://formspree.io/f/</code>
                  </p>
                </div>
              </div>
            ),
          },
          {
            n: 3,
            done: completedSteps >= 3,
            title: 'Paste your form URL here',
            body: (
              <div className="space-y-3">
                <p className="text-[#666]" style={{ fontSize: 14, lineHeight: 1.65 }}>
                  Paste the URL you copied from Formspree. Then click <strong>Save</strong> and <strong>Test</strong> — you'll get a real test email to confirm it works.
                </p>

                {/* Input */}
                <div className="relative">
                  <Link2
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    color={isValidUrl ? '#22c55e' : '#bbb'}
                  />
                  <input
                    type="url"
                    value={inputVal}
                    onChange={(e) => { setInputVal(e.target.value); setSaved(false); }}
                    placeholder="https://formspree.io/f/xxxxxxxx"
                    className="w-full h-[52px] pl-11 pr-4 rounded-2xl border text-[#111] placeholder-[#ccc] outline-none transition-all"
                    style={{
                      fontSize: 14,
                      background: inputVal && !isValidUrl ? '#fff5f5' : 'white',
                      borderColor: inputVal && !isValidUrl
                        ? 'rgba(227,30,36,0.35)'
                        : isValidUrl
                          ? 'rgba(34,197,94,0.45)'
                          : 'rgba(0,0,0,0.1)',
                      boxShadow: isValidUrl
                        ? '0 0 0 3px rgba(34,197,94,0.08)'
                        : inputVal && !isValidUrl
                          ? '0 0 0 3px rgba(227,30,36,0.06)'
                          : 'none',
                    }}
                  />
                  {isValidUrl && (
                    <CheckCircle2
                      size={16}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      color="#22c55e"
                    />
                  )}
                </div>

                {inputVal && !isValidUrl && (
                  <p className="flex items-center gap-1.5 text-[#E31E24]" style={{ fontSize: 12 }}>
                    <AlertCircle size={12} />
                    Should start with https://formspree.io/f/
                  </p>
                )}

                {/* Save + Test buttons */}
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSave}
                    disabled={!isValidUrl}
                    className="flex-1 h-[48px] rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: saved ? '#22c55e' : '#E31E24',
                      color: 'white',
                      fontSize: 14,
                      fontWeight: 700,
                      boxShadow: saved
                        ? '0 4px 12px rgba(34,197,94,0.25)'
                        : '0 4px 12px rgba(227,30,36,0.2)',
                    }}
                  >
                    {saved ? <><Check size={15} /> Saved!</> : <><Link2 size={14} /> Save URL</>}
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleTest}
                    disabled={!isValidUrl || testState === 'testing'}
                    className="h-[48px] px-5 rounded-xl border flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: testState === 'ok'
                        ? 'rgba(34,197,94,0.4)'
                        : testState === 'fail'
                          ? 'rgba(227,30,36,0.3)'
                          : 'rgba(0,0,0,0.1)',
                      background: testState === 'ok'
                        ? 'rgba(34,197,94,0.06)'
                        : testState === 'fail'
                          ? 'rgba(227,30,36,0.04)'
                          : 'white',
                      color: testState === 'ok' ? '#16a34a' : testState === 'fail' ? '#E31E24' : '#555',
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {testState === 'testing' && (
                        <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                          <Loader2 size={14} className="animate-spin" /> Sending…
                        </motion.span>
                      )}
                      {testState === 'ok' && (
                        <motion.span key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                          <Wifi size={14} /> Email sent!
                        </motion.span>
                      )}
                      {testState === 'fail' && (
                        <motion.span key="fail" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                          <WifiOff size={14} /> Failed
                        </motion.span>
                      )}
                      {testState === 'idle' && (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
                          <Inbox size={14} /> Send test
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {testState === 'ok' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5 rounded-xl bg-green-50 border border-green-200 p-3"
                    >
                      <CheckCircle2 size={15} color="#16a34a" className="shrink-0 mt-0.5" />
                      <p className="text-[#15803d]" style={{ fontSize: 13, lineHeight: 1.5 }}>
                        <strong>Check your inbox!</strong> A test email was just sent from Formspree. If you don't see it, check your spam folder and mark it as not spam.
                      </p>
                    </motion.div>
                  )}
                  {testState === 'fail' && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 p-3"
                    >
                      <AlertCircle size={15} color="#E31E24" className="shrink-0 mt-0.5" />
                      <p className="text-[#991b1b]" style={{ fontSize: 13, lineHeight: 1.5 }}>
                        Could not reach Formspree. Double-check the URL is copied exactly as shown in your Formspree dashboard.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ),
          },
        ].map((step) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: step.n * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border overflow-hidden"
            style={{
              borderColor: step.done ? 'rgba(34,197,94,0.2)' : 'rgba(0,0,0,0.05)',
              boxShadow: step.done
                ? '0 2px 12px rgba(34,197,94,0.07)'
                : '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <StepBadge n={step.n} done={step.done} />
                <div className="flex-1 min-w-0 space-y-4">
                  <h3 className="text-[#111]" style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
                    {step.title}
                  </h3>
                  {step.body}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ── Done banner ── */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-3xl overflow-hidden border border-green-200"
              style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}
            >
              <div className="p-6 md:p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto shadow-[0_4px_16px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 size={32} color="#22c55e" />
                </div>
                <div>
                  <h3 className="text-[#15803d]" style={{ fontSize: 22, fontWeight: 800 }}>
                    You're all set! 🎉
                  </h3>
                  <p className="text-[#16a34a] mt-1" style={{ fontSize: 14, lineHeight: 1.6 }}>
                    Every signup on the BeiterX landing page will now send you an email instantly.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/70 border border-green-200 p-4 text-left space-y-2">
                  <p className="text-[#15803d]" style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Each email will contain:
                  </p>
                  {[
                    '📧 Their email address or WhatsApp number',
                    '🏷️ Contact method (Email or WhatsApp)',
                    '🔗 Source (BeiterX Landing)',
                    '📅 Date & time of signup',
                  ].map((item) => (
                    <p key={item} className="text-[#166534]" style={{ fontSize: 13, lineHeight: 1.6 }}>{item}</p>
                  ))}
                </div>
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 h-[48px] rounded-2xl bg-[#E31E24] text-white hover:bg-[#c9191e] transition-all shadow-[0_4px_12px_rgba(227,30,36,0.2)]"
                  style={{ fontSize: 15, fontWeight: 700 }}
                >
                  Go to Landing Page <ArrowRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Troubleshoot ── */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5 space-y-3">
          <p className="text-[#111]" style={{ fontSize: 14, fontWeight: 700 }}>🔧 Not working?</p>
          <div className="space-y-3">
            {[
              { q: 'No email after testing', a: 'Check your spam folder and whitelist noreply@formspree.io. Also make sure you confirmed your email when signing up to Formspree.' },
              { q: '"Failed" on the test button', a: 'Make sure you copied the full URL including https:// and that it starts with formspree.io/f/' },
              { q: 'Need more than 50/month', a: 'Upgrade to Formspree Gold ($10/mo) for unlimited submissions, or contact us to set up a dedicated backend.' },
            ].map((item) => (
              <div key={item.q} className="space-y-0.5">
                <p className="text-[#444]" style={{ fontSize: 13, fontWeight: 600 }}>→ {item.q}</p>
                <p className="text-[#777]" style={{ fontSize: 13, lineHeight: 1.55 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
