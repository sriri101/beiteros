import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Building2, Package, MapPin, CreditCard, Check,
  ChevronLeft, ChevronRight, Search, Hash, AlertCircle,
  Truck, Zap, Wind, Clock, Minus, Plus, StickyNote,
  CheckCircle, Star, Calendar, FileText, Phone, User,
  ShoppingCart, ArrowRight, Info,
} from 'lucide-react';
import {
  useDistributorStore,
  DistContact, DistProduct, DistMgmtOrder, ShippingAddress,
} from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
const RED = '#E31E24';

function fmt(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Pre-filled addresses by distributor id ────────────────────────────────
const DIST_ADDRESSES: Record<string, Partial<ShippingAddress>> = {
  dc1: { company: 'Werkhaus GmbH',       street: 'Schleißheimer Str. 45',   postcode: '80333', city: 'München',     country: 'Deutschland', phone: '+49 89 120 34 500' },
  dc2: { company: 'Vogt Werkzeuge',      street: 'Deichstraße 28',           postcode: '20459', city: 'Hamburg',     country: 'Deutschland', phone: '+49 40 987 65 43'  },
  dc3: { company: 'Norbau Retail AG',    street: 'Invalidenstraße 112',      postcode: '10115', city: 'Berlin',      country: 'Deutschland', phone: '+49 30 445 67 100' },
  dc4: { company: 'Krafft GmbH & Co.',  street: 'Cannstatter Str. 4',       postcode: '70190', city: 'Stuttgart',   country: 'Deutschland', phone: '+49 711 234 56 78' },
  dc5: { company: 'Steinbach AG',        street: 'Mainzer Landstraße 50',    postcode: '60325', city: 'Frankfurt am Main', country: 'Deutschland', phone: '+49 69 888 77 66' },
  dc6: { company: 'Bauer Profi-Tools',   street: 'Ehrenstraße 2',            postcode: '50672', city: 'Köln',        country: 'Deutschland', phone: '+49 221 345 67 89' },
};

// ─── Shipping methods ──────────────────────────────────────────────────────
const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard Freight',  sub: '5 – 7 business days',  price: 0,   minFree: 1000, Icon: Truck,  color: '#34C759' },
  { id: 'express',  label: 'Express Courier',   sub: '2 – 3 business days',  price: 65,  minFree: 0,    Icon: Zap,    color: '#007AFF' },
  { id: 'dhl',      label: 'DHL Express',       sub: '1 – 2 business days',  price: 95,  minFree: 0,    Icon: Wind,   color: '#FFCC00' },
  { id: 'overnight',label: 'Overnight Delivery', sub: 'Next business day',   price: 145, minFree: 0,    Icon: Star,   color: '#FF9500' },
];

const PAYMENT_TERMS = ['Net 30', 'Net 60', 'Net 90', 'Due on Receipt'];
const PRIORITY_CFG: Record<string, { label: string; color: string; bg: string; dbg: string }> = {
  standard: { label: 'Standard',  color: '#8E8E93', bg: '#F2F2F7', dbg: '#2C2C2E' },
  express:  { label: 'Express',   color: '#007AFF', bg: '#EFF6FF', dbg: '#0A1A3A' },
  urgent:   { label: 'Urgent',    color: RED,       bg: '#FFF0F0', dbg: '#3A1010' },
};

const LOGO_COLORS: Record<string, { bg: string; dbg: string; text: string }> = {
  WH: { bg: '#EEF2FF', dbg: '#1A1A3A', text: '#4F46E5' },
  VW: { bg: '#F3F0FF', dbg: '#22133A', text: '#A855F7' },
  NR: { bg: '#FFF3E0', dbg: '#3A2800', text: '#FF9500' },
  KG: { bg: '#FFF0F0', dbg: '#3A1010', text: '#E31E24' },
  SA: { bg: '#E8F8EE', dbg: '#0D2A1A', text: '#34C759' },
  BP: { bg: '#F0F0F0', dbg: '#2A2A2A', text: '#8E8E93' },
};
function lc(logo: string, dm: boolean) {
  const c = LOGO_COLORS[logo] || { bg: '#F0F0F0', dbg: '#2A2A2A', text: '#8E8E93' };
  return { bg: dm ? c.dbg : c.bg, text: c.text };
}

// ─── STEP LABELS ──────────────────────────────────────────────────────────
const STEPS = [
  { n: 1, label: 'Distributor',  Icon: Building2   },
  { n: 2, label: 'Products',     Icon: Package     },
  { n: 3, label: 'Shipping',     Icon: MapPin      },
  { n: 4, label: 'Review',       Icon: CreditCard  },
];

// ─── Line item type used internally ───────────────────────────────────────
interface LineItem {
  product: DistProduct;
  quantity: number;
  discount: number; // % per line
  note: string;
}

interface Props {
  initialDistId?: string;
  preloadItems?: { productId: string; quantity: number }[];
  onClose: () => void;
  onSuccess: (orderId: string) => void;
  dm: boolean;
  CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}

