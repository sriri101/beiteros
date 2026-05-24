import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Send, Mail, Phone, MessageCircle, ChevronDown,
  Paperclip, Smile, CheckCheck, Check, Wifi,
} from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

const SARAH = {
  name:    'Sarah Vogel',
  role:    'Account Manager · DACH',
  company: 'BeiterTools GmbH',
  email:   's.vogel@beitertools.com',
  phone:   '+49 89 255 34 780',
  whatsapp:'+4989255347801',
  avatar:  'https://images.unsplash.com/photo-1655249493799-9cee4fe983bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJ1c2luZXNzJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzIzODQ0MzJ8MA&ixlib=rb-4.1.0&q=80&w=200',
  initials:'SV',
};

type Status = 'sent' | 'delivered' | 'read';

interface Msg {
  id:     string;
  from:   'me' | 'sarah';
  text:   string;
  time:   string;
  status?: Status;
  date?:  string;   // shows a date divider before this message
}

const INITIAL_MSGS: Msg[] = [
  {
    id: 'm1', from: 'sarah',
    text: 'Good morning Klaus! I saw your February numbers — really strong month. 🎉 The Berlin territory is performing well above the Gold tier benchmark.',
    time: '09:14', date: 'Monday, 24 Feb',
  },
  {
    id: 'm2', from: 'me',
    text: 'Morning Sarah! Thanks — the team has been working hard. We pushed a lot on the BRH70 campaign.',
    time: '09:22', status: 'read',
  },
  {
    id: 'm3', from: 'sarah',
    text: 'Great to hear! I wanted to let you know the new BRH90-20V is launching in April. As a Gold Partner you can reserve up to 15 units at the pre-launch price — a 12% discount off the standard list.',
    time: '09:25',
  },
  {
    id: 'm4', from: 'me',
    text: 'That sounds great. Can you send over the spec sheet and the pre-order form?',
    time: '09:28', status: 'read',
  },
  {
    id: 'm5', from: 'sarah',
    text: 'Of course! I\'ll have everything across to you by this afternoon. The specs are impressive — 25% more torque and 40 min runtime on the 5Ah pack.',
    time: '09:31',
  },
  {
    id: 'm6', from: 'sarah',
    text: 'Also — did you get a chance to review the Q1 promotional catalogue I sent last week? There are some bundle deals that should work really well for your trade customers.',
    time: '14:07', date: 'Thursday, 27 Feb',
  },
  {
    id: 'm7', from: 'me',
    text: 'Yes, I looked through it. The drill combo bundle at €429 is excellent — I think we can move 20+ units before Easter.',
    time: '14:22', status: 'read',
  },
  {
    id: 'm8', from: 'sarah',
    text: 'Perfect, I\'ll flag that to the logistics team so we make sure you have enough stock. I\'ll also arrange the co-op marketing materials to go with it. 👍',
    time: '14:28',
  },
  {
    id: 'm9', from: 'sarah',
    text: 'One more thing — your Gold Partner review is coming up on 15 March. If February closes as projected you\'ll be very close to the Platinum threshold. Worth preparing for!',
    time: '14:35', date: 'Today',
  },
];

/* ════════════════════════════════════════════════════════════ */

interface Props {
  open:    boolean;
  onClose: () => void;
}

