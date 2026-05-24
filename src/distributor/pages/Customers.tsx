import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ChevronRight, X, Phone, Mail, MapPin,
  Wrench, ShieldCheck, Clock, ChevronLeft, AlertTriangle, User,
} from 'lucide-react';
import { useDistributorStore, DistCustomer } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type Filter = 'all' | 'pro' | 'diy' | 'claims';

function StatusDot({ status }: { status: string }) {
  const color = status === 'active' ? '#34C759' : status === 'expiring' ? '#FF9500' : '#8E8E93';
  return <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />;
}

function CustomerDetail({ customer, onBack }: { customer: DistCustomer; onBack: () => void }) {
  const { darkMode } = useDistributorStore();
  const dm = darkMode;
  const totalActiveWarranty = customer.tools.filter((t) => t.status === 'active').length;

  const statusColors: Record<string, { bg: string; text: string }> = dm
    ? {
        active:   { bg: '#0D2A1A', text: '#4ADE80' },
        expiring: { bg: '#3A2800', text: '#FFB74D' },
        expired:  { bg: '#3A0D0D', text: '#F87171' },
      }
    : {
        active:   { bg: '#E8F8EE', text: '#1A8A4A' },
        expiring: { bg: '#FFF3E0', text: '#B97A00' },
        expired:  { bg: '#FFEEEE', text: '#C0392B' },
      };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="fixed inset-0 z-[60] max-w-md mx-auto overflow-y-auto pb-8 bg-background"
    >
      <div className="sticky top-0 backdrop-blur-md px-4 pt-14 pb-3 border-b border-border bg-background/95">
        <button onClick={onBack} className="flex items-center gap-0.5 text-[#E31E24] active:opacity-60">
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span className="text-[15px]" style={{ fontFamily: FF }}>Customers</span>
        </button>
      </div>

      <div className="px-4 pt-5 space-y-5">
        {/* Profile Hero */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #C8161C 0%, #E31E24 55%, #FF3B40 100%)' }}
        >
          <div className="absolute top-[-30px] right-[-30px] w-32 h-32 rounded-full bg-white opacity-[0.07]" />
          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[22px] font-black" style={{ fontFamily: FF }}>
                {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-[18px] font-semibold" style={{ fontFamily: FF }}>{customer.name}</h2>
              <p className="text-white/60 text-[13px]" style={{ fontFamily: FF }}>{customer.email}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">{customer.user_type}</span>
                <span className="text-white/60 text-[11px]"><MapPin size={10} className="inline mr-0.5" />{customer.city}</span>
              </div>
            </div>
          </div>
          <div className="relative grid grid-cols-3 gap-3 mt-4 bg-white/15 rounded-xl p-3">
            <div className="text-center">
              <p className="text-white text-[22px] font-black leading-none"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{customer.tools_count}</p>
              <p className="text-white/60 text-[10px] mt-0.5">Tools</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-white text-[22px] font-black leading-none"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{totalActiveWarranty}</p>
              <p className="text-white/60 text-[10px] mt-0.5">Active</p>
            </div>
            <div className="text-center">
              <p className="text-white text-[22px] font-black leading-none"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>
                €{customer.total_spent.toLocaleString('de-DE')}
              </p>
              <p className="text-white/60 text-[10px] mt-0.5">Spent</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}>
          {[
            { icon: Phone,  label: 'Phone',          value: customer.phone,  href: `tel:${customer.phone}` },
            { icon: Mail,   label: 'Email',           value: customer.email,  href: `mailto:${customer.email}` },
            { icon: MapPin, label: 'City',            value: customer.city,   href: undefined },
            { icon: Clock,  label: 'Customer since',  value: customer.joined, href: undefined },
          ].map(({ icon: Icon, label, value, href }, i, arr) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
              <Icon size={14} className="text-[#E31E24] flex-shrink-0" />
              <span className="text-muted-foreground text-[13px] w-28 flex-shrink-0" style={{ fontFamily: FF }}>{label}</span>
              {href ? (
                <a href={href} className="text-[#E31E24] text-[13px] font-medium flex-1 truncate">{value}</a>
              ) : (
                <span className="text-foreground text-[13px] font-medium flex-1" style={{ fontFamily: FF }}>{value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Registered Tools */}
        <div>
          <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.1em] mb-3"
            style={{ fontFamily: FF }}>Registered Tools</p>
          <div className="space-y-2.5">
            {customer.tools.map((tool) => {
              const sc = statusColors[tool.status] || statusColors.expired;
              return (
                <div key={tool.serial} className="bg-card rounded-2xl p-3.5 flex items-center gap-3"
                  style={{ boxShadow: dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)' }}>
                  <img src={tool.image_url} alt={tool.model} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E31E24] text-[9px] font-semibold uppercase tracking-wide">{tool.category}</p>
                    <p className="text-foreground text-[13px] font-medium mt-0.5" style={{ fontFamily: FF }}>{tool.model}</p>
                    <p className="text-muted-foreground text-[11px] font-mono mt-0.5">{tool.serial}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                      </span>
                      <span className="text-muted-foreground text-[10px]">until {tool.warranty_until}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Customers() {
  const { customers, darkMode } = useDistributorStore();
  const dm = darkMode;
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState<Filter>('all');
  const [selected, setSelected] = useState<DistCustomer | null>(null);

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ||
      (filter === 'pro'    && c.user_type === 'Pro') ||
      (filter === 'diy'    && c.user_type === 'DIYer') ||
      (filter === 'claims' && c.pending_claims > 0);
    return matchSearch && matchFilter;
  });

  const totalTools   = customers.reduce((a, c) => a + c.tools_count, 0);
  const totalRevenue = customers.reduce((a, c) => a + c.total_spent, 0);

  const pillInactiveBg   = dm ? '#2A2A2A' : '#F2F2F7';
  const pillInactiveText = dm ? '#FFFFFF'  : '#1D1D1F';
  const cardShadow       = dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)';

  const userTypeBadge = (type: string) => dm
    ? { bg: type === 'Pro' ? '#3A1010' : '#2A2A2A', text: type === 'Pro' ? '#FF6B6B' : '#AAAAAA' }
    : { bg: type === 'Pro' ? '#FFF0F0' : '#F2F2F7', text: type === 'Pro' ? '#E31E24' : '#6C6C70' };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {selected && <CustomerDetail customer={selected} onBack={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Sub-header */}
      <div
        className="fixed top-[88px] left-0 right-0 z-30 max-w-md mx-auto bg-card"
        style={{ boxShadow: dm ? '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.60)' : '0 1px 0 rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-foreground text-[17px] font-black text-center uppercase tracking-[0.04em]"
            style={{ fontFamily: FF }}>Customers</h1>
        </div>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Name, city or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted rounded-xl py-2 pl-8 pr-4 text-[14px] text-foreground focus:outline-none placeholder:text-muted-foreground"
              style={{ fontFamily: FF }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={13} className="text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {([
            { key: 'all',    label: 'All' },
            { key: 'pro',    label: '🔧 Pro' },
            { key: 'diy',    label: '🏠 DIY' },
            { key: 'claims', label: '⚠️ Claims' },
          ] as { key: Filter; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-shrink-0 px-3.5 py-1 rounded-full text-[12px] transition-all font-medium"
              style={{
                backgroundColor: filter === f.key ? '#E31E24' : pillInactiveBg,
                color:           filter === f.key ? 'white' : pillInactiveText,
                fontFamily:      FF,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-[148px] pb-4">
        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Customers',   value: customers.length,                              color: '#E31E24' },
            { label: 'Tools Reg.',  value: totalTools,                                    color: '#6366F1' },
            { label: 'Total Spent', value: `€${(totalRevenue / 1000).toFixed(1)}k`,       color: '#34C759' },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-xl p-2.5 text-center" style={{ boxShadow: cardShadow }}>
              <p className="font-black text-[20px] leading-none"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums', color: s.color }}>{s.value}</p>
              <p className="text-muted-foreground text-[10px] mt-0.5" style={{ fontFamily: FF }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Customer list */}
        <div className="space-y-2.5">
          {filtered.map((customer, i) => {
            const badge = userTypeBadge(customer.user_type);
            return (
              <motion.button
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(customer)}
                className="w-full bg-card rounded-2xl px-4 py-3.5 flex items-center gap-3 text-left active:scale-[0.98] transition-all"
                style={{ boxShadow: cardShadow }}
              >
                <div className="w-11 h-11 rounded-full bg-[#E31E24] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[13px] font-black" style={{ fontFamily: FF }}>
                    {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground text-[14px] font-medium truncate" style={{ fontFamily: FF }}>{customer.name}</p>
                    {customer.pending_claims > 0 && (
                      <span className="flex-shrink-0 w-4 h-4 bg-[#E31E24] rounded-full flex items-center justify-center">
                        <AlertTriangle size={8} className="text-white" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ backgroundColor: badge.bg, color: badge.text, fontFamily: FF }}>
                      {customer.user_type}
                    </span>
                    <span className="text-muted-foreground text-[11px]"><MapPin size={9} className="inline mr-0.5" />{customer.city}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1"><Wrench size={9} /> {customer.tools_count} tools</span>
                    <span className="text-muted-foreground text-[11px] flex items-center gap-1"><ShieldCheck size={9} /> {customer.warranty_active} active</span>
                    <span className="text-muted-foreground text-[11px]" style={{ fontVariantNumeric: 'tabular-nums' }}>€{customer.total_spent.toLocaleString('de-DE')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <ChevronRight size={14} className="text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{customer.last_purchase.slice(5)}</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <User size={28} className="text-[#E31E24]" />
            </div>
            <p className="text-foreground text-[16px] font-medium" style={{ fontFamily: FF }}>No customers found</p>
            <p className="text-muted-foreground text-[14px] mt-1" style={{ fontFamily: FF }}>Try a different filter or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
