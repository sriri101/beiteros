import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  TrendingUp, TrendingDown, Users, ShieldCheck, Package,
  AlertTriangle, Euro, Truck, Bell, ChevronRight, RefreshCw,
  Star, BarChart2, ExternalLink, MessageCircle,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell, CartesianGrid, PieChart, Pie, Legend,
} from 'recharts';
import { useDistributorStore } from '../store/useDistributorStore';
import { ToolActivationMap } from '../components/ToolActivationMap';
import { AccountManagerChat } from '../components/AccountManagerChat';

const FF = "'Inter', sans-serif";
function fmt(n: number) { return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }); }
function fmtK(n: number) { return n >= 1000 ? `€${(n / 1000).toFixed(1)}k` : `€${n}`; }

const TIER_CFG = {
  Silver:   { color: '#888888', bg: '#F5F5F5',  next: 'Gold',     target: 200000, icon: '🥈', darkBg: '#2A2A2A' },
  Gold:     { color: '#B8860B', bg: '#FFF3CD',  next: 'Platinum', target: 500000, icon: '🥇', darkBg: '#3A2800' },
  Platinum: { color: '#4F46E5', bg: '#EEF2FF',  next: null,       target: null,   icon: '💎', darkBg: '#1A1A3A' },
};

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  processing: { label: 'Processing', color: '#6366F1' },
  shipped:    { label: 'Shipped',    color: '#FF9500' },
  delivered:  { label: 'Delivered',  color: '#34C759' },
  cancelled:  { label: 'Cancelled',  color: '#C0392B' },
};

