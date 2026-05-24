import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search, X, Phone, Mail, MapPin, Wrench, ShieldCheck,
  Clock, AlertTriangle, User, ChevronUp, ChevronDown,
  ChevronRight, Store, TrendingUp, Euro,
} from 'lucide-react';
import { useDistributorStore, DistCustomer } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type Filter  = 'all' | 'pro' | 'diy' | 'claims';
type SortKey = 'name' | 'city' | 'reseller' | 'tools_count' | 'total_spent' | 'claims_count' | 'last_purchase';
type SortDir = 'asc' | 'desc';

/* Consistent colour per reseller id */
const RESELLER_COLORS: Record<string, { bg: string; darkBg: string; dot: string }> = {
  r1: { bg: '#EEF2FF', darkBg: '#1A1A3A', dot: '#6366F1' }, // Werkhaus → indigo
  r2: { bg: '#FFF3E0', darkBg: '#3A2800', dot: '#FF9500' }, // Norbau → orange
  r3: { bg: '#E8F8EE', darkBg: '#0D2A1A', dot: '#34C759' }, // Steinbach → green
  r4: { bg: '#FFF0F0', darkBg: '#3A1010', dot: '#E31E24' }, // Krafft → red
  r5: { bg: '#F3F0FF', darkBg: '#22133A', dot: '#A855F7' }, // Vogt → purple
};

function resellerColor(id: string, dm: boolean) {
  const c = RESELLER_COLORS[id] ?? { bg: '#F0F0F0', darkBg: '#2A2A2A', dot: '#8E8E93' };
  return { bg: dm ? c.darkBg : c.bg, dot: c.dot };
}

