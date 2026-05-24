import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2, Plus, Search, ChevronDown, ChevronUp, MoreHorizontal,
  Edit2, Trash2, Eye, ArrowLeft, Package, ShoppingCart, Upload,
  CheckCircle, AlertCircle, XCircle, Clock, Truck, X, Save,
  Copy, ClipboardList, FileSpreadsheet, ChevronRight,
  Mail, Phone, StickyNote, ToggleLeft, ToggleRight,
  Hash, Layers, DollarSign, Boxes, Check,
  AlertTriangle, RefreshCw, ClipboardCheck, FileDown, Filter,
} from 'lucide-react';
import {
  useDistributorStore,
  DistContact, DistProduct, DistMgmtOrder, DistMgmtOrderStatus,
} from '../store/useDistributorStore';
import { CreateOrderModal } from '../components/CreateOrderModal';

const FF = "'Inter', sans-serif";
const RED = '#E31E24';
function fmt(n: number) { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(d: string) { return d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'; }

// ─── Status configs ───────────────────────────────────────────────────────────
const ORDER_STATUS_CFG: Record<DistMgmtOrderStatus, { label: string; color: string; bg: string; dbg: string; Icon: React.ElementType }> = {
  draft:      { label: 'Draft',             color: '#8E8E93', bg: '#F2F2F7', dbg: '#2C2C2E', Icon: Clock         },
  submitted:  { label: 'Submitted',         color: '#007AFF', bg: '#EFF6FF', dbg: '#0A1A3A', Icon: ClipboardList  },
  confirmed:  { label: 'Confirmed',         color: '#5856D6', bg: '#EEEEFF', dbg: '#1A1A3A', Icon: ClipboardCheck },
  shipped:    { label: 'Shipped',           color: '#FF9500', bg: '#FFF3E0', dbg: '#3A2800', Icon: Truck          },
  delivered:  { label: 'Delivered',         color: '#34C759', bg: '#E8F8EE', dbg: '#0D2A1A', Icon: CheckCircle    },
  cancelled:  { label: 'Cancelled',         color: '#E31E24', bg: '#FFF0F0', dbg: '#3A1010', Icon: XCircle        },
  partial:    { label: 'Partial Delivery',  color: '#FF9500', bg: '#FFF3E0', dbg: '#3A2800', Icon: AlertCircle    },
};
const ORDER_TIMELINE: DistMgmtOrderStatus[] = ['draft','submitted','confirmed','shipped','delivered'];
const LOGO_COLORS: Record<string, { bg: string; dbg: string; text: string }> = {
  WH: { bg: '#EEF2FF', dbg: '#1A1A3A', text: '#4F46E5' },
  VW: { bg: '#F3F0FF', dbg: '#22133A', text: '#A855F7' },
  NR: { bg: '#FFF3E0', dbg: '#3A2800', text: '#FF9500' },
  KG: { bg: '#FFF0F0', dbg: '#3A1010', text: '#E31E24' },
  SA: { bg: '#E8F8EE', dbg: '#0D2A1A', text: '#34C759' },
  BP: { bg: '#F0F0F0', dbg: '#2A2A2A', text: '#8E8E93' },
};
function logoColor(logo: string, dm: boolean) {
  const c = LOGO_COLORS[logo] || { bg: '#F0F0F0', dbg: '#2A2A2A', text: '#8E8E93' };
  return { bg: dm ? c.dbg : c.bg, text: c.text };
}

// ─── Shared button styles ─────────────────────────────────────────────────────
function Btn({ label, onClick, icon: Icon, variant = 'ghost', size = 'sm', style: extra, disabled }: {
  label?: string; onClick?: () => void; icon?: React.ElementType; variant?: 'primary'|'ghost'|'danger'|'outline'; size?: 'sm'|'md'; style?: React.CSSProperties; disabled?: boolean;
}) {
  const base: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 7, border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: FF, fontWeight: 700, borderRadius: 10, whiteSpace: 'nowrap', opacity: disabled ? 0.4 : 1,
    padding: size === 'md' ? '0 20px' : '0 14px', height: size === 'md' ? 42 : 34, fontSize: size === 'md' ? 14 : 12,
  };
  const variants = {
    primary: { background: `linear-gradient(135deg,#C8161C,${RED})`, color: '#fff' },
    ghost:   { background: 'transparent', color: '#8E8E93' },
    danger:  { background: '#FFF0F0', color: RED },
    outline: { background: 'transparent', border: '1px solid rgba(0,0,0,0.12)', color: '#1d1d1f' },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...extra }}>
      {Icon && <Icon size={size === 'md' ? 14 : 12} />}{label}
    </button>
  );
}

// ─── Order status pill ────────────────────────────────────────────────────────
function StatusPill({ status, dm }: { status: DistMgmtOrderStatus; dm: boolean }) {
  const c = ORDER_STATUS_CFG[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: dm ? c.dbg : c.bg, color: c.color }}>
      <c.Icon size={9} /> {c.label}
    </span>
  );
}

// ─── Logo Avatar ─────────────────────────────────────────────────────────────
function LogoAvatar({ logo, dm, size = 36 }: { logo: string; dm: boolean; size?: number }) {
  const { bg, text } = logoColor(logo, dm);
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.28, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3, fontWeight: 900, color: text, flexShrink: 0 }}>
      {logo}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADD / EDIT DISTRIBUTOR MODAL