export default function WebDashboard() {
  const navigate = useNavigate();
  const { profile, revenue, claims, catalog, customers, notifications, orders, darkMode, markAllNotificationsRead } =
    useDistributorStore();

  const [refreshed, setRefreshed]   = useState(false);
  const [chatOpen, setChatOpen]     = useState(false);

  /* ── Responsive: track content width ── */
  const [contentWidth, setContentWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1400);
  useEffect(() => {
    const onResize = () => setContentWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  // Below ~1340px the 3-column layout gets too cramped (sidebar takes 252px)
  const isCompact = contentWidth < 1340;

  const dm   = darkMode;
  const BG   = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.07)';

  const kpiBg = {
    red:    dm ? '#3A1010' : '#FFF0F0',
    orange: dm ? '#3A2800' : '#FFF3E0',
    green:  dm ? '#0D2A1A' : '#E8F8EE',
    indigo: dm ? '#1A1A3A' : '#EEF2FF',
  };

  const current   = revenue[revenue.length - 1];
  const previous  = revenue[revenue.length - 2];
  const revChange = (((current.revenue - previous.revenue) / previous.revenue) * 100).toFixed(1);
  const revUp     = current.revenue >= previous.revenue;

  const pendingClaims = claims.filter((c) => c.status === 'pending').length;
  const inRepair      = claims.filter((c) => c.status === 'in_repair').length;
  const lowStock      = catalog.filter((c) => c.stock_level !== 'in_stock').length;
  const newCustomers  = customers.filter((c) => c.joined >= '2025-02-01').length;
  const unread        = notifications.filter((n) => !n.read);

  const tier        = TIER_CFG[profile.partner_tier];
  const ytdRevenue  = revenue.slice(-6).reduce((a, b) => a + b.revenue, 0);
  const tierPct     = tier.target ? Math.min((ytdRevenue / tier.target) * 100, 100) : 100;

  const handleRefresh = () => { setRefreshed(true); setTimeout(() => setRefreshed(false), 1500); };

  const KPIs = [
    {
      label: 'February Revenue', value: `€${fmt(current.revenue)}`,
      sub: `${revUp ? '+' : ''}${revChange}% vs January`,
      icon: Euro, color: '#E31E24', bg: kpiBg.red,
      trend: revUp, link: '/dist/analytics',
    },
    {
      label: 'Total Customers', value: customers.length,
      sub: `+${newCustomers} this month`,
      icon: Users, color: '#E31E24', bg: kpiBg.red,
      link: '/dist/customers',
    },
    {
      label: 'Open Claims', value: pendingClaims + inRepair,
      sub: `${pendingClaims} pending · ${inRepair} in repair`,
      icon: ShieldCheck, color: pendingClaims > 0 ? '#FF9500' : '#34C759',
      bg: pendingClaims > 0 ? kpiBg.orange : kpiBg.green,
      link: '/dist/claims',
    },
    {
      label: 'Stock Alerts', value: lowStock,
      sub: lowStock > 0 ? `${lowStock} SKU(s) need reorder` : 'All stock levels OK',
      icon: lowStock > 0 ? AlertTriangle : Package,
      color: lowStock > 0 ? '#FF9500' : '#34C759',
      bg: lowStock > 0 ? kpiBg.orange : kpiBg.green,
      link: '/dist/catalog',
    },
  ];

  const tooltipStyle = {
    background: dm ? '#2A2A2A' : '#1D1D1F', border: 'none',
    borderRadius: 10, fontSize: 12, padding: '8px 12px', fontFamily: FF,
  };

  const revenueLineData = revenue.map((r, i) => ({
    ...r,
    prev: i > 0 ? revenue[i - 1].revenue : null,
  }));

  /* ── Category sales mock data ── */
  const CATEGORY_DATA = [
    { name: 'Power Drills',    value: 35, color: '#E31E24' },
    { name: 'Angle Grinders',  value: 28, color: '#6366F1' },
    { name: 'Circular Saws',   value: 18, color: '#FF9500' },
    { name: 'Screwdrivers',    value: 12, color: '#34C759' },
    { name: 'Other',           value: 7,  color: '#8E8E93' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>
      {/* ── Page Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
            Good morning, {profile.contact.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 14, color: MUTED, margin: '5px 0 0', fontWeight: 500 }}>
            {profile.company} · {profile.territory} · {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            style={{ height: 42, borderRadius: 11, border: `1px solid ${BORDER}`, background: CARD, padding: '0 18px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: MUTED, fontSize: 14, fontWeight: 600 }}
          >
            <RefreshCw size={15} style={{ animation: refreshed ? 'spin 0.6s linear' : 'none' }} />
            Refresh
          </button>
          <button
            onClick={() => navigate('/dist/analytics')}
            style={{ height: 42, borderRadius: 11, background: '#E31E24', border: 'none', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#fff', fontSize: 14, fontWeight: 700 }}
          >
            <BarChart2 size={15} />
            Full Analytics
          </button>
        </div>
      </div>

      {/* ── KPI Cards Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 22 }}>
        {KPIs.map((kpi) => (
          <motion.div
            key={kpi.label}
            whileHover={{ y: -2 }}
            onClick={() => navigate(kpi.link)}
            style={{ background: CARD, borderRadius: 18, padding: 22, boxShadow: SHADOW, cursor: 'pointer', border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div style={{ width: 44, height: 44, borderRadius: 12, background: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </div>
              <ChevronRight size={16} style={{ color: MUTED, marginTop: 2 }} />
            </div>
            <p style={{ fontSize: 32, fontWeight: 900, color: TEXT, margin: 0, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em' }}>
              {kpi.value}
            </p>
            <p style={{ fontSize: 13, color: MUTED, margin: '5px 0 0', fontWeight: 600 }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: 13, color: kpi.color, margin: '7px 0 0', fontWeight: 600 }}>
              {kpi.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Main Content Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: isCompact ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr) minmax(0,1fr) 360px', gap: 20, marginBottom: 22 }}>

        {/* ── Revenue Chart (compact) ── */}
        <div style={{ background: CARD, borderRadius: 18, padding: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                6-Month Revenue Trend
              </p>
              <p style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: '3px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                {fmtK(ytdRevenue)} YTD
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, background: revUp ? (dm ? '#0D2A1A' : '#E8F8EE') : (dm ? '#3A0D0D' : '#FFEEEE') }}>
              {revUp ? <TrendingUp size={11} color="#34C759" /> : <TrendingDown size={11} color="#C0392B" />}
              <span style={{ fontSize: 11, fontWeight: 700, color: revUp ? '#34C759' : '#C0392B' }}>
                {revUp ? '+' : ''}{revChange}% MoM
              </span>
            </div>
          </div>

          {/* Chart grows to fill all available space */}
          <div style={{ flex: 1, minHeight: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue} barSize={22} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
                <CartesianGrid stroke={dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} vertical={false} />
                <XAxis dataKey="month" tick={{ fill: MUTED, fontSize: 12, fontFamily: FF }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: MUTED, fontSize: 12, fontFamily: FF }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${fmt(v)}`} width={60} />
                <Tooltip
                  cursor={{ fill: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', radius: 6 }}
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => [`€${fmt(v)}`, 'Revenue']}
                  labelStyle={{ color: '#fff', fontWeight: 700 }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="revenue" radius={[5, 5, 0, 0]}>
                  {revenue.map((_, i) => (
                    <Cell key={i} fill={i === revenue.length - 1 ? '#E31E24' : (dm ? 'rgba(255,255,255,0.12)' : 'rgba(227,30,36,0.15)')} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom stats pinned to footer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
            {[
              { label: 'Units MTD',     value: current.units },
              { label: 'Registrations', value: current.registrations },
              { label: 'Customers',     value: customers.length },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{s.value}</p>
                <p style={{ fontSize: 11, color: MUTED, margin: '4px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sales by Product Category ── */}
        <div style={{ background: CARD, borderRadius: 18, padding: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                Sales by Category
              </p>
              <p style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: '3px 0 0' }}>
                Product Mix
              </p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', padding: '4px 10px', borderRadius: 99 }}>
              Last 6 mo.
            </span>
          </div>

          {/* Body: donut LEFT · legend RIGHT — fills all remaining height */}
          <div style={{ flex: 1, display: 'flex', gap: 16, minHeight: 0, alignItems: 'stretch' }}>

            {/* Donut */}
            <div style={{ flexShrink: 0, width: 170, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {CATEGORY_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number) => [`${v}%`, 'Share']}
                    labelStyle={{ color: '#fff', fontWeight: 700 }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centre label */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <p style={{ fontSize: 20, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {CATEGORY_DATA.length}
                </p>
                <p style={{ fontSize: 11, color: MUTED, margin: 0, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Categories
                </p>
              </div>
            </div>

            {/* Vertical divider */}
            <div style={{ width: 1, background: BORDER, flexShrink: 0, alignSelf: 'stretch' }} />

            {/* Legend — fills remaining width, vertically centred */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 11 }}>
              {CATEGORY_DATA.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 9, height: 9, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: cat.color, fontVariantNumeric: 'tabular-nums' }}>{cat.value}%</span>
                  </div>
                  <div style={{ height: 5, background: dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${cat.value}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut', delay: CATEGORY_DATA.indexOf(cat) * 0.07 }}
                      style={{ height: '100%', background: cat.color, borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel: Tier + Notifications */}
        <div style={{ display: 'flex', flexDirection: isCompact ? 'row' : 'column', gap: 14, gridColumn: isCompact ? '1 / -1' : undefined }}>
          {/* Partner Tier Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #C8161C 0%, #E31E24 55%, #FF3B40 100%)',
              borderRadius: 18, padding: 20, boxShadow: SHADOW,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Partner Status</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '4px 0 0' }}>
                  {tier.icon} {profile.partner_tier} Partner
                </p>
              </div>
              <Star size={20} color="rgba(255,255,255,0.8)" fill="rgba(255,255,255,0.8)" />
            </div>
            {tier.target && (
              <>
                <div className="flex justify-between mb-1.5">
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                    {profile.partner_tier} → {tier.next}
                  </span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.95)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                    {Math.round(tierPct)}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${tierPct}%` }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    style={{ height: '100%', background: '#fff', borderRadius: 99 }}
                  />
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '7px 0 0', fontVariantNumeric: 'tabular-nums' }}>
                  €{fmt(ytdRevenue)} / €{fmt(tier.target)} target
                </p>
              </>
            )}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>Account Manager</p>
              <button
                onClick={() => setChatOpen(true)}
                style={{
                  background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 4,
                }}
              >
                <p style={{ fontSize: 14, color: '#fff', fontWeight: 700, margin: 0, textDecoration: 'underline', textUnderlineOffset: 3, textDecorationColor: 'rgba(255,255,255,0.5)' }}>
                  {profile.account_manager}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.18)', padding: '2px 8px', borderRadius: 99 }}>
                  <MessageCircle size={12} color="#fff" />
                  <span style={{ fontSize: 12, color: '#fff', fontWeight: 700 }}>Chat</span>
                </div>
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759' }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>Online now</span>
              </div>
            </div>
          </div>

          {/* Notifications Panel */}
          <div style={{ background: CARD, borderRadius: 18, flex: 1, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div className="flex items-center justify-between" style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2">
                <Bell size={17} style={{ color: TEXT }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Notifications</span>
                {unread.length > 0 && (
                  <span style={{ background: '#E31E24', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                    {unread.length}
                  </span>
                )}
              </div>
              {unread.length > 0 && (
                <button onClick={markAllNotificationsRead} style={{ fontSize: 13, color: '#E31E24', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 220 }}>
              {notifications.slice(0, 6).map((n) => {
                const iconColor = { claim: '#E31E24', stock: '#FF9500', registration: '#34C759', order: '#6366F1', alert: '#FF9500' }[n.type] || '#888';
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: '11px 18px',
                      borderBottom: `1px solid ${BORDER}`,
                      background: n.read ? 'transparent' : (dm ? 'rgba(227,30,36,0.06)' : 'rgba(227,30,36,0.03)'),
                      display: 'flex', gap: 10, alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.read ? 'transparent' : iconColor, marginTop: 5, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</p>
                      <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.body}</p>
                    </div>
                    <span style={{ fontSize: 11, color: MUTED, flexShrink: 0, marginTop: 2 }}>{n.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Territory Activation Map ── */}
      <div style={{ marginBottom: 20 }}>
        <ToolActivationMap dm={dm} />
      </div>

      {/* ── Recent Orders Table ── */}
      <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div className="flex items-center justify-between" style={{ padding: '20px 26px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3">
            <Truck size={18} style={{ color: TEXT }} />
            <span style={{ fontSize: 17, fontWeight: 700, color: TEXT }}>Recent Orders</span>
          </div>
          <button
            onClick={() => navigate('/dist/catalog')}
            style={{ fontSize: 13, color: '#E31E24', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}
          >
            Place New Order <ExternalLink size={14} />
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
                {['Invoice', 'Order Date', 'Items', 'Total', 'Expected Delivery', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '13px 22px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const st = ORDER_STATUS[o.status] || { label: o.status, color: '#888' };
                return (
                  <tr key={o.id} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 === 0 ? 'transparent' : (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') }}>
                    <td style={{ padding: '16px 22px', color: TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{o.invoice_number}</td>
                    <td style={{ padding: '16px 22px', color: MUTED }}>{o.order_date}</td>
                    <td style={{ padding: '16px 22px', color: TEXT }}>
                      {o.items.map((it) => `${it.model} ×${it.qty}`).join(', ')}
                    </td>
                    <td style={{ padding: '16px 22px', color: TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</td>
                    <td style={{ padding: '16px 22px', color: MUTED }}>{o.expected_delivery}</td>
                    <td style={{ padding: '16px 22px' }}>
                      <span style={{ padding: '5px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: `${st.color}22`, color: st.color }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {/* Account Manager Chat panel */}
      <AccountManagerChat open={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}