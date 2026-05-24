import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp, TrendingDown, Package, ShieldCheck,
  Truck, Check, Clock, X as XIcon, Euro,
  Store, Award, AlertTriangle, Zap, ChevronRight, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, LineChart, Line, CartesianGrid,
} from 'recharts';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";

function fmt(n: number) { return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }); }
function fmtK(n: number) { return n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : `€${n}`; }

const CATEGORY_DATA = [
  { name: 'Drilling',  value: 38, color: '#E31E24' },
  { name: 'Sawing',    value: 22, color: '#6366F1' },
  { name: 'Measuring', value: 18, color: '#FF9500' },
  { name: 'Grinding',  value: 15, color: '#34C759' },
  { name: 'Other',     value: 7,  color: '#888888' },
];

/* ── Re-distributor data (shared with web) ── */
interface ReDist { id:string; name:string; city:string; flag:string; market:'eu'|'sea'; tier:string; revenue_ytd:number; revenue_prev:number; units_ytd:number; orders_ytd:number; claims_rate:number; last_order:string; monthly:number[]; score:number; recommendation:'upgrade'|'maintain'|'nurture'|'alert'; }

const REDIST_DATA: ReDist[] = [
  { id:'r1', name:'Werkhaus GmbH',       city:'Munich',    flag:'🇩🇪', market:'eu',  tier:'Gold',   revenue_ytd:284200, revenue_prev:222000, units_ytd:892, orders_ytd:14, claims_rate:2.1, last_order:'2026-02-24', monthly:[38200,42100,45800,48300,52200,57600], score:94, recommendation:'upgrade'  },
  { id:'r2', name:'Vogt Werkzeuge',      city:'Hamburg',   flag:'🇩🇪', market:'eu',  tier:'Silver', revenue_ytd:112300, revenue_prev: 79600, units_ytd:353, orders_ytd: 7, claims_rate:1.8, last_order:'2026-02-20', monthly:[12300,14800,17200,18900,23100,26000], score:88, recommendation:'upgrade'  },
  { id:'r3', name:'Norbau Retail AG',    city:'Berlin',    flag:'🇩🇪', market:'eu',  tier:'Gold',   revenue_ytd:196400, revenue_prev:175300, units_ytd:618, orders_ytd:11, claims_rate:3.4, last_order:'2026-02-18', monthly:[28400,31200,33800,32900,35100,35000], score:76, recommendation:'maintain' },
  { id:'r4', name:'Steinbach AG',        city:'Frankfurt', flag:'🇩🇪', market:'eu',  tier:'Silver', revenue_ytd:148700, revenue_prev:141600, units_ytd:467, orders_ytd: 9, claims_rate:4.2, last_order:'2026-02-10', monthly:[22400,24100,25800,24900,25400,26100], score:63, recommendation:'maintain' },
  { id:'r5', name:'ProBuild Asia Pte.', city:'Singapore', flag:'🇸🇬', market:'sea', tier:'Silver', revenue_ytd: 76200, revenue_prev: 64100, units_ytd:239, orders_ytd: 8, claims_rate:2.9, last_order:'2026-02-22', monthly:[ 9800,11200,12400,13100,14300,15400], score:72, recommendation:'maintain' },
  { id:'r6', name:'South Asia Tools',   city:'Mumbai',    flag:'🇮🇳', market:'sea', tier:'New',    revenue_ytd: 28400, revenue_prev: 15600, units_ytd: 89, orders_ytd: 4, claims_rate:1.2, last_order:'2026-02-19', monthly:[ 2100, 3400, 4200, 5600, 6200, 6900], score:68, recommendation:'nurture'  },
  { id:'r7', name:'Krafft GmbH & Co.',  city:'Stuttgart', flag:'🇩🇪', market:'eu',  tier:'Gold',   revenue_ytd: 89500, revenue_prev: 97300, units_ytd:281, orders_ytd: 6, claims_rate:6.7, last_order:'2026-01-29', monthly:[17800,16200,15400,14800,12900,12400], score:42, recommendation:'alert'    },
  { id:'r8', name:'Max Bau GmbH',      city:'Düsseldorf',flag:'🇩🇪', market:'eu',  tier:'Bronze', revenue_ytd: 34100, revenue_prev: 40200, units_ytd:107, orders_ytd: 3, claims_rate:8.1, last_order:'2026-01-14', monthly:[ 7200, 6800, 6100, 5400, 4400, 4200], score:26, recommendation:'alert'    },
];

