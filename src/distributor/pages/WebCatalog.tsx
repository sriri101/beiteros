import { useState, useMemo, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search, X, Truck, AlertTriangle, Check, Plus, Minus,
  ShoppingCart, LayoutGrid, List, Clock, Eye, TrendingUp,
  Package, Zap, BarChart2, ShieldCheck, Settings2,
  Info, Save, RotateCcw,
} from 'lucide-react';
import { useDistributorStore, CatalogProduct, StockOrder } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type CategoryFilter = 'all' | string;
type ViewMode = 'grid' | 'table';

function fmt(n: number)    { return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtInt(n: number) { return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }); }

const STOCK_CFG = {
  in_stock:     { label: 'In Stock',     color: '#34C759', bgLight: '#E8F8EE', bgDark: '#0D2A1A' },
  low_stock:    { label: 'Low Stock',    color: '#FF9500', bgLight: '#FFF3E0', bgDark: '#3A2800' },
  out_of_stock: { label: 'Out of Stock', color: '#E31E24', bgLight: '#FFEEEE', bgDark: '#3A0D0D' },
};

const ORDER_STATUS_CFG: Record<string, { label: string; color: string }> = {
  processing: { label: 'Processing', color: '#6366F1' },
  shipped:    { label: 'Shipped',    color: '#FF9500' },
  delivered:  { label: 'Delivered',  color: '#34C759' },
  cancelled:  { label: 'Cancelled',  color: '#E31E24' },
};

/* ── Warranty label ── */
function warrantyLabel(m: number) {
  if (m < 12) return `${m} mo.`;
  if (m % 12 === 0) return `${m / 12} yr${m / 12 > 1 ? 's' : ''}`;
  return `${Math.floor(m / 12)}y ${m % 12}m`;
}

const WARRANTY_PRESETS = [6, 12, 24, 36, 48, 60];

/* ── Micro bar ── */
function MicroBar({ pct, color, dm }: { pct: number; color: string; dm: boolean }) {
  return (
    <div style={{ height: 4, background: dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 99, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: color, borderRadius: 99, transition: 'width 1s ease' }} />
    </div>
  );
}

