import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, TrendingDown, Package, ShieldCheck,
  Euro, Users, Check, X as XIcon, Clock, Wrench,
  ChevronUp, ChevronDown, Store, Star, AlertTriangle,
  ArrowUpRight, Zap, Award, Bell, ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, LineChart, Line, CartesianGrid, Legend,
  AreaChart, Area,
} from 'recharts';
import { useDistributorStore } from '../store/useDistributorStore';
import { LearnTooltip } from '../components/LearnTooltip';

const FF = "'Inter', sans-serif";
function fmt(n: number) { return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }); }
function fmtK(n: number) { return n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : `€${n}`; }

type Range = '3m' | '6m' | 'ytd';

const CATEGORY_DATA = [
  { name: 'Drilling',  value: 38, color: '#E31E24' },
  { name: 'Sawing',    value: 22, color: '#6366F1' },
  { name: 'Measuring', value: 18, color: '#FF9500' },
  { name: 'Grinding',  value: 15, color: '#34C759' },
  { name: 'Other',     value: 7,  color: '#888888' },
];

const STATUS_CFG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   color: '#FF9500', icon: Clock   },
  in_repair: { label: 'In Repair', color: '#6366F1', icon: Wrench  },
  approved:  { label: 'Approved',  color: '#34C759', icon: Check   },
  rejected:  { label: 'Rejected',  color: '#C0392B', icon: XIcon   },
};

/* ══════════════════════════════════════════════════════
   RE-DISTRIBUTOR DATA
   ══════════════════════════════════════════════════════ */
interface ReDist {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  market: 'eu' | 'sea';
  tier: 'Gold' | 'Silver' | 'Bronze' | 'New';
  revenue_ytd: number;
  revenue_prev: number;
  units_ytd: number;
  orders_ytd: number;
  claims_rate: number;
  active_skus: number;
  last_order: string;
  monthly: number[];
  score: number;
  recommendation: 'upgrade' | 'maintain' | 'nurture' | 'alert';
}

const REDIST_DATA: ReDist[] = [
  { id:'r1', name:'Werkhaus GmbH',        city:'Munich',     country:'Germany',   flag:'🇩🇪', market:'eu',  tier:'Gold',   revenue_ytd:284200, revenue_prev:222000, units_ytd:892, orders_ytd:14, claims_rate:2.1, active_skus:18, last_order:'2026-02-24', monthly:[38200,42100,45800,48300,52200,57600], score:94, recommendation:'upgrade'  },
  { id:'r2', name:'Vogt Werkzeuge',       city:'Hamburg',    country:'Germany',   flag:'🇩🇪', market:'eu',  tier:'Silver', revenue_ytd:112300, revenue_prev: 79600, units_ytd:353, orders_ytd: 7, claims_rate:1.8, active_skus:12, last_order:'2026-02-20', monthly:[12300,14800,17200,18900,23100,26000], score:88, recommendation:'upgrade'  },
  { id:'r3', name:'Norbau Retail AG',     city:'Berlin',     country:'Germany',   flag:'🇩🇪', market:'eu',  tier:'Gold',   revenue_ytd:196400, revenue_prev:175300, units_ytd:618, orders_ytd:11, claims_rate:3.4, active_skus:15, last_order:'2026-02-18', monthly:[28400,31200,33800,32900,35100,35000], score:76, recommendation:'maintain' },
  { id:'r4', name:'Steinbach AG',         city:'Frankfurt',  country:'Germany',   flag:'🇩🇪', market:'eu',  tier:'Silver', revenue_ytd:148700, revenue_prev:141600, units_ytd:467, orders_ytd: 9, claims_rate:4.2, active_skus:11, last_order:'2026-02-10', monthly:[22400,24100,25800,24900,25400,26100], score:63, recommendation:'maintain' },
  { id:'r5', name:'ProBuild Asia Pte.', city:'Singapore',  country:'Singapore', flag:'🇸🇬', market:'sea', tier:'Silver', revenue_ytd: 76200, revenue_prev: 64100, units_ytd:239, orders_ytd: 8, claims_rate:2.9, active_skus: 9, last_order:'2026-02-22', monthly:[ 9800,11200,12400,13100,14300,15400], score:72, recommendation:'maintain' },
  { id:'r6', name:'South Asia Tools',   city:'Mumbai',     country:'India',     flag:'🇮🇳', market:'sea', tier:'New',    revenue_ytd: 28400, revenue_prev: 15600, units_ytd: 89, orders_ytd: 4, claims_rate:1.2, active_skus: 5, last_order:'2026-02-19', monthly:[ 2100, 3400, 4200, 5600, 6200, 6900], score:68, recommendation:'nurture'  },
  { id:'r7', name:'Krafft GmbH & Co.',   city:'Stuttgart',  country:'Germany',   flag:'🇩🇪', market:'eu',  tier:'Gold',   revenue_ytd: 89500, revenue_prev: 97300, units_ytd:281, orders_ytd: 6, claims_rate:6.7, active_skus:10, last_order:'2026-01-29', monthly:[17800,16200,15400,14800,12900,12400], score:42, recommendation:'alert'    },
  { id:'r8', name:'Max Bau GmbH',       city:'Düsseldorf', country:'Germany',   flag:'🇩🇪', market:'eu',  tier:'Bronze', revenue_ytd: 34100, revenue_prev: 40200, units_ytd:107, orders_ytd: 3, claims_rate:8.1, active_skus: 6, last_order:'2026-01-14', monthly:[ 7200, 6800, 6100, 5400, 4400, 4200], score:26, recommendation:'alert'    },
];

