import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, Check, X, Clock, ShieldCheck, AlertTriangle,
  Wrench, Calendar, User, ChevronRight, Package,
} from 'lucide-react';
import { useDistributorStore, WarrantyClaim, ClaimStatus } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type TabFilter = 'pending' | 'in_repair' | 'approved' | 'rejected' | 'all';

function ClaimDetail({ claim, onBack }: { claim: WarrantyClaim; onBack: () => void }) {
  const { updateClaimStatus, darkMode } = useDistributorStore();
  const dm = darkMode;
  const [resolution, setResolution] = useState(claim.resolution || '');
  const [saved, setSaved] = useState(false);

  const STATUS_CFG_DM = {
    pending:   { label: 'Pending Review', bg: dm ? '#3A2800' : '#FFF3E0', text: dm ? '#FFB74D' : '#B97A00', icon: Clock },
    in_repair: { label: 'In Repair',      bg: dm ? '#1A1A3A' : '#EEF2FF', text: dm ? '#818CF8' : '#4F46E5', icon: Wrench },
    approved:  { label: 'Approved',       bg: dm ? '#0D2A1A' : '#E8F8EE', text: dm ? '#4ADE80' : '#1A8A4A', icon: Check },
    rejected:  { label: 'Rejected',       bg: dm ? '#3A0D0D' : '#FFEEEE', text: dm ? '#F87171' : '#C0392B', icon: X },
  };
  const cfg = STATUS_CFG_DM[claim.status];
  const cardShadow = dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)';

  const handle = (status: ClaimStatus) => {
    updateClaimStatus(claim.id, status, resolution || undefined);
    setSaved(true);
    setTimeout(() => { setSaved(false); onBack(); }, 900);
  };

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 260 }}
      className="fixed inset-0 z-[60] max-w-md mx-auto overflow-y-auto pb-10 bg-background"
    >
      <div className="sticky top-0 backdrop-blur-md px-4 pt-14 pb-3 border-b border-border bg-background/95">
        <button onClick={onBack} className="flex items-center gap-0.5 text-[#E31E24]">
          <ChevronLeft size={20} strokeWidth={2.5} />
          <span className="text-[15px]" style={{ fontFamily: FF }}>Claims</span>
        </button>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Tool + Status Hero */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          <div className="relative">
            <img src={claim.tool_image} alt={claim.tool_model} className="w-full h-44 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-[#E31E24] text-[10px] font-semibold uppercase tracking-widest">{claim.category}</p>
              <p className="text-white text-[17px] font-semibold leading-tight" style={{ fontFamily: FF }}>{claim.tool_model}</p>
              <p className="text-white/50 text-[11px] font-mono mt-0.5">{claim.tool_serial}</p>
            </div>
            <div className="absolute top-3 right-3">
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5"
                style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                <cfg.icon size={10} /> {cfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Claim Info */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          <div className="px-4 py-3 border-b border-border">
            <p className="text-foreground text-[14px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>Claim Details</p>
          </div>
          {[
            { icon: User,          label: 'Customer',   value: claim.customer_name },
            { icon: Calendar,      label: 'Submitted',  value: claim.submitted },
            { icon: AlertTriangle, label: 'Issue Type', value: claim.issue },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < 2 ? 'border-b border-border' : ''}`}>
              <Icon size={14} className="text-[#E31E24] flex-shrink-0" />
              <span className="text-muted-foreground text-[13px] w-24 flex-shrink-0" style={{ fontFamily: FF }}>{label}</span>
              <span className="text-foreground text-[13px] font-medium" style={{ fontFamily: FF }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Issue Description */}
        <div className="bg-card rounded-2xl p-4" style={{ boxShadow: cardShadow }}>
          <p className="text-foreground text-[13px] font-semibold uppercase tracking-[0.04em] mb-2"
            style={{ fontFamily: FF }}>Customer's Description</p>
          <p className="text-muted-foreground text-[14px] leading-relaxed" style={{ fontFamily: FF }}>{claim.issue_detail}</p>
        </div>

        {/* Parts Needed */}
        {claim.parts_needed && claim.parts_needed.length > 0 && (
          <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
            <div className="px-4 py-3 border-b border-border">
              <p className="text-foreground text-[13px] font-semibold uppercase tracking-[0.04em]"
                style={{ fontFamily: FF }}>Parts Required</p>
            </div>
            {claim.parts_needed.map((part, i) => (
              <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < claim.parts_needed!.length - 1 ? 'border-b border-border' : ''}`}>
                <Package size={13} className="text-[#E31E24]" />
                <span className="text-foreground text-[13px]" style={{ fontFamily: FF }}>{part}</span>
              </div>
            ))}
            {claim.estimated_completion && (
              <div className="px-4 py-3 border-t border-border flex items-center gap-3">
                <Clock size={13} className="text-[#6366F1]" />
                <span className="text-muted-foreground text-[12px]">Est. completion</span>
                <span className="text-foreground text-[13px] font-medium ml-auto" style={{ fontFamily: FF }}>{claim.estimated_completion}</span>
              </div>
            )}
          </div>
        )}

        {/* Resolution */}
        {(claim.status === 'approved' || claim.status === 'rejected') && claim.resolution && (
          <div className="bg-card rounded-2xl p-4" style={{ boxShadow: cardShadow }}>
            <p className="text-foreground text-[13px] font-semibold uppercase tracking-[0.04em] mb-2"
              style={{ fontFamily: FF }}>
              {claim.status === 'approved' ? '✅ Resolution' : '❌ Rejection Reason'}
            </p>
            <p className="text-muted-foreground text-[13px] leading-relaxed" style={{ fontFamily: FF }}>{claim.resolution}</p>
            {claim.technician && (
              <p className="text-muted-foreground text-[12px] mt-2" style={{ fontFamily: FF }}>
                Technician: <span className="text-[#E31E24] font-medium">{claim.technician}</span>
              </p>
            )}
          </div>
        )}

        {/* Action Panel — pending */}
        {claim.status === 'pending' && !saved && (
          <div className="bg-card rounded-2xl p-4 space-y-4" style={{ boxShadow: cardShadow }}>
            <p className="text-foreground text-[13px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>Technician Notes</p>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Describe the findings and resolution or rejection reason..."
              rows={4}
              className="w-full bg-muted rounded-xl px-4 py-3 text-[14px] text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-[#E31E24] placeholder:text-muted-foreground transition-colors"
              style={{ fontFamily: FF }}
            />
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handle('rejected')}
                className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold"
                style={{ backgroundColor: dm ? '#3A0D0D' : '#FFEEEE', color: dm ? '#F87171' : '#C0392B', fontFamily: FF }}
              >
                <X size={15} /> Reject Claim
              </button>
              <button
                onClick={() => handle('in_repair')}
                className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold"
                style={{ backgroundColor: dm ? '#1A1A3A' : '#EEF2FF', color: dm ? '#818CF8' : '#4F46E5', fontFamily: FF }}
              >
                <Wrench size={15} /> Send to Repair
              </button>
            </div>
            <button
              onClick={() => handle('approved')}
              className="w-full flex items-center justify-center gap-2 bg-[#E31E24] text-white rounded-2xl py-3.5 text-[15px] font-semibold"
              style={{ fontFamily: FF }}
            >
              <Check size={16} /> Approve & Close
            </button>
          </div>
        )}

        {/* Action Panel — in_repair */}
        {claim.status === 'in_repair' && !saved && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handle('rejected')}
              className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[14px] font-semibold"
              style={{ backgroundColor: dm ? '#3A0D0D' : '#FFEEEE', color: dm ? '#F87171' : '#C0392B', fontFamily: FF }}
            >
              <X size={15} /> Cannot Repair
            </button>
            <button
              onClick={() => handle('approved')}
              className="flex items-center justify-center gap-2 bg-[#E31E24] text-white rounded-2xl py-3.5 text-[14px] font-semibold"
              style={{ fontFamily: FF }}
            >
              <Check size={15} /> Mark Complete
            </button>
          </div>
        )}

        {saved && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ backgroundColor: dm ? '#0D2A1A' : '#E8F8EE' }}>
            <Check size={20} className="text-[#34C759]" />
            <p className="text-[14px] font-medium"
              style={{ color: dm ? '#4ADE80' : '#1A8A4A', fontFamily: FF }}>
              Claim status updated!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Claims() {
  const { claims, darkMode } = useDistributorStore();
  const dm = darkMode;
  const [tab, setTab]           = useState<TabFilter>('pending');
  const [selected, setSelected] = useState<WarrantyClaim | null>(null);

  const filtered = claims.filter((c) => tab === 'all' || c.status === tab);

  const counts: Record<TabFilter, number> = {
    pending:   claims.filter((c) => c.status === 'pending').length,
    in_repair: claims.filter((c) => c.status === 'in_repair').length,
    approved:  claims.filter((c) => c.status === 'approved').length,
    rejected:  claims.filter((c) => c.status === 'rejected').length,
    all:       claims.length,
  };

  const TABS: { key: TabFilter; label: string }[] = [
    { key: 'pending',   label: `Pending ${counts.pending > 0 ? `(${counts.pending})` : ''}` },
    { key: 'in_repair', label: 'In Repair' },
    { key: 'approved',  label: 'Approved' },
    { key: 'rejected',  label: 'Rejected' },
    { key: 'all',       label: 'All' },
  ];

  const STATUS_CFG_DM = {
    pending:   { label: 'Pending Review', bg: dm ? '#3A2800' : '#FFF3E0', text: dm ? '#FFB74D' : '#B97A00', icon: Clock },
    in_repair: { label: 'In Repair',      bg: dm ? '#1A1A3A' : '#EEF2FF', text: dm ? '#818CF8' : '#4F46E5', icon: Wrench },
    approved:  { label: 'Approved',       bg: dm ? '#0D2A1A' : '#E8F8EE', text: dm ? '#4ADE80' : '#1A8A4A', icon: Check },
    rejected:  { label: 'Rejected',       bg: dm ? '#3A0D0D' : '#FFEEEE', text: dm ? '#F87171' : '#C0392B', icon: X },
  };

  const pillInactiveBg   = dm ? '#2A2A2A' : '#F2F2F7';
  const pillInactiveText = dm ? '#FFFFFF'  : '#1D1D1F';
  const cardShadow       = dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)';

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {selected && <ClaimDetail claim={selected} onBack={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Sub-header */}
      <div
        className="fixed top-[88px] left-0 right-0 z-30 max-w-md mx-auto bg-card"
        style={{ boxShadow: dm ? '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.60)' : '0 1px 0 rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-foreground text-[17px] font-black text-center uppercase tracking-[0.04em]"
            style={{ fontFamily: FF }}>Warranty Claims</h1>
        </div>
        <div className="flex gap-1 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex-shrink-0 px-3 py-1 rounded-full text-[12px] font-medium transition-all"
              style={{
                backgroundColor: tab === t.key ? '#E31E24' : pillInactiveBg,
                color:           tab === t.key ? 'white' : pillInactiveText,
                fontFamily:      FF,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-[108px] pb-4 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShieldCheck size={28} className="text-[#34C759]" />
            </div>
            <p className="text-foreground text-[16px] font-medium" style={{ fontFamily: FF }}>No {tab} claims</p>
            <p className="text-muted-foreground text-[14px] mt-1" style={{ fontFamily: FF }}>
              {tab === 'pending' ? 'All caught up! 🎉' : 'Nothing to show here.'}
            </p>
          </div>
        )}

        {filtered.map((claim, i) => {
          const cfg = STATUS_CFG_DM[claim.status];
          const StatusIcon = cfg.icon;
          return (
            <motion.button
              key={claim.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(claim)}
              className="w-full bg-card rounded-2xl overflow-hidden text-left active:scale-[0.98] transition-all"
              style={{ boxShadow: cardShadow }}
            >
              <div className="h-1 w-full" style={{ backgroundColor: cfg.text }} />
              <div className="p-4 flex items-start gap-3">
                <img src={claim.tool_image} alt={claim.tool_model} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[#E31E24] text-[9px] font-semibold uppercase tracking-wide">{claim.category}</p>
                      <p className="text-foreground text-[14px] font-medium leading-tight" style={{ fontFamily: FF }}>{claim.tool_model}</p>
                      <p className="text-muted-foreground text-[11px] font-mono">{claim.tool_serial}</p>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                      <StatusIcon size={9} /> {cfg.label}
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-foreground text-[13px] font-medium" style={{ fontFamily: FF }}>{claim.issue}</p>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <User size={9} /> {claim.customer_name}
                        </span>
                        <span className="text-muted-foreground text-[11px] flex items-center gap-1">
                          <Calendar size={9} /> {claim.submitted}
                        </span>
                      </div>
                      <ChevronRight size={13} className="text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