export function CreateOrderModal({ initialDistId, preloadItems, onClose, onSuccess, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: Props) {
  const { distContacts, distProducts, addDistOrder } = useDistributorStore();

  // ── Step ──────────────────────────────────────────────────────────────────
  const [step, setStep]           = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [newOrderId, setNewOrderId] = useState('');

  // ── Step 1: Distributor & order info ─────────────────────────────────────
  const [distId,       setDistId]       = useState(initialDistId || '');
  const [distSearch,   setDistSearch]   = useState('');
  const [showDistDrop, setShowDistDrop] = useState(false);
  const [poRef,        setPoRef]        = useState('');
  const [priority,     setPriority]     = useState<'standard' | 'express' | 'urgent'>('standard');
  const [orderDate,    setOrderDate]    = useState(new Date().toISOString().slice(0, 10));
  const [expectedDate, setExpectedDate] = useState('');
  const [orderNote,    setOrderNote]    = useState('');

  // ── Step 2: Products & quantities ─────────────────────────────────────────
  const [lines,       setLines]       = useState<LineItem[]>(() => {
    if (!initialDistId || !preloadItems) return [];
    return preloadItems.flatMap(({ productId, quantity }) => {
      const p = distProducts.find(dp => dp.id === productId && dp.distributorId === initialDistId);
      return p ? [{ product: p, quantity, discount: 0, note: '' }] : [];
    });
  });
  const [overallDiscount, setOverallDiscount] = useState(0);
  const [productSearch,   setProductSearch]   = useState('');

  // ── Step 3: Shipping ──────────────────────────────────────────────────────
  const dist       = distContacts.find(c => c.id === distId);
  const preAddress = DIST_ADDRESSES[distId] || {};
  const [addr, setAddr] = useState<ShippingAddress>({
    company:      preAddress.company      || '',
    contactName:  dist?.contactName       || '',
    street:       preAddress.street       || '',
    postcode:     preAddress.postcode     || '',
    city:         preAddress.city         || '',
    country:      preAddress.country      || 'Deutschland',
    phone:        preAddress.phone        || '',
    instructions: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');

  // ── Step 4: Payment ──────────────────────────────────────────────────────
  const [paymentTerms, setPaymentTerms] = useState('Net 30');

  // ── Computed ────────────────────────────────────────────────────────────��─
  const productsForDist = useMemo(
    () => distProducts.filter(p => p.distributorId === distId),
    [distProducts, distId]
  );
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return productsForDist;
    const q = productSearch.toLowerCase();
    return productsForDist.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [productsForDist, productSearch]);

  const lineSubtotal = useMemo(
    () => lines.reduce((s, l) => {
      const lineGross = l.quantity * l.product.unitPrice;
      return s + lineGross * (1 - (l.discount || 0) / 100);
    }, 0),
    [lines]
  );
  const afterOverallDiscount = lineSubtotal * (1 - overallDiscount / 100);
  const selectedShipping = SHIPPING_METHODS.find(m => m.id === shippingMethod)!;
  const shippingCost = selectedShipping.minFree > 0 && afterOverallDiscount >= selectedShipping.minFree ? 0 : selectedShipping.price;
  const TAX_RATE = 0.19;
  const taxAmount = afterOverallDiscount * TAX_RATE;
  const totalAmount = afterOverallDiscount + taxAmount + shippingCost;
  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fieldStyle: React.CSSProperties = {
    width: '100%', background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 9,
    padding: '9px 12px', fontSize: 13, color: TEXT, fontFamily: FF, outline: 'none', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, color: MUTED, display: 'block', marginBottom: 5,
    textTransform: 'uppercase', letterSpacing: '0.06em',
  };

  const getLine = (pid: string) => lines.find(l => l.product.id === pid);
  const setQty = (pid: string, qty: number) => {
    const product = productsForDist.find(p => p.id === pid)!;
    if (qty <= 0) {
      setLines(ls => ls.filter(l => l.product.id !== pid));
    } else if (getLine(pid)) {
      setLines(ls => ls.map(l => l.product.id === pid ? { ...l, quantity: qty } : l));
    } else {
      setLines(ls => [...ls, { product, quantity: qty, discount: 0, note: '' }]);
    }
  };
  const setLineDiscount = (pid: string, d: number) =>
    setLines(ls => ls.map(l => l.product.id === pid ? { ...l, discount: d } : l));
  const setLineNote = (pid: string, note: string) =>
    setLines(ls => ls.map(l => l.product.id === pid ? { ...l, note } : l));

  // Update address when distributor changes
  const handleDistSelect = (id: string) => {
    setDistId(id);
    const d = distContacts.find(c => c.id === id);
    const a = DIST_ADDRESSES[id] || {};
    setAddr({
      company:      a.company      || d?.name          || '',
      contactName:  d?.contactName  || '',
      street:       a.street        || '',
      postcode:     a.postcode      || '',
      city:         a.city          || '',
      country:      a.country       || 'Deutschland',
      phone:        a.phone         || d?.phone         || '',
      instructions: '',
    });
    setLines([]);
    setShowDistDrop(false);
    setDistSearch('');
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const step1Valid = !!distId;
  const step2Valid = lines.length > 0 && lines.every(l => l.quantity > 0);
  const step3Valid = !!(addr.street && addr.city && addr.postcode);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    const oid = `ORD-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const order: DistMgmtOrder = {
      id:           oid,
      distributorId: distId,
      status:        'submitted',
      createdAt:     orderDate,
      expectedDate:  expectedDate,
      subtotal:      afterOverallDiscount,
      tax:           taxAmount,
      shipping:      shippingCost,
      discount:      overallDiscount,
      total:         totalAmount,
      note:          orderNote,
      poReference:   poRef,
      priority,
      shippingAddress: addr,
      shippingMethod,
      paymentTerms,
      items: lines.map((l, i) => {
        const lineGross = l.quantity * l.product.unitPrice;
        const lineNet   = lineGross * (1 - (l.discount || 0) / 100);
        return {
          id:          `item-${oid}-${i}`,
          orderId:     oid,
          productId:   l.product.id,
          productName: l.product.name,
          sku:         l.product.sku,
          quantity:    l.quantity,
          unitPrice:   l.product.unitPrice,
          lineTotal:   lineNet,
          note:        l.note,
          discount:    l.discount,
        };
      }),
    };
    addDistOrder(order);
    setNewOrderId(oid);
    setSubmitted(true);
  };

  // ── Shared mini summary bar (shows while editing products) ─────────────
  const MiniSummary = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px', background: dm ? 'rgba(227,30,36,0.06)' : '#FFF8F8', borderTop: `1px solid ${BORDER}`, fontSize: 12, flexShrink: 0 }}>
      <span style={{ color: MUTED }}>{lines.length} products · {totalQty} units</span>
      <div style={{ flex: 1 }} />
      <span style={{ color: MUTED }}>Subtotal</span>
      <span style={{ fontWeight: 800, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>€{fmt(lineSubtotal)}</span>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ────────────────────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        style={{ width: 420, background: CARD, borderRadius: 24, padding: '40px 32px', textAlign: 'center', border: `1px solid ${BORDER}`, boxShadow: '0 32px 80px rgba(0,0,0,0.35)', fontFamily: FF }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: dm ? '#0D2A1A' : '#E8F8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={34} style={{ color: '#34C759' }} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: TEXT, margin: '0 0 8px' }}>Order Submitted!</h2>
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 6px' }}>
          <span style={{ fontWeight: 700, color: TEXT }}>{newOrderId}</span> has been created successfully.
        </p>
        <p style={{ fontSize: 13, color: MUTED, margin: '0 0 28px' }}>
          Sent to <span style={{ fontWeight: 700, color: TEXT }}>{distContacts.find(c => c.id === distId)?.name}</span>
          {' '}· Total <span style={{ fontWeight: 900, color: RED }}>€{fmt(totalAmount)}</span>
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button onClick={onClose}
            style={{ flex: 1, height: 42, borderRadius: 10, border: `1px solid ${BORDER}`, background: INPUT_BG, cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 700, color: MUTED }}>
            Close
          </button>
          <button onClick={() => onSuccess(newOrderId)}
            style={{ flex: 1, height: 42, borderRadius: 10, border: 'none', background: `linear-gradient(135deg,#C8161C,${RED})`, cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            View Order <ArrowRight size={13} />
          </button>
        </div>
      </motion.div>
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────
  // MAIN MODAL
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}>
      <motion.div initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{ width: 780, maxWidth: '96vw', maxHeight: '92vh', background: CARD, borderRadius: 22, border: `1px solid ${BORDER}`, boxShadow: '0 40px 100px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', fontFamily: FF, overflow: 'hidden' }}>

        {/* ── HEADER ── */}
        <div style={{ padding: '18px 20px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#C8161C,#E31E24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={15} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: 0 }}>Create New Order</p>
                {dist && <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>for {dist.name}</p>}
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: INPUT_BG, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={14} style={{ color: MUTED }} />
            </button>
          </div>

          {/* Step progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 0 }}>
            {STEPS.map((s, i) => {
              const done    = step > s.n;
              const current = step === s.n;
              return (
                <div key={s.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Connector line */}
                  {i > 0 && (
                    <div style={{ position: 'absolute', top: 16, left: 0, width: '50%', height: 2, background: step > s.n - 1 ? RED : BORDER }} />
                  )}
                  {i < STEPS.length - 1 && (
                    <div style={{ position: 'absolute', top: 16, right: 0, width: '50%', height: 2, background: done ? RED : BORDER }} />
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: `2.5px solid ${current ? RED : done ? RED : BORDER}`, background: done ? RED : current ? (dm ? '#3A1010' : '#FFF0F0') : INPUT_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, transition: 'all 0.2s' }}>
                    {done ? <Check size={13} color="#fff" /> : <s.Icon size={13} style={{ color: current ? RED : MUTED }} />}
                  </div>
                  <p style={{ fontSize: 10, fontWeight: current ? 800 : 500, color: current ? RED : MUTED, margin: '5px 0 0', textAlign: 'center' }}>{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* Thin rule below steps */}
          <div style={{ height: 1, background: BORDER, margin: '14px -20px 0' }} />
        </div>

        {/* ── BODY (scrollable) ── */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          <AnimatePresence mode="wait">

            {/* ═══ STEP 1 — Distributor & Order Details ═══════════════════════ */}
            {step === 1 && (
              <motion.div key="step1" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <div style={{ padding: '20px 20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>

                  {/* LEFT — distributor selector */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Distributor *</label>
                    <div style={{ position: 'relative' }}>
                      <div onClick={() => setShowDistDrop(v => !v)}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: INPUT_BG, border: `1.5px solid ${distId ? RED : BORDER}`, borderRadius: 10, cursor: 'pointer' }}>
                        {dist ? (
                          <>
                            <div style={{ width: 28, height: 28, borderRadius: 7, background: lc(dist.logo, dm).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900, color: lc(dist.logo, dm).text, flexShrink: 0 }}>{dist.logo}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>{dist.name}</p>
                              <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{dist.email}</p>
                            </div>
                            <button onClick={e => { e.stopPropagation(); setDistId(''); setLines([]); }}
                              style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', color: MUTED }}>
                              <X size={13} />
                            </button>
                          </>
                        ) : (
                          <>
                            <Search size={14} style={{ color: MUTED, flexShrink: 0 }} />
                            <span style={{ fontSize: 13, color: MUTED }}>Select distributor…</span>
                          </>
                        )}
                      </div>
                      {showDistDrop && (
                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', marginTop: 4, overflow: 'hidden' }}>
                          <div style={{ padding: '8px 10px', borderBottom: `1px solid ${BORDER}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: INPUT_BG, borderRadius: 8, padding: '6px 10px' }}>
                              <Search size={12} style={{ color: MUTED }} />
                              <input autoFocus value={distSearch} onChange={e => setDistSearch(e.target.value)}
                                placeholder="Search distributors…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FF, flex: 1 }} />
                            </div>
                          </div>
                          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                            {distContacts.filter(c => !distSearch || c.name.toLowerCase().includes(distSearch.toLowerCase()) || c.contactName.toLowerCase().includes(distSearch.toLowerCase())).map(c => (
                              <div key={c.id} onClick={() => handleDistSelect(c.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', cursor: 'pointer', borderBottom: `1px solid ${BORDER}`, opacity: c.status === 'inactive' ? 0.5 : 1 }}
                                onMouseEnter={e => (e.currentTarget.style.background = dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: lc(c.logo, dm).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: lc(c.logo, dm).text }}>{c.logo}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{c.name}</p>
                                  <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{c.contactName} · {distProducts.filter(p => p.distributorId === c.id).length} products</p>
                                </div>
                                {c.status === 'inactive' && <span style={{ fontSize: 9, fontWeight: 700, color: MUTED, background: INPUT_BG, padding: '2px 7px', borderRadius: 99 }}>INACTIVE</span>}
                                {distId === c.id && <Check size={13} style={{ color: RED, flexShrink: 0 }} />}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    {dist && dist.notes && (
                      <div style={{ marginTop: 8, padding: '8px 12px', background: INPUT_BG, borderRadius: 9, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <Info size={12} style={{ color: MUTED, marginTop: 1, flexShrink: 0 }} />
                        <p style={{ fontSize: 11, color: MUTED, margin: 0, lineHeight: 1.5 }}>{dist.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* PO Reference */}
                  <div>
                    <label style={labelStyle}>PO Reference / Order Number</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...fieldStyle, padding: 0, overflow: 'hidden' }}>
                      <span style={{ padding: '9px 12px', background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRight: `1px solid ${BORDER}`, color: MUTED, display: 'flex', alignItems: 'center' }}><FileText size={13} /></span>
                      <input value={poRef} onChange={e => setPoRef(e.target.value)} placeholder="e.g. PO-2025-0042"
                        style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FF, flex: 1, padding: '9px 12px 9px 8px' }} />
                    </div>
                  </div>

                  {/* Order date */}
                  <div>
                    <label style={labelStyle}>Order Date</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...fieldStyle, padding: 0, overflow: 'hidden' }}>
                      <span style={{ padding: '9px 12px', background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRight: `1px solid ${BORDER}`, color: MUTED, display: 'flex', alignItems: 'center' }}><Calendar size={13} /></span>
                      <input type="date" value={orderDate} onChange={e => setOrderDate(e.target.value)}
                        style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FF, flex: 1, padding: '9px 12px 9px 8px', colorScheme: dm ? 'dark' : 'light' }} />
                    </div>
                  </div>

                  {/* Expected delivery */}
                  <div>
                    <label style={labelStyle}>Expected Delivery Date</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, ...fieldStyle, padding: 0, overflow: 'hidden' }}>
                      <span style={{ padding: '9px 12px', background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRight: `1px solid ${BORDER}`, color: MUTED, display: 'flex', alignItems: 'center' }}><Truck size={13} /></span>
                      <input type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)}
                        style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FF, flex: 1, padding: '9px 12px 9px 8px', colorScheme: dm ? 'dark' : 'light' }} />
                    </div>
                  </div>

                  {/* Priority */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Order Priority</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {Object.entries(PRIORITY_CFG).map(([key, cfg]) => (
                        <button key={key} onClick={() => setPriority(key as any)}
                          style={{ flex: 1, padding: '10px 0', borderRadius: 10, border: `1.5px solid ${priority === key ? cfg.color : BORDER}`, background: priority === key ? (dm ? cfg.dbg : cfg.bg) : INPUT_BG, cursor: 'pointer', fontFamily: FF, fontSize: 12, fontWeight: 700, color: priority === key ? cfg.color : MUTED, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                          {priority === key && <Check size={11} />} {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Internal note */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Internal Order Note</label>
                    <textarea value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={3}
                      placeholder="Notes visible to your team only…"
                      style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.6 }} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 2 — Products & Quantities ══════════════════════════ */}
            {step === 2 && (
              <motion.div key="step2" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px 20px 0' }}>
                  {/* Search */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: INPUT_BG, borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
                    <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
                    <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products…"
                      style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: TEXT, fontFamily: FF, flex: 1 }} />
                    {productSearch && <button onClick={() => setProductSearch('')} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X size={12} style={{ color: MUTED }} /></button>}
                  </div>
                  {productsForDist.length === 0 && (
                    <div style={{ padding: '20px 0', textAlign: 'center', color: MUTED }}>
                      <Package size={24} style={{ opacity: 0.3, marginBottom: 8 }} />
                      <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>No products in this distributor's catalogue</p>
                      <p style={{ fontSize: 11, margin: '4px 0 0' }}>Add products first from the Distributor detail page</p>
                    </div>
                  )}
                </div>

                {/* Product rows */}
                <div style={{ padding: '0 20px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {filteredProducts.map(p => {
                    const line = getLine(p.id);
                    const qty  = line?.quantity || 0;
                    const disc = line?.discount  || 0;
                    const lineGross = qty * p.unitPrice;
                    const lineNet   = lineGross * (1 - disc / 100);
                    return (
                      <div key={p.id} style={{ border: `1px solid ${qty > 0 ? RED + '44' : BORDER}`, borderRadius: 12, padding: '12px 14px', background: qty > 0 ? (dm ? 'rgba(227,30,36,0.05)' : '#FFFAFA') : INPUT_BG, transition: 'all 0.15s' }}>
                        {/* Top row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>{p.name}</span>
                              {!p.inStock && (
                                <span style={{ fontSize: 9, fontWeight: 700, color: RED, background: dm ? '#3A1010' : '#FFF0F0', padding: '2px 6px', borderRadius: 99, flexShrink: 0 }}>OOS</span>
                              )}
                            </div>
                            <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0', display: 'flex', gap: 10 }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Hash size={9} />{p.sku}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Package size={9} />{p.category}</span>
                              <span style={{ fontWeight: 700, color: TEXT }}>€{fmt(p.unitPrice)} /{p.unit}</span>
                            </p>
                          </div>

                          {/* Quantity stepper */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <button onClick={() => setQty(p.id, qty - 1)} disabled={qty === 0}
                              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${BORDER}`, background: INPUT_BG, cursor: qty > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: qty === 0 ? 0.4 : 1 }}>
                              <Minus size={11} style={{ color: TEXT }} />
                            </button>
                            <input type="number" min={0} value={qty || ''} placeholder="0"
                              onChange={e => setQty(p.id, Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ width: 52, textAlign: 'center', background: INPUT_BG, border: `1.5px solid ${qty > 0 ? RED : BORDER}`, borderRadius: 7, padding: '5px 4px', fontSize: 13, fontWeight: 700, color: TEXT, fontFamily: FF, outline: 'none' }} />
                            <button onClick={() => setQty(p.id, qty + 1)}
                              style={{ width: 28, height: 28, borderRadius: 7, border: qty > 0 ? 'none' : `1px solid ${BORDER}`, background: qty > 0 ? RED : INPUT_BG, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Plus size={11} style={{ color: qty > 0 ? '#fff' : TEXT }} />
                            </button>
                          </div>

                          {/* Line total */}
                          <div style={{ minWidth: 80, textAlign: 'right' }}>
                            {qty > 0 ? (
                              <>
                                <p style={{ fontSize: 14, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(lineNet)}</p>
                                {disc > 0 && <p style={{ fontSize: 10, color: MUTED, margin: 0, textDecoration: 'line-through' }}>€{fmt(lineGross)}</p>}
                              </>
                            ) : (
                              <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>—</p>
                            )}
                          </div>
                        </div>

                        {/* Expanded row when product has quantity */}
                        {qty > 0 && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10 }}>
                            <input value={line?.note || ''} onChange={e => setLineNote(p.id, e.target.value)}
                              placeholder="Line note (optional)…"
                              style={{ background: 'none', border: `1px solid ${BORDER}`, borderRadius: 7, padding: '5px 10px', fontSize: 11, color: MUTED, fontFamily: FF, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: INPUT_BG, border: `1px solid ${BORDER}`, borderRadius: 7, padding: '5px 10px' }}>
                              <span style={{ fontSize: 11, color: MUTED, whiteSpace: 'nowrap' }}>Disc.</span>
                              <input type="number" min={0} max={100} value={disc || ''} placeholder="0"
                                onChange={e => setLineDiscount(p.id, Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                                style={{ width: '100%', background: 'none', border: 'none', outline: 'none', fontSize: 12, fontWeight: 700, color: disc > 0 ? '#34C759' : TEXT, fontFamily: FF, textAlign: 'right' }} />
                              <span style={{ fontSize: 11, color: MUTED }}>%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Overall discount */}
                {lines.length > 0 && (
                  <div style={{ padding: '0 20px 16px' }}>
                    <div style={{ background: INPUT_BG, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>Overall Order Discount</p>
                        <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>Applied on top of any per-line discounts</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input type="number" min={0} max={50} value={overallDiscount || ''} placeholder="0"
                          onChange={e => setOverallDiscount(Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)))}
                          style={{ width: 64, textAlign: 'center', background: CARD, border: `1.5px solid ${overallDiscount > 0 ? '#34C759' : BORDER}`, borderRadius: 8, padding: '6px 8px', fontSize: 14, fontWeight: 800, color: overallDiscount > 0 ? '#34C759' : TEXT, fontFamily: FF, outline: 'none' }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>%</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══ STEP 3 — Shipping ══════════════════════════════════════ */}
            {step === 3 && (
              <motion.div key="step3" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <div style={{ padding: '20px 20px 24px' }}>

                  {/* Shipping address */}
                  <div style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: TEXT, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MapPin size={13} style={{ color: RED }} /> Ship-to Address
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Company *</label>
                        <input value={addr.company} onChange={e => setAddr(a => ({ ...a, company: e.target.value }))} placeholder="Company name" style={fieldStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Contact Name</label>
                        <div style={{ display: 'flex', alignItems: 'center', ...fieldStyle, padding: 0, overflow: 'hidden' }}>
                          <span style={{ padding: '9px 10px', color: MUTED, display: 'flex', alignItems: 'center', borderRight: `1px solid ${BORDER}`, background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}><User size={12} /></span>
                          <input value={addr.contactName} onChange={e => setAddr(a => ({ ...a, contactName: e.target.value }))} placeholder="Delivery contact"
                            style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FF, flex: 1, padding: '9px 10px' }} />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <div style={{ display: 'flex', alignItems: 'center', ...fieldStyle, padding: 0, overflow: 'hidden' }}>
                          <span style={{ padding: '9px 10px', color: MUTED, display: 'flex', alignItems: 'center', borderRight: `1px solid ${BORDER}`, background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}><Phone size={12} /></span>
                          <input value={addr.phone} onChange={e => setAddr(a => ({ ...a, phone: e.target.value }))} placeholder="+49 …"
                            style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, color: TEXT, fontFamily: FF, flex: 1, padding: '9px 10px' }} />
                        </div>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Street Address *</label>
                        <input value={addr.street} onChange={e => setAddr(a => ({ ...a, street: e.target.value }))} placeholder="Street and house number" style={{ ...fieldStyle, borderColor: !addr.street ? '#FF9500' : BORDER }} />
                      </div>
                      <div>
                        <label style={labelStyle}>Postal Code *</label>
                        <input value={addr.postcode} onChange={e => setAddr(a => ({ ...a, postcode: e.target.value }))} placeholder="e.g. 80333" style={{ ...fieldStyle, borderColor: !addr.postcode ? '#FF9500' : BORDER }} />
                      </div>
                      <div>
                        <label style={labelStyle}>City *</label>
                        <input value={addr.city} onChange={e => setAddr(a => ({ ...a, city: e.target.value }))} placeholder="e.g. München" style={{ ...fieldStyle, borderColor: !addr.city ? '#FF9500' : BORDER }} />
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Country</label>
                        <select value={addr.country} onChange={e => setAddr(a => ({ ...a, country: e.target.value }))}
                          style={{ ...fieldStyle, cursor: 'pointer' }}>
                          {['Deutschland', 'Österreich', 'Schweiz', 'Netherlands', 'France', 'Belgium', 'United Kingdom', 'India', 'UAE', 'Singapore'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={labelStyle}>Delivery Instructions</label>
                        <textarea value={addr.instructions} onChange={e => setAddr(a => ({ ...a, instructions: e.target.value }))} rows={2}
                          placeholder="e.g. Deliver to loading bay B, notify on arrival, signature required…"
                          style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }} />
                      </div>
                    </div>
                  </div>

                  {/* Shipping method */}
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: TEXT, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={13} style={{ color: RED }} /> Shipping Method
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {SHIPPING_METHODS.map(m => {
                        const active = shippingMethod === m.id;
                        const effectivePrice = m.minFree > 0 && afterOverallDiscount >= m.minFree ? 0 : m.price;
                        return (
                          <button key={m.id} onClick={() => setShippingMethod(m.id)}
                            style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${active ? RED : BORDER}`, background: active ? (dm ? 'rgba(227,30,36,0.06)' : '#FFF8F8') : INPUT_BG, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: active ? (dm ? '#3A1010' : '#FFF0F0') : (dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <m.Icon size={15} style={{ color: active ? RED : MUTED }} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 12, fontWeight: 800, color: active ? TEXT : MUTED, margin: 0 }}>{m.label}</p>
                              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{m.sub}</p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: effectivePrice === 0 ? '#34C759' : TEXT, margin: '3px 0 0' }}>
                                {effectivePrice === 0 ? (m.minFree > 0 ? '🎉 Free' : 'Free') : `+€${fmt(effectivePrice)}`}
                                {m.minFree > 0 && effectivePrice > 0 && <span style={{ fontSize: 9, color: MUTED, marginLeft: 4 }}>Free above €{m.minFree}</span>}
                              </p>
                            </div>
                            {active && <Check size={14} style={{ color: RED, flexShrink: 0, marginTop: 2 }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══ STEP 4 — Review & Payment ══════════════════════════════ */}
            {step === 4 && (
              <motion.div key="step4" initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -30, opacity: 0 }}>
                <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, alignItems: 'start' }}>

                  {/* LEFT — order details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                    {/* Distributor card */}
                    <div style={{ background: INPUT_BG, borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Distributor</p>
                      {dist && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, background: lc(dist.logo, dm).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: lc(dist.logo, dm).text }}>{dist.logo}</div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>{dist.name}</p>
                            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{dist.email}</p>
                          </div>
                        </div>
                      )}
                      {(poRef || priority !== 'standard') && (
                        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {poRef && <span style={{ fontSize: 10, fontWeight: 700, color: MUTED, background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', padding: '3px 8px', borderRadius: 6 }}>PO: {poRef}</span>}
                          {priority !== 'standard' && <span style={{ fontSize: 10, fontWeight: 700, color: PRIORITY_CFG[priority].color, background: dm ? PRIORITY_CFG[priority].dbg : PRIORITY_CFG[priority].bg, padding: '3px 8px', borderRadius: 6 }}>{PRIORITY_CFG[priority].label}</span>}
                        </div>
                      )}
                    </div>

                    {/* Ship-to card */}
                    <div style={{ background: INPUT_BG, borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Shipping</p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <MapPin size={13} style={{ color: MUTED, flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{addr.company}</p>
                          {addr.contactName && <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{addr.contactName}</p>}
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{addr.street}</p>
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{addr.postcode} {addr.city}, {addr.country}</p>
                          {addr.phone && <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{addr.phone}</p>}
                          {addr.instructions && <p style={{ fontSize: 11, color: MUTED, margin: '6px 0 0', fontStyle: 'italic', background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', padding: '5px 8px', borderRadius: 7 }}>"{addr.instructions}"</p>}
                        </div>
                      </div>
                      <div style={{ marginTop: 10, padding: '8px 10px', background: dm ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {(() => { const m = SHIPPING_METHODS.find(x => x.id === shippingMethod)!; return <><m.Icon size={13} style={{ color: MUTED }} /><span style={{ fontSize: 12, fontWeight: 700, color: TEXT }}>{m.label}</span><span style={{ fontSize: 11, color: MUTED }}>· {m.sub}</span></>; })()}
                      </div>
                    </div>

                    {/* Line items */}
                    <div style={{ background: INPUT_BG, borderRadius: 14, overflow: 'hidden' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0, padding: '10px 14px', borderBottom: `1px solid ${BORDER}` }}>
                        Order Lines ({lines.length})
                      </p>
                      {lines.map((l, i) => {
                        const gross = l.quantity * l.product.unitPrice;
                        const net   = gross * (1 - (l.discount || 0) / 100);
                        return (
                          <div key={l.product.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < lines.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{l.product.name}</p>
                              <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>
                                {l.product.sku} · ×{l.quantity} · €{fmt(l.product.unitPrice)}
                                {l.discount > 0 && <span style={{ color: '#34C759', marginLeft: 4 }}>−{l.discount}%</span>}
                              </p>
                              {l.note && <p style={{ fontSize: 10, color: MUTED, margin: '3px 0 0', fontStyle: 'italic' }}>{l.note}</p>}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 800, color: TEXT, fontVariantNumeric: 'tabular-nums' }}>€{fmt(net)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT — payment & totals */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {/* Payment terms */}
                    <div style={{ background: INPUT_BG, borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Payment Terms</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {PAYMENT_TERMS.map(pt => (
                          <button key={pt} onClick={() => setPaymentTerms(pt)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', borderRadius: 9, border: `1.5px solid ${paymentTerms === pt ? RED : BORDER}`, background: paymentTerms === pt ? (dm ? 'rgba(227,30,36,0.07)' : '#FFF8F8') : 'transparent', cursor: 'pointer', fontFamily: FF, fontSize: 12, fontWeight: 700, color: paymentTerms === pt ? TEXT : MUTED, transition: 'all 0.12s' }}>
                            {pt}
                            {paymentTerms === pt && <Check size={12} style={{ color: RED }} />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order totals */}
                    <div style={{ background: INPUT_BG, borderRadius: 14, padding: '14px 16px' }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>Order Total</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[
                          { label: 'Gross Subtotal', val: `€${fmt(lineSubtotal)}`, sub: true },
                          ...(overallDiscount > 0 ? [{ label: `Order Discount (${overallDiscount}%)`, val: `−€${fmt(lineSubtotal - afterOverallDiscount)}`, sub: true, green: true }] : []),
                          { label: 'Net Subtotal', val: `€${fmt(afterOverallDiscount)}`, sub: true },
                          { label: 'VAT (19%)', val: `€${fmt(taxAmount)}`, sub: true },
                          { label: 'Shipping', val: shippingCost === 0 ? 'Free' : `€${fmt(shippingCost)}`, sub: true, green: shippingCost === 0 },
                        ].map(r => (
                          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: 12, color: MUTED }}>{r.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: (r as any).green ? '#34C759' : TEXT }}>{r.val}</span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, marginTop: 4, borderTop: `2px solid ${BORDER}` }}>
                          <span style={{ fontSize: 15, fontWeight: 900, color: TEXT }}>Total Due</span>
                          <span style={{ fontSize: 18, fontWeight: 900, color: RED, fontVariantNumeric: 'tabular-nums' }}>€{fmt(totalAmount)}</span>
                        </div>
                        <p style={{ fontSize: 10, color: MUTED, margin: 0, textAlign: 'right' }}>{paymentTerms}</p>
                      </div>
                    </div>

                    {/* Dates summary */}
                    {(orderDate || expectedDate) && (
                      <div style={{ background: INPUT_BG, borderRadius: 14, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {orderDate && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ color: MUTED }}>Order Date</span><span style={{ fontWeight: 700, color: TEXT }}>{new Date(orderDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>}
                        {expectedDate && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ color: MUTED }}>Expected Delivery</span><span style={{ fontWeight: 700, color: TEXT }}>{new Date(expectedDate).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>}
                      </div>
                    )}

                    {/* Warnings */}
                    {lines.some(l => !l.product.inStock) && (
                      <div style={{ background: dm ? '#3A2800' : '#FFF3E0', border: '1px solid #FF9500', borderRadius: 12, padding: '10px 12px', display: 'flex', gap: 8 }}>
                        <AlertCircle size={14} style={{ color: '#FF9500', flexShrink: 0, marginTop: 1 }} />
                        <p style={{ fontSize: 11, color: '#FF9500', margin: 0, lineHeight: 1.5 }}>
                          Some products are currently out of stock. The order will be placed and fulfilled when stock becomes available.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mini summary bar (steps 2–3) */}
        {(step === 2 || step === 3) && lines.length > 0 && <MiniSummary />}

        {/* ── FOOTER ── */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: CARD }}>
          {/* Left — back */}
          <div>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1 as 1 | 2 | 3 | 4)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 16px', borderRadius: 9, border: `1px solid ${BORDER}`, background: 'transparent', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 700, color: MUTED }}>
                <ChevronLeft size={14} /> Back
              </button>
            )}
          </div>

          {/* Right — next / submit */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={onClose}
              style={{ height: 38, padding: '0 16px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 700, color: MUTED }}>
              Cancel
            </button>
            {step < 4 && (
              <button
                onClick={() => {
                  if (step === 1 && !step1Valid) return;
                  if (step === 2 && !step2Valid) return;
                  if (step === 3 && !step3Valid) return;
                  setStep(s => s + 1 as 2 | 3 | 4);
                }}
                disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, height: 38, padding: '0 20px', borderRadius: 9, border: 'none', background: (step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid) ? BORDER : `linear-gradient(135deg,#C8161C,${RED})`, color: (step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid) ? MUTED : '#fff', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 800, transition: 'all 0.15s' }}>
                {step === 3 ? 'Review Order' : 'Continue'}
                <ChevronRight size={14} />
              </button>
            )}
            {step === 4 && (
              <button onClick={handleSubmit}
                style={{ display: 'flex', alignItems: 'center', gap: 7, height: 42, padding: '0 24px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg,#C8161C,${RED})`, color: '#fff', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: 900 }}>
                <CheckCircle size={15} /> Submit Order · €{fmt(totalAmount)}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