const REC_CFG = {
  upgrade:  { label: 'Offer Upgrade Deal', color: '#34C759', bg: '#0D2A1A', bgL: '#E8F8EE', Icon: Award         },
  maintain: { label: 'Maintain',           color: '#6366F1', bg: '#1A1A3A', bgL: '#EEF2FF', Icon: Check         },
  nurture:  { label: 'Nurture',            color: '#FF9500', bg: '#3A2800', bgL: '#FFF3E0', Icon: Zap           },
  alert:    { label: 'Needs Attention',    color: '#E31E24', bg: '#3A1010', bgL: '#FFF0F0', Icon: AlertTriangle },
};

type SortKey = 'score' | 'revenue_ytd' | 'growth' | 'claims_rate' | 'orders_ytd';

/* ── Mini sparkline bars ── */
function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 28, width: 80 }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, height: `${Math.max((v / max) * 100, 10)}%`, background: i === data.length - 1 ? color : `${color}55`, borderRadius: 2 }} />
      ))}
    </div>
  );
}

/* ── Score ring ── */
function ScoreRing({ score, color, size = 42 }: { score: number; color: string; size?: number }) {
  const r    = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={5} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 900, color, fontVariantNumeric: 'tabular-nums' }}>{score}</span>
      </div>
    </div>
  );
}

