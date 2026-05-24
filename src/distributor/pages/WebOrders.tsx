import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingCart, Truck, Receipt, Search, Download, ChevronDown, ChevronUp,
  Package, CheckCircle, Clock, XCircle, AlertCircle, Filter, Eye,
  Building2, Factory, TrendingUp, Calendar, Hash, MapPin, FileText,
  ArrowUpRight, Boxes, RefreshCw, ChevronRight,
} from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";

/* ─── Types ─────────────────────────────────────────────────────────── */
type OrderStatus   = 'processing' | 'shipped' | 'delivered' | 'cancelled';
type InvoiceStatus = 'paid' | 'pending' | 'overdue';
type MainTab       = 'history' | 'tracking' | 'receipts';
type HistorySource = 'manufacturer' | 'reseller';
type ReceiptSource = 'manufacturer' | 'reseller';

interface OrderItem { model: string; qty: number; unit_price: number; sku: string; }

interface ManufacturerOrder {
  id: string; invoice_number: string; order_date: string;
  expected_delivery: string; actual_delivery?: string;
  status: OrderStatus; total: number; items: OrderItem[];
  tracking_number?: string; carrier?: string;
  warehouse: string; notes?: string;
}

interface ResellerSale {
  id: string; invoice_number: string; sale_date: string;
  due_date: string; paid_date?: string;
  status: InvoiceStatus; total: number; items: OrderItem[];
  reseller_name: string; reseller_city: string;
  contact: string; delivery_method: string; notes?: string;
}

/* ─── Mock Data ─────────────────────────────────────────────────────── */
const MFG_ORDERS: ManufacturerOrder[] = [
  {
    id: 'mo001', invoice_number: 'INV-2025-0122', order_date: '2025-02-23',
    expected_delivery: '2025-03-02', status: 'processing', total: 1_750,
    tracking_number: undefined, carrier: 'DPD',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BOS-ID18', qty: 10, unit_price: 120, sku: 'BT-BOSID18' },
      { model: 'BRH70-20V', qty: 5, unit_price: 110, sku: 'BT-BRH70-20V' },
    ],
    notes: 'Priority stock replenishment — Q1 campaign.',
  },
  {
    id: 'mo002', invoice_number: 'INV-2025-0109', order_date: '2025-02-19',
    expected_delivery: '2025-02-26', status: 'shipped', total: 2_158,
    tracking_number: 'DPD-DE-88421907433', carrier: 'DPD',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BI-BTS125', qty: 8, unit_price: 135, sku: 'BT-BTS125' },
      { model: 'TIGE-3DG', qty: 7, unit_price: 143, sku: 'BT-TIGE3DG' },
    ],
  },
  {
    id: 'mo003', invoice_number: 'INV-2025-0088', order_date: '2025-02-10',
    expected_delivery: '2025-02-15', actual_delivery: '2025-02-14',
    status: 'delivered', total: 4_720,
    tracking_number: 'DHL-DE-33219847123', carrier: 'DHL',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BRH70-20V', qty: 10, unit_price: 187, sku: 'BT-BRH70-20V' },
      { model: 'AG180',     qty: 20, unit_price: 97,  sku: 'BT-AG180'     },
    ],
  },
  {
    id: 'mo004', invoice_number: 'INV-2025-0061', order_date: '2025-01-28',
    expected_delivery: '2025-02-04', actual_delivery: '2025-02-04',
    status: 'delivered', total: 3_345,
    tracking_number: 'UPS-DE-1Z8W7V060396441072', carrier: 'UPS',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BOS-D18',   qty: 15, unit_price: 112, sku: 'BT-BOSD18'   },
      { model: 'BOS-ID18',  qty: 10, unit_price: 120, sku: 'BT-BOSID18'  },
      { model: 'TIGE-3DG',  qty: 5,  unit_price: 143, sku: 'BT-TIGE3DG'  },
    ],
  },
  {
    id: 'mo005', invoice_number: 'INV-2025-0033', order_date: '2025-01-10',
    expected_delivery: '2025-01-17', actual_delivery: '2025-01-18',
    status: 'delivered', total: 5_850,
    tracking_number: 'DHL-DE-11933719012', carrier: 'DHL',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BRH70-20V', qty: 15, unit_price: 187, sku: 'BT-BRH70-20V' },
      { model: 'AG180',     qty: 20, unit_price: 97,  sku: 'BT-AG180'     },
      { model: 'BI-BTS125', qty: 10, unit_price: 135, sku: 'BT-BTS125'    },
    ],
  },
  {
    id: 'mo006', invoice_number: 'INV-2024-0412', order_date: '2024-12-05',
    expected_delivery: '2024-12-12', actual_delivery: '2024-12-13',
    status: 'delivered', total: 2_880,
    tracking_number: 'DPD-DE-71200019844', carrier: 'DPD',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'TIGE-3DG',  qty: 8,  unit_price: 143, sku: 'BT-TIGE3DG'  },
      { model: 'BOS-ID18',  qty: 12, unit_price: 120, sku: 'BT-BOSID18'  },
    ],
  },
  {
    id: 'mo007', invoice_number: 'INV-2024-0388', order_date: '2024-11-20',
    expected_delivery: '2024-11-27', actual_delivery: '2024-11-28',
    status: 'delivered', total: 6_240,
    carrier: 'DHL', tracking_number: 'DHL-DE-22841098321',
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BRH70-20V', qty: 20, unit_price: 187, sku: 'BT-BRH70-20V' },
      { model: 'AG180',     qty: 15, unit_price: 97,  sku: 'BT-AG180'     },
      { model: 'BI-BTS125', qty: 8,  unit_price: 135, sku: 'BT-BTS125'    },
    ],
    notes: 'Black Friday stock build-up.',
  },
  {
    id: 'mo008', invoice_number: 'INV-2024-0290', order_date: '2024-09-30',
    expected_delivery: '2024-10-07', status: 'cancelled', total: 1_500,
    warehouse: 'BEITER Factory – Mannheim',
    items: [
      { model: 'BOS-D18', qty: 10, unit_price: 112, sku: 'BT-BOSD18' },
      { model: 'BOS-ID18', qty: 5, unit_price: 120, sku: 'BT-BOSID18' },
    ],
    notes: 'Cancelled — product line temporarily out of stock at factory.',
  },
];