export function AccountManagerChat({ open, onClose }: Props) {
  const { profile, darkMode } = useDistributorStore();
  const dm = darkMode;

  const [msgs, setMsgs]       = useState<Msg[]>(INITIAL_MSGS);
  const [draft, setDraft]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [tab, setTab]         = useState<'chat' | 'contact'>('chat');
  const inputRef              = useRef<HTMLInputElement>(null);
  const bottomRef             = useRef<HTMLDivElement>(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, open]);

  /* Focus input when panel opens */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const PANEL_BG  = dm ? '#1C1C1E' : '#F5F5F7';
  const HEADER_BG = dm ? '#111111' : '#FFFFFF';
  const BORDER    = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const TEXT      = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED     = dm ? '#636366' : '#8E8E93';
  const INPUT_BG  = dm ? '#2C2C2E' : '#FFFFFF';
  const ME_BG     = '#E31E24';
  const HER_BG    = dm ? '#2C2C2E' : '#FFFFFF';
  const HER_TEXT  = dm ? '#f2f2f7' : '#1d1d1f';
  const DATE_PILL = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)';

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;

    const newMsg: Msg = {
      id: `m${Date.now()}`,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMsgs(prev => [...prev, newMsg]);
    setDraft('');

    /* Simulate "delivered" then Sarah typing → reply */
    setTimeout(() => {
      setMsgs(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 800);

    setTimeout(() => setTyping(true), 1800);

    const replies = [
      'Thanks for reaching out, Klaus! Let me check on that for you.',
      'Great question — I\'ll get back to you by end of day.',
      'Noted! I\'ll loop in our logistics team and confirm.',
      'Absolutely, I\'ll send the updated documentation this afternoon.',
      'Good timing — I was just reviewing your account. Let me pull up the details.',
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      setTyping(false);
      setMsgs(prev => [
        ...prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m),
        {
          id: `m${Date.now() + 1}`,
          from: 'sarah',
          text: reply,
          time: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 4000);
  };

  const StatusIcon = ({ status }: { status?: Status }) => {
    if (!status) return null;
    if (status === 'read')      return <CheckCheck size={12} style={{ color: '#90CAF9' }} />;
    if (status === 'delivered') return <CheckCheck size={12} style={{ color: 'rgba(255,255,255,0.55)' }} />;
    return <Check size={12} style={{ color: 'rgba(255,255,255,0.55)' }} />;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 420, zIndex: 8001,
              background: PANEL_BG,
              display: 'flex', flexDirection: 'column',
              fontFamily: FF,
              boxShadow: '-8px 0 48px rgba(0,0,0,0.28)',
            }}
          >

            {/* ── Header ── */}
            <div style={{
              background: HEADER_BG,
              borderBottom: `1px solid ${BORDER}`,
              padding: '14px 16px',
              flexShrink: 0,
            }}>
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={SARAH.avatar}
                    alt={SARAH.name}
                    style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: '2px solid #E31E24' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  {/* Online dot */}
                  <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#34C759', border: `2px solid ${HEADER_BG}` }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: TEXT, margin: 0, letterSpacing: '-0.01em' }}>{SARAH.name}</p>
                    <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(227,30,36,0.12)', color: '#E31E24', padding: '2px 7px', borderRadius: 99, letterSpacing: '0.04em' }}>
                      BEITER
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0', fontWeight: 500 }}>{SARAH.role}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Wifi size={9} style={{ color: '#34C759' }} />
                    <span style={{ fontSize: 10, color: '#34C759', fontWeight: 600 }}>Online</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                  <X size={15} style={{ color: TEXT }} />
                </button>
              </div>

              {/* Quick-action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${SARAH.whatsapp.replace(/\+/g, '')}?text=Hi%20Sarah%2C%20this%20is%20${encodeURIComponent(profile.contact)}%20from%20${encodeURIComponent(profile.company)}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '9px 6px', borderRadius: 12,
                    background: dm ? 'rgba(37,211,102,0.12)' : 'rgba(37,211,102,0.1)',
                    border: '1px solid rgba(37,211,102,0.25)',
                    textDecoration: 'none', cursor: 'pointer',
                  }}
                >
                  <MessageCircle size={16} style={{ color: '#25D366' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#25D366' }}>WhatsApp</span>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${SARAH.email}?subject=Query from ${profile.company}&body=Hi Sarah,%0D%0A%0D%0A`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '9px 6px', borderRadius: 12,
                    background: dm ? 'rgba(99,130,255,0.12)' : 'rgba(99,130,255,0.09)',
                    border: '1px solid rgba(99,130,255,0.25)',
                    textDecoration: 'none', cursor: 'pointer',
                  }}
                >
                  <Mail size={16} style={{ color: '#6382FF' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#6382FF' }}>Email</span>
                </a>

                {/* Phone */}
                <a
                  href={`tel:${SARAH.phone}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '9px 6px', borderRadius: 12,
                    background: dm ? 'rgba(52,199,89,0.10)' : 'rgba(52,199,89,0.09)',
                    border: '1px solid rgba(52,199,89,0.22)',
                    textDecoration: 'none', cursor: 'pointer',
                  }}
                >
                  <Phone size={16} style={{ color: '#34C759' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#34C759' }}>Call</span>
                </a>
              </div>
            </div>

            {/* ── Tab bar ── */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, background: HEADER_BG }}>
              {([['chat', 'Chat'], ['contact', 'Contact Details']] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    flex: 1, height: 38, border: 'none', cursor: 'pointer', background: 'none',
                    fontSize: 12, fontWeight: tab === key ? 700 : 500,
                    color: tab === key ? '#E31E24' : MUTED,
                    borderBottom: tab === key ? '2px solid #E31E24' : '2px solid transparent',
                    fontFamily: FF, transition: 'all 0.15s',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Chat tab ── */}
            {tab === 'chat' && (
              <>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {msgs.map((m, idx) => {
                    const isMe = m.from === 'me';
                    const showDate = !!m.date;
                    const prevSame = idx > 0 && msgs[idx - 1].from === m.from;
                    const nextSame = idx < msgs.length - 1 && msgs[idx + 1].from === m.from && !msgs[idx + 1].date;

                    return (
                      <div key={m.id}>
                        {showDate && (
                          <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 8px' }}>
                            <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, background: DATE_PILL, padding: '3px 12px', borderRadius: 99 }}>
                              {m.date}
                            </span>
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: nextSame ? 2 : 8, alignItems: 'flex-end', gap: 6 }}>
                          {/* Sarah avatar - only on last message in a group */}
                          {!isMe && (
                            <div style={{ width: 26, flexShrink: 0 }}>
                              {!nextSame && (
                                <img
                                  src={SARAH.avatar}
                                  alt="SV"
                                  style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                                  onError={e => {
                                    const el = e.target as HTMLImageElement;
                                    el.style.display = 'none';
                                    (el.parentElement as HTMLElement).innerHTML = `<div style="width:26px;height:26px;border-radius:50%;background:#E31E24;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;color:#fff">SV</div>`;
                                  }}
                                />
                              )}
                            </div>
                          )}

                          {/* Bubble */}
                          <div
                            style={{
                              maxWidth: '78%',
                              background: isMe ? ME_BG : HER_BG,
                              color: isMe ? '#fff' : HER_TEXT,
                              padding: '9px 13px',
                              borderRadius: isMe
                                ? (prevSame ? '18px 4px 4px 18px' : '18px 4px 18px 18px')
                                : (prevSame ? '4px 18px 18px 4px' : '4px 18px 18px 18px'),
                              boxShadow: isMe ? '0 2px 8px rgba(227,30,36,0.25)' : (dm ? 'none' : '0 1px 4px rgba(0,0,0,0.08)'),
                              border: !isMe && !dm ? '1px solid rgba(0,0,0,0.06)' : 'none',
                            }}
                          >
                            <p style={{ fontSize: 13, margin: 0, lineHeight: 1.5 }}>{m.text}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 3, marginTop: 4 }}>
                              <span style={{ fontSize: 10, opacity: 0.65, fontVariantNumeric: 'tabular-nums' }}>{m.time}</span>
                              {isMe && <StatusIcon status={m.status} />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {typing && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}
                      >
                        <img src={SARAH.avatar} alt="SV" style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ background: HER_BG, borderRadius: '4px 18px 18px 4px', padding: '11px 14px', border: !dm ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                style={{ width: 6, height: 6, borderRadius: '50%', background: MUTED }}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
                              />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div ref={bottomRef} />
                </div>

                {/* ── Input bar ── */}
                <div style={{
                  padding: '10px 12px',
                  borderTop: `1px solid ${BORDER}`,
                  background: HEADER_BG,
                  display: 'flex', alignItems: 'center', gap: 8,
                  flexShrink: 0,
                }}>
                  <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Smile size={20} style={{ color: MUTED }} />
                  </button>

                  <div style={{ flex: 1, background: INPUT_BG, borderRadius: 22, padding: '9px 14px', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      ref={inputRef}
                      value={draft}
                      onChange={e => setDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Message Sarah…"
                      style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FF, minWidth: 0 }}
                    />
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                      <Paperclip size={16} style={{ color: MUTED }} />
                    </button>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={sendMessage}
                    disabled={!draft.trim()}
                    style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: draft.trim() ? '#E31E24' : (dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'),
                      border: 'none', cursor: draft.trim() ? 'pointer' : 'default',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.15s', flexShrink: 0,
                      boxShadow: draft.trim() ? '0 2px 8px rgba(227,30,36,0.35)' : 'none',
                    }}
                  >
                    <Send size={16} style={{ color: draft.trim() ? '#fff' : MUTED, marginLeft: 2 }} />
                  </motion.button>
                </div>
              </>
            )}

            {/* ── Contact Details tab ── */}
            {tab === 'contact' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                {/* Sarah profile card */}
                <div style={{ background: dm ? '#2C2C2E' : '#fff', borderRadius: 18, padding: 20, border: `1px solid ${BORDER}`, marginBottom: 16, textAlign: 'center' }}>
                  <img
                    src={SARAH.avatar}
                    alt={SARAH.name}
                    style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #E31E24', marginBottom: 12 }}
                  />
                  <p style={{ fontSize: 17, fontWeight: 900, color: TEXT, margin: 0 }}>{SARAH.name}</p>
                  <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 10px' }}>{SARAH.role}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(227,30,36,0.1)', color: '#E31E24', padding: '4px 14px', borderRadius: 99 }}>
                    {SARAH.company}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginTop: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C759' }} />
                    <span style={{ fontSize: 11, color: '#34C759', fontWeight: 600 }}>Available — Typically replies within 2 h</span>
                  </div>
                </div>

                {/* Contact details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Email', value: SARAH.email, icon: Mail, color: '#6382FF', href: `mailto:${SARAH.email}`, action: 'Send Email' },
                    { label: 'WhatsApp', value: SARAH.phone, icon: MessageCircle, color: '#25D366', href: `https://wa.me/${SARAH.whatsapp.replace(/\+/g, '')}`, action: 'Open WhatsApp' },
                    { label: 'Direct Line', value: SARAH.phone, icon: Phone, color: '#34C759', href: `tel:${SARAH.phone}`, action: 'Call Now' },
                  ].map(({ label, value, icon: Icon, color, href, action }) => (
                    <div key={label} style={{ background: dm ? '#2C2C2E' : '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 10, color: MUTED, margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
                        <p style={{ fontSize: 13, color: TEXT, margin: '2px 0 0', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</p>
                      </div>
                      <a
                        href={href}
                        target={label === 'WhatsApp' ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, padding: '5px 12px', borderRadius: 8, textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        {action}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Office hours */}
                <div style={{ marginTop: 16, background: dm ? '#2C2C2E' : '#fff', borderRadius: 14, padding: '14px 16px', border: `1px solid ${BORDER}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Office Hours</p>
                  {[
                    { day: 'Monday – Friday', hours: '08:00 – 18:00 CET' },
                    { day: 'Saturday',        hours: '09:00 – 13:00 CET' },
                    { day: 'Sunday',          hours: 'Closed' },
                  ].map(r => (
                    <div key={r.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: MUTED }}>{r.day}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.hours === 'Closed' ? '#E31E24' : TEXT }}>{r.hours}</span>
                    </div>
                  ))}
                </div>

                {/* Note */}
                <p style={{ fontSize: 11, color: MUTED, textAlign: 'center', margin: '16px 0 0', lineHeight: 1.6 }}>
                  Sarah is your dedicated BEITER account manager for the DACH region. All queries about stock, pricing, and partnership status go directly to her.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