/* ── Re-distributor slide-over detail panel ── */
function ReDistPanel({ rd, onClose, dm }: { rd: ReDist; onClose: () => void; dm: boolean }) {
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const INPUT  = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const cfg    = REC_CFG[rd.recommendation];
  const growth = ((rd.revenue_ytd - rd.revenue_prev) / rd.revenue_prev) * 100;
  const monthLabels = ['Sep','Oct','Nov','Dec','Jan','Feb'];
  const chartData   = rd.monthly.map((v, i) => ({ m: monthLabels[i], v }));
  const tooltipStyle = { background: dm ? '#2A2A2A' : '#1D1D1F', border: 'none', borderRadius: 10, fontSize: 12, padding: '8px 12px', fontFamily: FF };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontFamily: FF, backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        style={{ width: 400, height: '100%', background: CARD, overflowY: 'auto', borderLeft: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ padding: '26px 22px 18px', borderBottom: `1px solid ${BORDER}`, background: dm ? `${cfg.bg}88` : `${cfg.bgL}88` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <span style={{ fontSize: 28 }}>{rd.flag}</span>
              <p style={{ fontSize: 20, fontWeight: 900, color: TEXT, margin: '6px 0 0', letterSpacing: '-0.02em' }}>{rd.name}</p>
              <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>{rd.city}, {rd.country} · {rd.tier} Tier · {rd.market.toUpperCase()} Market</p>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginTop: -2 }}>
              <XIcon size={18} style={{ color: MUTED }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ScoreRing score={rd.score} color={cfg.color} size={52} />
            <div>
              <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 5px' }}>Performance Score</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: dm ? cfg.bg : cfg.bgL, border: `1px solid ${cfg.color}33` }}>
                <cfg.Icon size={12} style={{ color: cfg.color }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Area chart */}
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>6-Month Revenue Trend</p>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`pg-${rd.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={cfg.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={cfg.color} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
              <XAxis dataKey="m" tick={{ fill: MUTED, fontSize: 10, fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`€${fmt(v)}`, 'Revenue']} labelStyle={{ color: '#fff', fontWeight: 700 }} itemStyle={{ color: '#fff' }} />
              <Area type="monotone" dataKey="v" stroke={cfg.color} strokeWidth={2.5} fill={`url(#pg-${rd.id})`} dot={{ r: 3, fill: cfg.color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats grid */}
        <div style={{ padding: '18px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderBottom: `1px solid ${BORDER}` }}>
          {[
            { label: 'Revenue YTD',   value: `€${fmt(rd.revenue_ytd)}`,                                                          color: TEXT },
            { label: 'Growth vs LY',  value: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`,                                   color: growth >= 0 ? '#34C759' : '#E31E24' },
            { label: 'Units YTD',     value: fmt(rd.units_ytd),                                                                   color: TEXT },
            { label: 'Orders YTD',    value: String(rd.orders_ytd),                                                               color: TEXT },
            { label: 'Avg Order Val', value: `€${fmt(Math.round(rd.revenue_ytd / rd.orders_ytd))}`,                               color: TEXT },
            { label: 'Claims Rate',   value: `${rd.claims_rate}%`,                                                                color: rd.claims_rate > 5 ? '#E31E24' : rd.claims_rate > 3 ? '#FF9500' : '#34C759' },
            { label: 'Active SKUs',   value: `${rd.active_skus} products`,                                                        color: TEXT },
            { label: 'Last Order',    value: rd.last_order.slice(5).split('-').join(' / '),                                        color: TEXT },
          ].map(s => (
            <div key={s.label} style={{ background: INPUT, borderRadius: 10, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>{s.label}</p>
              <p style={{ fontSize: 14, fontWeight: 900, color: s.color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div style={{ padding: '18px 22px', flex: 1 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Recommended Action</p>
          {rd.recommendation === 'upgrade' && (
            <div style={{ background: dm ? '#0D2A1A' : '#E8F8EE', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(52,199,89,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <Award size={14} style={{ color: '#34C759' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#34C759' }}>Offer a better deal now</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.6 }}>This partner is your top performer with exceptional growth. Offer improved pricing tiers, extended payment terms, or priority stock allocation to deepen their loyalty and reward their performance.</p>
            </div>
          )}
          {rd.recommendation === 'alert' && (
            <div style={{ background: dm ? '#3A1010' : '#FFF0F0', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(227,30,36,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <AlertTriangle size={14} style={{ color: '#E31E24' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#E31E24' }}>Schedule a review call this week</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.6 }}>Revenue is declining and the claims rate is elevated — both are early warning signs. Reach out within 7 days to understand what's blocking them and offer targeted support or adjusted terms.</p>
            </div>
          )}
          {rd.recommendation === 'nurture' && (
            <div style={{ background: dm ? '#3A2800' : '#FFF3E0', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(255,149,0,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <Zap size={14} style={{ color: '#FF9500' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#FF9500' }}>Invest in growth — strong upside</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.6 }}>This partner is showing strong growth from a small base. Share marketing assets, introduce 3–5 additional SKUs, and consider a co-marketing activation to accelerate their reach.</p>
            </div>
          )}
          {rd.recommendation === 'maintain' && (
            <div style={{ background: dm ? '#1A1A3A' : '#EEF2FF', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(99,102,241,0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <Check size={14} style={{ color: '#6366F1' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>Keep current deal — on track</span>
              </div>
              <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.6 }}>Performing in line with expectations. Conduct a quarterly check-in to maintain momentum and watch for opportunities to expand their product range.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   RE-DISTRIBUTOR LEADERBOARD SECTION
   ══════════════════════════════════════════════════════ */
function ReDistributorSection({ dm }: { dm: boolean }) {
  const [sortKey,    setSortKey]    = useState<SortKey>('score');
  const [sortAsc,    setSortAsc]    = useState(false);
  const [selected,   setSelected]   = useState<ReDist | null>(null);
  const [marketFilt, setMarketFilt] = useState<'all' | 'eu' | 'sea'>('all');

  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.07)';
  const INPUT  = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const growthOf = (r: ReDist) => ((r.revenue_ytd - r.revenue_prev) / r.revenue_prev) * 100;

  const data = REDIST_DATA
    .filter(r => marketFilt === 'all' || r.market === marketFilt)
    .sort((a, b) => {
      const ga = growthOf(a), gb = growthOf(b);
      const va = sortKey === 'growth' ? ga : sortKey === 'claims_rate' ? a.claims_rate : (a as any)[sortKey];
      const vb = sortKey === 'growth' ? gb : sortKey === 'claims_rate' ? b.claims_rate : (b as any)[sortKey];
      // For claims_rate we want low = good, so ascending by default
      const asc = sortKey === 'claims_rate' ? !sortAsc : sortAsc;
      return asc ? va - vb : vb - va;
    });

  const toggleSort = (k: SortKey) => { if (sortKey === k) setSortAsc(v => !v); else { setSortKey(k); setSortAsc(false); } };

  const totalRevNet  = data.reduce((a, r) => a + r.revenue_ytd, 0);
  const upgradeList  = REDIST_DATA.filter(r => r.recommendation === 'upgrade');
  const alertList    = REDIST_DATA.filter(r => r.recommendation === 'alert');
  const totalRevAll  = REDIST_DATA.reduce((a, r) => a + r.revenue_ytd, 0);

  const TH_TIPS: Record<SortKey, { title: string; desc: string }> = {
    score:       { title: 'Performance Score',      desc: 'A 0–100 composite index weighting revenue growth (35%), order frequency (25%), active SKU coverage (20%) and inverse claims rate (20%). Click to sort.' },
    revenue_ytd: { title: 'Revenue YTD',            desc: 'Total revenue generated by this re-distributor from all orders placed since 1 Jan 2026. Click column header to sort.' },
    growth:      { title: 'Growth vs. Last Year',   desc: 'Year-on-year revenue change vs. the same period last year. Green = growing, red = declining. Click to sort.' },
    claims_rate: { title: 'Claims Rate',            desc: 'Percentage of sold units that triggered a warranty claim. Under 3% is healthy, 3–5% is a watch zone, above 5% is a warning. Sorted ascending (low = good) by default.' },
    orders_ytd:  { title: 'Orders per Year',        desc: 'Number of distinct stock purchase orders placed this year — a proxy for buying frequency and commercial engagement. Click to sort.' },
  };

  const SortTh = ({ k, label }: { k: SortKey; label: string }) => (
    <th onClick={() => toggleSort(k)}
      style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: sortKey === k ? '#E31E24' : MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <LearnTooltip title={TH_TIPS[k].title} desc={TH_TIPS[k].desc} side="bottom" width={260}>
          <span>{label}</span>
        </LearnTooltip>
        {sortKey === k && (sortAsc ? <ChevronUp size={11} style={{ color: '#E31E24' }} /> : <ChevronDown size={11} style={{ color: '#E31E24' }} />)}
      </div>
    </th>
  );

  return (
    <div style={{ marginTop: 30 }}>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: dm ? '#3A2800' : '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={16} style={{ color: '#FF9500' }} />
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.025em' }}>Re-Distributor Network</h2>
            <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>Performance ranking, deal recommendations & growth signals across your channel</p>
          </div>
        </div>
        {/* Market filter toggle */}
        <div style={{ display: 'flex', background: INPUT, borderRadius: 12, padding: 3, gap: 3 }}>
          {(['all', 'eu', 'sea'] as const).map(m => (
            <button key={m} onClick={() => setMarketFilt(m)}
              style={{ padding: '7px 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: FF, background: marketFilt === m ? '#E31E24' : 'transparent', color: marketFilt === m ? '#fff' : MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.15s' }}>
              {m === 'all' ? 'All Markets' : m === 'eu' ? '🇪🇺 Europe' : '🌏 South Asia'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {[
          { label: 'Network Revenue YTD', value: `€${fmt(totalRevNet)}`, sub: `${data.length} re-distributors`,       color: '#E31E24', Icon: Euro,  tip: { title: 'Network Revenue YTD', desc: 'Combined revenue from all re-distributors in the selected market filter. Excludes your direct sales to end-customers.' } },
          { label: 'Upgrade Candidates',  value: String(upgradeList.length), sub: upgradeList.map(r => r.name.split(' ')[0]).join(', '), color: '#34C759', Icon: Award, tip: { title: 'Upgrade Candidates', desc: 'Re-distributors with a score ≥88 or YoY growth above 30%. These partners are outperforming — offering them better pricing or priority stock deepens loyalty.' } },
          { label: 'Need Attention',      value: String(alertList.length),   sub: alertList.map(r => r.name.split(' ')[0]).join(' & '), color: '#E31E24', Icon: Bell,  tip: { title: 'Needs Attention', desc: 'Re-distributors with declining revenue trends or a claims rate above 5%. Proactive outreach within 7 days can prevent churn.' } },
          { label: 'Top Performer',       value: REDIST_DATA[0].name.split(' ')[0], sub: `Score ${REDIST_DATA[0].score}/100 · ${REDIST_DATA[0].flag} ${REDIST_DATA[0].city}`, color: '#FF9500', Icon: Star, tip: { title: 'Top Performer', desc: 'The re-distributor with the highest overall Performance Score in your network this period.' } },
        ].map(s => (
          <div key={s.label} style={{ background: CARD, borderRadius: 14, padding: '14px 16px', border: `1px solid ${BORDER}`, boxShadow: SHADOW }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: `${s.color}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.Icon size={12} style={{ color: s.color }} />
              </div>
              <LearnTooltip title={s.tip.title} desc={s.tip.desc} side="bottom" width={268}>
                <span style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</span>
              </LearnTooltip>
            </div>
            <p style={{ fontSize: 22, fontWeight: 900, color: s.color, margin: '0 0 2px', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>{s.value}</p>
            <p style={{ fontSize: 10, color: MUTED, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Leaderboard table */}
      <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: 0 }}>Leaderboard</p>
          <span style={{ fontSize: 13, color: MUTED }}>Click any row to view full profile & action plan</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
            {([['score','Score'],['revenue_ytd','Revenue'],['growth','Growth'],['claims_rate','Claims ↓']] as [SortKey,string][]).map(([k,l]) => (
              <button key={k} onClick={() => toggleSort(k)}
                style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FF, background: sortKey === k ? (dm ? '#3A1010' : '#FFF0F0') : INPUT, color: sortKey === k ? '#E31E24' : MUTED, transition: 'all 0.15s' }}>
                {l} {sortKey === k ? (sortAsc ? '↑' : '↓') : ''}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: dm ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.025)' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', width: 44 }}>
                <LearnTooltip title="Rank" desc="Leaderboard position based on the currently active sort. Default ranking is by Performance Score — your most commercially valuable partners appear first." side="bottom">
                  <span>#</span>
                </LearnTooltip>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <LearnTooltip title="Re-Distributor" desc="Name, city and partner tier of each re-distributor in your network. Click any row to open their full performance profile and deal recommendations." side="bottom" width={272}>
                  <span>Re-Distributor</span>
                </LearnTooltip>
              </th>
              <SortTh k="score"       label="Score"     />
              <SortTh k="revenue_ytd" label="Rev. YTD"  />
              <SortTh k="growth"      label="Growth"    />
              <SortTh k="orders_ytd"  label="Orders"    />
              <SortTh k="claims_rate" label="Claims %"  />
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <LearnTooltip title="6-Month Revenue Trend" desc="Mini bar chart showing monthly revenue for the last 6 months (Sep → Feb). The tallest, darkest bar is the most recent month. A rising pattern = healthy growth." side="bottom" width={268}>
                  <span>6M Trend</span>
                </LearnTooltip>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <LearnTooltip title="Revenue Share" desc="This re-distributor's contribution as a % of your total network revenue. A high share means you're reliant on them — diversification is healthy. A low share on a growing partner is an opportunity." side="bottom" width={284}>
                  <span>Share</span>
                </LearnTooltip>
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <LearnTooltip title="Deal Recommendation" desc="Commercial action suggested based on performance score and trend: 'Offer Upgrade' = reward with better terms, 'Maintain' = stay the course, 'Nurture' = invest to grow, 'Needs Attention' = risk of losing this partner." side="bottom" width={300}>
                  <span>Action</span>
                </LearnTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((rd, i) => {
              const growth  = growthOf(rd);
              const growthUp = growth >= 0;
              const cfg     = REC_CFG[rd.recommendation];
              const share   = (rd.revenue_ytd / totalRevAll) * 100;
              return (
                <motion.tr key={rd.id} whileHover={{ backgroundColor: dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' } as any}
                  onClick={() => setSelected(rd)}
                  style={{ borderTop: `1px solid ${BORDER}`, cursor: 'pointer' }}>

                  {/* Rank */}
                  <td style={{ padding: '14px 16px', fontSize: 18, textAlign: 'center' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>{i+1}</span>}
                  </td>

                  {/* Name */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cfg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                        {rd.flag}
                      </div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: 'nowrap' }}>{rd.name}</p>
                        <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>{rd.city} · {rd.tier}</p>
                      </div>
                    </div>
                  </td>

                  {/* Score with ring */}
                  <td style={{ padding: '14px 16px' }}>
                    <ScoreRing score={rd.score} color={cfg.color} size={44} />
                  </td>

                  {/* Revenue */}
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>€{fmt(rd.revenue_ytd)}</td>

                  {/* Growth */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: growthUp ? (dm ? '#0D2A1A' : '#E8F8EE') : (dm ? '#3A0D0D' : '#FFEEEE') }}>
                      {growthUp ? <TrendingUp size={11} style={{ color: '#34C759' }} /> : <TrendingDown size={11} style={{ color: '#E31E24' }} />}
                      <span style={{ fontSize: 12, fontWeight: 700, color: growthUp ? '#34C759' : '#E31E24', fontVariantNumeric: 'tabular-nums' }}>
                        {growthUp ? '+' : ''}{growth.toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Orders */}
                  <td style={{ padding: '14px 16px', color: TEXT, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    {rd.orders_ytd} <span style={{ color: MUTED, fontWeight: 400, fontSize: 12 }}>/ yr</span>
                  </td>

                  {/* Claims rate */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: rd.claims_rate > 5 ? '#E31E24' : rd.claims_rate > 3 ? '#FF9500' : '#34C759', fontVariantNumeric: 'tabular-nums' }}>
                      {rd.claims_rate}%
                    </span>
                  </td>

                  {/* Sparkline */}
                  <td style={{ padding: '14px 16px' }}>
                    <MiniSparkline data={rd.monthly} color={cfg.color} />
                  </td>

                  {/* Revenue share bar */}
                  <td style={{ padding: '14px 16px', minWidth: 90 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ flex: 1, height: 6, background: dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden', minWidth: 50 }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${share}%` }} transition={{ duration: 1, delay: i * 0.06 }}
                          style={{ height: '100%', background: cfg.color, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{share.toFixed(0)}%</span>
                    </div>
                  </td>

                  {/* Recommendation badge */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, background: dm ? cfg.bg : cfg.bgL, border: `1px solid ${cfg.color}33`, whiteSpace: 'nowrap' }}>
                      <cfg.Icon size={11} style={{ color: cfg.color }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Upgrade partners */}
        <div style={{ background: CARD, borderRadius: 16, padding: '16px 18px', border: `1.5px solid rgba(52,199,89,0.25)`, boxShadow: SHADOW }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: dm ? '#0D2A1A' : '#E8F8EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={14} style={{ color: '#34C759' }} />
            </div>
            <LearnTooltip title="Reward These Partners" desc="Partners scoring 88+ or growing >30% YoY. Offering them better pricing tiers, longer payment terms or priority stock allocation rewards performance and reduces churn risk." side="bottom" width={288}>
              <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>Reward These Partners</p>
            </LearnTooltip>
            <span style={{ marginLeft: 'auto', padding: '3px 9px', borderRadius: 99, background: dm ? '#0D2A1A' : '#E8F8EE', fontSize: 10, fontWeight: 700, color: '#34C759' }}>Offer Better Deal</span>
          </div>
          <p style={{ fontSize: 11, color: MUTED, margin: '0 0 12px', lineHeight: 1.5 }}>
            These re-distributors are growing fast and performing above expectations. Strengthen the relationship with better pricing or priority allocation.
          </p>
          {upgradeList.map((rd, i) => {
            const growth = growthOf(rd);
            return (
              <div key={rd.id} onClick={() => setSelected(rd)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderTop: i === 0 ? `1px solid ${BORDER}` : `1px solid ${BORDER}`, cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{rd.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{rd.name}</p>
                  <p style={{ fontSize: 10, color: MUTED, margin: '1px 0 0' }}>{rd.city} · Score {rd.score}/100</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#34C759', margin: 0, fontVariantNumeric: 'tabular-nums' }}>+{growth.toFixed(0)}%</p>
                  <p style={{ fontSize: 10, color: MUTED, margin: '1px 0 0' }}>€{fmt(rd.revenue_ytd)}</p>
                </div>
                <ArrowUpRight size={14} style={{ color: '#34C759', flexShrink: 0 }} />
              </div>
            );
          })}
        </div>

        {/* Alert partners */}
        <div style={{ background: CARD, borderRadius: 16, padding: '16px 18px', border: `1.5px solid rgba(227,30,36,0.2)`, boxShadow: SHADOW }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: dm ? '#3A1010' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={14} style={{ color: '#E31E24' }} />
            </div>
            <LearnTooltip title="Give These Attention" desc="Partners with a declining revenue trend and/or claims rate above 5%. A proactive call within 7 days — even just a check-in — can reverse churn before it becomes irreversible." side="bottom" width={288}>
              <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>Give These Attention</p>
            </LearnTooltip>
            <span style={{ marginLeft: 'auto', padding: '3px 9px', borderRadius: 99, background: dm ? '#3A1010' : '#FFF0F0', fontSize: 10, fontWeight: 700, color: '#E31E24' }}>Call This Week</span>
          </div>
          <p style={{ fontSize: 11, color: MUTED, margin: '0 0 12px', lineHeight: 1.5 }}>
            Declining revenue and high claims rates are warning signs. A proactive call this week can re-engage them before the relationship deteriorates further.
          </p>
          {alertList.map((rd, i) => {
            const growth = growthOf(rd);
            return (
              <div key={rd.id} onClick={() => setSelected(rd)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderTop: i === 0 ? `1px solid ${BORDER}` : `1px solid ${BORDER}`, cursor: 'pointer' }}>
                <span style={{ fontSize: 22 }}>{rd.flag}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{rd.name}</p>
                  <p style={{ fontSize: 10, color: MUTED, margin: '1px 0 0' }}>Last order: {rd.last_order.slice(5).split('-').join('/')}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#E31E24', margin: 0, fontVariantNumeric: 'tabular-nums' }}>{growth.toFixed(0)}%</p>
                  <p style={{ fontSize: 10, color: '#E31E24', margin: '1px 0 0' }}>{rd.claims_rate}% claims</p>
                </div>
                <ChevronRight size={14} style={{ color: MUTED, flexShrink: 0 }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel slide-over */}
      <AnimatePresence>
        {selected && <ReDistPanel rd={selected} onClose={() => setSelected(null)} dm={dm} />}
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function WebAnalytics() {
  const { revenue, catalog, customers, claims, profile, darkMode, learnMode, toggleLearnMode } = useDistributorStore();
  const [range, setRange] = useState<Range>('6m');

  const dm     = darkMode;
  const BG     = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.07)';
  const GRID   = dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  const tooltipStyle = { background: dm ? '#2A2A2A' : '#1D1D1F', border: 'none', borderRadius: 10, fontSize: 12, padding: '8px 12px', fontFamily: FF };

  const sliced       = range === '3m' ? revenue.slice(-3) : revenue;
  const totalRevenue = sliced.reduce((a, b) => a + b.revenue, 0);
  const totalUnits   = sliced.reduce((a, b) => a + b.units, 0);
  const totalRegs    = sliced.reduce((a, b) => a + b.registrations, 0);
  const avgRevenue   = Math.round(totalRevenue / sliced.length);

  const currentMth = revenue[revenue.length - 1];
  const prevMth    = revenue[revenue.length - 2];
  const revChange  = (((currentMth.revenue - prevMth.revenue) / prevMth.revenue) * 100).toFixed(1);
  const revUp      = currentMth.revenue >= prevMth.revenue;

  const topProducts    = [...catalog].sort((a, b) => b.units_sold_ytd - a.units_sold_ytd);
  const claimsByStatus = {
    pending:   claims.filter((c) => c.status === 'pending').length,
    in_repair: claims.filter((c) => c.status === 'in_repair').length,
    approved:  claims.filter((c) => c.status === 'approved').length,
    rejected:  claims.filter((c) => c.status === 'rejected').length,
  };
  const totalClaims = Object.values(claimsByStatus).reduce((a, b) => a + b, 0);
  const regData     = sliced.map((r) => ({ month: r.month, registrations: r.registrations }));

  const RANGES: { key: Range; label: string }[] = [
    { key: '3m', label: 'Last 3M' },
    { key: '6m', label: 'Last 6M' },
    { key: 'ytd', label: 'YTD' },
  ];

  const KPIs = [
    { label: 'Period Revenue', value: `€${fmt(totalRevenue)}`, icon: Euro,       color: '#E31E24', trend: true,  delta: `${revUp ? '+' : ''}${revChange}% MoM`, tip: 'Total revenue across all your stock orders in the selected period. The MoM badge compares the latest month against the previous one.' },
    { label: 'Units Sold',     value: fmt(totalUnits),          icon: Package,   color: '#6366F1', trend: false, delta: `avg ${Math.round(totalUnits / sliced.length)}/mo`, tip: 'Total product units shipped to you (as distributor) from BEITER in the selected period, averaged per month.' },
    { label: 'Registrations',  value: fmt(totalRegs),           icon: Users,     color: '#34C759', trend: false, delta: `avg ${Math.round(totalRegs / sliced.length)}/mo`, tip: 'Number of BEITER tools registered via the BeiterOS app by end-customers in your territory. Higher registrations = stronger market penetration.' },
    { label: 'Avg. Monthly',   value: fmtK(avgRevenue),         icon: TrendingUp,color: '#FF9500', trend: false, delta: 'revenue average', tip: 'Average revenue per calendar month over the selected period — a stable baseline to track momentum.' },
  ];

  const kpiBg: Record<string, string> = {
    '#E31E24': dm ? '#3A1010' : '#FFF0F0',
    '#6366F1': dm ? '#1A1A3A' : '#EEF2FF',
    '#34C759': dm ? '#0D2A1A' : '#E8F8EE',
    '#FF9500': dm ? '#3A2800' : '#FFF3E0',
  };

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>

      {/* Learn Mode banner */}
      {learnMode && (
        <div style={{ background: dm ? 'rgba(227,30,36,0.1)' : 'rgba(227,30,36,0.06)', border: `1px solid rgba(227,30,36,0.25)`, borderRadius: 14, padding: '13px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: '#E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>🎓</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#E31E24', margin: 0 }}>Learn Mode is ON</p>
            <p style={{ fontSize: 13, color: MUTED, margin: '2px 0 0' }}>Hover over any label with a <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}><span style={{ width: 14, height: 14, borderRadius: '50%', background: '#E31E24', color: '#fff', fontSize: 8, fontWeight: 900, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>?</span></span> badge to see an explanation. Toggle off via the sidebar.</p>
          </div>
          <button onClick={toggleLearnMode} style={{ padding: '7px 14px', borderRadius: 9, border: '1px solid rgba(227,30,36,0.35)', background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#E31E24', fontFamily: FF }}>
            Turn Off
          </button>
        </div>
      )}

      {/* Header + Range selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Analytics</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: '5px 0 0', fontWeight: 500 }}>{profile.company} · {profile.territory}</p>
        </div>
        <div style={{ display: 'flex', background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', borderRadius: 12, padding: 4, gap: 3 }}>
          {RANGES.map((r) => (
            <button key={r.key} onClick={() => setRange(r.key)}
              style={{ padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: FF, background: range === r.key ? '#E31E24' : 'transparent', color: range === r.key ? '#fff' : MUTED, transition: 'all 0.15s' }}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
        {KPIs.map((kpi) => (
          <motion.div key={kpi.label} whileHover={{ y: -2 }}
            style={{ background: CARD, borderRadius: 18, padding: 22, boxShadow: SHADOW, border: `1px solid ${BORDER}` }}>
            <div className="flex items-start justify-between mb-4">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: kpiBg[kpi.color], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </div>
              {kpi.trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 99, background: revUp ? (dm ? '#0D2A1A' : '#E8F8EE') : (dm ? '#3A0D0D' : '#FFEEEE') }}>
                  {revUp ? <TrendingUp size={12} color="#34C759" /> : <TrendingDown size={12} color="#C0392B" />}
                  <span style={{ fontSize: 12, fontWeight: 700, color: revUp ? '#34C759' : '#C0392B' }}>{kpi.delta}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 30, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>{kpi.value}</p>
            <LearnTooltip title={kpi.label} desc={kpi.tip} side="bottom" width={268}>
              <p style={{ fontSize: 13, color: MUTED, margin: '5px 0 0', fontWeight: 600 }}>{kpi.label}</p>
            </LearnTooltip>
            {!kpi.trend && <p style={{ fontSize: 13, color: kpi.color, margin: '5px 0 0', fontWeight: 600 }}>{kpi.delta}</p>}
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div style={{ background: CARD, borderRadius: 18, padding: 24, boxShadow: SHADOW, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <LearnTooltip title="Revenue vs. Units" desc="Red bars (left axis) show monthly revenue in €. Blue bars (right axis) show units sold. Both axes are independent — they don't share a scale. The darkest red bar is the most recent month." side="right" width={288}>
              <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Revenue vs. Units</p>
            </LearnTooltip>
            <p style={{ fontSize: 20, fontWeight: 900, color: TEXT, margin: '5px 0 0' }}>Monthly Performance Breakdown</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={sliced} margin={{ top: 4, bottom: 0, left: 0, right: 0 }} barGap={6}>
            <CartesianGrid stroke={GRID} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11, fontFamily: FF }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="rev" tick={{ fill: MUTED, fontSize: 11, fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${fmt(v)}`} width={62} />
            <YAxis yAxisId="units" orientation="right" tick={{ fill: MUTED, fontSize: 11, fontFamily: FF }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number, name: string) => [name === 'revenue' ? `€${fmt(v)}` : v, name === 'revenue' ? 'Revenue' : 'Units']} labelStyle={{ color: '#fff', fontWeight: 700 }} itemStyle={{ color: '#fff' }} />
            <Legend formatter={(val) => <span style={{ color: MUTED, fontSize: 11, fontFamily: FF }}>{val === 'revenue' ? 'Revenue' : 'Units Sold'}</span>} />
            <Bar yAxisId="rev" dataKey="revenue" name="revenue" radius={[5,5,0,0]} barSize={28}>
              {sliced.map((_, i) => <Cell key={i} fill={i === sliced.length - 1 ? '#E31E24' : (dm ? 'rgba(227,30,36,0.35)' : 'rgba(227,30,36,0.25)')} />)}
            </Bar>
            <Bar yAxisId="units" dataKey="units" name="units" radius={[5,5,0,0]} barSize={18} fill={dm ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.35)'} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Pie + Registration Trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: CARD, borderRadius: 18, padding: 24, boxShadow: SHADOW, border: `1px solid ${BORDER}` }}>
          <LearnTooltip title="Category Mix" desc="Percentage breakdown of your YTD units sold by product category. Helps identify your strongest verticals and where there may be an opportunity to grow underserved segments." side="right" width={284}>
            <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Category Mix</p>
          </LearnTooltip>
          <p style={{ fontSize: 18, fontWeight: 900, color: TEXT, margin: '0 0 16px' }}>Sales by Product Category</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <PieChart width={180} height={180}>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}%`, 'Share']} labelStyle={{ color: '#fff', fontWeight: 700 }} itemStyle={{ color: '#fff' }} />
            </PieChart>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              {CATEGORY_DATA.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: TEXT }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: CARD, borderRadius: 18, padding: 24, boxShadow: SHADOW, border: `1px solid ${BORDER}` }}>
          <LearnTooltip title="Warranty Registrations" desc="Tools registered by end-customers using the BeiterOS mobile app. Each registration activates their warranty — so this is both a service metric and a measure of how widely your customers are adopting the BeiterOS ecosystem." side="left" width={300}>
            <p style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Warranty Registrations</p>
          </LearnTooltip>
          <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: '0 0 16px' }}>Monthly Registration Trend</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={regData} margin={{ top: 4, bottom: 0, left: -10, right: 8 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 11, fontFamily: FF }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: MUTED, fontSize: 11, fontFamily: FF }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v, 'Registrations']} labelStyle={{ color: '#fff', fontWeight: 700 }} itemStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="registrations" stroke="#34C759" strokeWidth={2.5} dot={{ r: 4, fill: '#34C759', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#34C759' }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>Period Total</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: TEXT, margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>{totalRegs}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>Feb 2026 (latest)</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#34C759', margin: '2px 0 0', fontVariantNumeric: 'tabular-nums' }}>{currentMth.registrations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products + Claims */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 0 }}>
        <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${BORDER}` }}>
            <LearnTooltip title="Top Performers" desc="Your catalog products ranked by year-to-date units sold. MTD = units sold this calendar month. YTD = units sold since 1 Jan. The bar shows each product's share relative to the #1 seller." side="right" width={288}>
              <p style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Top Performers</p>
            </LearnTooltip>
            <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: '4px 0 0' }}>Products by YTD Units Sold</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
                {['#', 'Product', 'Category', 'MTD', 'YTD', 'Stock'].map((h) => (
                  <th key={h} style={{ padding: '9px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => {
                const maxYtd = topProducts[0].units_sold_ytd;
                const pct    = (p.units_sold_ytd / maxYtd) * 100;
                return (
                  <tr key={p.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                    <td style={{ padding: '12px 16px', color: MUTED, fontWeight: 700, width: 40 }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div className="flex items-center gap-3">
                        <img src={p.image_url} alt={p.model} style={{ width: 34, height: 34, borderRadius: 7, objectFit: 'cover' }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{p.model}</p>
                          <p style={{ fontSize: 11, color: MUTED, margin: '1px 0 0' }}>{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: MUTED, fontSize: 12 }}>{p.category}</td>
                    <td style={{ padding: '12px 16px', color: TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{p.units_sold_mtd}</td>
                    <td style={{ padding: '12px 16px', minWidth: 100 }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums', minWidth: 28 }}>{p.units_sold_ytd}</span>
                        <div style={{ flex: 1, height: 5, background: dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.08 }}
                            style={{ height: '100%', background: i === 0 ? '#E31E24' : (dm ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'), borderRadius: 99 }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                        background: p.stock_level === 'in_stock' ? (dm ? '#0D2A1A' : '#E8F8EE') : (p.stock_level === 'low_stock' ? (dm ? '#3A2800' : '#FFF3E0') : (dm ? '#3A0D0D' : '#FFEEEE')),
                        color: p.stock_level === 'in_stock' ? '#34C759' : (p.stock_level === 'low_stock' ? '#FF9500' : '#C0392B') }}>
                        {p.stock}u
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ background: CARD, borderRadius: 18, padding: 22, boxShadow: SHADOW, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Warranty Claims</p>
          <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: '0 0 18px' }}>Status Breakdown</p>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <p style={{ fontSize: 40, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{totalClaims}</p>
            <p style={{ fontSize: 11, color: MUTED, margin: '4px 0 0' }}>Total Claims on Record</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
            {Object.entries(claimsByStatus).map(([status, count]) => {
              const cfg = STATUS_CFG[status];
              const pct = totalClaims > 0 ? (count / totalClaims) * 100 : 0;
              return (
                <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${cfg.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <cfg.icon size={14} style={{ color: cfg.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{cfg.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 900, color: cfg.color, fontVariantNumeric: 'tabular-nums' }}>{count}</span>
                    </div>
                    <div style={{ height: 5, background: dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9 }}
                        style={{ height: '100%', background: cfg.color, borderRadius: 99 }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 12, padding: 14 }}>
            <LearnTooltip title="Resolution Rate" desc="Percentage of all warranty claims that have been closed — either approved or rejected. Pending and in-repair claims are not counted. A high rate means your claims pipeline is being processed efficiently." side="top" width={288}>
            <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 6px' }}>Resolution Rate</p>
          </LearnTooltip>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#34C759', margin: 0, fontVariantNumeric: 'tabular-nums' }}>
              {totalClaims > 0 ? Math.round(((claimsByStatus.approved + claimsByStatus.rejected) / totalClaims) * 100) : 0}%
            </p>
            <p style={{ fontSize: 11, color: MUTED, margin: '3px 0 0' }}>{claimsByStatus.approved + claimsByStatus.rejected} of {totalClaims} claims resolved</p>
          </div>
        </div>
      </div>

      {/* ══ Re-Distributor Network Section ══ */}
      <ReDistributorSection dm={dm} />

    </div>
  );
}