/* ── Circular progress (SVG) ── */
function CircProg({ value, max, color, size = 40, dm }: { value: number; max: number; color: string; size?: number; dm: boolean }) {
  const pct  = max > 0 ? Math.min(value / max, 1) : 0;
  const r    = (size - 5) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'} strokeWidth={4} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════
   SETTINGS TAB
   ══════════════════════════════════════════════════════ */
function SettingsTab({ product, dm }: { product: CatalogProduct; dm: boolean }) {
  const { updateCatalogProduct } = useDistributorStore();

  const TEXT     = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED    = dm ? '#636366' : '#8E8E93';
  const CARD     = dm ? '#1c1c1e' : '#ffffff';
  const BORDER   = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const INPUT_BG = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  /* Warranty state */
  const [warrantyMonths, setWarrantyMonths] = useState(product.warranty_months);
  const [customInput,    setCustomInput]    = useState('');
  const [showCustom,     setShowCustom]     = useState(false);
  const [warrantySaved,  setWarrantySaved]  = useState(false);

  /* MSRP state */
  const [msrpInput,   setMsrpInput]   = useState(product.msrp.toFixed(2).replace('.', ','));
  const [msrpSaved,   setMsrpSaved]   = useState(false);
  const [msrpConfirm, setMsrpConfirm] = useState(false);
  const msrpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setWarrantyMonths(product.warranty_months);
    setCustomInput(''); setShowCustom(false); setWarrantySaved(false);
    setMsrpInput(product.msrp.toFixed(2).replace('.', ',')); setMsrpSaved(false); setMsrpConfirm(false);
  }, [product.id]);

  /* Derived */
  const parsedMsrp  = parseFloat(msrpInput.replace(',', '.')) || 0;
  const cost        = product.distributor_price;
  const origMsrp    = product.msrp;
  const origProfit  = origMsrp - cost;
  const origMargin  = origMsrp > 0 ? (origProfit / origMsrp) * 100 : 0;
  const newProfit   = parsedMsrp - cost;
  const newMargin   = parsedMsrp > 0 ? (newProfit / parsedMsrp) * 100 : 0;
  const marginDelta = newMargin - origMargin;
  const msrpChanged = Math.abs(parsedMsrp - origMsrp) > 0.01;
  const msrpValid   = parsedMsrp > cost && parsedMsrp > 0;

  const saveWarranty = () => {
    updateCatalogProduct(product.id, { warranty_months: warrantyMonths });
    setWarrantySaved(true);
    setTimeout(() => setWarrantySaved(false), 2500);
  };
  const saveMsrp = () => {
    if (!msrpValid) return;
    updateCatalogProduct(product.id, { msrp: parsedMsrp });
    setMsrpSaved(true); setMsrpConfirm(false);
    setTimeout(() => setMsrpSaved(false), 2500);
  };

  const sectionLabel = (t: string) => (
    <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>{t}</p>
  );
  const statusBar = (pct: number, color: string) => (
    <div style={{ height: 6, background: dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(Math.max(pct, 0), 100)}%`, background: color, borderRadius: 99, transition: 'width 0.7s ease' }} />
    </div>
  );

  return (
    <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ────────────── WARRANTY SECTION ────────────── */}
      <div style={{ background: CARD, borderRadius: 16, padding: 18, border: `1px solid ${BORDER}` }}>

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          {sectionLabel('Warranty Configuration')}
          <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: dm ? '#0D2A1A' : '#E8F8EE', color: '#34C759', display: 'flex', alignItems: 'center', gap: 4, marginTop: -12 }}>
            <ShieldCheck size={10} /> {warrantyLabel(warrantyMonths)}
          </span>
        </div>

        {/* ── Duration quick-picks ── */}
        <p style={{ fontSize: 11, color: MUTED, margin: '0 0 8px', fontWeight: 600 }}>Duration</p>
        <div style={{ display: 'flex', gap: 5, marginBottom: 14, flexWrap: 'wrap' }}>
          {WARRANTY_PRESETS.map((m) => {
            const active = warrantyMonths === m && !showCustom;
            return (
              <button
                key={m}
                onClick={() => { setWarrantyMonths(m); setShowCustom(false); setCustomInput(''); }}
                style={{
                  flex: '1 0 auto', minWidth: 44, height: 36, borderRadius: 9,
                  border: `1.5px solid ${active ? '#E31E24' : BORDER}`,
                  background: active ? (dm ? '#3A1010' : '#FFF0F0') : INPUT_BG,
                  color: active ? '#E31E24' : TEXT,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FF, transition: 'all 0.15s',
                }}
              >
                {warrantyLabel(m)}
              </button>
            );
          })}
          <button
            onClick={() => setShowCustom(true)}
            style={{
              flex: '1 0 auto', minWidth: 60, height: 36, borderRadius: 9,
              border: `1.5px solid ${showCustom ? '#E31E24' : BORDER}`,
              background: showCustom ? (dm ? '#3A1010' : '#FFF0F0') : INPUT_BG,
              color: showCustom ? '#E31E24' : MUTED,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FF,
            }}
          >
            Custom
          </button>
        </div>

        {/* Custom month input */}
        <AnimatePresence>
          {showCustom && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, background: INPUT_BG, borderRadius: 10, padding: '8px 14px', border: `1.5px solid ${BORDER}` }}>
                  <input
                    type="number" min="1" max="120"
                    value={customInput}
                    onChange={(e) => { setCustomInput(e.target.value); const v = parseInt(e.target.value); if (v > 0 && v <= 120) setWarrantyMonths(v); }}
                    placeholder="e.g. 9"
                    style={{ background: 'none', border: 'none', outline: 'none', fontSize: 16, color: TEXT, flex: 1, fontFamily: FF, fontWeight: 900, width: 60 }}
                  />
                  <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>months</span>
                </div>
                {customInput && parseInt(customInput) > 0 && (
                  <span style={{ fontSize: 13, color: TEXT, fontWeight: 700, whiteSpace: 'nowrap' }}>= {warrantyLabel(parseInt(customInput))}</span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Coverage bar */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>Coverage</span>
            <span style={{ fontSize: 10, color: TEXT, fontWeight: 700 }}>{warrantyMonths} months</span>
          </div>
          {(() => {
            const barColor = warrantyMonths >= 24 ? '#34C759' : warrantyMonths >= 12 ? '#FF9500' : '#E31E24';
            return statusBar((warrantyMonths / 60) * 100, barColor);
          })()}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
            <span style={{ fontSize: 9, color: MUTED }}>Short (6 mo.)</span>
            <span style={{ fontSize: 9, color: MUTED }}>Standard (12 mo.)</span>
            <span style={{ fontSize: 9, color: MUTED }}>Extended (60 mo.)</span>
          </div>
        </div>

        {/* ── Coverage feedback ── */}
        <AnimatePresence mode="wait">
          {warrantyMonths < 12 && (
            <motion.div key="short" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ background: dm ? '#3A1010' : '#FFF0F0', borderRadius: 10, padding: '10px 13px', display: 'flex', gap: 8, alignItems: 'flex-start', border: '1px solid rgba(227,30,36,0.2)' }}>
                <AlertTriangle size={13} style={{ color: '#E31E24', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: '#E31E24', margin: 0, fontWeight: 600 }}>Short coverage — below 12 months. Consider extending for stronger customer confidence.</p>
              </div>
            </motion.div>
          )}
          {warrantyMonths >= 12 && warrantyMonths < 24 && (
            <motion.div key="standard" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ background: dm ? '#3A2800' : '#FFF3E0', borderRadius: 10, padding: '10px 13px', display: 'flex', gap: 8, alignItems: 'flex-start', border: '1px solid rgba(255,149,0,0.2)' }}>
                <Info size={13} style={{ color: '#FF9500', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: '#FF9500', margin: 0, fontWeight: 600 }}>Standard coverage. Extending to 24+ months increases buyer confidence and reduces claims disputes.</p>
              </div>
            </motion.div>
          )}
          {warrantyMonths >= 24 && (
            <motion.div key="strong" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ background: dm ? '#0D2A1A' : '#E8F8EE', borderRadius: 10, padding: '10px 13px', display: 'flex', gap: 8, alignItems: 'flex-start', border: '1px solid rgba(52,199,89,0.2)' }}>
                <Check size={13} style={{ color: '#34C759', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: '#34C759', margin: 0, fontWeight: 600 }}>Strong coverage — 24+ months builds trust and positions BEITER competitively in any market.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={saveWarranty}
          style={{
            width: '100%', height: 42, borderRadius: 11, border: 'none', cursor: 'pointer', fontFamily: FF,
            background: warrantySaved ? (dm ? '#0D2A1A' : '#E8F8EE') : 'linear-gradient(135deg, #1A8A4A, #34C759)',
            color: warrantySaved ? '#34C759' : '#fff', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
          }}
        >
          {warrantySaved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Warranty Settings</>}
        </button>
      </div>

      {/* ────────────── MSRP CALCULATOR SECTION ────────────── */}
      <div style={{ background: CARD, borderRadius: 16, padding: 18, border: `1px solid ${BORDER}` }}>
        {sectionLabel('MSRP & Profit Calculator')}

        {/* Fixed cost */}
        <div style={{ background: INPUT_BG, borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366F1' }} />
            <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>Your cost (fixed)</span>
          </div>
          <span style={{ fontSize: 16, fontWeight: 900, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>€{fmt(cost)}</span>
        </div>

        {/* MSRP input */}
        <p style={{ fontSize: 11, color: MUTED, margin: '0 0 8px', fontWeight: 600 }}>Retail Price (MSRP)</p>
        <div style={{
          display: 'flex', alignItems: 'center', borderRadius: 11, overflow: 'hidden', marginBottom: 6,
          border: `2px solid ${msrpChanged ? '#E31E24' : BORDER}`,
          boxShadow: msrpChanged ? `0 0 0 3px rgba(227,30,36,0.12)` : 'none',
          background: INPUT_BG, transition: 'box-shadow 0.2s, border-color 0.2s',
        }}>
          <span style={{ padding: '0 14px', fontSize: 18, color: MUTED, fontWeight: 700, userSelect: 'none' }}>€</span>
          <input
            ref={msrpRef}
            type="text"
            value={msrpInput}
            onChange={(e) => { setMsrpInput(e.target.value); setMsrpSaved(false); setMsrpConfirm(false); }}
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 24, fontWeight: 900, color: '#E31E24', fontFamily: FF, padding: '11px 0', fontVariantNumeric: 'tabular-nums', minWidth: 0 }}
          />
          {msrpChanged && (
            <button onClick={() => { setMsrpInput(origMsrp.toFixed(2).replace('.', ',')); setMsrpConfirm(false); }} style={{ padding: '0 14px', background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', alignItems: 'center' }}>
              <RotateCcw size={14} />
            </button>
          )}
        </div>
        {!msrpValid && parsedMsrp > 0 && (
          <p style={{ fontSize: 11, color: '#E31E24', margin: '0 0 10px', fontWeight: 600 }}>⚠ MSRP must exceed your cost of €{fmt(cost)}</p>
        )}
        {(msrpValid || !parsedMsrp) && <div style={{ height: 10 }} />}

        {/* Comparison table */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderBottom: `1px solid ${BORDER}` }}>
            {['Metric', 'Current', 'New'].map((h, i) => (
              <div key={h} style={{ padding: '8px 12px', fontSize: 9, fontWeight: 700, color: i === 2 ? '#E31E24' : MUTED, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>
          {[
            { label: 'MSRP',        curr: `€${fmt(origMsrp)}`,       next: `€${fmt(parsedMsrp || origMsrp)}`,                                               nextColor: msrpChanged ? '#E31E24' : TEXT },
            { label: 'Profit / unit',curr: `€${fmt(origProfit)}`,     next: msrpValid ? `€${fmt(newProfit)}` : '—',                                          nextColor: newProfit >= origProfit ? '#34C759' : '#FF9500' },
            { label: 'Margin %',     curr: `${origMargin.toFixed(1)}%`, next: msrpValid ? `${newMargin.toFixed(1)}%` : '—',                                   nextColor: newMargin >= origMargin ? '#34C759' : '#FF9500' },
            { label: 'Δ Change',     curr: '—',                        next: msrpChanged && msrpValid ? `${marginDelta >= 0 ? '+' : ''}${marginDelta.toFixed(1)}%` : '—', nextColor: marginDelta >= 0 ? '#34C759' : '#E31E24' },
          ].map((row, ri) => (
            <div key={row.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: ri < 3 ? `1px solid ${BORDER}` : 'none' }}>
              <div style={{ padding: '10px 12px', fontSize: 11, color: MUTED, fontWeight: 600 }}>{row.label}</div>
              <div style={{ padding: '10px 12px', fontSize: 12, fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{row.curr}</div>
              <div style={{ padding: '10px 12px', fontSize: 12, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: row.nextColor }}>{row.next}</div>
            </div>
          ))}
        </div>

        {/* Visual margin bars */}
        {msrpValid && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>Current margin</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: TEXT }}>{origMargin.toFixed(1)}%</span>
            </div>
            {statusBar(origMargin, '#8E8E93')}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>New margin</span>
                {msrpChanged && (
                  <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 99, fontWeight: 700, background: marginDelta >= 0 ? (dm ? '#0D2A1A' : '#E8F8EE') : (dm ? '#3A1010' : '#FFF0F0'), color: marginDelta >= 0 ? '#34C759' : '#E31E24' }}>
                    {marginDelta >= 0 ? '+' : ''}{marginDelta.toFixed(1)}%
                  </span>
                )}
              </div>
              <span style={{ fontSize: 11, fontWeight: 900, color: marginDelta >= 0 ? '#34C759' : '#FF9500' }}>{newMargin.toFixed(1)}%</span>
            </div>
            {statusBar(newMargin, marginDelta >= 0 ? '#34C759' : '#FF9500')}
          </div>
        )}

        {/* Confirm flow */}
        {!msrpConfirm ? (
          <button
            onClick={() => { if (msrpValid && msrpChanged) setMsrpConfirm(true); }}
            disabled={!msrpValid || !msrpChanged}
            style={{
              width: '100%', height: 42, borderRadius: 11, border: 'none', fontFamily: FF, cursor: (!msrpValid || !msrpChanged) ? 'not-allowed' : 'pointer',
              background: msrpSaved ? (dm ? '#0D2A1A' : '#E8F8EE') : (!msrpValid || !msrpChanged) ? (dm ? '#2a2a2a' : '#e8e8e8') : 'linear-gradient(135deg, #C8161C, #E31E24)',
              color: msrpSaved ? '#34C759' : (!msrpValid || !msrpChanged) ? '#8E8E93' : '#fff',
              fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s',
            }}
          >
            {msrpSaved ? <><Check size={14} /> MSRP Updated!</> : <>Preview &amp; Validate</>}
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ background: dm ? '#2A1010' : '#FFF0F0', borderRadius: 12, padding: 16, border: '1.5px solid rgba(227,30,36,0.3)' }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: '0 0 6px' }}>Confirm MSRP Change</p>
            <p style={{ fontSize: 12, color: MUTED, margin: '0 0 14px', lineHeight: 1.5 }}>
              Update <strong style={{ color: TEXT }}>{product.model}</strong> from{' '}
              <strong style={{ color: TEXT }}>€{fmt(origMsrp)}</strong> → <strong style={{ color: '#E31E24' }}>€{fmt(parsedMsrp)}</strong>.{' '}
              Margin: <strong style={{ color: TEXT }}>{origMargin.toFixed(1)}%</strong> → <strong style={{ color: marginDelta >= 0 ? '#34C759' : '#E31E24' }}>{newMargin.toFixed(1)}%</strong>
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setMsrpConfirm(false)} style={{ flex: 1, height: 38, borderRadius: 9, border: `1px solid ${BORDER}`, background: 'none', color: MUTED, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FF }}>Cancel</button>
              <button onClick={saveMsrp} style={{ flex: 2, height: 38, borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #C8161C, #E31E24)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Check size={14} /> Validate &amp; Apply
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRODUCT PANEL — tabbed slide-over (Order | Settings)
   ══════════════════════════════════════════════════════ */
function ProductPanel({ product, onClose, dm }: { product: CatalogProduct; onClose: () => void; dm: boolean }) {
  const { addOrder } = useDistributorStore();
  const [tab,     setTab]     = useState<'order' | 'settings'>('order');
  const [qty,     setQty]     = useState(product.min_order);
  const [ordered, setOrdered] = useState(false);

  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const sc     = STOCK_CFG[product.stock_level];
  const scBg   = dm ? sc.bgDark : sc.bgLight;
  const margin = Math.round((1 - product.distributor_price / product.msrp) * 100);

  useEffect(() => { setQty(product.min_order); setOrdered(false); setTab('order'); }, [product.id]);

  const placeOrder = () => {
    const order: StockOrder = {
      id: 'ord_' + Date.now(),
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery: new Date(Date.now() + product.lead_time_days * 86400000).toISOString().split('T')[0],
      status: 'processing',
      total: qty * product.distributor_price,
      invoice_number: 'INV-2025-' + Math.floor(1000 + Math.random() * 9000),
      items: [{ model: product.model, qty, unit_price: product.distributor_price }],
    };
    addOrder(order);
    setOrdered(true);
  };

  return (
    <motion.div
      initial={{ x: 480, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 480, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 460, background: dm ? '#111111' : '#f8f8fa', borderLeft: `1px solid ${BORDER}`, boxShadow: dm ? '-16px 0 60px rgba(0,0,0,0.7)' : '-16px 0 60px rgba(0,0,0,0.14)', zIndex: 100, display: 'flex', flexDirection: 'column', fontFamily: FF }}
    >
      {/* Hero */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img src={product.image_url} alt={product.model} style={{ width: '100%', height: 196, objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <X size={14} color="#fff" />
        </button>
        <span style={{ position: 'absolute', top: 14, left: 14, padding: '4px 10px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: scBg, color: sc.color }}>● {sc.label}</span>
        <span style={{ position: 'absolute', top: 44, left: 14, padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: 'rgba(52,199,89,0.2)', color: '#34C759', border: '1px solid rgba(52,199,89,0.35)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <ShieldCheck size={9} /> {warrantyLabel(product.warranty_months)} warranty
        </span>
        <div style={{ position: 'absolute', bottom: 14, left: 18 }}>
          <p style={{ color: '#E31E24', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{product.category}</p>
          <p style={{ color: '#fff', fontSize: 19, fontWeight: 900, margin: '3px 0 0', letterSpacing: '-0.02em' }}>{product.full_name}</p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: '3px 0 0' }}>SKU: {product.sku} · {product.battery_platform}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', background: dm ? '#1a1a1a' : '#f0f0f5', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        {([
          { key: 'order',    label: 'Place Order',      Icon: ShoppingCart },
          { key: 'settings', label: 'Product Settings', Icon: Settings2    },
        ] as const).map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 700,
              background: tab === key ? (dm ? '#111' : '#fff') : 'transparent',
              color: tab === key ? '#E31E24' : MUTED,
              borderBottom: tab === key ? '2.5px solid #E31E24' : '2.5px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {tab === 'order' ? (
            <motion.div key="order" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.16 }}>
              <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Prices */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'Your Price', val: `€${fmt(product.distributor_price)}`, color: '#E31E24', sub: 'per unit' },
                    { label: 'MSRP',       val: `€${fmt(product.msrp)}`,             color: TEXT,      sub: `${margin}% margin` },
                  ].map((p) => (
                    <div key={p.label} style={{ background: CARD, borderRadius: 13, padding: '14px 16px', border: `1px solid ${BORDER}` }}>
                      <p style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 7px' }}>{p.label}</p>
                      <p style={{ fontSize: 24, fontWeight: 900, color: p.color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{p.val}</p>
                      <p style={{ fontSize: 12, color: MUTED, margin: '4px 0 0' }}>{p.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[
                    { label: 'Stock',      val: `${product.stock}`,              color: sc.color },
                    { label: 'Min. Order', val: `${product.min_order} u`,        color: TEXT },
                    { label: 'Lead Time',  val: `${product.lead_time_days}d`,    color: TEXT },
                  ].map((m) => (
                    <div key={m.label} style={{ background: CARD, borderRadius: 10, padding: '10px 12px', border: `1px solid ${BORDER}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 18, fontWeight: 900, color: m.color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{m.val}</p>
                      <p style={{ fontSize: 11, color: MUTED, margin: '4px 0 0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</p>
                    </div>
                  ))}
                </div>

                {/* Warranty strip */}
                <div style={{ background: dm ? '#0D2A1A' : '#E8F8EE', borderRadius: 12, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid rgba(52,199,89,0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={14} style={{ color: '#34C759' }} />
                    <span style={{ fontSize: 12, color: '#34C759', fontWeight: 700 }}>Warranty Period</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#34C759' }}>{warrantyLabel(product.warranty_months)}</span>
                    <button onClick={() => setTab('settings')} style={{ padding: '3px 10px', borderRadius: 7, background: 'rgba(52,199,89,0.2)', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: '#34C759', fontFamily: FF }}>Edit</button>
                  </div>
                </div>

                {/* Order controls */}
                {ordered ? (
                  <div style={{ padding: 18, borderRadius: 14, background: dm ? '#0D2A1A' : '#E8F8EE', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(52,199,89,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={20} color="#34C759" />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#34C759', margin: 0 }}>Order placed!</p>
                      <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>ETA {product.lead_time_days} business days</p>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: CARD, borderRadius: 14, padding: 18, border: `1px solid ${BORDER}` }}>
                    <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>Place Order</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: TEXT, fontWeight: 600 }}>Quantity</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button onClick={() => setQty((q) => Math.max(product.min_order, q - 1))} style={{ width: 34, height: 34, borderRadius: 9, background: dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Minus size={14} color={TEXT} />
                        </button>
                        <span style={{ fontSize: 22, fontWeight: 900, color: TEXT, minWidth: 36, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                        <button onClick={() => setQty((q) => q + 1)} style={{ width: 34, height: 34, borderRadius: 9, background: dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={14} color={TEXT} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontSize: 13, color: MUTED }}>Total</span>
                      <span style={{ fontSize: 26, fontWeight: 900, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>€{fmt(qty * product.distributor_price)}</span>
                    </div>
                    <button
                      onClick={placeOrder}
                      disabled={product.stock_level === 'out_of_stock'}
                      style={{ width: '100%', height: 50, borderRadius: 13, background: product.stock_level === 'out_of_stock' ? (dm ? '#2a2a2a' : '#e0e0e0') : 'linear-gradient(135deg, #C8161C, #E31E24)', border: 'none', cursor: product.stock_level === 'out_of_stock' ? 'not-allowed' : 'pointer', color: product.stock_level === 'out_of_stock' ? MUTED : '#fff', fontSize: 15, fontWeight: 700, fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      <ShoppingCart size={16} />
                      {product.stock_level === 'out_of_stock' ? 'Out of Stock' : 'Place Order'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div key="settings" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.16 }}>
              <SettingsTab product={product} dm={dm} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   PRODUCT CARD
   ══════════════════════════════════════════════════════ */
function ProductCard({ p, isSelected, onSelect, onQuickView, dm }: {
  p: CatalogProduct; isSelected: boolean; onSelect: () => void; onQuickView: () => void; dm: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const sc     = STOCK_CFG[p.stock_level];
  const scBg   = dm ? sc.bgDark : sc.bgLight;
  const margin = Math.round((1 - p.distributor_price / p.msrp) * 100);
  const isOOS  = p.stock_level === 'out_of_stock';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={onSelect}
      style={{
        background: CARD, borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        border: `1.5px solid ${isSelected ? '#E31E24' : BORDER}`,
        boxShadow: hovered
          ? (dm ? '0 20px 48px rgba(0,0,0,0.5)' : '0 20px 48px rgba(0,0,0,0.14)')
          : (dm ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.06)'),
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', overflow: 'hidden', height: 188 }}>
        <img src={p.image_url} alt={p.model} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)' }} />
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: scBg, color: sc.color }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.color, display: 'inline-block' }} />{sc.label}
          </span>
        </div>
        {/* Warranty chip on image */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: 'rgba(52,199,89,0.2)', color: '#34C759', border: '1px solid rgba(52,199,89,0.3)', backdropFilter: 'blur(4px)' }}>
            <ShieldCheck size={10} />{warrantyLabel(p.warranty_months)}
          </span>
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
          <p style={{ color: '#E31E24', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', margin: 0 }}>{p.category}</p>
          <p style={{ color: '#fff', fontSize: 18, fontWeight: 900, margin: '3px 0 0' }}>{p.model}</p>
        </div>
        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backdropFilter: 'blur(2px)', pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <button onClick={(e) => { e.stopPropagation(); onQuickView(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#1d1d1f', fontFamily: FF }}>
            <Eye size={13} /> Quick View
          </button>
          <button onClick={(e) => { e.stopPropagation(); onSelect(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 10, background: '#E31E24', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: FF, opacity: isOOS ? 0.5 : 1 }}>
            <ShoppingCart size={13} /> Order
          </button>
        </motion.div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
          <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.45, flex: 1 }}>{p.full_name}</p>
          <span style={{ flexShrink: 0, padding: '3px 9px', borderRadius: 8, fontSize: 11, fontWeight: 700, background: dm ? '#0D2A1A' : '#E8F8EE', color: '#34C759' }}>{margin}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 11, color: MUTED, margin: '0 0 3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Price</p>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#E31E24', margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(p.distributor_price)}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: MUTED, margin: '0 0 3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>MSRP</p>
            <p style={{ fontSize: 16, fontWeight: 700, color: MUTED, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(p.msrp)}</p>
          </div>
        </div>
        <div style={{ height: 1, background: BORDER, margin: '0 0 12px' }} />
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Stock</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: sc.color, fontVariantNumeric: 'tabular-nums' }}>{p.stock}</span>
            </div>
            <MicroBar pct={(p.stock / 20) * 100} color={sc.color} dm={dm} />
          </div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircProg value={p.units_sold_mtd} max={p.units_sold_ytd} color="#E31E24" size={40} dm={dm} />
              <span style={{ position: 'absolute', fontSize: 10, fontWeight: 900, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{p.units_sold_mtd}</span>
            </div>
            <span style={{ fontSize: 10, color: MUTED, fontWeight: 600, marginTop: 3 }}>MTD</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>YTD</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 900, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{p.units_sold_ytd}</span>
                <TrendingUp size={10} color="#34C759" />
              </div>
            </div>
            <MicroBar pct={(p.units_sold_ytd / 70) * 100} color="#34C759" dm={dm} />
          </div>
        </div>
        <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={12} style={{ color: MUTED }} />
          <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>{p.battery_platform}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   QUICK VIEW MODAL
   ══════════════════════════════════════════════════════ */
function QuickViewModal({ product, onClose, onOrder, dm }: { product: CatalogProduct; onClose: () => void; onOrder: () => void; dm: boolean }) {
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const sc     = STOCK_CFG[product.stock_level];
  const scBg   = dm ? sc.bgDark : sc.bgLight;
  const margin = Math.round((1 - product.distributor_price / product.msrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: CARD, borderRadius: 24, overflow: 'hidden', width: '100%', maxWidth: 780, boxShadow: '0 32px 80px rgba(0,0,0,0.35)', fontFamily: FF, display: 'flex', maxHeight: '90vh' }}
      >
        <div style={{ width: 320, flexShrink: 0, position: 'relative', background: '#111' }}>
          <img src={product.image_url} alt={product.model} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.92 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
          <span style={{ position: 'absolute', top: 20, left: 20, padding: '5px 12px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: scBg, color: sc.color }}>● {sc.label}</span>
          <span style={{ position: 'absolute', top: 50, left: 20, padding: '3px 9px', borderRadius: 99, fontSize: 9, fontWeight: 700, background: 'rgba(52,199,89,0.2)', color: '#34C759', border: '1px solid rgba(52,199,89,0.35)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <ShieldCheck size={8} />{warrantyLabel(product.warranty_months)} warranty
          </span>
          <div style={{ position: 'absolute', bottom: 22, left: 22 }}>
            <p style={{ color: '#E31E24', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>{product.category}</p>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: '4px 0 0' }}>{product.model}</p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, margin: '3px 0 0' }}>{product.sku}</p>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 26, position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, width: 34, height: 34, borderRadius: '50%', background: dm ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={14} color={TEXT} />
          </button>
          <p style={{ fontSize: 11, color: MUTED, margin: '0 0 4px', fontWeight: 500 }}>{product.battery_platform}</p>
          <p style={{ fontSize: 19, fontWeight: 900, color: TEXT, margin: '0 0 16px', letterSpacing: '-0.02em', paddingRight: 40 }}>{product.full_name}</p>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Your Price', val: `€${fmt(product.distributor_price)}`, color: '#E31E24', bg: dm ? '#111' : '#FFF0F0', border: '#E31E2422' },
              { label: 'MSRP',       val: `€${fmt(product.msrp)}`,             color: TEXT,      bg: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', border: BORDER },
              { label: 'Margin',     val: `${margin}%`,                         color: '#34C759', bg: dm ? '#0D2A1A' : '#E8F8EE', border: 'rgba(52,199,89,0.2)' },
            ].map((p2) => (
              <div key={p2.label} style={{ flex: 1, borderRadius: 12, padding: '12px 13px', background: p2.bg, border: `1px solid ${p2.border}` }}>
                <p style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 5px' }}>{p2.label}</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: p2.color, margin: 0, fontVariantNumeric: 'tabular-nums' }}>{p2.val}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Stock', val: product.stock, pct: (product.stock / 20) * 100, color: sc.color, type: 'bar' },
              { label: 'MTD Sold', val: product.units_sold_mtd, max: product.units_sold_ytd, color: '#E31E24', type: 'circ' },
              { label: 'YTD Sold', val: product.units_sold_ytd, pct: (product.units_sold_ytd / 70) * 100, color: '#34C759', type: 'bar' },
            ].map((m) => (
              <div key={m.label} style={{ background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 12, padding: '12px 13px', border: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>{m.label}</p>
                {m.type === 'circ' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircProg value={m.val} max={m.max ?? 1} color={m.color} size={36} dm={dm} />
                      <span style={{ position: 'absolute', fontSize: 9, fontWeight: 900, color: TEXT }}>{m.val}</span>
                    </div>
                    <span style={{ fontSize: 10, color: MUTED }}>of {m.max} YTD</span>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: 20, fontWeight: 900, color: TEXT, margin: '0 0 6px', fontVariantNumeric: 'tabular-nums' }}>{m.val}</p>
                    <MicroBar pct={m.pct ?? 0} color={m.color} dm={dm} />
                  </>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {[{ label: 'Min. Order', val: `${product.min_order} units` }, { label: 'Lead Time', val: `${product.lead_time_days} days` }].map((m) => (
              <div key={m.label} style={{ background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderRadius: 9, padding: '8px 14px' }}>
                <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>{m.label}: </span>
                <span style={{ fontSize: 12, color: TEXT, fontWeight: 700 }}>{m.val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { onClose(); onOrder(); }}
            disabled={product.stock_level === 'out_of_stock'}
            style={{ width: '100%', height: 46, borderRadius: 13, background: product.stock_level === 'out_of_stock' ? (dm ? '#2a2a2a' : '#e0e0e0') : 'linear-gradient(135deg, #C8161C, #E31E24)', border: 'none', cursor: product.stock_level === 'out_of_stock' ? 'not-allowed' : 'pointer', color: product.stock_level === 'out_of_stock' ? MUTED : '#fff', fontSize: 14, fontWeight: 700, fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <ShoppingCart size={15} />
            {product.stock_level === 'out_of_stock' ? 'Out of Stock' : 'Add to Order'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function WebCatalog() {
  const { catalog, orders, darkMode } = useDistributorStore();
  const [query,     setQuery]     = useState('');
  const [category,  setCategory]  = useState<CategoryFilter>('all');
  const [view,      setView]      = useState<ViewMode>('grid');
  const [selected,  setSelected]  = useState<CatalogProduct | null>(null);
  const [quickView, setQuickView] = useState<CatalogProduct | null>(null);

  // Keep selected in sync with store updates (e.g., after MSRP save)
  const { catalog: storeCatalog } = useDistributorStore();
  useEffect(() => {
    if (selected) {
      const updated = storeCatalog.find((p) => p.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [storeCatalog]);

  const dm     = darkMode;
  const BG     = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.07)';

  const categories = useMemo(() => ['all', ...new Set(catalog.map((p) => p.category))], [catalog]);
  const filtered   = useMemo(() => catalog.filter((p) => {
    const q = query.toLowerCase();
    if (q && !(p.model.toLowerCase().includes(q) || p.full_name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))) return false;
    if (category !== 'all' && p.category !== category) return false;
    return true;
  }), [catalog, query, category]);

  const kpiInStock = catalog.filter((p) => p.stock_level === 'in_stock').length;
  const kpiLow     = catalog.filter((p) => p.stock_level === 'low_stock').length;
  const kpiOOS     = catalog.filter((p) => p.stock_level === 'out_of_stock').length;
  const kpiMTD     = catalog.reduce((a, p) => a + p.units_sold_mtd, 0);
  const kpiYTD     = catalog.reduce((a, p) => a + p.units_sold_ytd, 0);
  const kpiRevMTD  = catalog.reduce((a, p) => a + p.units_sold_mtd * p.distributor_price, 0);

  const stockBg = (sl: string) => ({ in_stock: dm ? '#0D2A1A' : '#E8F8EE', low_stock: dm ? '#3A2800' : '#FFF3E0', out_of_stock: dm ? '#3A0D0D' : '#FFEEEE' }[sl] ?? '');

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Product Catalog</h1>
          <p style={{ fontSize: 14, color: MUTED, margin: '5px 0 0', fontWeight: 500 }}>{filtered.length} products · {kpiLow + kpiOOS} stock alerts · click any product to order or configure</p>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { Icon: Package,      label: 'Total SKUs',    val: catalog.length,       sub: 'in catalog',               color: '#6366F1', bg: dm ? '#1A1A3A' : '#EEF2FF' },
          { Icon: Check,        label: 'In Stock',      val: kpiInStock,            sub: 'SKUs available',           color: '#34C759', bg: dm ? '#0D2A1A' : '#E8F8EE' },
          { Icon: AlertTriangle,label: 'Stock Alerts',  val: kpiLow + kpiOOS,       sub: `${kpiLow} low · ${kpiOOS} OOS`, color: '#E31E24', bg: dm ? '#3A1010' : '#FFF0F0' },
          { Icon: BarChart2,    label: 'MTD Units',     val: kpiMTD,                sub: 'units sold this month',   color: '#FF9500', bg: dm ? '#3A2800' : '#FFF3E0' },
          { Icon: TrendingUp,   label: 'MTD Revenue',   val: `€${fmtInt(kpiRevMTD)}`, sub: `${kpiYTD} YTD units`, color: '#E31E24', bg: dm ? '#3A1010' : '#FFF0F0' },
        ].map(({ Icon, label, val, sub, color, bg }) => (
          <div key={label} style={{ background: CARD, borderRadius: 16, padding: '14px 16px', border: `1px solid ${BORDER}`, boxShadow: SHADOW }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={15} style={{ color }} />
              </div>
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 900, color: TEXT, margin: '0 0 3px', fontVariantNumeric: 'tabular-nums' }}>{val}</p>
            <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{ background: CARD, borderRadius: 18, padding: '12px 16px', boxShadow: SHADOW, border: `1px solid ${BORDER}`, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220, background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: 10, padding: '8px 14px' }}>
            <Search size={15} style={{ color: MUTED, flexShrink: 0 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search model, name, or category…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: TEXT, flex: 1, fontFamily: FF }} />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} style={{ color: MUTED }} /></button>}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)} style={{ height: 40, padding: '0 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FF, whiteSpace: 'nowrap', background: category === cat ? '#E31E24' : (dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), color: category === cat ? '#fff' : TEXT }}>
                {cat === 'all' ? `All (${catalog.length})` : cat}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: 10, padding: 3, gap: 2 }}>
            {(['grid', 'table'] as ViewMode[]).map((v) => (
              <button key={v} onClick={() => setView(v)} style={{ width: 34, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: view === v ? (dm ? '#333' : '#fff') : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: view === v ? '0 1px 4px rgba(0,0,0,0.15)' : 'none', color: view === v ? '#E31E24' : MUTED }}>
                {v === 'grid' ? <LayoutGrid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18, marginBottom: 28 }}>
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} isSelected={selected?.id === p.id} onSelect={() => setSelected(selected?.id === p.id ? null : p)} onQuickView={() => setQuickView(p)} dm={dm} />
          ))}
        </div>
      )}

      {/* Table */}
      {view === 'table' && (
        <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
                  {['Product', 'Category', 'MSRP', 'Dist. Price', 'Margin', 'Warranty', 'Stock', 'MTD', 'YTD', ''].map((h) => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const sc     = STOCK_CFG[p.stock_level];
                  const margin = Math.round((1 - p.distributor_price / p.msrp) * 100);
                  const isSel  = selected?.id === p.id;
                  const mtdPct = p.units_sold_ytd > 0 ? (p.units_sold_mtd / p.units_sold_ytd) * 100 : 0;
                  return (
                    <tr key={p.id} onClick={() => setSelected(isSel ? null : p)} style={{ borderTop: `1px solid ${BORDER}`, cursor: 'pointer', background: isSel ? (dm ? 'rgba(227,30,36,0.1)' : 'rgba(227,30,36,0.04)') : (i % 2 !== 0 ? (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : 'transparent'), transition: 'background 0.1s' }}>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <img src={p.image_url} alt={p.model} style={{ width: 36, height: 36, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{p.model}</p>
                            <p style={{ fontSize: 10, color: MUTED, margin: '1px 0 0' }}>{p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', color: MUTED, whiteSpace: 'nowrap' }}>{p.category}</td>
                      <td style={{ padding: '12px 14px', color: MUTED, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>€{fmt(p.msrp)}</td>
                      <td style={{ padding: '12px 14px', color: '#E31E24', fontWeight: 700, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>€{fmt(p.distributor_price)}</td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ padding: '3px 9px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: dm ? '#0D2A1A' : '#E8F8EE', color: '#34C759' }}>{margin}%</span>
                      </td>
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#34C759' }}>
                          <ShieldCheck size={11} />{warrantyLabel(p.warranty_months)}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', minWidth: 120 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: sc.color, minWidth: 22, fontVariantNumeric: 'tabular-nums' }}>{p.stock}</span>
                          <div style={{ flex: 1 }}>
                            <MicroBar pct={(p.stock / 20) * 100} color={sc.color} dm={dm} />
                          </div>
                          <span style={{ fontSize: 9, color: sc.color, fontWeight: 700, whiteSpace: 'nowrap' }}>{sc.label}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircProg value={p.units_sold_mtd} max={p.units_sold_ytd} color="#E31E24" size={30} dm={dm} />
                            <span style={{ position: 'absolute', fontSize: 7, fontWeight: 900, color: TEXT }}>{p.units_sold_mtd}</span>
                          </div>
                          <span style={{ fontSize: 10, color: MUTED }}>{Math.round(mtdPct)}%</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>{p.units_sold_ytd}</span>
                          <TrendingUp size={11} color="#34C759" />
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <button onClick={(e) => { e.stopPropagation(); setQuickView(p); }} style={{ height: 32, padding: '0 10px', borderRadius: 8, background: dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer', color: TEXT, fontSize: 11, fontWeight: 600, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Eye size={11} /> View
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setSelected(p); }} style={{ height: 32, padding: '0 10px', borderRadius: 8, background: '#E31E24', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <ShoppingCart size={11} /> Order
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Truck size={15} style={{ color: TEXT }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>Recent Orders</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: MUTED }}>{orders.length} orders</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: dm ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.025)' }}>
                {['Invoice', 'Date', 'Items', 'Total', 'Expected', 'Status'].map((h) => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => {
                const st = ORDER_STATUS_CFG[o.status] || { label: o.status, color: '#888' };
                return (
                  <tr key={o.id} style={{ borderTop: `1px solid ${BORDER}`, background: i % 2 !== 0 ? (dm ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)') : 'transparent' }}>
                    <td style={{ padding: '12px 16px', color: TEXT, fontWeight: 700 }}>{o.invoice_number}</td>
                    <td style={{ padding: '12px 16px', color: MUTED }}>{o.order_date}</td>
                    <td style={{ padding: '12px 16px', color: TEXT, maxWidth: 220 }}><p style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.items.map((it) => `${it.model} ×${it.qty}`).join(', ')}</p></td>
                    <td style={{ padding: '12px 16px', color: TEXT, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>€{fmtInt(o.total)}</td>
                    <td style={{ padding: '12px 16px', color: MUTED }}><div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Clock size={11} />{o.expected_delivery}</div></td>
                    <td style={{ padding: '12px 16px' }}><span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: `${st.color}22`, color: st.color }}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View */}
      <AnimatePresence>
        {quickView && <QuickViewModal key="qv" product={quickView} onClose={() => setQuickView(null)} onOrder={() => setSelected(quickView)} dm={dm} />}
      </AnimatePresence>

      {/* Product panel */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div key="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 99 }} />
            <ProductPanel key={selected.id} product={selected} onClose={() => setSelected(null)} dm={dm} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