const REC_CFG_M = {
  upgrade:  { label:'Offer Upgrade Deal', color:'#34C759', bgDark:'#0D2A1A', bgLight:'#E8F8EE', Icon:Award          },
  maintain: { label:'Maintain',           color:'#6366F1', bgDark:'#1A1A3A', bgLight:'#EEF2FF', Icon:Check          },
  nurture:  { label:'Nurture',            color:'#FF9500', bgDark:'#3A2800', bgLight:'#FFF3E0', Icon:Zap            },
  alert:    { label:'Needs Attention',    color:'#E31E24', bgDark:'#3A1010', bgLight:'#FFF0F0', Icon:AlertTriangle  },
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  processing: '#6366F1',
  shipped:    '#FF9500',
  delivered:  '#34C759',
  cancelled:  '#C0392B',
};

type Range = '3m' | '6m' | 'ytd';

function ReDistMobileSection({ dm, barTrackBg, cardShadow }: { dm: boolean; barTrackBg: string; cardShadow: string }) {
  const [selected, setSelected] = useState<ReDist | null>(null);
  const [filter,   setFilter]   = useState<'all'|'eu'|'sea'>('all');
  const FF2 = "'Inter', sans-serif";
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';

  const list = REDIST_DATA.filter(r => filter === 'all' || r.market === filter)
    .sort((a, b) => b.score - a.score);

  const totalRev = REDIST_DATA.reduce((a,r) => a+r.revenue_ytd, 0);
  const fmt2 = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 0 });

  return (
    <>
      {/* Section header */}
      <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.15), rgba(255,149,0,0.05))', padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2 mb-1">
            <div style={{ width:26,height:26,borderRadius:7,background:dm?'#3A2800':'#FFF3E0',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <Store size={12} style={{ color:'#FF9500' }} />
            </div>
            <p className="text-foreground font-black text-[15px] uppercase tracking-[0.03em]" style={{ fontFamily:FF2, margin:0 }}>Re-Distributor Network</p>
          </div>
          <p style={{ fontSize:11, color:MUTED, margin:'0 0 10px' }}>Performance ranking & deal recommendations</p>

          {/* KPI row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { l:'Network Rev.', v:`€${(totalRev/1000).toFixed(0)}k`, c:'#E31E24' },
              { l:'Upgrade',      v:String(REDIST_DATA.filter(r=>r.recommendation==='upgrade').length), c:'#34C759' },
              { l:'Alert',        v:String(REDIST_DATA.filter(r=>r.recommendation==='alert').length),   c:'#E31E24' },
            ].map(s=>(
              <div key={s.l} style={{ background:dm?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)', borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                <p style={{ fontSize:18, fontWeight:900, color:s.c, margin:0, fontVariantNumeric:'tabular-nums' }}>{s.v}</p>
                <p style={{ fontSize:9, color:MUTED, margin:'2px 0 0', fontWeight:600 }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Market filter */}
        <div style={{ padding:'10px 12px', borderBottom:`1px solid ${BORDER}`, display:'flex', gap:6 }}>
          {(['all','eu','sea'] as const).map(m=>(
            <button key={m} onClick={()=>setFilter(m)}
              style={{ flex:1, height:30, borderRadius:8, border:'none', cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:FF2, background:filter===m?'#E31E24':(dm?'rgba(255,255,255,0.07)':'rgba(0,0,0,0.05)'), color:filter===m?'#fff':MUTED }}>
              {m==='all'?'All':m==='eu'?'🇪🇺 EU':'🌏 SEA'}
            </button>
          ))}
        </div>

        {/* Distributor rows */}
        {list.map((rd, i) => {
          const cfg    = REC_CFG_M[rd.recommendation];
          const growth = ((rd.revenue_ytd - rd.revenue_prev) / rd.revenue_prev) * 100;
          const share  = (rd.revenue_ytd / totalRev) * 100;
          return (
            <motion.div key={rd.id} whileTap={{ scale:0.98 }} onClick={()=>setSelected(rd)}
              style={{ padding:'12px 14px', borderTop:i>0?`1px solid ${BORDER}`:'none', cursor:'pointer' }}>
              <div className="flex items-center gap-3">
                {/* Rank + flag */}
                <div style={{ width:38, height:38, borderRadius:10, background:`${cfg.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {rd.flag}
                </div>
                {/* Name + city */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize:13, fontWeight:700, color:TEXT, margin:0 }}>{rd.name}</p>
                    {i===0&&<span style={{ fontSize:8, padding:'1px 5px', borderRadius:99, background:'#FFD60A22', color:'#D97706', fontWeight:700 }}>🥇 TOP</span>}
                  </div>
                  <p style={{ fontSize:10, color:MUTED, margin:'1px 0 0' }}>{rd.city} · {rd.tier}</p>
                </div>
                {/* Score */}
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <p style={{ fontSize:16, fontWeight:900, color:cfg.color, margin:0, fontVariantNumeric:'tabular-nums' }}>{rd.score}</p>
                  <p style={{ fontSize:9, color:MUTED, margin:0 }}>score</p>
                </div>
                <ChevronRight size={13} style={{ color:MUTED, flexShrink:0 }} />
              </div>

              {/* Revenue bar + growth */}
              <div className="flex items-center gap-3 mt-2.5">
                <div style={{ flex:1, height:4, background:barTrackBg, borderRadius:99, overflow:'hidden' }}>
                  <motion.div initial={{ width:0 }} animate={{ width:`${share}%` }} transition={{ duration:0.8, delay:i*0.06 }}
                    style={{ height:'100%', background:cfg.color, borderRadius:99 }} />
                </div>
                <span style={{ fontSize:10, fontWeight:700, color:TEXT, whiteSpace:'nowrap', fontVariantNumeric:'tabular-nums' }}>€{fmt2(rd.revenue_ytd)}</span>
                <span style={{ fontSize:10, fontWeight:700, color:growth>=0?'#34C759':'#E31E24', whiteSpace:'nowrap' }}>
                  {growth>=0?'+':''}{growth.toFixed(0)}%
                </span>
              </div>

              {/* Recommendation badge */}
              <div style={{ marginTop:8 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'3px 9px', borderRadius:99, background:dm?cfg.bgDark:cfg.bgLight }}>
                  <cfg.Icon size={9} style={{ color:cfg.color }} />
                  <span style={{ fontSize:9, fontWeight:700, color:cfg.color }}>{cfg.label}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail bottom sheet */}
      <AnimatePresence>
        {selected && (() => {
          const cfg    = REC_CFG_M[selected.recommendation];
          const growth = ((selected.revenue_ytd - selected.revenue_prev) / selected.revenue_prev) * 100;
          return (
            <>
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={()=>setSelected(null)}
                style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:100, backdropFilter:'blur(4px)' }} />
              <motion.div initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }} transition={{ type:'spring', damping:30, stiffness:280 }}
                style={{ position:'fixed', bottom:0, left:0, right:0, background:dm?'#1c1c1e':'#fff', borderRadius:'20px 20px 0 0', zIndex:101, maxHeight:'80svh', overflowY:'auto', fontFamily:FF2 }}>

                {/* Handle */}
                <div style={{ width:36, height:4, background:dm?'rgba(255,255,255,0.2)':'rgba(0,0,0,0.15)', borderRadius:99, margin:'12px auto 0' }} />

                <div style={{ padding:'16px 18px 32px' }}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span style={{ fontSize:26 }}>{selected.flag}</span>
                      <p style={{ fontSize:18, fontWeight:900, color:TEXT, margin:'4px 0 0' }}>{selected.name}</p>
                      <p style={{ fontSize:11, color:MUTED, margin:'2px 0 0' }}>{selected.city} · {selected.tier} · {selected.market.toUpperCase()}</p>
                    </div>
                    <button onClick={()=>setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
                      <XIcon size={18} style={{ color:MUTED }} />
                    </button>
                  </div>

                  {/* Score + badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ width:52, height:52, borderRadius:'50%', background:`${cfg.color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <span style={{ fontSize:20, fontWeight:900, color:cfg.color }}>{selected.score}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:99, background:dm?cfg.bgDark:cfg.bgLight, marginBottom:3 }}>
                        <cfg.Icon size={11} style={{ color:cfg.color }} />
                        <span style={{ fontSize:11, fontWeight:700, color:cfg.color }}>{cfg.label}</span>
                      </div>
                      <p style={{ fontSize:11, color:MUTED, margin:0 }}>Performance score out of 100</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      { l:'Revenue YTD',   v:`€${fmt2(selected.revenue_ytd)}`, c:TEXT },
                      { l:'Growth vs LY',  v:`${growth>=0?'+':''}${growth.toFixed(1)}%`, c:growth>=0?'#34C759':'#E31E24' },
                      { l:'Units YTD',     v:fmt2(selected.units_ytd), c:TEXT },
                      { l:'Orders / Year', v:String(selected.orders_ytd), c:TEXT },
                      { l:'Claims Rate',   v:`${selected.claims_rate}%`, c:selected.claims_rate>5?'#E31E24':selected.claims_rate>3?'#FF9500':'#34C759' },
                      { l:'Last Order',    v:selected.last_order.slice(5).split('-').join('/'), c:TEXT },
                    ].map(s=>(
                      <div key={s.l} style={{ background:dm?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.04)', borderRadius:10, padding:'10px 12px' }}>
                        <p style={{ fontSize:9, color:MUTED, fontWeight:700, textTransform:'uppercase', margin:'0 0 3px' }}>{s.l}</p>
                        <p style={{ fontSize:14, fontWeight:900, color:s.c, margin:0, fontVariantNumeric:'tabular-nums' }}>{s.v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Action advice */}
                  <div style={{ background:dm?cfg.bgDark:cfg.bgLight, borderRadius:12, padding:'12px 14px', border:`1px solid ${cfg.color}33` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <cfg.Icon size={13} style={{ color:cfg.color }} />
                      <span style={{ fontSize:12, fontWeight:700, color:cfg.color }}>
                        {selected.recommendation==='upgrade'&&'Offer a better deal'}
                        {selected.recommendation==='alert'&&'Schedule a review call this week'}
                        {selected.recommendation==='nurture'&&'Invest in growth — strong upside'}
                        {selected.recommendation==='maintain'&&'Keep current deal — on track'}
                      </span>
                    </div>
                    <p style={{ fontSize:11, color:MUTED, margin:0, lineHeight:1.5 }}>
                      {selected.recommendation==='upgrade'&&'Top performer with exceptional growth. Offer improved pricing tiers or priority allocation to deepen loyalty.'}
                      {selected.recommendation==='alert'&&'Revenue declining and claims rate elevated. Proactive outreach within 7 days can reverse the trend.'}
                      {selected.recommendation==='nurture'&&'Strong growth from a small base. Introduce more SKUs and share marketing assets to accelerate reach.'}
                      {selected.recommendation==='maintain'&&'Performing as expected. Quarterly check-in recommended to maintain momentum.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

export default function Analytics() {
  const { revenue, catalog, customers, claims, orders, profile, darkMode } = useDistributorStore();
  const [range, setRange] = useState<Range>('6m');

  const dm = darkMode;

  const sliced       = range === '3m' ? revenue.slice(-3) : range === 'ytd' ? revenue : revenue.slice(-6);
  const totalRevenue = sliced.reduce((a, b) => a + b.revenue, 0);
  const totalUnits   = sliced.reduce((a, b) => a + b.units, 0);
  const totalRegs    = sliced.reduce((a, b) => a + b.registrations, 0);
  const avgRevenue   = totalRevenue / sliced.length;

  const currentMth = revenue[revenue.length - 1];
  const prevMth    = revenue[revenue.length - 2];
  const revChange  = (((currentMth.revenue - prevMth.revenue) / prevMth.revenue) * 100).toFixed(1);
  const revUp      = currentMth.revenue >= prevMth.revenue;

  const topProducts    = [...catalog].sort((a, b) => b.units_sold_ytd - a.units_sold_ytd).slice(0, 5);
  const claimsByStatus = {
    pending:   claims.filter((c) => c.status === 'pending').length,
    in_repair: claims.filter((c) => c.status === 'in_repair').length,
    approved:  claims.filter((c) => c.status === 'approved').length,
    rejected:  claims.filter((c) => c.status === 'rejected').length,
  };
  const totalClaims = Object.values(claimsByStatus).reduce((a, b) => a + b, 0);
  const regData     = sliced.map((r) => ({ month: r.month, registrations: r.registrations }));

  const cardShadow       = dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)';
  const tooltipBg        = dm ? '#2A2A2A' : '#1D1D1F';
  const axisTickFill     = dm ? '#AAAAAA' : '#6C6C70';
  const gridStroke       = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
  const pillInactiveBg   = dm ? '#2A2A2A' : '#F2F2F7';
  const pillInactiveText = dm ? '#FFFFFF' : '#1D1D1F';
  const barTrackBg       = dm ? '#2A2A2A' : '#F2F2F7';

  const kpiBg = {
    orange: dm ? '#3A2800' : '#FFF3E0',
    indigo: dm ? '#1A1A3A' : '#EEF2FF',
    green:  dm ? '#0D2A1A' : '#E8F8EE',
    red:    dm ? '#3A0D0D' : '#FFEEEE',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sub-header */}
      <div
        className="fixed top-[88px] left-0 right-0 z-30 max-w-md mx-auto bg-card"
        style={{ boxShadow: dm ? '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.60)' : '0 1px 0 rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 pt-3 pb-3">
          <h1 className="text-foreground text-[17px] font-black text-center uppercase tracking-[0.04em] mb-2.5"
            style={{ fontFamily: FF }}>Sales Analytics</h1>
          <div className="flex gap-2 justify-center">
            {([
              { key: '3m',  label: '3 Months' },
              { key: '6m',  label: '6 Months' },
              { key: 'ytd', label: 'YTD' },
            ] as { key: Range; label: string }[]).map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className="px-4 py-1.5 rounded-full text-[12px] font-medium transition-all"
                style={{
                  backgroundColor: range === r.key ? '#E31E24' : pillInactiveBg,
                  color:           range === r.key ? 'white' : pillInactiveText,
                  fontFamily:      FF,
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 pt-[116px] pb-6 space-y-5">

        {/* Summary KPIs */}
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Revenue',       value: `€${fmt(totalRevenue)}`, sub: `${revUp ? '+' : ''}${revChange}% vs prev`, color: revUp ? '#34C759' : '#E31E24', icon: Euro },
            { label: 'Units Sold',    value: fmt(totalUnits),         sub: `${(totalUnits / sliced.length).toFixed(0)} avg/mo`, color: '#E31E24', icon: Package },
            { label: 'Registrations', value: fmt(totalRegs),          sub: `${(totalRegs / sliced.length).toFixed(0)} avg/mo`, color: '#6366F1', icon: ShieldCheck },
          ].map((kpi) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl p-3 text-center"
              style={{ boxShadow: cardShadow }}
            >
              <kpi.icon size={15} style={{ color: kpi.color }} className="mx-auto mb-1.5" />
              <p className="text-foreground text-[15px] font-black leading-none"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{kpi.value}</p>
              <p className="text-muted-foreground text-[9px] mt-0.5 leading-tight">{kpi.sub}</p>
              <p className="text-muted-foreground text-[9px] font-medium mt-0.5">{kpi.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-card rounded-2xl p-4" style={{ boxShadow: cardShadow }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-foreground text-[14px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>MONTHLY REVENUE</p>
            <p className="text-[#E31E24] text-[13px] font-medium" style={{ fontFamily: FF }}>
              {revUp ? <TrendingUp size={13} className="inline mr-1" /> : <TrendingDown size={13} className="inline mr-1" />}
              {revUp ? '+' : ''}{revChange}% MoM
            </p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={sliced} barSize={24} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisTickFill }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: 'none', borderRadius: 10, fontSize: 12, padding: '8px 12px', fontFamily: FF }}
                formatter={(v: number) => [`€${fmt(v)}`, 'Revenue']}
                labelStyle={{ color: '#FFFFFF', fontWeight: 700, marginBottom: 2 }}
                itemStyle={{ color: '#FFFFFF' }}
                cursor={{ fill: 'rgba(227,30,36,0.08)' }}
              />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {sliced.map((_, i) => (
                  <Cell key={i} fill="#E31E24" fillOpacity={i === sliced.length - 1 ? 1 : 0.25} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-muted-foreground text-[10px]">Monthly avg</p>
              <p className="text-foreground text-[14px] font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtK(avgRevenue)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-[10px]">Best month</p>
              <p className="text-foreground text-[14px] font-semibold">
                {sliced.reduce((a, b) => a.revenue > b.revenue ? a : b).month}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-[10px]">Total</p>
              <p className="text-[#E31E24] text-[14px] font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>{fmtK(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Registrations Line Chart */}
        <div className="bg-card rounded-2xl p-4" style={{ boxShadow: cardShadow }}>
          <p className="text-foreground text-[14px] font-semibold mb-4 uppercase tracking-[0.04em]"
            style={{ fontFamily: FF }}>TOOL REGISTRATIONS (BEITEROS)</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={regData} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: axisTickFill }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: tooltipBg, border: 'none', borderRadius: 10, fontSize: 12, padding: '8px 12px', fontFamily: FF }}
                formatter={(v: number) => [v, 'Registrations']}
                labelStyle={{ color: '#FFFFFF', fontWeight: 700, marginBottom: 2 }}
                itemStyle={{ color: '#FFFFFF' }}
              />
              <Line
                type="monotone" dataKey="registrations" stroke="#E31E24"
                strokeWidth={2.5} dot={{ fill: '#E31E24', r: 4 }} activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-muted-foreground text-[11px] mt-2 text-center" style={{ fontFamily: FF }}>
            {totalRegs} total registrations via BeiterOS in this period
          </p>
        </div>

        {/* Sales by Category Donut */}
        <div className="bg-card rounded-2xl p-4" style={{ boxShadow: cardShadow }}>
          <p className="text-foreground text-[14px] font-semibold mb-3 uppercase tracking-[0.04em]"
            style={{ fontFamily: FF }}>SALES MIX BY CATEGORY</p>
          <div className="flex items-center gap-4">
            <div style={{ width: 140, height: 140, flexShrink: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={42} outerRadius={65} dataKey="value" stroke="none">
                    {CATEGORY_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: tooltipBg, border: 'none', borderRadius: 10, fontSize: 11, padding: '8px 12px', fontFamily: FF }}
                    formatter={(v: number) => [`${v}%`, 'Share']}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 700 }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {CATEGORY_DATA.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-foreground text-[12px]" style={{ fontFamily: FF }}>{cat.name}</span>
                  </div>
                  <span className="text-foreground text-[12px] font-medium">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products YTD */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-foreground text-[14px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>TOP PRODUCTS · YTD</p>
          </div>
          {topProducts.map((p, i) => {
            const barWidth = Math.round((p.units_sold_ytd / topProducts[0].units_sold_ytd) * 100);
            return (
              <div key={p.id} className={`px-4 py-3 ${i < topProducts.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[#E31E24] text-[16px] font-black w-5"
                      style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                    <div>
                      <p className="text-foreground text-[13px] font-medium" style={{ fontFamily: FF }}>{p.model}</p>
                      <p className="text-muted-foreground text-[11px]" style={{ fontFamily: FF }}>{p.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-[13px] font-medium"
                      style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{p.units_sold_ytd} units</p>
                    <p className="text-[#E31E24] text-[11px]" style={{ fontVariantNumeric: 'tabular-nums' }}>€{fmt(p.units_sold_ytd * p.distributor_price)}</p>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: barTrackBg }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="h-full rounded-full bg-[#E31E24]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Warranty Claims Overview */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-foreground text-[14px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>WARRANTY CLAIMS OVERVIEW</p>
          </div>
          <div className="grid grid-cols-4">
            {[
              { label: 'Pending',  value: claimsByStatus.pending,   color: '#FF9500', bg: kpiBg.orange, icon: Clock },
              { label: 'Repair',   value: claimsByStatus.in_repair, color: '#6366F1', bg: kpiBg.indigo, icon: Package },
              { label: 'Approved', value: claimsByStatus.approved,  color: '#34C759', bg: kpiBg.green,  icon: Check },
              { label: 'Rejected', value: claimsByStatus.rejected,  color: '#C0392B', bg: kpiBg.red,    icon: XIcon },
            ].map(({ label, value, color, bg, icon: Icon }, i) => (
              <div key={label} className={`py-4 text-center ${i < 3 ? 'border-r border-border' : ''}`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5"
                  style={{ backgroundColor: bg }}>
                  <Icon size={14} style={{ color }} />
                </div>
                <p className="text-[20px] font-black leading-none"
                  style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums', color }}>{value}</p>
                <p className="text-muted-foreground text-[10px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[12px]">Approval rate</span>
              <span className="text-[#34C759] text-[13px] font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {totalClaims > 0 ? Math.round((claimsByStatus.approved / totalClaims) * 100) : 0}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: barTrackBg }}>
              <div
                className="h-full bg-[#34C759] rounded-full"
                style={{ width: `${totalClaims > 0 ? Math.round((claimsByStatus.approved / totalClaims) * 100) : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Orders Summary */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-foreground text-[14px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>RECENT STOCK ORDERS</p>
          </div>
          {useDistributorStore.getState().orders.slice(0, 4).map((order, i, arr) => {
            const sc = ORDER_STATUS_COLORS[order.status];
            return (
              <div key={order.id} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: sc + '22' }}>
                  <Truck size={14} style={{ color: sc }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-[13px] font-medium" style={{ fontFamily: FF }}>{order.invoice_number}</p>
                  <p className="text-muted-foreground text-[11px]" style={{ fontFamily: FF }}>{order.order_date} · {order.items.length} product(s)</p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-[13px] font-semibold"
                    style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>€{fmt(order.total)}</p>
                  <span className="text-[10px] font-medium capitalize px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: sc + '22', color: sc, fontFamily: FF }}>
                    {order.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══ Re-Distributor Network ══ */}
        <ReDistMobileSection dm={dm} barTrackBg={barTrackBg} cardShadow={cardShadow} />

        {/* Partner Performance */}
        <div
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #C8161C 0%, #E31E24 55%, #FF3B40 100%)' }}
        >
          <p className="text-white/60 text-[10px] font-semibold uppercase tracking-[0.1em] mb-1"
            style={{ fontFamily: FF }}>Partner Program</p>
          <p className="text-white text-[18px] font-black mb-1" style={{ fontFamily: FF }}>
            🥇 {profile.partner_tier} Partner — {profile.territory}
          </p>
          <p className="text-white/50 text-[12px] mb-3" style={{ fontFamily: FF }}>
            Partner since {profile.partner_since.slice(0, 7)}
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Customers',     value: customers.length },
              { label: 'Units YTD',     value: catalog.reduce((a, b) => a + b.units_sold_ytd, 0) },
              { label: 'Registrations', value: revenue.reduce((a, b) => a + b.registrations, 0) },
            ].map((s) => (
              <div key={s.label} className="bg-white/15 rounded-xl p-2.5 text-center">
                <p className="text-white text-[18px] font-black"
                  style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                <p className="text-white/50 text-[9px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}