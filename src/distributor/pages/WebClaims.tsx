import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search, X, Check, Clock, Wrench, AlertTriangle,
  Calendar, User, Package, ChevronRight, ChevronUp, ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { useDistributorStore, WarrantyClaim, ClaimStatus } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type TabFilter = 'all' | 'pending' | 'in_repair' | 'approved' | 'rejected';
type SortKey = 'customer_name' | 'tool_model' | 'submitted' | 'status';
type SortDir = 'asc' | 'desc';

const STATUS_CFG: Record<ClaimStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending:   { label: 'Pending',   color: '#FF9500', icon: Clock   },
  in_repair: { label: 'In Repair', color: '#6366F1', icon: Wrench  },
  approved:  { label: 'Approved',  color: '#34C759', icon: Check   },
  rejected:  { label: 'Rejected',  color: '#C0392B', icon: X       },
};

function StatusBadge({ status }: { status: ClaimStatus }) {
  const cfg = STATUS_CFG[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: `${cfg.color}20`, color: cfg.color }}>
      <cfg.icon size={11} />
      {cfg.label}
    </span>
  );
}

function ClaimDetailPanel({
  claim, onClose, dm,
}: { claim: WarrantyClaim; onClose: () => void; dm: boolean }) {
  const { updateClaimStatus } = useDistributorStore();
  const [resolution, setResolution] = useState(claim.resolution || '');
  const [saved, setSaved] = useState(false);

  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const INPUT_BG = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';

  const cfg = STATUS_CFG[claim.status];

  const handle = (status: ClaimStatus) => {
    updateClaimStatus(claim.id, status, resolution || undefined);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <motion.div
      initial={{ x: 480, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 480, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 460,
        background: dm ? '#111111' : '#f8f8fa',
        borderLeft: `1px solid ${BORDER}`,
        boxShadow: dm ? '-12px 0 40px rgba(0,0,0,0.5)' : '-12px 0 40px rgba(0,0,0,0.12)',
        zIndex: 100, overflowY: 'auto', fontFamily: FF,
      }}
    >
      {/* Tool Hero */}
      <div style={{ position: 'relative' }}>
        <img src={claim.tool_image} alt={claim.tool_model} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={14} color="#fff" />
        </button>
        <div style={{ position: 'absolute', bottom: 16, left: 18 }}>
          <p style={{ color: '#E31E24', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{claim.category}</p>
          <p style={{ color: '#fff', fontSize: 17, fontWeight: 900, margin: '3px 0 0' }}>{claim.tool_model}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, margin: '2px 0 0' }}>S/N: {claim.tool_serial}</p>
        </div>
      </div>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Claim Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Claim #{claim.id}</p>
            <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: '4px 0 0' }}>{claim.issue}</p>
          </div>
          <StatusBadge status={claim.status} />
        </div>

        {/* Meta cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { icon: User,     label: 'Customer',   val: claim.customer_name },
            { icon: Calendar, label: 'Submitted',   val: claim.submitted },
            ...(claim.technician ? [{ icon: Wrench, label: 'Technician', val: claim.technician }] : []),
            ...(claim.estimated_completion ? [{ icon: Clock, label: 'ETA', val: claim.estimated_completion }] : []),
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} style={{ background: CARD, borderRadius: 12, padding: 12, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} style={{ color: MUTED }} />
                <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{label}</p>
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Issue detail */}
        <div style={{ background: CARD, borderRadius: 12, padding: 14, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Issue Description</p>
          <p style={{ fontSize: 13, color: TEXT, margin: 0, lineHeight: 1.6 }}>{claim.issue_detail}</p>
        </div>

        {/* Parts needed */}
        {claim.parts_needed && claim.parts_needed.length > 0 && (
          <div style={{ background: CARD, borderRadius: 12, padding: 14, border: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>Parts Required</p>
            {claim.parts_needed.map((p) => (
              <div key={p} className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                <Package size={12} style={{ color: '#6366F1' }} />
                <span style={{ fontSize: 12, color: TEXT }}>{p}</span>
              </div>
            ))}
          </div>
        )}

        {/* Resolution note */}
        <div style={{ background: CARD, borderRadius: 12, padding: 14, border: `1px solid ${BORDER}` }}>
          <p style={{ fontSize: 10, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Resolution Note</p>
          <textarea
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Add resolution details…"
            rows={3}
            style={{ width: '100%', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', fontSize: 13, color: TEXT, fontFamily: FF, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          />
        </div>

        {/* Action buttons */}
        {saved ? (
          <div style={{ padding: 14, borderRadius: 12, background: dm ? '#0D2A1A' : '#E8F8EE', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Check size={16} color="#34C759" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#34C759' }}>Saved successfully</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {claim.status !== 'approved' && (
              <button
                onClick={() => handle('approved')}
                style={{ padding: '12px', borderRadius: 12, background: dm ? '#0D2A1A' : '#E8F8EE', border: `1px solid ${dm ? '#1A4A2A' : '#C8F0D8'}`, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#34C759', fontFamily: FF }}
              >
                ✓ Approve
              </button>
            )}
            {claim.status !== 'in_repair' && (
              <button
                onClick={() => handle('in_repair')}
                style={{ padding: '12px', borderRadius: 12, background: dm ? '#1A1A3A' : '#EEF2FF', border: `1px solid ${dm ? '#2A2A5A' : '#C8C8F8'}`, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#6366F1', fontFamily: FF }}
              >
                🔧 In Repair
              </button>
            )}
            {claim.status !== 'rejected' && (
              <button
                onClick={() => handle('rejected')}
                style={{ padding: '12px', borderRadius: 12, background: dm ? '#3A0D0D' : '#FFEEEE', border: `1px solid ${dm ? '#5A1A1A' : '#F8C8C8'}`, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#C0392B', fontFamily: FF }}
              >
                ✗ Reject
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function WebClaims() {
  const { claims, darkMode } = useDistributorStore();
  const [tab,      setTab]      = useState<TabFilter>('all');
  const [query,    setQuery]    = useState('');
  const [sortKey,  setSortKey]  = useState<SortKey>('submitted');
  const [sortDir,  setSortDir]  = useState<SortDir>('desc');
  const [selected, setSelected] = useState<WarrantyClaim | null>(null);

  const dm     = darkMode;
  const BG     = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.07)';
  const ROW_HOVER = dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)';

  const TABS: { key: TabFilter; label: string }[] = [
    { key: 'all',      label: `All (${claims.length})` },
    { key: 'pending',  label: `Pending (${claims.filter((c) => c.status === 'pending').length})` },
    { key: 'in_repair', label: `In Repair (${claims.filter((c) => c.status === 'in_repair').length})` },
    { key: 'approved', label: `Approved (${claims.filter((c) => c.status === 'approved').length})` },
    { key: 'rejected', label: `Rejected (${claims.filter((c) => c.status === 'rejected').length})` },
  ];

  const COLUMNS: { key: SortKey | null; label: string }[] = [
    { key: null,            label: 'Tool' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'tool_model',    label: 'Issue' },
    { key: 'submitted',     label: 'Submitted' },
    { key: 'status',        label: 'Status' },
    { key: null,            label: 'Technician' },
    { key: null,            label: '' },
  ];

  const handleSort = (key: SortKey | null) => {
    if (!key) return;
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => {
    let list = claims.filter((c) => {
      const q = query.toLowerCase();
      if (q && !(c.customer_name.toLowerCase().includes(q) || c.tool_model.toLowerCase().includes(q) || c.id.includes(q))) return false;
      if (tab !== 'all' && c.status !== tab) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      const va = a[sortKey as keyof WarrantyClaim] as string;
      const vb = b[sortKey as keyof WarrantyClaim] as string;
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return list;
  }, [claims, query, tab, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey | null }) => {
    if (!col) return null;
    if (col !== sortKey) return <ChevronUp size={12} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc' ? <ChevronUp size={12} style={{ color: '#E31E24' }} /> : <ChevronDown size={12} style={{ color: '#E31E24' }} />;
  };

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Warranty Claims</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: '5px 0 0', fontWeight: 500 }}>
            {filtered.length} claim{filtered.length !== 1 ? 's' : ''} {tab !== 'all' ? `· ${STATUS_CFG[tab as ClaimStatus]?.label ?? tab}` : ''}
          </p>
        </div>
      </div>

      {/* Search + Tabs */}
      <div style={{ background: CARD, borderRadius: 18, padding: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, marginBottom: 18 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-1" style={{ background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: 11, padding: '10px 16px', minWidth: 200 }}>
            <Search size={16} style={{ color: MUTED, flexShrink: 0 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer, tool, or claim ID…"
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: TEXT, flex: 1, fontFamily: FF }}
            />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={15} style={{ color: MUTED }} /></button>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  height: 40, padding: '0 16px', borderRadius: 11, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, fontFamily: FF, whiteSpace: 'nowrap',
                  background: tab === t.key ? '#E31E24' : (dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'),
                  color: tab === t.key ? '#fff' : TEXT,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims Table */}
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
                    <div className="flex items-center gap-1">{col.label}<SortIcon col={col.key} /></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => {
                const isSelected = selected?.id === c.id;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(isSelected ? null : c)}
                    style={{
                      borderTop: `1px solid ${BORDER}`, cursor: 'pointer',
                      background: isSelected ? (dm ? 'rgba(227,30,36,0.1)' : 'rgba(227,30,36,0.04)') : (i % 2 !== 0 ? (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : 'transparent'),
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = ROW_HOVER; }}
                    onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLTableRowElement).style.background = i % 2 !== 0 ? (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : 'transparent'; }}
                  >
                    {/* Tool image */}
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-3">
                        <img src={c.tool_image} alt={c.tool_model} style={{ width: 44, height: 44, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{c.tool_model.split(' ')[0]}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>#{c.id}</p>
                        </div>
                      </div>
                    </td>
                    {/* Customer */}
                    <td style={{ padding: '14px 20px' }}>
                      <div className="flex items-center gap-2">
                        <User size={14} style={{ color: MUTED }} />
                        <span style={{ color: TEXT, fontWeight: 600 }}>{c.customer_name}</span>
                      </div>
                    </td>
                    {/* Issue */}
                    <td style={{ padding: '14px 20px', maxWidth: 240 }}>
                      <p style={{ color: TEXT, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.issue}</p>
                      <p style={{ color: MUTED, fontSize: 12, margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{c.issue_detail}</p>
                    </td>
                    {/* Submitted */}
                    <td style={{ padding: '14px 20px', color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{c.submitted}</td>
                    {/* Status */}
                    <td style={{ padding: '14px 20px' }}><StatusBadge status={c.status} /></td>
                    {/* Technician */}
                    <td style={{ padding: '14px 20px', color: MUTED, fontSize: 13 }}>{c.technician || '—'}</td>
                    {/* Arrow */}
                    <td style={{ padding: '14px 20px' }}>
                      <ChevronRight size={16} style={{ color: isSelected ? '#E31E24' : MUTED }} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '56px 20px', textAlign: 'center', color: MUTED }}>
                    <ShieldCheck size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ margin: 0, fontSize: 15 }}>No claims match your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail slide-over */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }}
            />
            <ClaimDetailPanel key="panel" claim={selected} onClose={() => setSelected(null)} dm={dm} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}