// ══════════════════════════════════════════════════════════════════════════════
function AddEditModal({ existing, onClose, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: {
  existing: DistContact | null; onClose: () => void; dm: boolean;
  CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}) {
  const { addDistContact, updateDistContact } = useDistributorStore();
  const [form, setForm] = useState<Omit<DistContact, 'id'>>({
    name: existing?.name || '', contactName: existing?.contactName || '',
    phone: existing?.phone || '', email: existing?.email || '',
    logo: existing?.logo || '', notes: existing?.notes || '',
    status: existing?.status || 'active', lastOrderDate: existing?.lastOrderDate || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldStyle: React.CSSProperties = { width: '100%', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FF, outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: MUTED, display: 'block', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.06em' };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (existing) {
      updateDistContact(existing.id, form);
    } else {
      addDistContact({ ...form, id: `dc${Date.now()}` });
    }
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ width: 480, background: CARD, borderRadius: 18, border: `1px solid ${BORDER}`, boxShadow: '0 24px 60px rgba(0,0,0,0.3)', overflow: 'hidden', fontFamily: FF }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: dm ? '#3A1010' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={15} style={{ color: RED }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>{existing ? 'Edit Distributor' : 'Add Distributor'}</span>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: INPUT_BG, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} style={{ color: MUTED }} />
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '65vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Company Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Werkhaus GmbH" style={{ ...fieldStyle, borderColor: errors.name ? RED : BORDER }} />
              {errors.name && <span style={{ fontSize: 10, color: RED }}>{errors.name}</span>}
            </div>
            <div>
              <label style={labelStyle}>Contact Name</label>
              <input value={form.contactName} onChange={e => setForm(f => ({ ...f, contactName: e.target.value }))} placeholder="e.g. Franz Kellner" style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Logo Initials</label>
              <input value={form.logo} onChange={e => setForm(f => ({ ...f, logo: e.target.value.toUpperCase().slice(0, 2) }))} placeholder="e.g. WH" maxLength={2} style={fieldStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="orders@company.de" type="email" style={{ ...fieldStyle, borderColor: errors.email ? RED : BORDER }} />
              {errors.email && <span style={{ fontSize: 10, color: RED }}>{errors.email}</span>}
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+49 89 …" style={fieldStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} placeholder="Internal notes…" style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: INPUT_BG, borderRadius: 10, padding: '10px 14px' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>Status</span>
              <button onClick={() => setForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 12, fontWeight: 700, color: form.status === 'active' ? '#34C759' : MUTED }}>
                {form.status === 'active' ? <ToggleRight size={20} style={{ color: '#34C759' }} /> : <ToggleLeft size={20} style={{ color: MUTED }} />}
                {form.status === 'active' ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Btn label="Cancel" onClick={onClose} variant="ghost" size="md" extra={{ color: MUTED } as any} />
          <Btn label={existing ? 'Save Changes' : 'Add Distributor'} onClick={handleSave} variant="primary" size="md" icon={Save} />
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// IMPORT MODAL (3 methods as tabs)
// ══════════════════════════════════════════════════════════════════════════════
function ImportModal({ distId, onClose, onImport, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: {
  distId: string; onClose: () => void; onImport: (rows: Partial<DistProduct>[]) => void;
  dm: boolean; CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}) {
  const [method, setMethod]       = useState<'csv' | 'paste'>('csv');
  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [pasteText, setPasteText] = useState('');
  const [pastePreview, setPastePreview] = useState<string[][]>([]);
  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState('');
  const [validRows, setValidRows] = useState<Partial<DistProduct>[]>([]);

  const FIELDS = ['name','sku','category','unit','packSize','unitPrice','casePrice','moq','inStock','notes'];
  const [mapping, setMapping]     = useState<Record<string, string>>({});
  const [headers, setHeaders]     = useState<string[]>([]);
  const [csvRows, setCsvRows]     = useState<string[][]>([]);

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n');
    const heads = lines[0].split(/,|\t/).map(h => h.trim().replace(/"/g, ''));
    const rows  = lines.slice(1).map(l => l.split(/,|\t/).map(c => c.trim().replace(/"/g, '')));
    setHeaders(heads);
    setCsvRows(rows);
    // auto-map
    const autoMap: Record<string, string> = {};
    FIELDS.forEach(f => {
      const match = heads.find(h => h.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(h.toLowerCase()));
      if (match) autoMap[f] = match;
    });
    setMapping(autoMap);
    setStep(2);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = ev => parseCSV(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handlePasteParse = () => {
    const lines = pasteText.trim().split('\n');
    const rows = lines.map(l => l.split('\t'));
    setPastePreview(rows);
    const mapped: Partial<DistProduct>[] = rows.map(r => ({
      distributorId: distId, name: r[0] || '', sku: r[1] || '',
      category: r[2] || 'Power Tools', unit: r[3] || 'each',
      packSize: Number(r[4]) || 1, unitPrice: parseFloat(r[5]) || 0,
      casePrice: parseFloat(r[6]) || 0, moq: Number(r[7]) || 1,
      inStock: (r[8] || '').toLowerCase() !== 'false', notes: r[9] || '',
      lastUpdated: new Date().toISOString().slice(0, 10),
    }));
    setValidRows(mapped.filter(r => r.name));
    setStep(3);
  };

  const buildFromMapping = () => {
    const rows: Partial<DistProduct>[] = csvRows.map(row => {
      const get = (field: string) => {
        const h = mapping[field]; if (!h) return '';
        const idx = headers.indexOf(h);
        return idx >= 0 ? row[idx] || '' : '';
      };
      return {
        distributorId: distId, name: get('name'), sku: get('sku'),
        category: get('category') || 'Power Tools', unit: get('unit') || 'each',
        packSize: Number(get('packSize')) || 1, unitPrice: parseFloat(get('unitPrice')) || 0,
        casePrice: parseFloat(get('casePrice')) || 0, moq: Number(get('moq')) || 1,
        inStock: get('inStock').toLowerCase() !== 'false', notes: get('notes'),
        lastUpdated: new Date().toISOString().slice(0, 10),
      };
    });
    const valid = rows.filter(r => r.name && r.sku);
    const invalid = rows.length - valid.length;
    setValidRows(valid);
    setStep(3);
    return { valid: valid.length, invalid };
  };

  const validCount = validRows.length;
  const warnCount  = validRows.filter(r => !r.sku).length;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        style={{ width: 600, background: CARD, borderRadius: 18, border: `1px solid ${BORDER}`, boxShadow: '0 24px 60px rgba(0,0,0,0.3)', fontFamily: FF, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Upload size={15} style={{ color: RED }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: TEXT }}>Import Products</span>
            {step > 1 && (
              <div style={{ display: 'flex', gap: 4 }}>
                {[1,2,3].map(s => (
                  <div key={s} style={{ width: 20, height: 4, borderRadius: 99, background: s <= step ? RED : (dm ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)') }} />
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: INPUT_BG, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} style={{ color: MUTED }} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {step === 1 && (
            <div style={{ padding: 20 }}>
              {/* Method tabs */}
              <div style={{ display: 'flex', gap: 4, background: INPUT_BG, borderRadius: 10, padding: 3, marginBottom: 20 }}>
                {([{ key: 'csv', label: '📄  Excel / CSV File' }, { key: 'paste', label: '📋  Paste from Clipboard' }] as const).map(m => (
                  <button key={m.key} onClick={() => setMethod(m.key)}
                    style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 12, fontWeight: method === m.key ? 800 : 500, background: method === m.key ? (dm ? '#333' : '#fff') : 'transparent', color: method === m.key ? TEXT : MUTED, transition: 'all 0.15s', boxShadow: method === m.key ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                    {m.label}
                  </button>
                ))}
              </div>

              {method === 'csv' ? (
                <div>
                  {/* Drop zone */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    style={{ border: `2px dashed ${dragOver ? RED : BORDER}`, borderRadius: 14, padding: '36px 20px', textAlign: 'center', background: dragOver ? (dm ? 'rgba(227,30,36,0.06)' : '#FFF0F0') : INPUT_BG, transition: 'all 0.2s', cursor: 'pointer' }}>
                    <FileSpreadsheet size={32} style={{ color: dragOver ? RED : MUTED, marginBottom: 10 }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 6px' }}>Drop your file here</p>
                    <p style={{ fontSize: 12, color: MUTED, margin: '0 0 14px' }}>Supports .xlsx and .csv</p>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 16px', borderRadius: 9, background: dm ? '#2A2A2A' : '#fff', border: `1px solid ${BORDER}`, cursor: 'pointer', fontSize: 12, fontWeight: 700, color: TEXT, fontFamily: FF }}>
                      <Upload size={12} /> Browse File
                      <input type="file" accept=".csv,.xlsx" style={{ display: 'none' }} onChange={e => {
                        const f = e.target.files?.[0]; if (!f) return;
                        setFileName(f.name);
                        const reader = new FileReader();
                        reader.onload = ev => parseCSV(ev.target?.result as string);
                        reader.readAsText(f);
                      }} />
                    </label>
                    {fileName && <p style={{ marginTop: 10, fontSize: 11, color: '#34C759', fontWeight: 700 }}>✓ {fileName} loaded</p>}
                  </div>
                  <div style={{ marginTop: 14, textAlign: 'center' }}>
                    <button style={{ fontSize: 12, color: MUTED, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <FileDown size={12} /> Download Template (.csv)
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
                    Copy rows from Excel or Google Sheets and paste below. Expected columns:
                    <span style={{ color: TEXT, fontWeight: 700 }}> Name · SKU · Category · Unit · Pack Size · Unit Price · Case Price · MOQ · In Stock · Notes</span>
                  </p>
                  <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} rows={8} placeholder="Paste your data here (tab-separated)…" style={{ width: '100%', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 12px', fontSize: 12, color: TEXT, fontFamily: 'monospace', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }} />
                  <div style={{ marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    <Btn label="Parse & Preview" onClick={handlePasteParse} variant="primary" size="md" icon={ClipboardList} disabled={!pasteText.trim()} />
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && method === 'csv' && (
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>Column Mapping</p>
              <p style={{ fontSize: 11, color: MUTED, margin: '0 0 16px' }}>Map your file headers to system fields. Required fields are marked *</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {FIELDS.map(field => {
                  const required = ['name','sku'].includes(field);
                  const mapped = mapping[field];
                  return (
                    <div key={field} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: 12, padding: '8px 12px', background: INPUT_BG, borderRadius: 9, border: `1px solid ${required && !mapped ? '#FF9500' : BORDER}` }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: mapped ? TEXT : MUTED }}>
                        {field}{required ? ' *' : ''}
                        {!mapped && required && <span style={{ fontSize: 10, color: '#FF9500', marginLeft: 6 }}>Unmapped</span>}
                      </span>
                      <select value={mapped || ''} onChange={e => setMapping(m => ({ ...m, [field]: e.target.value }))}
                        style={{ background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '5px 8px', fontSize: 12, color: TEXT, fontFamily: FF, outline: 'none' }}>
                        <option value="">— not mapped —</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  );
                })}
              </div>
              {/* Preview */}
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Data Preview (first 3 rows)</p>
              <div style={{ overflowX: 'auto', background: INPUT_BG, borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                  <thead>
                    <tr>{headers.map(h => <th key={h} style={{ padding: '7px 12px', textAlign: 'left', color: MUTED, fontWeight: 700, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {csvRows.slice(0, 3).map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j} style={{ padding: '6px 12px', color: TEXT, borderBottom: i < 2 ? `1px solid ${BORDER}` : 'none', whiteSpace: 'nowrap' }}>{cell}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                <Btn label="Validate →" onClick={() => buildFromMapping()} variant="primary" size="md" icon={Check} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ padding: 20 }}>
              {/* Validation summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Ready', val: validCount, color: '#34C759', bg: dm ? '#0D2A1A' : '#E8F8EE', Icon: CheckCircle },
                  { label: 'Warnings', val: warnCount, color: '#FF9500', bg: dm ? '#3A2800' : '#FFF3E0', Icon: AlertTriangle },
                  { label: 'Errors', val: 0, color: '#8E8E93', bg: INPUT_BG, Icon: XCircle },
                ].map(k => (
                  <div key={k.label} style={{ background: k.bg, borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                    <k.Icon size={18} style={{ color: k.color, marginBottom: 4 }} />
                    <p style={{ fontSize: 20, fontWeight: 900, color: k.color, margin: '0 0 2px' }}>{k.val}</p>
                    <p style={{ fontSize: 10, fontWeight: 700, color: k.color, margin: 0 }}>{k.label}</p>
                  </div>
                ))}
              </div>
              {/* Import mode */}
              <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Import Mode</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
                {[
                  { label: 'Update existing (match by SKU)', sub: 'New rows added, existing rows updated if SKU matches' },
                  { label: 'Add new only', sub: 'Skip any rows with duplicate SKUs' },
                  { label: 'Replace all products for this distributor', sub: 'Existing product list will be cleared first' },
                ].map((opt, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: i === 0 ? (dm ? 'rgba(227,30,36,0.08)' : '#FFF0F0') : INPUT_BG, borderRadius: 9, border: `1px solid ${i === 0 ? RED + '44' : BORDER}`, cursor: 'pointer' }}>
                    <input type="radio" name="importMode" defaultChecked={i === 0} style={{ marginTop: 2, accentColor: RED }} />
                    <div><p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: '0 0 2px' }}>{opt.label}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{opt.sub}</p></div>
                  </label>
                ))}
              </div>
              {/* Preview table */}
              {validRows.length > 0 && (
                <>
                  <p style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Preview ({Math.min(5, validCount)} of {validCount})</p>
                  <div style={{ overflowX: 'auto', background: INPUT_BG, borderRadius: 10, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                      <thead><tr>{['Name','SKU','Category','Unit Price'].map(h => <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: MUTED, fontWeight: 700, borderBottom: `1px solid ${BORDER}` }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {validRows.slice(0, 5).map((r, i) => (
                          <tr key={i} style={{ background: r.sku ? 'transparent' : (dm ? 'rgba(255,149,0,0.08)' : '#FFF8EC') }}>
                            <td style={{ padding: '6px 10px', color: TEXT }}>{r.name}</td>
                            <td style={{ padding: '6px 10px', color: r.sku ? TEXT : '#FF9500', fontWeight: r.sku ? 400 : 700 }}>{r.sku || '⚠ missing'}</td>
                            <td style={{ padding: '6px 10px', color: MUTED }}>{r.category}</td>
                            <td style={{ padding: '6px 10px', color: TEXT }}>€{fmt(r.unitPrice || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            {step > 1 && <Btn label="← Back" onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)} variant="ghost" size="md" extra={{ color: MUTED } as any} />}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn label="Cancel" onClick={onClose} variant="ghost" size="md" extra={{ color: MUTED } as any} />
            {step === 3 && (
              <Btn label={`Confirm Import (${validCount} rows)`} onClick={() => { onImport(validRows); onClose(); }} variant="primary" size="md" icon={CheckCircle} disabled={validCount === 0} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCT SPREADSHEET (inline-editable table)
// ══════════════��═══════════════════════════════════════════════════════════════
type EditingCell = { rowId: string; field: string } | null;

function ProductSpreadsheet({ products, distId, dm, TEXT, MUTED, BORDER, INPUT_BG, CARD }: {
  products: DistProduct[]; distId: string; dm: boolean;
  TEXT: string; MUTED: string; BORDER: string; INPUT_BG: string; CARD: string;
}) {
  const { updateDistProduct, deleteDistProduct, addDistProduct } = useDistributorStore();
  const [editing, setEditing]     = useState<EditingCell>(null);
  const [selected, setSelected]   = useState<Set<string>>(new Set());
  const [saving, setSaving]       = useState<string | null>(null);
  const [sortKey, setSortKey]     = useState<keyof DistProduct>('name');
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => [...products].sort((a, b) => {
    const av = String(a[sortKey]), bv = String(b[sortKey]);
    return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  }), [products, sortKey, sortDir]);

  const toggleSort = (key: keyof DistProduct) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };
  const SortIcon = ({ k }: { k: keyof DistProduct }) => (
    <span style={{ opacity: sortKey === k ? 1 : 0.3, marginLeft: 2 }}>
      {sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
    </span>
  );

  const handleChange = (id: string, field: string, value: string | number | boolean) => {
    setSaving(id);
    const updates: Partial<DistProduct> = { [field]: value, lastUpdated: new Date().toISOString().slice(0, 10) };
    if (field === 'unitPrice' && typeof value === 'number') {
      const p = products.find(p => p.id === id);
      if (p && p.casePrice === p.unitPrice * p.packSize) updates.casePrice = value * p.packSize;
    }
    updateDistProduct(id, updates);
    setTimeout(() => setSaving(null), 800);
  };

  const toggleSelect = (id: string) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected  = sorted.length > 0 && selected.size === sorted.length;
  const toggleAll    = () => setSelected(allSelected ? new Set() : new Set(sorted.map(p => p.id)));

  const bulkDelete = () => {
    selected.forEach(id => deleteDistProduct(id));
    setSelected(new Set());
  };

  const addRow = () => {
    addDistProduct({
      id: `dp${Date.now()}`, distributorId: distId, name: 'New Product', sku: `SKU-${Date.now()}`,
      category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 0, casePrice: 0, moq: 1,
      inStock: true, notes: '', lastUpdated: new Date().toISOString().slice(0, 10),
    });
  };

  const duplicateRow = (p: DistProduct) => {
    addDistProduct({ ...p, id: `dp${Date.now()}`, sku: `${p.sku}-COPY`, name: `${p.name} (Copy)` });
  };

  const TH = ({ label, k, width }: { label: string; k?: keyof DistProduct; width?: number }) => (
    <th onClick={k ? () => toggleSort(k) : undefined}
      style={{ padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap', cursor: k ? 'pointer' : 'default', userSelect: 'none', width: width || 'auto', position: 'sticky', top: 0, background: dm ? '#1c1c1e' : '#fff', zIndex: 2 }}>
      {label}{k && <SortIcon k={k} />}
    </th>
  );

  const EditCell = ({ row, field, type = 'text', prefix }: { row: DistProduct; field: string; type?: string; prefix?: string }) => {
    const val    = (row as any)[field];
    const isEdit = editing?.rowId === row.id && editing?.field === field;
    const ref    = useRef<HTMLInputElement>(null);
    if (isEdit) setTimeout(() => ref.current?.focus(), 10);
    return isEdit ? (
      <input ref={ref} defaultValue={val} type={type} autoFocus
        onBlur={e => { handleChange(row.id, field, type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value); setEditing(null); }}
        onKeyDown={e => { if (e.key === 'Escape') setEditing(null); if (e.key === 'Enter') { handleChange(row.id, field, type === 'number' ? parseFloat((e.target as HTMLInputElement).value) || 0 : (e.target as HTMLInputElement).value); setEditing(null); } }}
        style={{ width: '100%', background: dm ? '#222' : '#fff', border: `1.5px solid ${RED}`, borderRadius: 6, padding: '4px 7px', fontSize: 12, color: TEXT, fontFamily: FF, outline: 'none' }} />
    ) : (
      <span onClick={() => setEditing({ rowId: row.id, field })} style={{ display: 'block', cursor: 'text', padding: '4px 2px', borderRadius: 5, color: TEXT, fontSize: 12, minWidth: 40, minHeight: 20 }}>
        {prefix}{type === 'number' ? fmt(Number(val)) : String(val)}
      </span>
    );
  };

  return (
    <div>
      {/* Bulk action bar */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: dm ? '#2A2000' : '#FFF3E0', border: `1px solid #FF9500`, borderRadius: 10, marginBottom: 10, fontSize: 12, fontFamily: FF }}>
            <span style={{ fontWeight: 700, color: '#FF9500' }}>{selected.size} selected</span>
            <div style={{ flex: 1 }} />
            <Btn label="Duplicate" icon={Copy} onClick={() => { sorted.filter(p => selected.has(p.id)).forEach(duplicateRow); setSelected(new Set()); }} variant="ghost" />
            <Btn label="Delete Selected" icon={Trash2} onClick={bulkDelete} variant="danger" />
            <button onClick={() => setSelected(new Set())} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <X size={13} style={{ color: MUTED }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto-save indicator */}
      <AnimatePresence>
        {saving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', bottom: 24, right: 32, zIndex: 999, background: dm ? '#222' : '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '8px 14px', fontSize: 12, fontWeight: 700, color: TEXT, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={12} style={{ color: '#34C759', animation: 'spin 1s linear infinite' }} /> Saving…
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: `1px solid ${BORDER}`, borderRadius: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF, minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ padding: '8px 10px', width: 32, borderBottom: `1px solid ${BORDER}`, background: dm ? '#1c1c1e' : '#fff', position: 'sticky', top: 0, zIndex: 2 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: RED }} />
              </th>
              <TH label="Product Name" k="name" />
              <TH label="SKU" k="sku" />
              <TH label="Category" k="category" />
              <TH label="Unit" />
              <TH label="Pack" k="packSize" />
              <TH label="Unit Price" k="unitPrice" />
              <TH label="Case Price" k="casePrice" />
              <TH label="MOQ" k="moq" />
              <TH label="In Stock" k="inStock" />
              <TH label="Notes" />
              <TH label="Updated" k="lastUpdated" />
              <th style={{ padding: '8px 10px', width: 80, borderBottom: `1px solid ${BORDER}`, background: dm ? '#1c1c1e' : '#fff', position: 'sticky', top: 0, zIndex: 2 }} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr key={p.id} style={{ background: selected.has(p.id) ? (dm ? 'rgba(227,30,36,0.06)' : '#FFF8F8') : (i % 2 === 0 ? 'transparent' : (dm ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)')) }}>
                <td style={{ padding: '7px 10px', borderBottom: `1px solid ${BORDER}` }}>
                  <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} style={{ accentColor: RED }} />
                </td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 180 }}><EditCell row={p} field="name" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 110 }}><EditCell row={p} field="sku" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 110 }}><EditCell row={p} field="category" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 60 }}><EditCell row={p} field="unit" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 50 }}><EditCell row={p} field="packSize" type="number" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 90 }}><EditCell row={p} field="unitPrice" type="number" prefix="€" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 90 }}><EditCell row={p} field="casePrice" type="number" prefix="€" /></td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 50 }}><EditCell row={p} field="moq" type="number" /></td>
                <td style={{ padding: '7px 10px', borderBottom: `1px solid ${BORDER}` }}>
                  <button onClick={() => handleChange(p.id, 'inStock', !p.inStock)} style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none', background: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: p.inStock ? '#34C759' : '#E31E24', fontFamily: FF }}>
                    {p.inStock ? <CheckCircle size={13} /> : <XCircle size={13} />}
                    {p.inStock ? 'Yes' : 'No'}
                  </button>
                </td>
                <td style={{ padding: '4px 10px', borderBottom: `1px solid ${BORDER}`, minWidth: 140 }}><EditCell row={p} field="notes" /></td>
                <td style={{ padding: '7px 10px', borderBottom: `1px solid ${BORDER}`, fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>{fmtDate(p.lastUpdated)}</td>
                <td style={{ padding: '7px 10px', borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button title="Duplicate" onClick={() => duplicateRow(p)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: INPUT_BG, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Copy size={11} style={{ color: MUTED }} />
                    </button>
                    <button title="Delete" onClick={() => deleteDistProduct(p.id)} style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: INPUT_BG, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trash2 size={11} style={{ color: RED }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sorted.length === 0 && (
        <div style={{ padding: '32px 0', textAlign: 'center', color: MUTED }}>
          <Package size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>No products yet</p>
          <p style={{ fontSize: 12, margin: 0 }}>Add a row or import to get started</p>
        </div>
      )}
      <button onClick={addRow} style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 7, height: 34, padding: '0 14px', borderRadius: 9, border: `1.5px dashed ${BORDER}`, background: 'transparent', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: FF, transition: 'all 0.15s' }}>
        <Plus size={13} /> Add Row
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDER BUILDER
// ══════════════════════════════════════════════════════════════════════════════
function OrderBuilder({ dist, products, onClose, onSubmit, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: {
  dist: DistContact; products: DistProduct[]; onClose: () => void;
  onSubmit: (order: DistMgmtOrder) => void;
  dm: boolean; CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}) {
  const [qtys, setQtys]     = useState<Record<string, number>>({});
  const [notes, setNotes]   = useState<Record<string, string>>({});
  const [orderNote, setOrderNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const TAX_RATE = 0.19;
  const SHIPPING = 0;

  const lines = products.filter(p => (qtys[p.id] || 0) > 0);
  const subtotal = lines.reduce((s, p) => s + (qtys[p.id] || 0) * p.unitPrice, 0);
  const tax      = subtotal * TAX_RATE;
  const total    = subtotal + tax + SHIPPING;
  const totalItems = lines.reduce((s, p) => s + (qtys[p.id] || 0), 0);
  const totalCases = lines.reduce((s, p) => s + Math.ceil((qtys[p.id] || 0) / p.packSize), 0);

  const handleSubmit = () => {
    if (lines.length === 0) return;
    const order: DistMgmtOrder = {
      id: `dmo${Date.now()}`, distributorId: dist.id, status: 'submitted',
      createdAt: new Date().toISOString().slice(0, 10), expectedDate: '',
      subtotal, tax, shipping: SHIPPING, total, note: orderNote,
      items: lines.map((p, i) => ({
        id: `dmi${Date.now()}${i}`, orderId: `dmo${Date.now()}`,
        productId: p.id, productName: p.name, sku: p.sku,
        quantity: qtys[p.id], unitPrice: p.unitPrice, lineTotal: qtys[p.id] * p.unitPrice,
        note: notes[p.id] || '',
      })),
    };
    onSubmit(order);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 12, fontFamily: FF }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: dm ? '#0D2A1A' : '#E8F8EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CheckCircle size={26} style={{ color: '#34C759' }} />
      </div>
      <p style={{ fontSize: 18, fontWeight: 900, color: TEXT, margin: 0 }}>Order Submitted!</p>
      <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Total: €{fmt(total)} · {totalItems} items</p>
      <Btn label="Back to Distributor" onClick={onClose} variant="primary" size="md" />
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 20, fontFamily: FF }}>
      {/* Left — product list */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {products.map(p => {
            const qty = qtys[p.id] || 0;
            return (
              <div key={p.id} style={{ background: qty > 0 ? (dm ? 'rgba(227,30,36,0.06)' : '#FFF8F8') : INPUT_BG, border: `1px solid ${qty > 0 ? RED + '33' : BORDER}`, borderRadius: 12, padding: '12px 14px', transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0', display: 'flex', gap: 8 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Hash size={9} />{p.sku}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><DollarSign size={9} />€{fmt(p.unitPrice)} / {p.unit}</span>
                      {!p.inStock && <span style={{ color: RED, fontWeight: 700 }}>⚠ Out of stock</span>}
                    </p>
                  </div>
                  {/* Qty stepper */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => setQtys(q => ({ ...q, [p.id]: Math.max(0, (q[p.id] || 0) - 1) }))}
                      style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${BORDER}`, background: INPUT_BG, cursor: 'pointer', fontSize: 16, color: TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                    <input type="number" min={0} value={qty || ''} placeholder="0" onChange={e => setQtys(q => ({ ...q, [p.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                      style={{ width: 52, textAlign: 'center', background: INPUT_BG, border: `1px solid ${qty > 0 ? RED : BORDER}`, borderRadius: 7, padding: '4px 6px', fontSize: 13, color: TEXT, fontFamily: FF, outline: 'none' }} />
                    <button onClick={() => setQtys(q => ({ ...q, [p.id]: (q[p.id] || 0) + 1 }))}
                      style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${BORDER}`, background: qty > 0 ? RED : INPUT_BG, cursor: 'pointer', fontSize: 16, color: qty > 0 ? '#fff' : TEXT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                  </div>
                  {qty > 0 && (
                    <span style={{ fontSize: 13, fontWeight: 800, color: TEXT, minWidth: 70, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>€{fmt(qty * p.unitPrice)}</span>
                  )}
                </div>
                {qty > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <input value={notes[p.id] || ''} onChange={e => setNotes(n => ({ ...n, [p.id]: e.target.value }))} placeholder="Line note…"
                      style={{ width: '100%', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 7, padding: '5px 10px', fontSize: 11, color: MUTED, fontFamily: FF, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED }}>
            <Package size={26} style={{ opacity: 0.3, marginBottom: 8 }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>No products in catalogue</p>
          </div>
        )}
      </div>

      {/* Right — sticky summary */}
      <div style={{ width: 260, flexShrink: 0 }}>
        <div style={{ position: 'sticky', top: 20, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}` }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Order Summary</p>
          </div>
          <div style={{ padding: '14px 16px' }}>
            {/* Line items */}
            {lines.length === 0 ? (
              <p style={{ fontSize: 12, color: MUTED, margin: '0 0 12px', textAlign: 'center' }}>Add products to begin</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                {lines.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: MUTED, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name} ×{qtys[p.id]}</span>
                    <span style={{ color: TEXT, fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>€{fmt(qtys[p.id] * p.unitPrice)}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Totals */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                { label: 'Subtotal', val: `€${fmt(subtotal)}` },
                { label: `VAT (19%)`, val: `€${fmt(tax)}` },
                { label: 'Shipping', val: SHIPPING ? `€${fmt(SHIPPING)}` : 'Free' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: MUTED }}>{r.label}</span>
                  <span style={{ color: TEXT, fontWeight: 700 }}>{r.val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 900, color: RED, fontVariantNumeric: 'tabular-nums' }}>€{fmt(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUTED }}>
                <span>{totalItems} items</span>
                <span>{totalCases} cases</span>
              </div>
            </div>
            {/* Note */}
            <div style={{ marginTop: 12 }}>
              <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={2} placeholder="Order note…"
                style={{ width: '100%', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 10px', fontSize: 11, color: TEXT, fontFamily: FF, resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <button onClick={handleSubmit} disabled={lines.length === 0}
              style={{ marginTop: 10, width: '100%', height: 40, borderRadius: 10, border: 'none', background: lines.length > 0 ? `linear-gradient(135deg,#C8161C,${RED})` : BORDER, color: lines.length > 0 ? '#fff' : MUTED, fontSize: 13, fontWeight: 800, cursor: lines.length > 0 ? 'pointer' : 'not-allowed', fontFamily: FF }}>
              Submit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDER DETAIL SLIDE-OVER
// ══════════════════════════════════════════════════════════════════════════════
function OrderDetailPanel({ order, distName, onClose, onReorder, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: {
  order: DistMgmtOrder; distName: string; onClose: () => void; onReorder: () => void;
  dm: boolean; CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}) {
  const { updateDistOrder } = useDistributorStore();
  const cfg = ORDER_STATUS_CFG[order.status];
  const timelineStatuses = ORDER_TIMELINE;
  const curStep = timelineStatuses.indexOf(order.status);

  const activityLog = [
    { time: fmtDate(order.createdAt), action: 'Order created', icon: Plus },
    ...(order.status !== 'draft' ? [{ time: fmtDate(order.createdAt), action: 'Order submitted to Werkhaus Berlin GmbH', icon: ClipboardList }] : []),
    ...((['confirmed','shipped','delivered','partial'] as DistMgmtOrderStatus[]).includes(order.status) ? [{ time: fmtDate(order.createdAt), action: 'Order confirmed by distributor', icon: ClipboardCheck }] : []),
    ...((['shipped','delivered','partial'] as DistMgmtOrderStatus[]).includes(order.status) ? [{ time: order.expectedDate ? fmtDate(order.expectedDate) : '—', action: 'Shipment dispatched', icon: Truck }] : []),
    ...((['delivered'] as DistMgmtOrderStatus[]).includes(order.status) ? [{ time: order.expectedDate ? fmtDate(order.expectedDate) : '—', action: 'Delivered in full', icon: CheckCircle }] : []),
  ];

  return (
    <motion.div initial={{ x: 480, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 480, opacity: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: dm ? '#111' : '#f8f8fa', borderLeft: `1px solid ${BORDER}`, boxShadow: '-12px 0 40px rgba(0,0,0,0.2)', zIndex: 200, overflowY: 'auto', fontFamily: FF }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg,#C8161C,${RED})`, padding: '22px 20px 18px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={14} color="#fff" />
        </button>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Order Detail</p>
        <p style={{ fontSize: 20, fontWeight: 900, color: '#fff', margin: '0 0 4px' }}>{order.id}</p>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: 0 }}>{distName} · {fmtDate(order.createdAt)}</p>
      </div>

      <div style={{ padding: 18 }}>
        {/* Status + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <StatusPill status={order.status} dm={dm} />
          <div style={{ flex: 1 }} />
          {order.status === 'draft' && <Btn label="Edit" icon={Edit2} variant="outline" />}
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <Btn label="Cancel" icon={XCircle} variant="danger" onClick={() => updateDistOrder(order.id, { status: 'cancelled' })} />
          )}
          <Btn label="Reorder" icon={RefreshCw} onClick={onReorder} variant="primary" />
          <Btn label="Export" icon={FileDown} variant="ghost" />
        </div>

        {/* Order timeline */}
        {order.status !== 'cancelled' && (
          <div style={{ background: INPUT_BG, borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>Order Progress</p>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {timelineStatuses.map((s, i) => {
                const done    = i <= curStep && order.status !== 'cancelled';
                const current = i === curStep;
                const c       = ORDER_STATUS_CFG[s];
                return (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                    {i > 0 && <div style={{ position: 'absolute', top: 13, left: 0, width: '50%', height: 3, background: i <= curStep ? RED : BORDER }} />}
                    {i < timelineStatuses.length - 1 && <div style={{ position: 'absolute', top: 13, right: 0, width: '50%', height: 3, background: i < curStep ? RED : BORDER }} />}
                    <div style={{ width: 26, height: 26, borderRadius: '50%', border: `2.5px solid ${done ? RED : BORDER}`, background: done ? (dm ? '#3A1010' : '#FFF0F0') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                      {done ? <Check size={12} style={{ color: RED }} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: BORDER }} />}
                    </div>
                    <span style={{ fontSize: 9, fontWeight: current ? 800 : 500, color: current ? RED : MUTED, marginTop: 5, textAlign: 'center', lineHeight: 1.3 }}>{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Line items */}
        <div style={{ background: INPUT_BG, borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Line Items ({order.items.length})</span>
          </div>
          {order.items.map((item, i) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderBottom: i < order.items.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{item.productName}</p>
                <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{item.sku} · ×{item.quantity} · €{fmt(item.unitPrice)} each</p>
                {item.note && <p style={{ fontSize: 10, color: MUTED, margin: '3px 0 0', fontStyle: 'italic' }}>{item.note}</p>}
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: TEXT, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>€{fmt(item.lineTotal)}</span>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{ background: INPUT_BG, borderRadius: 14, padding: '12px 14px', marginBottom: 14 }}>
          {[
            { label: 'Subtotal', val: `€${fmt(order.subtotal)}` },
            { label: 'VAT (19%)', val: `€${fmt(order.tax)}` },
            { label: 'Shipping', val: order.shipping ? `€${fmt(order.shipping)}` : 'Free' },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ color: MUTED }}>{r.label}</span><span style={{ fontWeight: 700, color: TEXT }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 900, color: RED, fontVariantNumeric: 'tabular-nums' }}>€{fmt(order.total)}</span>
          </div>
          {order.note && <p style={{ marginTop: 10, padding: '8px 10px', background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderRadius: 8, fontSize: 11, color: MUTED, margin: '10px 0 0', fontStyle: 'italic' }}>"{order.note}"</p>}
        </div>

        {/* Activity log */}
        <div style={{ background: INPUT_BG, borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Activity</span>
          </div>
          {activityLog.map((log, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderBottom: i < activityLog.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: dm ? '#3A1010' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <log.icon size={11} style={{ color: RED }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, color: TEXT, margin: '0 0 2px' }}>{log.action}</p>
                <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>{log.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
type MainView = 'list' | 'detail' | 'orders';

export default function WebDistributors() {
  const {
    darkMode, distContacts, distProducts, distOrders,
    deleteDistContact, addDistProduct, addDistOrder,
  } = useDistributorStore();
  const dm = darkMode;

  const BG       = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD     = dm ? '#1c1c1e' : '#ffffff';
  const BORDER   = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT     = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED    = dm ? '#636366' : '#8E8E93';
  const SHADOW   = dm ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.07)';
  const INPUT_BG = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  // ── View state ──────────────────────────────────────────────────────────────
  const [view,         setView]         = useState<MainView>('list');
  const [selectedDist, setSelectedDist] = useState<DistContact | null>(null);
  const [detailTab,    setDetailTab]    = useState<'products' | 'orders'>('products');
  const [showAddEdit,  setShowAddEdit]  = useState(false);
  const [editTarget,   setEditTarget]   = useState<DistContact | null>(null);
  const [showImport,   setShowImport]   = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DistMgmtOrder | null>(null);
  const [showDeleteId,  setShowDeleteId]  = useState<string | null>(null);
  const [showCreateOrder,     setShowCreateOrder]     = useState(false);
  const [createOrderDistId,   setCreateOrderDistId]   = useState<string | undefined>(undefined);
  const [preloadItems,        setPreloadItems]        = useState<{ productId: string; quantity: number }[] | undefined>(undefined);

  // ── Directory filters ───────────────────────────────────────────────────────
  const [query,        setQuery]        = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortKey,      setSortKey]      = useState<keyof DistContact>('name');
  const [sortDir,      setSortDir]      = useState<'asc' | 'desc'>('asc');

  // ── Orders tab filters ──────────────────────────────────────────────────────
  const [ordersQuery,  setOrdersQuery]  = useState('');
  const [ordersStatus, setOrdersStatus] = useState<string>('all');
  const [ordersDist,   setOrdersDist]   = useState<string>('all');

  const productsForDist = useCallback((id: string) => distProducts.filter(p => p.distributorId === id), [distProducts]);
  const ordersForDist   = useCallback((id: string) => distOrders.filter(o => o.distributorId === id), [distOrders]);

  const filteredContacts = useMemo(() => {
    let list = distContacts;
    if (statusFilter !== 'all') list = list.filter(c => c.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || productsForDist(c.id).some(p => p.name.toLowerCase().includes(q)));
    }
    return [...list].sort((a, b) => {
      const av = String(a[sortKey]), bv = String(b[sortKey]);
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [distContacts, statusFilter, query, sortKey, sortDir, productsForDist]);

  const filteredOrders = useMemo(() => {
    let list = distOrders;
    if (ordersStatus !== 'all') list = list.filter(o => o.status === ordersStatus);
    if (ordersDist  !== 'all') list = list.filter(o => o.distributorId === ordersDist);
    if (ordersQuery.trim()) {
      const q = ordersQuery.toLowerCase();
      list = list.filter(o => o.id.toLowerCase().includes(q) || distContacts.find(c => c.id === o.distributorId)?.name.toLowerCase().includes(q) || o.items.some(i => i.productName.toLowerCase().includes(q)));
    }
    return list;
  }, [distOrders, ordersStatus, ordersDist, ordersQuery, distContacts]);

  const toggleSort = (k: keyof DistContact) => {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };
  const SortIcon = ({ k }: { k: keyof DistContact }) => (
    <span style={{ opacity: sortKey === k ? 1 : 0.3, marginLeft: 2 }}>
      {sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
    </span>
  );

  const kpiSharedProps = { dm, CARD, BORDER, TEXT, MUTED, INPUT_BG };
  const totalOrderValue = distOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const activeCount     = distContacts.filter(c => c.status === 'active').length;
  const pendingOrders   = distOrders.filter(o => ['submitted','confirmed','shipped'].includes(o.status)).length;
  const lowStockCount   = distProducts.filter(p => !p.inStock).length;

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 28, fontFamily: FF }}>

      {/* ── Modals (always above everything) ── */}
      <AnimatePresence>
        {showAddEdit && (
          <AddEditModal existing={editTarget} onClose={() => { setShowAddEdit(false); setEditTarget(null); }}
            dm={dm} CARD={CARD} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} INPUT_BG={INPUT_BG} />
        )}
        {showImport && selectedDist && (
          <ImportModal distId={selectedDist.id} onClose={() => setShowImport(false)}
            onImport={rows => rows.forEach(r => addDistProduct({ ...r as DistProduct, id: `dp${Date.now()}${Math.random()}` }))}
            dm={dm} CARD={CARD} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} INPUT_BG={INPUT_BG} />
        )}
        {showCreateOrder && (
          <CreateOrderModal
            initialDistId={createOrderDistId}
            preloadItems={preloadItems}
            onClose={() => { setShowCreateOrder(false); setPreloadItems(undefined); }}
            onSuccess={oid => {
              setShowCreateOrder(false);
              setPreloadItems(undefined);
              if (createOrderDistId) {
                const d = distContacts.find(c => c.id === createOrderDistId);
                if (d) { setSelectedDist(d); setDetailTab('orders'); setView('detail'); }
              } else {
                setView('orders');
              }
            }}
            dm={dm} CARD={CARD} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} INPUT_BG={INPUT_BG}
          />
        )}
        {selectedOrder && (
          <OrderDetailPanel
            order={selectedOrder}
            distName={distContacts.find(c => c.id === selectedOrder.distributorId)?.name || ''}
            onClose={() => setSelectedOrder(null)}
            onReorder={() => {
              setPreloadItems(selectedOrder.items.map(i => ({ productId: i.productId, quantity: i.quantity })));
              setCreateOrderDistId(selectedOrder.distributorId);
              setSelectedOrder(null);
              setShowCreateOrder(true);
            }}
            dm={dm} CARD={CARD} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} INPUT_BG={INPUT_BG} />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: 22 }}>
        {/* Breadcrumb */}
        {view !== 'list' && view !== 'orders' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 12, color: MUTED }}>
            <button onClick={() => { setView('list'); setSelectedDist(null); }} style={{ border: 'none', background: 'none', cursor: 'pointer', color: MUTED, fontFamily: FF, fontSize: 12, padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Building2 size={11} /> Distributors
            </button>
            {selectedDist && <><ChevronRight size={11} /><span style={{ color: TEXT, fontWeight: 700 }}>{selectedDist.name}</span></>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {view === 'detail' && (
              <button onClick={() => { setView('list'); setSelectedDist(null); }}
                style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowLeft size={14} style={{ color: MUTED }} />
              </button>
            )}
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#C8161C,#E31E24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={17} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>
                {view === 'list' && 'Distributors'}
                {view === 'orders' && 'All Orders'}
                {view === 'detail' && selectedDist?.name}
              </h1>
              <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>
                {view === 'list'   && 'Manage your re-distributor network and product catalogues'}
                {view === 'orders' && 'Global view of all distributor purchase orders'}
                {view === 'detail' && `${selectedDist?.email} · ${selectedDist?.phone}`}
              </p>
            </div>
          </div>

          {/* View-specific actions */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {view === 'list' && (
              <>
                <div style={{ display: 'flex', background: INPUT_BG, borderRadius: 9, padding: 2, gap: 2 }}>
                  {(['list', 'orders'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)}
                      style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 11, fontWeight: view === v ? 800 : 500, background: view === v ? (dm ? '#333' : '#fff') : 'transparent', color: view === v ? TEXT : MUTED }}>
                      {v === 'list' ? '🏢 Distributors' : '📦 All Orders'}
                    </button>
                  ))}
                </div>
                <Btn label="+ Add Distributor" onClick={() => { setEditTarget(null); setShowAddEdit(true); }} variant="primary" size="md" icon={Plus} />
              </>
            )}
            {view === 'orders' && (
              <div style={{ display: 'flex', background: INPUT_BG, borderRadius: 9, padding: 2, gap: 2 }}>
                {(['list', 'orders'] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    style={{ padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 11, fontWeight: view === v ? 800 : 500, background: view === v ? (dm ? '#333' : '#fff') : 'transparent', color: view === v ? TEXT : MUTED }}>
                    {v === 'list' ? '🏢 Distributors' : '📦 All Orders'}
                  </button>
                ))}
              </div>
            )}
            {view === 'detail' && selectedDist && (
              <>
                <Btn label="Edit" icon={Edit2} onClick={() => { setEditTarget(selectedDist); setShowAddEdit(true); }} variant="outline" size="md" extra={{ border: `1px solid ${BORDER}`, color: TEXT, background: CARD } as any} />
                <Btn label="Import Products" icon={Upload} onClick={() => setShowImport(true)} variant="outline" size="md" extra={{ border: `1px solid ${BORDER}`, color: TEXT, background: CARD } as any} />
                <Btn label="Create Order" icon={ShoppingCart} onClick={() => { setCreateOrderDistId(selectedDist.id); setPreloadItems(undefined); setShowCreateOrder(true); }} variant="primary" size="md" />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          KPI STRIP (list / orders views)
      ══════════════════════════════════════════════════════════ */}
      {(view === 'list' || view === 'orders') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Active Distributors', val: String(activeCount), sub: `${distContacts.length - activeCount} inactive`, Icon: Building2, color: '#007AFF', dbg: '#0A1A3A', lbg: '#EFF6FF' },
            { label: 'Total Order Value', val: `€${(totalOrderValue / 1000).toFixed(1)}k`, sub: `${distOrders.filter(o => o.status !== 'cancelled').length} orders placed`, Icon: ShoppingCart, color: '#34C759', dbg: '#0D2A1A', lbg: '#E8F8EE' },
            { label: 'Pending Orders', val: String(pendingOrders), sub: 'submitted / confirmed / shipped', Icon: Truck, color: '#FF9500', dbg: '#3A2800', lbg: '#FFF3E0' },
            { label: 'Out-of-Stock Items', val: String(lowStockCount), sub: 'across all distributor catalogues', Icon: AlertTriangle, color: lowStockCount > 0 ? RED : '#34C759', dbg: lowStockCount > 0 ? '#3A1010' : '#0D2A1A', lbg: lowStockCount > 0 ? '#FFF0F0' : '#E8F8EE' },
          ].map(k => (
            <div key={k.label} style={{ background: CARD, borderRadius: 16, padding: '14px 16px', border: `1px solid ${BORDER}`, boxShadow: SHADOW }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: dm ? k.dbg : k.lbg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <k.Icon size={13} style={{ color: k.color }} />
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: '0 0 2px', fontVariantNumeric: 'tabular-nums' }}>{k.val}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: k.color, margin: '0 0 3px' }}>{k.label}</p>
              <p style={{ fontSize: 10, color: MUTED, margin: 0 }}>{k.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          DIRECTORY VIEW (list)
      ══════════════════════════════════════════════════════════ */}
      {view === 'list' && (
        <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 8, background: INPUT_BG, borderRadius: 10, padding: '8px 13px' }}>
              <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, contact, product…"
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: TEXT, flex: 1, fontFamily: FF }} />
              {query && <button onClick={() => setQuery('')} style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex' }}><X size={12} style={{ color: MUTED }} /></button>}
            </div>
            {(['all', 'active', 'inactive'] as const).map(f => (
              <button key={f} onClick={() => setStatusFilter(f)}
                style={{ height: 32, padding: '0 13px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 11, fontWeight: 600, background: statusFilter === f ? RED : INPUT_BG, color: statusFilter === f ? '#fff' : MUTED, textTransform: 'capitalize' }}>
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredContacts.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF }}>
                <thead>
                  <tr>
                    {[
                      { label: 'Distributor', k: 'name' as keyof DistContact },
                      { label: 'Contact Info', k: undefined },
                      { label: 'Products', k: undefined },
                      { label: 'Last Order', k: 'lastOrderDate' as keyof DistContact },
                      { label: 'Status', k: 'status' as keyof DistContact },
                      { label: 'Create Order', k: undefined },
                      { label: 'Actions', k: undefined },
                    ].map(col => (
                      <th key={col.label} onClick={col.k ? () => toggleSort(col.k!) : undefined}
                        style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${BORDER}`, cursor: col.k ? 'pointer' : 'default', whiteSpace: 'nowrap', userSelect: 'none' }}>
                        {col.label}{col.k && <SortIcon k={col.k} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.map((c, i) => {
                    const products = productsForDist(c.id);
                    const orders   = ordersForDist(c.id);
                    const lc       = logoColor(c.logo, dm);
                    return (
                      <tr key={c.id} style={{ borderBottom: i < filteredContacts.length - 1 ? `1px solid ${BORDER}` : 'none', transition: 'background 0.12s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        {/* Name + logo */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => { setSelectedDist(c); setView('detail'); }}>
                            <LogoAvatar logo={c.logo} dm={dm} />
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>{c.name}</p>
                              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{c.contactName}</p>
                            </div>
                          </div>
                        </td>
                        {/* Contact */}
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontSize: 11, color: TEXT, margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}><Mail size={10} style={{ color: MUTED }} />{c.email}</p>
                          <p style={{ fontSize: 11, color: MUTED, margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={10} />{c.phone}</p>
                        </td>
                        {/* Products count */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: TEXT }}>{products.length}</span>
                            <span style={{ fontSize: 11, color: MUTED }}>SKUs</span>
                            {products.some(p => !p.inStock) && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: RED, background: dm ? '#3A1010' : '#FFF0F0', padding: '2px 6px', borderRadius: 99 }}>
                                {products.filter(p => !p.inStock).length} OOS
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{orders.length} orders</p>
                        </td>
                        {/* Last order */}
                        <td style={{ padding: '12px 16px' }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: c.lastOrderDate ? TEXT : MUTED, margin: 0 }}>{c.lastOrderDate ? fmtDate(c.lastOrderDate) : '—'}</p>
                        </td>
                        {/* Status */}
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: c.status === 'active' ? (dm ? '#0D2A1A' : '#E8F8EE') : INPUT_BG, color: c.status === 'active' ? '#34C759' : MUTED }}>
                            {c.status === 'active' ? <CheckCircle size={9} /> : <Clock size={9} />}
                            {c.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        {/* Create Order */}
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            title="Create Order"
                            onClick={() => { setCreateOrderDistId(c.id); setPreloadItems(undefined); setShowCreateOrder(true); }}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 6,
                              height: 32, padding: '0 14px', borderRadius: 9, border: 'none',
                              background: `linear-gradient(135deg,#C8161C,${RED})`,
                              color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer',
                              fontFamily: FF, whiteSpace: 'nowrap',
                              boxShadow: '0 2px 8px rgba(227,30,36,0.3)',
                              transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                          >
                            <ShoppingCart size={12} /> New Order
                          </button>
                        </td>
                        {/* Actions */}
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button title="View" onClick={() => { setSelectedDist(c); setView('detail'); }}
                              style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Eye size={12} style={{ color: MUTED }} />
                            </button>
                            <button title="Edit" onClick={() => { setEditTarget(c); setShowAddEdit(true); }}
                              style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Edit2 size={12} style={{ color: MUTED }} />
                            </button>
                            <button title="Delete" onClick={() => setShowDeleteId(c.id)}
                              style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Trash2 size={12} style={{ color: RED }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty state */
            <div style={{ padding: '60px 20px', textAlign: 'center', fontFamily: FF }}>
              <div style={{ width: 64, height: 64, borderRadius: 18, background: dm ? '#2A2A2A' : '#F2F2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Building2 size={28} style={{ color: MUTED }} />
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: TEXT, margin: '0 0 6px' }}>{query ? 'No distributors found' : 'No distributors yet'}</p>
              <p style={{ fontSize: 13, color: MUTED, margin: '0 0 20px' }}>{query ? 'Try a different search' : 'Add your first re-distributor to get started'}</p>
              {!query && <Btn label="+ Add Distributor" onClick={() => { setEditTarget(null); setShowAddEdit(true); }} variant="primary" size="md" icon={Plus} />}
            </div>
          )}

          {/* Inline delete confirm */}
          <AnimatePresence>
            {showDeleteId && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                  style={{ background: CARD, borderRadius: 16, padding: '24px 24px 20px', width: 360, textAlign: 'center', border: `1px solid ${BORDER}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: dm ? '#3A1010' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Trash2 size={20} style={{ color: RED }} />
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 800, color: TEXT, margin: '0 0 6px', fontFamily: FF }}>Delete Distributor?</p>
                  <p style={{ fontSize: 13, color: MUTED, margin: '0 0 20px', fontFamily: FF }}>This will permanently remove the distributor and their product catalogue. This action cannot be undone.</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <Btn label="Cancel" onClick={() => setShowDeleteId(null)} variant="ghost" size="md" extra={{ color: MUTED } as any} />
                    <Btn label="Delete" icon={Trash2} onClick={() => { deleteDistContact(showDeleteId!); setShowDeleteId(null); }} variant="primary" size="md" extra={{ background: RED } as any} />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ALL ORDERS VIEW
      ══════════════════════════════════════════════════════════ */}
      {view === 'orders' && (
        <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${BORDER}`, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: INPUT_BG, borderRadius: 10, padding: '8px 13px' }}>
              <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
              <input value={ordersQuery} onChange={e => setOrdersQuery(e.target.value)} placeholder="Search order ID, distributor, product…"
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: TEXT, flex: 1, fontFamily: FF }} />
            </div>
            {/* Distributor filter */}
            <select value={ordersDist} onChange={e => setOrdersDist(e.target.value)}
              style={{ height: 36, padding: '0 10px', borderRadius: 9, border: `1px solid ${BORDER}`, background: INPUT_BG, color: TEXT, fontFamily: FF, fontSize: 12, outline: 'none' }}>
              <option value="all">All distributors</option>
              {distContacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {/* Status filter */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {(['all', 'draft', 'submitted', 'confirmed', 'shipped', 'delivered', 'partial', 'cancelled'] as const).map(s => (
                <button key={s} onClick={() => setOrdersStatus(s)}
                  style={{ height: 30, padding: '0 11px', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 10, fontWeight: 600, background: ordersStatus === s ? RED : INPUT_BG, color: ordersStatus === s ? '#fff' : MUTED, textTransform: 'capitalize' }}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
            <Btn label="+ New Order" icon={Plus} onClick={() => { setCreateOrderDistId(undefined); setPreloadItems(undefined); setShowCreateOrder(true); }} variant="primary" size="md" />
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF }}>
              <thead>
                <tr>
                  {['Order #', 'Distributor', 'Date Created', 'Status', 'Items', 'Total', 'Expected Delivery', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o, i) => {
                  const dist = distContacts.find(c => c.id === o.distributorId);
                  return (
                    <tr key={o.id} style={{ borderBottom: i < filteredOrders.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td style={{ padding: '11px 16px', fontSize: 12, fontWeight: 800, color: TEXT }}>{o.id}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {dist && <LogoAvatar logo={dist.logo} dm={dm} size={26} />}
                          <span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{dist?.name || '—'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: MUTED }}>{fmtDate(o.createdAt)}</td>
                      <td style={{ padding: '11px 16px' }}><StatusPill status={o.status} dm={dm} /></td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: TEXT }}>{o.items.reduce((s, i) => s + i.quantity, 0)} units</td>
                      <td style={{ padding: '11px 16px', fontSize: 13, fontWeight: 800, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</td>
                      <td style={{ padding: '11px 16px', fontSize: 12, color: MUTED }}>{o.expectedDate ? fmtDate(o.expectedDate) : '—'}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button title="View Details" onClick={() => setSelectedOrder(o)}
                            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={12} style={{ color: MUTED }} />
                          </button>
                          <button title="Go to Distributor" onClick={() => { const d = distContacts.find(c => c.id === o.distributorId); if (d) { setSelectedDist(d); setView('detail'); setDetailTab('orders'); } }}
                            style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ChevronRight size={12} style={{ color: MUTED }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', color: MUTED }}>
                <ShoppingCart size={28} style={{ opacity: 0.3, marginBottom: 10 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>No orders found</p>
                <p style={{ fontSize: 12, margin: 0 }}>Adjust your filters</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          DISTRIBUTOR DETAIL VIEW
      ══════════════════════════════════════════════════════════ */}
      {view === 'detail' && selectedDist && (
        <div>
          {/* Contact info card */}
          <div style={{ background: CARD, borderRadius: 18, padding: '18px 20px', border: `1px solid ${BORDER}`, boxShadow: SHADOW, marginBottom: 18, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <LogoAvatar logo={selectedDist.logo} dm={dm} size={52} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: TEXT, margin: 0 }}>{selectedDist.name}</h2>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: selectedDist.status === 'active' ? (dm ? '#0D2A1A' : '#E8F8EE') : INPUT_BG, color: selectedDist.status === 'active' ? '#34C759' : MUTED }}>
                    {selectedDist.status === 'active' ? <CheckCircle size={9} /> : <Clock size={9} />}
                    {selectedDist.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  {[
                    { Icon: Mail,  val: selectedDist.email },
                    { Icon: Phone, val: selectedDist.phone },
                  ].map(r => r.val ? (
                    <span key={r.val} style={{ fontSize: 12, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <r.Icon size={11} style={{ flexShrink: 0 }} />{r.val}
                    </span>
                  ) : null)}
                </div>
                {selectedDist.notes && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: MUTED, background: INPUT_BG, borderRadius: 8, padding: '6px 10px', maxWidth: 500, lineHeight: 1.5 }}>
                    <StickyNote size={10} style={{ marginRight: 5, verticalAlign: 'middle' }} />{selectedDist.notes}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>
                €{fmt(ordersForDist(selectedDist.id).filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0))}
              </span>
              <span style={{ fontSize: 11, color: MUTED }}>Total order value</span>
            </div>
          </div>

          {/* Detail tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, marginBottom: 16 }}>
            {([{ key: 'products', label: '📦  Products', count: productsForDist(selectedDist.id).length }, { key: 'orders', label: '🛒  Orders', count: ordersForDist(selectedDist.id).length }] as const).map(t => (
              <button key={t.key} onClick={() => setDetailTab(t.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 18px', border: 'none', cursor: 'pointer', background: 'none', fontFamily: FF, fontSize: 13, fontWeight: detailTab === t.key ? 800 : 500, color: detailTab === t.key ? RED : MUTED, borderBottom: detailTab === t.key ? `2.5px solid ${RED}` : '2.5px solid transparent', transition: 'all 0.15s' }}>
                {t.label}
                <span style={{ padding: '1px 7px', borderRadius: 99, fontSize: 10, fontWeight: 800, background: detailTab === t.key ? (dm ? '#3A1010' : '#FFF0F0') : INPUT_BG, color: detailTab === t.key ? RED : MUTED }}>{t.count}</span>
              </button>
            ))}
          </div>

          {/* Products tab */}
          {detailTab === 'products' && (
            <div style={{ background: CARD, borderRadius: 18, padding: '18px 20px', border: `1px solid ${BORDER}`, boxShadow: SHADOW }}>
              <ProductSpreadsheet products={productsForDist(selectedDist.id)} distId={selectedDist.id} dm={dm} TEXT={TEXT} MUTED={MUTED} BORDER={BORDER} INPUT_BG={INPUT_BG} CARD={CARD} />
            </div>
          )}

          {/* Orders tab */}
          {detailTab === 'orders' && (
            <div style={{ background: CARD, borderRadius: 18, border: `1px solid ${BORDER}`, boxShadow: SHADOW, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>Orders from {selectedDist.name}</span>
                <Btn label="New Order" icon={Plus} onClick={() => { setCreateOrderDistId(selectedDist.id); setPreloadItems(undefined); setShowCreateOrder(true); }} variant="primary" />
              </div>
              {ordersForDist(selectedDist.id).length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center', color: MUTED, fontFamily: FF }}>
                  <ShoppingCart size={26} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>No orders yet</p>
                  <Btn label="Create First Order" onClick={() => { setCreateOrderDistId(selectedDist.id); setPreloadItems(undefined); setShowCreateOrder(true); }} variant="primary" size="md" style={{ marginTop: 10 }} />
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: FF }}>
                    <thead>
                      <tr>
                        {['Order ID', 'Date', 'Status', 'Items', 'Total', 'ETA', ''].map(h => (
                          <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ordersForDist(selectedDist.id).map((o, i, arr) => (
                        <tr key={o.id} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none', cursor: 'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <td style={{ padding: '10px 16px', fontSize: 12, fontWeight: 800, color: TEXT }}>{o.id}</td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: MUTED }}>{fmtDate(o.createdAt)}</td>
                          <td style={{ padding: '10px 16px' }}><StatusPill status={o.status} dm={dm} /></td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: TEXT }}>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                          <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 800, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</td>
                          <td style={{ padding: '10px 16px', fontSize: 12, color: MUTED }}>{o.expectedDate ? fmtDate(o.expectedDate) : '—'}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <button onClick={() => setSelectedOrder(o)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`, background: CARD, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Eye size={12} style={{ color: MUTED }} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