const RESELLER_SALES: ResellerSale[] = [
  {
    id: 'rs001', invoice_number: 'BB-INV-2025-0047', sale_date: '2025-02-25',
    due_date: '2025-03-25', status: 'pending', total: 2_340,
    reseller_name: 'Werkhaus GmbH', reseller_city: 'Munich',
    contact: '+49 89 120 34 500', delivery_method: 'DPD Same-Day',
    items: [
      { model: 'BRH70-20V', qty: 6, unit_price: 210, sku: 'BT-BRH70-20V' },
      { model: 'AG180',     qty: 8, unit_price: 112, sku: 'BT-AG180'     },
    ],
  },
  {
    id: 'rs002', invoice_number: 'BB-INV-2025-0041', sale_date: '2025-02-18',
    due_date: '2025-03-18', paid_date: '2025-02-20', status: 'paid', total: 1_890,
    reseller_name: 'Vogt Werkzeuge', reseller_city: 'Hamburg',
    contact: '+49 40 987 65 43', delivery_method: 'Self-collect',
    items: [
      { model: 'BI-BTS125', qty: 7, unit_price: 155, sku: 'BT-BTS125'   },
      { model: 'TIGE-3DG',  qty: 5, unit_price: 163, sku: 'BT-TIGE3DG'  },
    ],
  },
  {
    id: 'rs003', invoice_number: 'BB-INV-2025-0035', sale_date: '2025-02-10',
    due_date: '2025-03-10', paid_date: '2025-02-14', status: 'paid', total: 3_120,
    reseller_name: 'Norbau Retail AG', reseller_city: 'Berlin',
    contact: '+49 30 445 67 100', delivery_method: 'DHL Express',
    items: [
      { model: 'BRH70-20V', qty: 8,  unit_price: 218, sku: 'BT-BRH70-20V' },
      { model: 'BOS-ID18',  qty: 10, unit_price: 136, sku: 'BT-BOSID18'   },
    ],
  },
  {
    id: 'rs004', invoice_number: 'BB-INV-2025-0022', sale_date: '2025-01-28',
    due_date: '2025-02-27', status: 'overdue', total: 1_478,
    reseller_name: 'Krafft GmbH & Co.', reseller_city: 'Stuttgart',
    contact: '+49 711 234 56 78', delivery_method: 'DPD Standard',
    items: [
      { model: 'AG180',    qty: 7, unit_price: 112, sku: 'BT-AG180'   },
      { model: 'BOS-D18', qty: 5, unit_price: 126, sku: 'BT-BOSD18'  },
    ],
    notes: '⚠️ Payment overdue — 2nd reminder sent 03.03.2025.',
  },
  {
    id: 'rs005', invoice_number: 'BB-INV-2025-0014', sale_date: '2025-01-15',
    due_date: '2025-02-14', paid_date: '2025-02-10', status: 'paid', total: 2_720,
    reseller_name: 'Steinbach AG', reseller_city: 'Frankfurt',
    contact: '+49 69 888 77 66', delivery_method: 'DHL Express',
    items: [
      { model: 'BRH70-20V', qty: 5, unit_price: 218, sku: 'BT-BRH70-20V' },
      { model: 'BI-BTS125', qty: 6, unit_price: 155, sku: 'BT-BTS125'    },
      { model: 'TIGE-3DG',  qty: 4, unit_price: 163, sku: 'BT-TIGE3DG'   },
    ],
  },
  {
    id: 'rs006', invoice_number: 'BB-INV-2025-0006', sale_date: '2025-01-05',
    due_date: '2025-02-04', paid_date: '2025-01-30', status: 'paid', total: 1_650,
    reseller_name: 'Werkhaus GmbH', reseller_city: 'Munich',
    contact: '+49 89 120 34 500', delivery_method: 'Self-collect',
    items: [
      { model: 'AG180',    qty: 10, unit_price: 112, sku: 'BT-AG180'  },
      { model: 'BOS-D18', qty: 5,  unit_price: 126, sku: 'BT-BOSD18' },
    ],
  },
  {
    id: 'rs007', invoice_number: 'BB-INV-2024-0198', sale_date: '2024-12-10',
    due_date: '2025-01-09', paid_date: '2025-01-07', status: 'paid', total: 4_440,
    reseller_name: 'Norbau Retail AG', reseller_city: 'Berlin',
    contact: '+49 30 445 67 100', delivery_method: 'UPS Express',
    items: [
      { model: 'BRH70-20V', qty: 10, unit_price: 218, sku: 'BT-BRH70-20V' },
      { model: 'BI-BTS125', qty: 8,  unit_price: 155, sku: 'BT-BTS125'    },
      { model: 'BOS-ID18',  qty: 8,  unit_price: 136, sku: 'BT-BOSID18'   },
    ],
    notes: 'Year-end bulk order — special pricing applied.',
  },
  {
    id: 'rs008', invoice_number: 'BB-INV-2024-0177', sale_date: '2024-11-22',
    due_date: '2024-12-22', paid_date: '2024-12-18', status: 'paid', total: 3_270,
    reseller_name: 'Vogt Werkzeuge', reseller_city: 'Hamburg',
    contact: '+49 40 987 65 43', delivery_method: 'DHL Express',
    items: [
      { model: 'BRH70-20V', qty: 8,  unit_price: 218, sku: 'BT-BRH70-20V' },
      { model: 'TIGE-3DG',  qty: 6,  unit_price: 163, sku: 'BT-TIGE3DG'   },
      { model: 'AG180',     qty: 5,  unit_price: 112, sku: 'BT-AG180'     },
    ],
  },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const fmt = (n: number) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = (d: string) => new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });

const ORDER_STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string; darkBg: string; Icon: React.ElementType }> = {
  processing: { label: 'Processing', color: '#FF9500', bg: '#FFF3E0', darkBg: '#3A2800', Icon: Clock },
  shipped:    { label: 'Shipped',    color: '#007AFF', bg: '#EFF6FF', darkBg: '#0A1A3A', Icon: Truck },
  delivered:  { label: 'Delivered',  color: '#34C759', bg: '#E8F8EE', darkBg: '#0D2A1A', Icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: '#E31E24', bg: '#FFF0F0', darkBg: '#3A1010', Icon: XCircle },
};

const INV_STATUS_CFG: Record<InvoiceStatus, { label: string; color: string; bg: string; darkBg: string }> = {
  paid:    { label: 'Paid',    color: '#34C759', bg: '#E8F8EE', darkBg: '#0D2A1A' },
  pending: { label: 'Pending', color: '#FF9500', bg: '#FFF3E0', darkBg: '#3A2800' },
  overdue: { label: 'Overdue', color: '#E31E24', bg: '#FFF0F0', darkBg: '#3A1010' },
};

const TRACKING_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'processing', label: 'Order Placed'    },
  { key: 'shipped',    label: 'Dispatched'      },
  { key: 'delivered',  label: 'Delivered'       },
];
const stepIndex = (s: OrderStatus) => TRACKING_STEPS.findIndex(t => t.key === s);

/* ─── Sub-components ─────────────────────────────────────────────────── */
function StatusPill({ status, dm }: { status: OrderStatus; dm: boolean }) {
  const cfg = ORDER_STATUS_CFG[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: dm ? cfg.darkBg : cfg.bg, color: cfg.color }}>
      <cfg.Icon size={11} /> {cfg.label}
    </span>
  );
}

function InvPill({ status, dm }: { status: InvoiceStatus; dm: boolean }) {
  const cfg = INV_STATUS_CFG[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: dm ? cfg.darkBg : cfg.bg, color: cfg.color }}>
      {status === 'overdue' && <AlertCircle size={11} />}
      {status === 'paid'    && <CheckCircle size={11} />}
      {status === 'pending' && <Clock size={11} />}
      {cfg.label}
    </span>
  );
}

