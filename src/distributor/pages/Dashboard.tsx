import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, Users, ShieldCheck, Package, AlertTriangle,
  ChevronRight, Truck, Star, Euro, QrCode, ClipboardList, ArrowUpRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";

function fmt(n: number) {
  return n.toLocaleString('de-DE', { maximumFractionDigits: 0 });
}

const TIER_CONFIG = {
  Silver:   { color: '#888888', bg: '#F5F5F5',  next: 'Gold',     target: 200000, icon: '🥈' },
  Gold:     { color: '#B8860B', bg: '#FFF3CD',  next: 'Platinum', target: 500000, icon: '🥇' },
  Platinum: { color: '#4F46E5', bg: '#EEF2FF',  next: null,       target: null,   icon: '💎' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, revenue, claims, catalog, customers, notifications, orders, darkMode } = useDistributorStore();

  const current  = revenue[revenue.length - 1];
  const previous = revenue[revenue.length - 2];
  const revChange = (((current.revenue - previous.revenue) / previous.revenue) * 100).toFixed(1);
  const revUp    = current.revenue >= previous.revenue;

  const pendingClaims = claims.filter((c) => c.status === 'pending').length;
  const inRepair      = claims.filter((c) => c.status === 'in_repair').length;
  const lowStock      = catalog.filter((c) => c.stock_level !== 'in_stock').length;
  const newCustomers  = customers.filter((c) => c.joined >= '2025-02-01').length;
  const unread        = notifications.filter((n) => !n.read);

  const tier        = TIER_CONFIG[profile.partner_tier];
  const ytdRevenue  = revenue.slice(-6).reduce((a, b) => a + b.revenue, 0);
  const tierProgress = tier.target ? Math.min((ytdRevenue / tier.target) * 100, 100) : 100;

  const activeOrder = orders.find((o) => o.status === 'shipped' || o.status === 'processing');

  const dm = darkMode;
  const kpiBg = {
    red:    dm ? '#3A1010' : '#FFF0F0',
    orange: dm ? '#3A2800' : '#FFF3E0',
    green:  dm ? '#0D2A1A' : '#E8F8EE',
    indigo: dm ? '#1A1A3A' : '#EEF2FF',
  };
  const tooltipBg = dm ? '#2A2A2A' : '#1D1D1F';

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 pt-5 pb-6 space-y-5">

        {/* ── Hero Revenue Card ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden p-5"
          style={{ background: 'linear-gradient(135deg, #C8161C 0%, #E31E24 55%, #FF3B40 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 32px), repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 32px)' }} />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] mb-0.5"
                  style={{ fontFamily: FF }}>
                  February 2025 Revenue
                </p>
                <p className="text-white text-[36px] font-black leading-none"
                  style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>
                  €{fmt(current.revenue)}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {revUp ? <TrendingUp size={13} className="text-white/90" /> : <TrendingDown size={13} className="text-white/90" />}
                  <span className="text-[12px] font-semibold text-white" style={{ fontFamily: FF }}>
                    {revUp ? '+' : ''}{revChange}% vs Jan
                  </span>
                  <span className="text-white/50 text-[11px]">· {current.units} units</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px] uppercase tracking-[0.1em]"
                  style={{ fontFamily: FF }}>Registrations</p>
                <p className="text-white text-[28px] font-black leading-none"
                  style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>
                  {current.registrations}
                </p>
                <p className="text-white/50 text-[10px]">this month</p>
              </div>
            </div>

            {/* Mini bar chart */}
            <div style={{ height: 60 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenue} barSize={18} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    cursor={false}
                    contentStyle={{ background: tooltipBg, border: 'none', borderRadius: 10, fontSize: 11, padding: '8px 12px', fontFamily: FF }}
                    formatter={(v: number) => [`€${fmt(v)}`, 'Revenue']}
                    labelStyle={{ color: '#FFFFFF', fontWeight: 700, marginBottom: 2 }}
                    itemStyle={{ color: '#FFFFFF' }}
                  />
                  <Bar dataKey="revenue" radius={[3, 3, 0, 0]}>
                    {revenue.map((_, i) => (
                      <Cell key={i} fill={i === revenue.length - 1 ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.3)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Partner tier progress */}
            {tier.target && (
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/60 text-[10px] font-semibold uppercase tracking-[0.08em]"
                    style={{ fontFamily: FF }}>
                    {tier.icon} {profile.partner_tier} → {tier.next} Progress
                  </span>
                  <span className="text-white/70 text-[10px]" style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>
                    €{fmt(ytdRevenue)} / €{fmt(tier.target)}
                  </span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tierProgress}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: 'Customers', value: customers.length,
              sub: `+${newCustomers} this month`, icon: Users,
              color: '#E31E24', bg: kpiBg.red, action: () => navigate('/dist/customers'),
            },
            {
              label: 'Open Claims', value: pendingClaims + inRepair,
              sub: `${pendingClaims} pending · ${inRepair} in repair`, icon: ShieldCheck,
              color: pendingClaims > 0 ? '#FF9500' : '#34C759',
              bg: pendingClaims > 0 ? kpiBg.orange : kpiBg.green, action: () => navigate('/dist/claims'),
            },
            {
              label: 'Stock Alerts', value: lowStock,
              sub: lowStock > 0 ? 'products need reorder' : 'All levels OK', icon: Package,
              color: lowStock > 0 ? '#E31E24' : '#34C759',
              bg: lowStock > 0 ? kpiBg.red : kpiBg.green, action: () => navigate('/dist/catalog'),
            },
            {
              label: 'New Registrations', value: current.registrations,
              sub: 'tools this month', icon: QrCode,
              color: '#6366F1', bg: kpiBg.indigo, action: () => navigate('/dist/customers'),
            },
          ].map((kpi) => (
            <motion.button
              key={kpi.label}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={kpi.action}
              className="bg-card rounded-2xl p-4 text-left active:scale-[0.97] transition-all"
              style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: kpi.bg }}>
                  <kpi.icon size={17} style={{ color: kpi.color }} />
                </div>
                <ArrowUpRight size={13} className="text-muted-foreground mt-0.5" />
              </div>
              <p className="text-foreground text-[26px] font-black leading-none"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>
                {kpi.value}
              </p>
              <p className="text-muted-foreground text-[11px] mt-0.5 leading-tight"
                style={{ fontFamily: FF }}>{kpi.sub}</p>
              <p className="text-foreground text-[12px] font-medium mt-1"
                style={{ fontFamily: FF }}>{kpi.label}</p>
            </motion.button>
          ))}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.1em] mb-3"
            style={{ fontFamily: FF }}>Quick Actions</p>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { label: 'Process\nClaim',   icon: ClipboardList, color: '#E31E24', bg: kpiBg.red,    action: () => navigate('/dist/claims') },
              { label: 'Order\nStock',     icon: Truck,         color: '#6366F1', bg: kpiBg.indigo, action: () => navigate('/dist/catalog') },
              { label: 'View\nAnalytics',  icon: TrendingUp,    color: '#34C759', bg: kpiBg.green,  action: () => navigate('/dist/analytics') },
            ].map((qa) => (
              <button
                key={qa.label}
                onClick={qa.action}
                className="bg-card rounded-2xl py-4 flex flex-col items-center gap-2 active:scale-[0.96] transition-all"
                style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: qa.bg }}>
                  <qa.icon size={18} style={{ color: qa.color }} />
                </div>
                <p className="text-foreground text-[11px] font-medium text-center leading-tight whitespace-pre-line"
                  style={{ fontFamily: FF }}>{qa.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Active Shipment ── */}
        {activeOrder && (
          <button
            onClick={() => navigate('/dist/analytics')}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 active:opacity-80 transition-opacity"
            style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: kpiBg.indigo }}>
              <Truck size={22} className="text-[#6366F1]" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-foreground text-[14px] font-medium" style={{ fontFamily: FF }}>
                {activeOrder.status === 'shipped' ? '🚚 Order En Route' : '⚙️ Order Processing'}
              </p>
              <p className="text-muted-foreground text-[12px]" style={{ fontFamily: FF }}>
                {activeOrder.invoice_number} · €{fmt(activeOrder.total)} · ETA {activeOrder.expected_delivery}
              </p>
            </div>
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>
        )}

        {/* ── Notifications Feed ── */}
        {unread.length > 0 && (
          <div>
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5"
              style={{ fontFamily: FF }}>
              <AlertTriangle size={11} className="text-[#E31E24]" /> Latest Alerts
            </p>
            <div className="bg-card rounded-2xl overflow-hidden"
              style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}>
              {unread.slice(0, 4).map((n, i) => {
                const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
                  claim:        { icon: ShieldCheck, color: '#FF9500' },
                  stock:        { icon: Package,     color: '#E31E24' },
                  registration: { icon: QrCode,      color: '#6366F1' },
                  order:        { icon: Truck,       color: '#34C759' },
                  alert:        { icon: Star,        color: '#F59E0B' },
                };
                const cfg = iconMap[n.type] || iconMap.alert;
                return (
                  <div key={n.id}
                    className={`flex items-start gap-3 px-4 py-3.5 ${i < unread.slice(0, 4).length - 1 ? 'border-b border-border' : ''}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-muted">
                      <cfg.icon size={14} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-[13px] font-medium leading-tight"
                        style={{ fontFamily: FF }}>{n.title}</p>
                      <p className="text-muted-foreground text-[12px] mt-0.5 leading-tight line-clamp-2"
                        style={{ fontFamily: FF }}>{n.body}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 pt-0.5">{n.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Top Products This Month ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.1em]"
              style={{ fontFamily: FF }}>Top Sellers · Feb</p>
            <button onClick={() => navigate('/dist/catalog')} className="text-[#E31E24] text-[13px] font-medium flex items-center gap-0.5"
              style={{ fontFamily: FF }}>
              View all <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>
          <div className="bg-card rounded-2xl overflow-hidden"
            style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}>
            {[...useDistributorStore.getState().catalog]
              .sort((a, b) => b.units_sold_mtd - a.units_sold_mtd)
              .slice(0, 4)
              .map((p, i, arr) => (
                <div key={p.id}
                  className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
                  <span className="text-[#E31E24] text-[14px] font-black w-5 text-center"
                    style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</span>
                  <img src={p.image_url} alt={p.model} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-[13px] font-medium truncate"
                      style={{ fontFamily: FF }}>{p.model}</p>
                    <p className="text-muted-foreground text-[11px]"
                      style={{ fontFamily: FF }}>{p.units_sold_mtd} units · €{fmt(p.units_sold_mtd * p.distributor_price)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground text-[13px] font-semibold"
                      style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>€{p.msrp}</p>
                    <p className="text-muted-foreground text-[10px]">MSRP</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ── Account Manager ── */}
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{ background: dm ? 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)' : 'linear-gradient(135deg, #1D1D1F 0%, #2A2A2A 100%)' }}
        >
          <div className="w-12 h-12 rounded-full bg-[#E31E24] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[16px] font-semibold" style={{ fontFamily: FF }}>
              {profile.account_manager.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white/50 text-[10px] uppercase tracking-[0.1em] font-semibold"
              style={{ fontFamily: FF }}>Your Account Manager</p>
            <p className="text-white text-[15px] font-semibold mt-0.5"
              style={{ fontFamily: FF }}>{profile.account_manager}</p>
            <p className="text-white/40 text-[12px]"
              style={{ fontFamily: FF }}>BEITER Tools Central Europe</p>
          </div>
          <div className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15">
            <Euro size={15} className="text-[#E31E24]" />
          </div>
        </div>

      </div>
    </div>
  );
}