/* ─── Detail slide-over panel ─── */
function DetailPanel({ customer, onClose, dm }: { customer: DistCustomer; onClose: () => void; dm: boolean }) {
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const { bg: rBg, dot: rDot } = resellerColor(customer.reseller.id, dm);

  const statusColors: Record<string, { bg: string; text: string }> = dm
    ? { active: { bg: '#0D2A1A', text: '#4ADE80' }, expiring: { bg: '#3A2800', text: '#FFB74D' }, expired: { bg: '#3A0D0D', text: '#F87171' } }
    : { active: { bg: '#E8F8EE', text: '#1A8A4A' }, expiring: { bg: '#FFF3E0', text: '#B97A00' }, expired: { bg: '#FFEEEE', text: '#C0392B' } };

  const initials = customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0,   opacity: 1 }}
      exit={{   x: 420, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: dm ? '#111111' : '#f8f8fa',
        borderLeft: `1px solid ${BORDER}`,
        boxShadow: dm ? '-12px 0 40px rgba(0,0,0,0.5)' : '-12px 0 40px rgba(0,0,0,0.12)',
        zIndex: 100, overflowY: 'auto', fontFamily: FF,
      }}
    >
      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg, #C8161C 0%, #E31E24 55%, #FF3B40 100%)', padding: '24px 20px 20px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={14} color="#fff" />
        </button>
        <div className="flex items-center gap-4">
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 900 }}>{initials}</span>
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, margin: 0 }}>{customer.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{customer.user_type}</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>since {customer.joined}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 16 }}>
          {[
            { label: 'Tools',           val: customer.tools_count },
            { label: 'Active Warranty', val: customer.warranty_active },
            { label: 'Total Spent',     val: `€${customer.total_spent.toLocaleString('de-DE')}` },
          ].map((s) => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 10px', textAlign: 'center' }}>
              <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, margin: 0 }}>{s.val}</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, margin: '2px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Purchase Source (Reseller) ── */}
        <div style={{ background: rBg, borderRadius: 14, padding: 16, border: `2px solid ${rDot}33`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -12, right: -12, width: 56, height: 56, borderRadius: '50%', background: rDot + '18' }} />
          <div className="flex items-center gap-2 mb-3">
            <Store size={13} style={{ color: rDot }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Purchase Source · Reseller
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: rDot + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: rDot }}>
                {customer.reseller.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 900, color: TEXT, margin: 0 }}>{customer.reseller.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} style={{ color: MUTED }} />
                <span style={{ fontSize: 11, color: MUTED }}>{customer.reseller.city}</span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={10} style={{ color: MUTED }} />
                <span style={{ fontSize: 11, color: MUTED }}>{customer.reseller.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Customer Contact</p>
          {[
            { icon: Phone,  val: customer.phone },
            { icon: Mail,   val: customer.email },
            { icon: MapPin, val: customer.city },
          ].map(({ icon: Icon, val }) => (
            <div key={val} className="flex items-center gap-3" style={{ marginBottom: 8 }}>
              <Icon size={13} style={{ color: MUTED, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: TEXT }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Registered tools */}
        <div style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Registered Tools</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {customer.tools.map((t) => {
              const sc = statusColors[t.status];
              return (
                <div key={t.serial} className="flex items-center gap-3">
                  <img src={t.image_url} alt={t.model} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{t.model}</p>
                    <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>S/N: {t.serial}</p>
                  </div>
                  <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: sc.bg, color: sc.text, flexShrink: 0 }}>{t.status}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claims */}
        {customer.claims_count > 0 && (
          <div style={{ background: CARD, borderRadius: 14, padding: 16, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>Claim Summary</p>
            <div className="flex gap-3">
              {[
                { label: 'Total Claims', val: customer.claims_count,  color: TEXT },
                { label: 'Pending',      val: customer.pending_claims, color: customer.pending_claims > 0 ? '#FF9500' : '#34C759' },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, background: customer.pending_claims > 0 ? (dm ? '#3A2800' : '#FFF3E0') : (dm ? '#0D2A1A' : '#E8F8EE'), borderRadius: 10, padding: 12, textAlign: 'center' }}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: 0 }}>{s.val}</p>
                  <p style={{ fontSize: 10, color: MUTED, margin: '3px 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main page ─── */
export default function WebCustomers() {
  const { customers, darkMode } = useDistributorStore();

  const [query,          setQuery]          = useState('');
  const [filter,         setFilter]         = useState<Filter>('all');
  const [resellerFilter, setResellerFilter] = useState<string>('all');
  const [sortKey,        setSortKey]        = useState<SortKey>('name');
  const [sortDir,        setSortDir]        = useState<SortDir>('asc');
  const [selected,       setSelected]       = useState<DistCustomer | null>(null);

  const dm     = darkMode;
  const BG     = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.07)';
  const ROW_HOVER = dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)';

  /* Deduplicate resellers present in this customer list */
  const uniqueResellers = useMemo(() => {
    const seen = new Map<string, { id: string; name: string }>();
    customers.forEach((c) => { if (!seen.has(c.reseller.id)) seen.set(c.reseller.id, { id: c.reseller.id, name: c.reseller.name }); });
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [customers]);

  /* Per-reseller aggregate stats for the performance strip */
  const resellerStats = useMemo(() => {
    const map: Record<string, { id: string; name: string; customers: number; tools: number; spent: number; pending: number }> = {};
    customers.forEach((c) => {
      if (!map[c.reseller.id]) map[c.reseller.id] = { id: c.reseller.id, name: c.reseller.name, customers: 0, tools: 0, spent: 0, pending: 0 };
      const s = map[c.reseller.id];
      s.customers += 1; s.tools += c.tools_count; s.spent += c.total_spent; s.pending += c.pending_claims;
    });
    return Object.values(map).sort((a, b) => b.spent - a.spent);
  }, [customers]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all',    label: `All (${customers.length})` },
    { key: 'pro',    label: `Pro (${customers.filter((c) => c.user_type === 'Pro').length})` },
    { key: 'diy',    label: `DIYer (${customers.filter((c) => c.user_type === 'DIYer').length})` },
    { key: 'claims', label: `Pending Claims (${customers.filter((c) => c.pending_claims > 0).length})` },
  ];

  const COLUMNS: { key: SortKey | null; label: string }[] = [
    { key: 'name',          label: 'Customer'     },
    { key: 'city',          label: 'City'         },
    { key: 'reseller',      label: 'Reseller Shop'},
    { key: null,            label: 'Type'         },
    { key: 'tools_count',   label: 'Tools'        },
    { key: null,            label: 'Warranty'     },
    { key: 'total_spent',   label: 'Total Spent'  },
    { key: 'claims_count',  label: 'Claims'       },
    { key: 'last_purchase', label: 'Last Purchase'},
    { key: null,            label: ''             },
  ];

  const getSortValue = (c: DistCustomer, key: SortKey): string | number => {
    if (key === 'reseller') return c.reseller.name;
    return c[key as keyof DistCustomer] as string | number;
  };

  const filtered = useMemo(() => {
    let list = customers.filter((c) => {
      const q = query.toLowerCase();
      if (q && !(
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.reseller.name.toLowerCase().includes(q)
      )) return false;
      if (filter === 'pro')    return c.user_type === 'Pro';
      if (filter === 'diy')    return c.user_type === 'DIYer';
      if (filter === 'claims') return c.pending_claims > 0;
      if (resellerFilter !== 'all') return c.reseller.id === resellerFilter;
      return true;
    });
    if (resellerFilter !== 'all' && filter === 'all') {
      // already filtered above — noop
    }
    list = [...list].sort((a, b) => {
      const va = getSortValue(a, sortKey);
      const vb = getSortValue(b, sortKey);
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(String(vb)) : String(vb).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
    return list;
  }, [customers, query, filter, resellerFilter, sortKey, sortDir]);

  const handleSort = (key: SortKey | null) => {
    if (!key) return;
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortIcon = ({ col }: { col: SortKey | null }) => {
    if (!col) return null;
    if (col !== sortKey) return <ChevronUp size={12} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={12} style={{ color: '#E31E24' }} /> : <ChevronDown size={12} style={{ color: '#E31E24' }} />;
  };

  const maxSpent = Math.max(...resellerStats.map((r) => r.spent), 1);

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Customers</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: '5px 0 0', fontWeight: 500 }}>
            {filtered.length} customer{filtered.length !== 1 ? 's' : ''}{query ? ' matching search' : ' in your territory'} · {uniqueResellers.length} active resellers
          </p>
        </div>
      </div>

      {/* ── Reseller Performance Strip ── */}
      <div style={{ marginBottom: 18 }}>
        {/* Section header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: dm ? 'rgba(227,30,36,0.14)' : 'rgba(227,30,36,0.09)',
              border: `1px solid rgba(227,30,36,0.22)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Store size={17} style={{ color: '#E31E24' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: TEXT, letterSpacing: '-0.01em' }}>
                  Active Resellers
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 800,
                  background: '#E31E24', color: '#fff',
                  padding: '3px 9px', borderRadius: 99,
                  letterSpacing: '0.03em',
                }}>
                  {resellerStats.length} ACTIVE
                </span>
              </div>
              <p style={{ fontSize: 13, color: MUTED, margin: '2px 0 0', fontWeight: 500 }}>
                Click a reseller to filter customers by shop · sorted by total revenue
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 99, background: dm ? 'rgba(52,199,89,0.10)' : 'rgba(52,199,89,0.09)', border: '1px solid rgba(52,199,89,0.22)' }}>
            <motion.div
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C759' }}
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#34C759' }}>All Shops Operational</span>
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${resellerStats.length}, 1fr)`, gap: 12 }}>
          {resellerStats.map((rs) => {
            const { bg, dot } = resellerColor(rs.id, dm);
            const pct = (rs.spent / maxSpent) * 100;
            const isActive = resellerFilter === rs.id;
            return (
              <motion.div
                key={rs.id}
                whileHover={{ y: -2 }}
                onClick={() => setResellerFilter(isActive ? 'all' : rs.id)}
                style={{
                  background: isActive ? dot : CARD,
                  borderRadius: 16, padding: '14px 16px', cursor: 'pointer',
                  border: `1.5px solid ${isActive ? dot : BORDER}`,
                  boxShadow: isActive ? `0 4px 20px ${dot}44` : SHADOW,
                  transition: 'all 0.15s ease',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: isActive ? 'rgba(255,255,255,0.22)' : bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={14} style={{ color: isActive ? '#fff' : dot }} />
                  </div>
                  {rs.pending > 0 && (
                    <span style={{ background: isActive ? 'rgba(255,255,255,0.25)' : '#FF950022', color: isActive ? '#fff' : '#FF9500', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>
                      {rs.pending} pending
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, fontWeight: 900, color: isActive ? '#fff' : TEXT, margin: '0 0 1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{rs.name}</p>
                <div className="flex items-center gap-3 mt-1 mb-2">
                  <span style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.7)' : MUTED }}><strong style={{ color: isActive ? '#fff' : TEXT }}>{rs.customers}</strong> cust.</span>
                  <span style={{ fontSize: 10, color: isActive ? 'rgba(255,255,255,0.7)' : MUTED }}><strong style={{ color: isActive ? '#fff' : TEXT }}>{rs.tools}</strong> tools</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 900, color: isActive ? '#fff' : TEXT, marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>
                  €{rs.spent.toLocaleString('de-DE')}
                </div>
                {/* Revenue bar */}
                <div style={{ height: 4, background: isActive ? 'rgba(255,255,255,0.25)' : (dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'), borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: isActive ? '#fff' : dot, borderRadius: 99 }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div style={{ background: CARD, borderRadius: 18, padding: 14, boxShadow: SHADOW, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1" style={{ minWidth: 200, background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: 10, padding: '8px 14px' }}>
            <Search size={15} style={{ color: MUTED, flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, city, or reseller…"
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: TEXT, flex: 1, fontFamily: FF }}
            />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} style={{ color: MUTED }} /></button>}
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  height: 36, padding: '0 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 600, fontFamily: FF, whiteSpace: 'nowrap',
                  background: filter === f.key ? '#E31E24' : (dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                  color: filter === f.key ? '#fff' : TEXT,
                }}
              >{f.label}</button>
            ))}

            {/* Reseller dropdown */}
            <div style={{ position: 'relative' }}>
              <Store size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: resellerFilter !== 'all' ? '#E31E24' : MUTED, pointerEvents: 'none' }} />
              <select
                value={resellerFilter}
                onChange={(e) => setResellerFilter(e.target.value)}
                style={{
                  height: 36, paddingLeft: 30, paddingRight: 28, borderRadius: 10,
                  border: resellerFilter !== 'all' ? '1.5px solid #E31E24' : `1px solid ${BORDER}`,
                  background: resellerFilter !== 'all' ? (dm ? '#3A1010' : '#FFF0F0') : (dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                  color: resellerFilter !== 'all' ? '#E31E24' : TEXT,
                  fontSize: 12, fontWeight: 600, fontFamily: FF, cursor: 'pointer',
                  appearance: 'none', outline: 'none',
                }}
              >
                <option value="all">All Resellers</option>
                {uniqueResellers.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <ChevronDown size={11} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: resellerFilter !== 'all' ? '#E31E24' : MUTED, pointerEvents: 'none' }} />
            </div>

            {/* Clear all filters */}
            {(filter !== 'all' || resellerFilter !== 'all' || query) && (
              <button
                onClick={() => { setFilter('all'); setResellerFilter('all'); setQuery(''); }}
                style={{ height: 36, padding: '0 12px', borderRadius: 10, border: `1px solid ${BORDER}`, background: 'none', cursor: 'pointer', color: MUTED, fontSize: 12, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <X size={11} /> Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
                {COLUMNS.map((col) => (
                  <th
                    key={col.label}
                    onClick={() => handleSort(col.key)}
                    style={{
                      padding: '13px 20px', textAlign: 'left', fontSize: 12, fontWeight: 700,
                      color: col.key === sortKey ? '#E31E24' : MUTED,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      cursor: col.key ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none',
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon col={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isSelected = selected?.id === c.id;
                const initials = c.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                const { bg: rBg, dot: rDot } = resellerColor(c.reseller.id, dm);
                const resellerInitials = c.reseller.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(isSelected ? null : c)}
                    style={{
                      borderTop: `1px solid ${BORDER}`, cursor: 'pointer',
                      background: isSelected
                        ? (dm ? 'rgba(227,30,36,0.1)' : 'rgba(227,30,36,0.04)')
                        : (i % 2 !== 0 ? (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : 'transparent'),
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = ROW_HOVER; }}
                    onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = i % 2 !== 0 ? (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : 'transparent'; }}
                  >
                    {/* Customer */}
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-3">
                        <div style={{ width: 38, height: 38, borderRadius: '50%', background: isSelected ? '#E31E24' : (dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 13, fontWeight: 900, color: isSelected ? '#fff' : TEXT }}>{initials}</span>
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{c.name}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* City */}
                    <td style={{ padding: '14px 20px', color: MUTED, whiteSpace: 'nowrap' }}>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={13} style={{ color: MUTED }} />
                        {c.city}
                      </div>
                    </td>
                    {/* Reseller Shop */}
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: rBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${rDot}33` }}>
                          <span style={{ fontSize: 10, fontWeight: 900, color: rDot }}>{resellerInitials}</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>{c.reseller.name}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{c.reseller.city}</p>
                        </div>
                      </div>
                    </td>
                    {/* Type */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: c.user_type === 'Pro' ? (dm ? '#1A1A3A' : '#EEF2FF') : (dm ? '#0D2A1A' : '#E8F8EE'), color: c.user_type === 'Pro' ? '#6366F1' : '#34C759' }}>
                        {c.user_type}
                      </span>
                    </td>
                    {/* Tools */}
                    <td style={{ padding: '14px 20px', color: TEXT, fontWeight: 700 }}>
                      <div className="flex items-center gap-1.5">
                        <Wrench size={12} style={{ color: MUTED }} />
                        {c.tools_count}
                      </div>
                    </td>
                    {/* Warranty */}
                    <td style={{ padding: '14px 20px', fontVariantNumeric: 'tabular-nums' }}>
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={12} style={{ color: c.warranty_active > 0 ? '#34C759' : MUTED }} />
                        <span style={{ color: TEXT }}>{c.warranty_active}</span>
                        <span style={{ color: MUTED, fontSize: 11 }}>active</span>
                      </div>
                    </td>
                    {/* Spent */}
                    <td style={{ padding: '14px 20px', color: TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      €{c.total_spent.toLocaleString('de-DE')}
                    </td>
                    {/* Claims */}
                    <td style={{ padding: '14px 20px' }}>
                      {c.pending_claims > 0
                        ? <div className="flex items-center gap-1.5"><AlertTriangle size={12} style={{ color: '#FF9500' }} /><span style={{ color: '#FF9500', fontWeight: 700 }}>{c.pending_claims} pending</span></div>
                        : <span style={{ color: MUTED }}>{c.claims_count} total</span>
                      }
                    </td>
                    {/* Last purchase */}
                    <td style={{ padding: '14px 20px', color: MUTED, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} style={{ color: MUTED }} />
                        {c.last_purchase}
                      </div>
                    </td>
                    {/* Arrow */}
                    <td style={{ padding: '14px 20px' }}>
                      <ChevronRight size={15} style={{ color: isSelected ? '#E31E24' : MUTED }} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: '48px 20px', textAlign: 'center', color: MUTED, fontSize: 14 }}>
                    <User size={32} style={{ margin: '0 auto 10px', opacity: 0.3 }} />
                    <p style={{ margin: 0 }}>No customers match your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer summary */}
        {filtered.length > 0 && (
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 24 }}>
            {[
              { Icon: User,         label: `${filtered.length} customers` },
              { Icon: Wrench,       label: `${filtered.reduce((a, c) => a + c.tools_count, 0)} tools` },
              { Icon: Euro,         label: `€${filtered.reduce((a, c) => a + c.total_spent, 0).toLocaleString('de-DE')} total spent` },
              { Icon: TrendingUp,   label: `${filtered.reduce((a, c) => a + c.warranty_active, 0)} active warranties` },
              { Icon: AlertTriangle,label: `${filtered.reduce((a, c) => a + c.pending_claims, 0)} pending claims` },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon size={11} style={{ color: MUTED }} />
                <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }}
            />
            <DetailPanel key="panel" customer={selected} onClose={() => setSelected(null)} dm={dm} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}