/* ── Manufacturer order row ── */
function MfgOrderRow({ o, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: {
  o: ManufacturerOrder; dm: boolean;
  CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}) {
  const [open, setOpen] = useState(false);
  const cfg = ORDER_STATUS_CFG[o.status];
  return (
    <div style={{ border: `1px solid ${open ? cfg.color + '44' : BORDER}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: CARD, border: 'none', cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, fontFamily: FF, textAlign: 'left' }}
      >
        {/* Icon */}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: dm ? cfg.darkBg : cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <cfg.Icon size={19} style={{ color: cfg.color }} />
        </div>
        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>{o.invoice_number}</span>
            <StatusPill status={o.status} dm={dm} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} /> {fmtDate(o.order_date)}</span>
            <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}><Boxes size={12} /> {o.items.reduce((s, i) => s + i.qty, 0)} units · {o.items.length} SKUs</span>
            {o.carrier && <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}><Truck size={12} /> {o.carrier}</span>}
          </div>
        </div>
        {/* Total */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 19, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</p>
          <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0' }}>
            {o.status === 'delivered' && o.actual_delivery ? `Delivered ${fmtDate(o.actual_delivery)}` : `ETA ${fmtDate(o.expected_delivery)}`}
          </p>
        </div>
        {open ? <ChevronUp size={15} style={{ color: MUTED, flexShrink: 0 }} /> : <ChevronDown size={15} style={{ color: MUTED, flexShrink: 0 }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 18px 16px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                {/* Items table */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Line Items</p>
                  <div style={{ background: INPUT_BG, borderRadius: 11, overflow: 'hidden' }}>
                    {o.items.map((item, i) => (
                      <div key={item.sku} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 15px', borderBottom: i < o.items.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{item.model}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>{item.sku} · ×{item.qty}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>€{fmt(item.qty * item.unit_price)}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>€{fmt(item.unit_price)} / unit</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>Total</span>
                      <span style={{ fontSize: 15, fontWeight: 900, color: '#E31E24', fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</span>
                    </div>
                  </div>
                </div>
                {/* Details */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Details</p>
                  <div style={{ background: INPUT_BG, borderRadius: 11, padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Supplier',  val: 'BEITER Tools AG',  Icon: Factory },
                      { label: 'Warehouse', val: o.warehouse,         Icon: MapPin },
                      { label: 'Carrier',   val: o.carrier || '—',   Icon: Truck },
                      { label: 'Tracking',  val: o.tracking_number ? o.tracking_number.replace(/(.{12})/, '$1…') : '—', Icon: Hash },
                      { label: 'Ordered',   val: fmtDate(o.order_date),           Icon: Calendar },
                      { label: o.status === 'delivered' ? 'Delivered' : 'ETA',
                        val: o.status === 'delivered' && o.actual_delivery ? fmtDate(o.actual_delivery) : fmtDate(o.expected_delivery),
                        Icon: CheckCircle },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <row.Icon size={13} style={{ color: MUTED, marginTop: 1, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{row.label}: </span>
                          <span style={{ fontSize: 12, color: TEXT, fontWeight: 700, wordBreak: 'break-all' }}>{row.val}</span>
                        </div>
                      </div>
                    ))}
                    {o.notes && (
                      <div style={{ marginTop: 4, padding: '9px 12px', background: dm ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderRadius: 9, fontSize: 12, color: MUTED, lineHeight: 1.6 }}>{o.notes}</div>
                    )}
                  </div>
                  <button style={{ marginTop: 12, width: '100%', height: 40, borderRadius: 10, border: `1px solid ${BORDER}`, background: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: MUTED, fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Download size={14} /> Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Reseller sale row ── */
function ResellerRow({ s, dm, CARD, BORDER, TEXT, MUTED, INPUT_BG }: {
  s: ResellerSale; dm: boolean;
  CARD: string; BORDER: string; TEXT: string; MUTED: string; INPUT_BG: string;
}) {
  const [open, setOpen] = useState(false);
  const cfg = INV_STATUS_CFG[s.status];
  return (
    <div style={{ border: `1px solid ${open ? cfg.color + '44' : BORDER}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', background: CARD, border: 'none', cursor: 'pointer', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, fontFamily: FF, textAlign: 'left' }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: dm ? cfg.darkBg : cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Building2 size={19} style={{ color: cfg.color }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>{s.invoice_number}</span>
            <InvPill status={s.status} dm={dm} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}><Building2 size={12} /> {s.reseller_name}</span>
            <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={12} /> {s.reseller_city}</span>
            <span style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={12} /> {fmtDate(s.sale_date)}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontSize: 19, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(s.total)}</p>
          <p style={{ fontSize: 12, color: s.status === 'overdue' ? '#E31E24' : MUTED, margin: '3px 0 0', fontWeight: s.status === 'overdue' ? 700 : 400 }}>
            {s.status === 'paid' && s.paid_date ? `Paid ${fmtDate(s.paid_date)}` : `Due ${fmtDate(s.due_date)}`}
          </p>
        </div>
        {open ? <ChevronUp size={15} style={{ color: MUTED, flexShrink: 0 }} /> : <ChevronDown size={15} style={{ color: MUTED, flexShrink: 0 }} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 18px 16px', background: CARD, borderTop: `1px solid ${BORDER}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Line Items</p>
                  <div style={{ background: INPUT_BG, borderRadius: 11, overflow: 'hidden' }}>
                    {s.items.map((item, i) => (
                      <div key={item.sku} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 15px', borderBottom: i < s.items.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{item.model}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>{item.sku} · ×{item.qty}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>€{fmt(item.qty * item.unit_price)}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0' }}>€{fmt(item.unit_price)} / unit</p>
                        </div>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 15px', borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: MUTED }}>Total</span>
                      <span style={{ fontSize: 15, fontWeight: 900, color: '#34C759', fontVariantNumeric: 'tabular-nums' }}>€{fmt(s.total)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>Details</p>
                  <div style={{ background: INPUT_BG, borderRadius: 11, padding: '12px 15px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Customer',  val: s.reseller_name,       Icon: Building2  },
                      { label: 'City',      val: s.reseller_city,        Icon: MapPin     },
                      { label: 'Contact',   val: s.contact,              Icon: Hash       },
                      { label: 'Delivery',  val: s.delivery_method,      Icon: Truck      },
                      { label: 'Issued',    val: fmtDate(s.sale_date),   Icon: Calendar   },
                      { label: s.status === 'paid' ? 'Paid on' : 'Due', val: s.status === 'paid' && s.paid_date ? fmtDate(s.paid_date) : fmtDate(s.due_date), Icon: CheckCircle },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                        <row.Icon size={13} style={{ color: MUTED, marginTop: 1, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{row.label}: </span>
                          <span style={{ fontSize: 12, color: TEXT, fontWeight: 700 }}>{row.val}</span>
                        </div>
                      </div>
                    ))}
                    {s.notes && (
                      <div style={{ marginTop: 4, padding: '9px 12px', background: dm ? 'rgba(227,30,36,0.1)' : '#FFF0F0', borderRadius: 9, fontSize: 12, color: '#E31E24', lineHeight: 1.6, fontWeight: 600 }}>{s.notes}</div>
                    )}
                  </div>
                  <button style={{ marginTop: 10, width: '100%', height: 36, borderRadius: 9, border: `1px solid ${BORDER}`, background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Download size={12} /> Download Receipt
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
export default function WebOrders() {
  const { darkMode } = useDistributorStore();
  const dm = darkMode;

  const BG      = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD    = dm ? '#1c1c1e' : '#ffffff';
  const BORDER  = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT    = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED   = dm ? '#636366' : '#8E8E93';
  const SHADOW  = dm ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.07)';
  const INPUT_BG = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const [mainTab,        setMainTab]        = useState<MainTab>('history');
  const [histSource,     setHistSource]     = useState<HistorySource>('manufacturer');
  const [receiptSource,  setReceiptSource]  = useState<ReceiptSource>('manufacturer');
  const [query,          setQuery]          = useState('');
  const [statusFilter,   setStatusFilter]   = useState<string>('all');
  const [expandedReceipt, setExpandedReceipt] = useState<string | null>(null);

  /* KPI aggregates */
  const totalMfgValue    = MFG_ORDERS.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const totalSalesValue  = RESELLER_SALES.reduce((s, r) => s + r.total, 0);
  const pendingInvoices  = RESELLER_SALES.filter(r => r.status === 'pending' || r.status === 'overdue');
  const pendingValue     = pendingInvoices.reduce((s, r) => s + r.total, 0);
  const activeOrders     = MFG_ORDERS.filter(o => o.status === 'processing' || o.status === 'shipped');
  const overdueCount     = RESELLER_SALES.filter(r => r.status === 'overdue').length;

  /* Filtered history lists */
  const filteredMfg = useMemo(() => {
    let list = MFG_ORDERS;
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(o => o.invoice_number.toLowerCase().includes(q) || o.items.some(i => i.model.toLowerCase().includes(q)));
    }
    return list;
  }, [statusFilter, query]);

  const filteredSales = useMemo(() => {
    let list = RESELLER_SALES;
    if (statusFilter !== 'all') list = list.filter(r => r.status === statusFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r => r.invoice_number.toLowerCase().includes(q) || r.reseller_name.toLowerCase().includes(q) || r.items.some(i => i.model.toLowerCase().includes(q)));
    }
    return list;
  }, [statusFilter, query]);

  /* Receipts filtered */
  const filteredReceiptsMfg = useMemo(() => {
    if (!query.trim()) return MFG_ORDERS.filter(o => o.status === 'delivered');
    const q = query.toLowerCase();
    return MFG_ORDERS.filter(o => o.status === 'delivered' && (o.invoice_number.toLowerCase().includes(q) || o.items.some(i => i.model.toLowerCase().includes(q))));
  }, [query]);

  const filteredReceiptsSales = useMemo(() => {
    if (!query.trim()) return RESELLER_SALES;
    const q = query.toLowerCase();
    return RESELLER_SALES.filter(r => r.invoice_number.toLowerCase().includes(q) || r.reseller_name.toLowerCase().includes(q));
  }, [query]);

  const TABS: { key: MainTab; label: string; Icon: React.ElementType }[] = [
    { key: 'history',  label: 'Order History',  Icon: ShoppingCart },
    { key: 'tracking', label: 'Order Tracking', Icon: Truck        },
    { key: 'receipts', label: 'Receipts Vault', Icon: Receipt      },
  ];

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg, #C8161C, #E31E24)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.03em' }}>Orders & Receipts</h1>
            <p style={{ fontSize: 14, color: MUTED, margin: 0 }}>Full purchase + sales history with receipt vault</p>
          </div>
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'Total Purchased (YTD)',   val: `€${(totalMfgValue / 1000).toFixed(1)}k`,   Icon: Factory,     color: '#007AFF', bg: '#EFF6FF', dbg: '#0A1A3A', sub: `${MFG_ORDERS.filter(o => o.status !== 'cancelled').length} orders from BEITER` },
          { label: 'Total Sold (YTD)',         val: `€${(totalSalesValue / 1000).toFixed(1)}k`, Icon: TrendingUp,  color: '#34C759', bg: '#E8F8EE', dbg: '#0D2A1A', sub: `${RESELLER_SALES.length} invoices to re-distributors` },
          { label: 'Active Shipments',         val: String(activeOrders.length),                Icon: Truck,       color: '#FF9500', bg: '#FFF3E0', dbg: '#3A2800', sub: activeOrders.map(o => o.invoice_number).join(', ') || 'None' },
          { label: 'Outstanding Receivables',  val: `€${fmt(pendingValue)}`,                   Icon: AlertCircle, color: overdueCount > 0 ? '#E31E24' : '#FF9500', bg: overdueCount > 0 ? '#FFF0F0' : '#FFF3E0', dbg: overdueCount > 0 ? '#3A1010' : '#3A2800', sub: `${overdueCount} overdue · ${pendingInvoices.length - overdueCount} pending` },
        ].map(k => (
          <div key={k.label} style={{ background: CARD, borderRadius: 16, padding: '16px 18px', border: `1px solid ${BORDER}`, boxShadow: SHADOW }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: dm ? k.dbg : k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.Icon size={16} style={{ color: k.color }} />
              </div>
            </div>
            <p style={{ fontSize: 26, fontWeight: 900, color: TEXT, margin: '0 0 3px', fontVariantNumeric: 'tabular-nums' }}>{k.val}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: k.color, margin: '0 0 4px' }}>{k.label}</p>
            <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.4 }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main tabs ── */}
      <div style={{ background: CARD, borderRadius: 18, boxShadow: SHADOW, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}`, padding: '0 20px' }}>
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => { setMainTab(key); setQuery(''); setStatusFilter('all'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '18px 22px', border: 'none', cursor: 'pointer',
                borderBottom: mainTab === key ? '2.5px solid #E31E24' : '2.5px solid transparent',
                background: 'none', fontFamily: FF, fontSize: 14, fontWeight: mainTab === key ? 800 : 500,
                color: mainTab === key ? '#E31E24' : MUTED, transition: 'all 0.15s', marginRight: 4,
              }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* ══════════ ORDER HISTORY TAB ══════════ */}
        {mainTab === 'history' && (
          <div style={{ padding: 20 }}>
            {/* Source toggle + search + filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Source toggle */}
              <div style={{ display: 'flex', background: INPUT_BG, borderRadius: 11, padding: 3, gap: 3, flexShrink: 0 }}>
                {([
                  { key: 'manufacturer' as HistorySource, label: '🏭  From BEITER', color: '#007AFF' },
                  { key: 'reseller'     as HistorySource, label: '🏪  To Re-distributors', color: '#34C759' },
                ] as const).map(({ key, label, color }) => (
                  <button key={key} onClick={() => { setHistSource(key); setStatusFilter('all'); setQuery(''); }}
                    style={{ padding: '9px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: histSource === key ? 800 : 500, background: histSource === key ? (dm ? '#222' : '#fff') : 'transparent', color: histSource === key ? color : MUTED, boxShadow: histSource === key ? '0 1px 6px rgba(0,0,0,0.12)' : 'none', transition: 'all 0.15s' }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: INPUT_BG, borderRadius: 10, padding: '8px 14px' }}>
                <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search invoice, model…"
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: TEXT, flex: 1, fontFamily: FF }} />
              </div>
              {/* Status filters */}
              <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                {(histSource === 'manufacturer'
                  ? ['all', 'processing', 'shipped', 'delivered', 'cancelled']
                  : ['all', 'paid', 'pending', 'overdue']
                ).map(f => (
                  <button key={f} onClick={() => setStatusFilter(f)}
                    style={{ height: 36, padding: '0 14px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FF, background: statusFilter === f ? '#E31E24' : INPUT_BG, color: statusFilter === f ? '#fff' : MUTED, transition: 'all 0.15s', textTransform: 'capitalize' }}>
                    {f === 'all' ? 'All' : f}
                  </button>
                ))}
              </div>
            </div>

            {/* Order rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {histSource === 'manufacturer'
                ? filteredMfg.map(o => <MfgOrderRow key={o.id} o={o} dm={dm} CARD={CARD} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} INPUT_BG={INPUT_BG} />)
                : filteredSales.map(s => <ResellerRow key={s.id} s={s} dm={dm} CARD={CARD} BORDER={BORDER} TEXT={TEXT} MUTED={MUTED} INPUT_BG={INPUT_BG} />)
              }
              {((histSource === 'manufacturer' && filteredMfg.length === 0) || (histSource === 'reseller' && filteredSales.length === 0)) && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED }}>
                  <Search size={28} style={{ opacity: 0.3, marginBottom: 10 }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>No orders found</p>
                  <p style={{ fontSize: 12, margin: 0 }}>Adjust your search or filter</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ ORDER TRACKING TAB ══════════ */}
        {mainTab === 'tracking' && (
          <div style={{ padding: 20 }}>
            {/* Active shipments */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34C759' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>Active Shipments</span>
                <span style={{ padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: '#FF9500', color: '#fff' }}>{activeOrders.length}</span>
              </div>

              {activeOrders.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 0', color: MUTED, background: INPUT_BG, borderRadius: 14 }}>
                  <CheckCircle size={26} style={{ opacity: 0.3, marginBottom: 8, color: '#34C759' }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>All orders delivered</p>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activeOrders.map((o) => {
                  const cfg  = ORDER_STATUS_CFG[o.status];
                  const step = stepIndex(o.status);
                  return (
                    <motion.div key={o.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      style={{ background: CARD, border: `1.5px solid ${cfg.color}44`, borderRadius: 18, padding: '18px 20px', boxShadow: SHADOW }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 15, fontWeight: 900, color: TEXT }}>{o.invoice_number}</span>
                            <StatusPill status={o.status} dm={dm} />
                          </div>
                          <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>
                            Ordered {fmtDate(o.order_date)} · ETA <strong style={{ color: TEXT }}>{fmtDate(o.expected_delivery)}</strong>
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: 18, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</p>
                          <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0' }}>{o.carrier || 'Carrier TBC'}</p>
                        </div>
                      </div>

                      {/* Step tracker */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 16, position: 'relative' }}>
                        {TRACKING_STEPS.map((ts, i) => {
                          const done    = i <= step;
                          const current = i === step;
                          return (
                            <div key={ts.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                              {/* Connector left */}
                              {i > 0 && (
                                <div style={{ position: 'absolute', top: 14, left: 0, width: '50%', height: 3, background: i <= step ? cfg.color : (dm ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'), transition: 'background 0.3s' }} />
                              )}
                              {/* Connector right */}
                              {i < TRACKING_STEPS.length - 1 && (
                                <div style={{ position: 'absolute', top: 14, right: 0, width: '50%', height: 3, background: i < step ? cfg.color : (dm ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'), transition: 'background 0.3s' }} />
                              )}
                              {/* Circle */}
                              <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2.5px solid ${done ? cfg.color : (dm ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)')}`, background: done ? (dm ? cfg.darkBg : cfg.bg) : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, transition: 'all 0.3s' }}>
                                {done ? <CheckCircle size={13} style={{ color: cfg.color }} /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: dm ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }} />}
                              </div>
                              <span style={{ fontSize: 10, fontWeight: current ? 800 : 500, color: current ? cfg.color : (done ? TEXT : MUTED), marginTop: 6, whiteSpace: 'nowrap' }}>{ts.label}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Tracking number + items */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div style={{ background: INPUT_BG, borderRadius: 10, padding: '10px 13px' }}>
                          <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tracking Number</p>
                          {o.tracking_number
                            ? <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, margin: 0, wordBreak: 'break-all' }}>{o.tracking_number}</p>
                            : <p style={{ fontSize: 13, color: MUTED, margin: 0, fontStyle: 'italic' }}>Assigned when dispatched</p>
                          }
                          <p style={{ fontSize: 12, color: MUTED, margin: '5px 0 0' }}>via {o.carrier || 'TBC'} · {o.warehouse}</p>
                        </div>
                        <div style={{ background: INPUT_BG, borderRadius: 11, padding: '12px 14px' }}>
                          <p style={{ fontSize: 12, color: MUTED, fontWeight: 700, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipment Contents</p>
                          {o.items.map(item => (
                            <div key={item.sku} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ fontSize: 13, color: TEXT, fontWeight: 700 }}>{item.model}</span>
                              <span style={{ fontSize: 13, color: MUTED }}>×{item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Recent deliveries */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <CheckCircle size={14} style={{ color: '#34C759' }} />
                <span style={{ fontSize: 14, fontWeight: 800, color: TEXT }}>Recent Deliveries</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: INPUT_BG, borderRadius: 14, overflow: 'hidden' }}>
                {MFG_ORDERS.filter(o => o.status === 'delivered').slice(0, 5).map((o, i, arr) => (
                  <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', background: CARD, borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 9, background: dm ? '#0D2A1A' : '#E8F8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle size={14} style={{ color: '#34C759' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: 0 }}>{o.invoice_number}</p>
                      <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0' }}>
                        {o.items.map(i => `${i.model} ×${i.qty}`).join(' · ')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#34C759', margin: 0 }}>Delivered</p>
                      <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0' }}>{o.actual_delivery ? fmtDate(o.actual_delivery) : '��'}</p>
                    </div>
                    <ChevronRight size={15} style={{ color: MUTED }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ RECEIPTS VAULT TAB ══════════ */}
        {mainTab === 'receipts' && (
          <div style={{ padding: 20 }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Source toggle */}
              <div style={{ display: 'flex', background: INPUT_BG, borderRadius: 11, padding: 3, gap: 3, flexShrink: 0 }}>
                {([
                  { key: 'manufacturer' as ReceiptSource, label: '🏭  Purchase Invoices', sub: 'From BEITER Tools AG' },
                  { key: 'reseller'     as ReceiptSource, label: '🏪  Sales Receipts',    sub: 'To Re-distributors' },
                ] as const).map(({ key, label }) => (
                  <button key={key} onClick={() => { setReceiptSource(key); setQuery(''); }}
                    style={{ padding: '9px 18px', borderRadius: 9, border: 'none', cursor: 'pointer', fontFamily: FF, fontSize: 13, fontWeight: receiptSource === key ? 800 : 500, background: receiptSource === key ? (dm ? '#222' : '#fff') : 'transparent', color: receiptSource === key ? (key === 'manufacturer' ? '#007AFF' : '#34C759') : MUTED, boxShadow: receiptSource === key ? '0 1px 6px rgba(0,0,0,0.12)' : 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                    {label}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div style={{ flex: 1, minWidth: 200, display: 'flex', alignItems: 'center', gap: 8, background: INPUT_BG, borderRadius: 10, padding: '8px 14px' }}>
                <Search size={13} style={{ color: MUTED, flexShrink: 0 }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search invoice number, model, partner…"
                  style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: TEXT, flex: 1, fontFamily: FF }} />
              </div>
              {/* Summary chip */}
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ padding: '6px 14px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: dm ? '#0A1A3A' : '#EFF6FF', color: '#007AFF' }}>
                  {receiptSource === 'manufacturer' ? filteredReceiptsMfg.length : filteredReceiptsSales.length} documents
                </span>
              </div>
            </div>

            {/* Section description */}
            <div style={{ background: dm ? (receiptSource === 'manufacturer' ? '#0A1A3A' : '#0D2A1A') : (receiptSource === 'manufacturer' ? '#EFF6FF' : '#E8F8EE'), borderRadius: 12, padding: '12px 16px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              {receiptSource === 'manufacturer' ? <Factory size={15} style={{ color: '#007AFF', flexShrink: 0 }} /> : <Building2 size={15} style={{ color: '#34C759', flexShrink: 0 }} />}
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: receiptSource === 'manufacturer' ? '#007AFF' : '#34C759', margin: 0 }}>
                  {receiptSource === 'manufacturer' ? 'Purchase Invoices from BEITER Tools AG' : 'Sales Receipts issued to Re-distributors'}
                </p>
                <p style={{ fontSize: 12, color: MUTED, margin: '3px 0 0' }}>
                  {receiptSource === 'manufacturer'
                    ? `Total purchased: €${fmt(MFG_ORDERS.filter(o => o.status === 'delivered').reduce((s, o) => s + o.total, 0))} · ${filteredReceiptsMfg.length} invoices`
                    : `Total billed: €${fmt(RESELLER_SALES.reduce((s, r) => s + r.total, 0))} · ${filteredReceiptsSales.length} receipts · ${overdueCount} overdue`}
                </p>
              </div>
            </div>

            {/* ── Manufacturer purchase invoices ── */}
            {receiptSource === 'manufacturer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredReceiptsMfg.map(o => {
                  const isExpanded = expandedReceipt === o.id;
                  return (
                    <div key={o.id} style={{ background: CARD, border: `1px solid ${isExpanded ? '#007AFF44' : BORDER}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: dm ? '#0A1A3A' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText size={19} style={{ color: '#007AFF' }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 800, color: TEXT, margin: 0 }}>{o.invoice_number}</p>
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>{fmtDate(o.order_date)} · BEITER Tools AG, Mannheim · {o.carrier}</p>
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>
                            {o.items.map(i => `${i.model} ×${i.qty}`).join(' · ')}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                          <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</p>
                          <p style={{ fontSize: 10, color: '#34C759', margin: '2px 0 0', fontWeight: 700 }}>Paid</p>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => setExpandedReceipt(isExpanded ? null : o.id)}
                            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={13} style={{ color: MUTED }} />
                          </button>
                          <button style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#C8161C,#E31E24)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={13} color="#fff" />
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${BORDER}` }}>
                              <div style={{ marginTop: 14, background: INPUT_BG, borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px', gap: 0, padding: '8px 14px', borderBottom: `1px solid ${BORDER}` }}>
                                  {['Model / SKU', 'Qty', 'Unit Price', 'Subtotal'].map(h => (
                                    <span key={h} style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                                  ))}
                                </div>
                                {o.items.map((item, i) => (
                                  <div key={item.sku} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px', gap: 0, padding: '10px 14px', borderBottom: i < o.items.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                                    <div><p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{item.model}</p><p style={{ fontSize: 10, color: MUTED, margin: '1px 0 0' }}>{item.sku}</p></div>
                                    <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>×{item.qty}</span>
                                    <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>€{fmt(item.unit_price)}</span>
                                    <span style={{ fontSize: 12, color: TEXT, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>€{fmt(item.qty * item.unit_price)}</span>
                                  </div>
                                ))}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px', gap: 0, padding: '10px 14px', borderTop: `1px solid ${BORDER}`, background: dm ? 'rgba(0,122,255,0.06)' : 'rgba(0,122,255,0.03)' }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, gridColumn: '1/4' }}>Total (excl. VAT)</span>
                                  <span style={{ fontSize: 14, fontWeight: 900, color: '#007AFF', fontVariantNumeric: 'tabular-nums' }}>€{fmt(o.total)}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ── Reseller sales receipts ── */}
            {receiptSource === 'reseller' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filteredReceiptsSales.map(s => {
                  const invCfg   = INV_STATUS_CFG[s.status];
                  const isExpanded = expandedReceipt === s.id;
                  return (
                    <div key={s.id} style={{ background: CARD, border: `1px solid ${isExpanded ? invCfg.color + '44' : (s.status === 'overdue' ? '#E31E2433' : BORDER)}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: dm ? invCfg.darkBg : invCfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Receipt size={16} style={{ color: invCfg.color }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <p style={{ fontSize: 13, fontWeight: 800, color: TEXT, margin: 0 }}>{s.invoice_number}</p>
                            <InvPill status={s.status} dm={dm} />
                          </div>
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Building2 size={10} /> {s.reseller_name}, {s.reseller_city} · {fmtDate(s.sale_date)}
                          </p>
                          <p style={{ fontSize: 11, color: MUTED, margin: '2px 0 0' }}>
                            {s.items.map(i => `${i.model} ×${i.qty}`).join(' · ')}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                          <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: 0, fontVariantNumeric: 'tabular-nums' }}>€{fmt(s.total)}</p>
                          <p style={{ fontSize: 10, color: invCfg.color, margin: '2px 0 0', fontWeight: 700 }}>
                            {s.status === 'paid' && s.paid_date ? `Paid ${fmtDate(s.paid_date)}` : `Due ${fmtDate(s.due_date)}`}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                          <button
                            onClick={() => setExpandedReceipt(isExpanded ? null : s.id)}
                            style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={13} style={{ color: MUTED }} />
                          </button>
                          <button style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#C8161C,#E31E24)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Download size={13} color="#fff" />
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                            <div style={{ padding: '0 18px 16px', borderTop: `1px solid ${BORDER}` }}>
                              <div style={{ marginTop: 14, background: INPUT_BG, borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px', gap: 0, padding: '8px 14px', borderBottom: `1px solid ${BORDER}` }}>
                                  {['Model / SKU', 'Qty', 'Unit Price', 'Subtotal'].map(h => (
                                    <span key={h} style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                                  ))}
                                </div>
                                {s.items.map((item, i) => (
                                  <div key={item.sku} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px', gap: 0, padding: '10px 14px', borderBottom: i < s.items.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                                    <div><p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>{item.model}</p><p style={{ fontSize: 10, color: MUTED, margin: '1px 0 0' }}>{item.sku}</p></div>
                                    <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>×{item.qty}</span>
                                    <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>€{fmt(item.unit_price)}</span>
                                    <span style={{ fontSize: 12, color: TEXT, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>€{fmt(item.qty * item.unit_price)}</span>
                                  </div>
                                ))}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px', gap: 0, padding: '10px 14px', borderTop: `1px solid ${BORDER}`, background: dm ? 'rgba(52,199,89,0.06)' : 'rgba(52,199,89,0.04)' }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: MUTED, gridColumn: '1/4' }}>Total (excl. VAT)</span>
                                  <span style={{ fontSize: 14, fontWeight: 900, color: '#34C759', fontVariantNumeric: 'tabular-nums' }}>€{fmt(s.total)}</span>
                                </div>
                              </div>
                              {s.notes && (
                                <div style={{ marginTop: 10, padding: '9px 13px', background: dm ? 'rgba(227,30,36,0.1)' : '#FFF0F0', borderRadius: 9, fontSize: 11, color: '#E31E24', fontWeight: 600, lineHeight: 1.5 }}>{s.notes}</div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {((receiptSource === 'manufacturer' && filteredReceiptsMfg.length === 0) ||
              (receiptSource === 'reseller' && filteredReceiptsSales.length === 0)) && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: MUTED }}>
                <Receipt size={28} style={{ opacity: 0.3, marginBottom: 10 }} />
                <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>No receipts found</p>
                <p style={{ fontSize: 12, margin: 0 }}>Try a different search term</p>
              </div>
            )}

            {/* Total summary footer */}
            <div style={{ marginTop: 20, padding: '14px 18px', background: INPUT_BG, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ArrowUpRight size={14} style={{ color: MUTED }} />
                <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>
                  {receiptSource === 'manufacturer' ? 'All invoices settled · No outstanding payables to BEITER' : `Outstanding receivables: €${fmt(pendingValue)} across ${pendingInvoices.length} open invoices`}
                </span>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg,#C8161C,#E31E24)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: FF }}>
                <Download size={12} /> Export All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
