import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Package, Truck, ChevronRight, Plus, Minus, ShoppingCart,
  AlertTriangle, Check, X, ChevronLeft, TrendingUp, Clock, Euro,
} from 'lucide-react';
import { useDistributorStore, CatalogProduct, StockOrder } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type CategoryFilter = 'all' | string;

function fmt(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function ProductDetail({ product, onBack }: { product: CatalogProduct; onBack: () => void }) {
  const { addOrder, darkMode } = useDistributorStore();
  const dm = darkMode;
  const [qty, setQty]         = useState(product.min_order);
  const [ordered, setOrdered] = useState(false);
  const total = qty * product.distributor_price;

  const STOCK_CFG_DM = {
    in_stock:     { label: 'In Stock',     color: '#34C759', bg: dm ? '#0D2A1A' : '#E8F8EE', dot: '#34C759' },
    low_stock:    { label: 'Low Stock',    color: '#FF9500', bg: dm ? '#3A2800' : '#FFF3E0', dot: '#FF9500' },
    out_of_stock: { label: 'Out of Stock', color: '#C0392B', bg: dm ? '#3A0D0D' : '#FFEEEE', dot: '#E31E24' },
  };
  const sc = STOCK_CFG_DM[product.stock_level];
  const cardShadow = dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)';

  const placeOrder = () => {
    const order: StockOrder = {
      id:                'ord_' + Date.now(),
      order_date:        new Date().toISOString().split('T')[0],
      expected_delivery: new Date(Date.now() + product.lead_time_days * 86400000).toISOString().split('T')[0],
      status:            'processing',
      total:             qty * product.distributor_price,
      invoice_number:    'INV-2025-' + Math.floor(1000 + Math.random() * 9000),
      items:             [{ model: product.model, qty, unit_price: product.distributor_price }],
    };
    addOrder(order);
    setOrdered(true);
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
          <span className="text-[15px]" style={{ fontFamily: FF }}>Catalog</span>
        </button>
      </div>

      <div className="px-4 pt-5 space-y-4">
        {/* Product Hero */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          <div className="relative">
            <img src={product.image_url} alt={product.model} className="w-full h-52 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-[#E31E24] text-[10px] font-semibold uppercase tracking-widest">{product.category}</p>
              <p className="text-white text-[20px] font-black leading-tight" style={{ fontFamily: FF }}>{product.full_name}</p>
              <p className="text-white/50 text-[11px] mt-0.5">SKU: {product.sku}</p>
            </div>
            <div className="absolute top-3 right-3">
              <span className="text-[11px] font-medium px-3 py-1.5 rounded-full"
                style={{ backgroundColor: sc.bg, color: sc.color }}>
                ● {sc.label}
              </span>
            </div>
          </div>
        </div>

        {/* Price Block */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center" style={{ boxShadow: cardShadow }}>
            <p className="text-muted-foreground text-[11px] font-semibold uppercase tracking-[0.08em] mb-1"
              style={{ fontFamily: FF }}>MSRP</p>
            <p className="text-foreground text-[26px] font-black leading-none"
              style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>€{fmt(product.msrp)}</p>
            <p className="text-muted-foreground text-[10px] mt-0.5">end customer price</p>
          </div>
          <div className="bg-[#E31E24] rounded-2xl p-4 text-center">
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-[0.08em] mb-1">Your Price</p>
            <p className="text-white text-[26px] font-black leading-none"
              style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>€{fmt(product.distributor_price)}</p>
            <p className="text-white/60 text-[10px] mt-0.5">+{Math.round(((product.msrp - product.distributor_price) / product.msrp) * 100)}% margin</p>
          </div>
        </div>

        {/* Stock + Sales Stats */}
        <div className="bg-card rounded-2xl overflow-hidden" style={{ boxShadow: cardShadow }}>
          {[
            { label: 'Current Stock',    value: `${product.stock} units`,                icon: Package,      color: sc.color },
            { label: 'Min. Reorder Qty', value: `${product.min_order} units`,             icon: ShoppingCart, color: '#6366F1' },
            { label: 'Units Sold (MTD)', value: `${product.units_sold_mtd} units`,         icon: TrendingUp,   color: '#34C759' },
            { label: 'Units Sold (YTD)', value: `${product.units_sold_ytd} units`,         icon: TrendingUp,   color: '#E31E24' },
            { label: 'Lead Time',        value: `${product.lead_time_days} business days`, icon: Clock,        color: '#FF9500' },
            { label: 'Battery Platform', value: product.battery_platform,                  icon: Euro,         color: '#888888' },
          ].map(({ label, value, icon: Icon, color }, i, arr) => (
            <div key={label} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-border' : ''}`}>
              <Icon size={14} style={{ color }} className="flex-shrink-0" />
              <span className="text-muted-foreground text-[13px] flex-1" style={{ fontFamily: FF }}>{label}</span>
              <span className="text-foreground text-[13px] font-medium" style={{ fontFamily: FF }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Order Panel */}
        {!ordered ? (
          <div className="bg-card rounded-2xl p-4 space-y-4" style={{ boxShadow: cardShadow }}>
            <p className="text-foreground text-[14px] font-semibold uppercase tracking-[0.04em]"
              style={{ fontFamily: FF }}>Place Stock Order</p>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[13px]" style={{ fontFamily: FF }}>Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty(Math.max(product.min_order, qty - product.min_order))}
                  className="w-9 h-9 rounded-full bg-muted flex items-center justify-center active:opacity-60"
                >
                  <Minus size={15} className="text-foreground" />
                </button>
                <span className="text-foreground text-[20px] font-black w-12 text-center"
                  style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                <button
                  onClick={() => setQty(qty + product.min_order)}
                  className="w-9 h-9 rounded-full bg-[#E31E24] flex items-center justify-center active:opacity-60"
                >
                  <Plus size={15} className="text-white" />
                </button>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-3 flex items-center justify-between">
              <span className="text-muted-foreground text-[13px]" style={{ fontFamily: FF }}>Order Total</span>
              <span className="text-foreground text-[18px] font-black"
                style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>€{fmt(total)}</span>
            </div>
            <p className="text-muted-foreground text-[11px] text-center" style={{ fontFamily: FF }}>
              ETA: {product.lead_time_days} business days · {new Date(Date.now() + product.lead_time_days * 86400000).toLocaleDateString('de-DE')}
            </p>
            <button
              onClick={placeOrder}
              className="w-full bg-[#E31E24] text-white rounded-2xl py-4 font-semibold text-[15px] flex items-center justify-center gap-2"
              style={{ fontFamily: FF }}
            >
              <Truck size={16} /> Confirm Order · €{fmt(total)}
            </button>
          </div>
        ) : (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}
            className="rounded-2xl p-5 flex flex-col items-center gap-3"
            style={{ backgroundColor: dm ? '#0D2A1A' : '#E8F8EE' }}>
            <div className="w-14 h-14 rounded-full bg-[#34C759] flex items-center justify-center">
              <Check size={26} className="text-white" />
            </div>
            <p className="text-[17px] font-semibold"
              style={{ color: dm ? '#4ADE80' : '#1A8A4A', fontFamily: FF }}>Order Placed!</p>
            <p className="text-[13px] text-center"
              style={{ color: dm ? '#4ADE80' : '#1A8A4A', opacity: 0.7, fontFamily: FF }}>
              Your order for {qty} × {product.model} has been submitted.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Catalog() {
  const { catalog, darkMode } = useDistributorStore();
  const dm = darkMode;
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState<CategoryFilter>('all');
  const [selected, setSelected]   = useState<CatalogProduct | null>(null);

  const categories = ['all', ...Array.from(new Set(catalog.map((p) => p.category)))];
  const filtered   = catalog.filter((p) => {
    const matchSearch =
      p.model.toLowerCase().includes(search.toLowerCase()) ||
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });
  const alerts = catalog.filter((p) => p.stock_level !== 'in_stock');

  const STOCK_CFG_DM = {
    in_stock:     { label: 'In Stock',     color: '#34C759', bg: dm ? '#0D2A1A' : '#E8F8EE', dot: '#34C759' },
    low_stock:    { label: 'Low Stock',    color: '#FF9500', bg: dm ? '#3A2800' : '#FFF3E0', dot: '#FF9500' },
    out_of_stock: { label: 'Out of Stock', color: '#C0392B', bg: dm ? '#3A0D0D' : '#FFEEEE', dot: '#E31E24' },
  };

  const pillInactiveBg   = dm ? '#2A2A2A' : '#F2F2F7';
  const pillInactiveText = dm ? '#FFFFFF'  : '#1D1D1F';
  const cardShadow       = dm ? '0 1px 6px rgba(0,0,0,0.3)' : '0 1px 6px rgba(0,0,0,0.06)';
  const alertBg          = dm ? '#3A1010' : '#FFF0F0';

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence>
        {selected && <ProductDetail product={selected} onBack={() => setSelected(null)} />}
      </AnimatePresence>

      {/* Sub-header */}
      <div
        className="fixed top-[88px] left-0 right-0 z-30 max-w-md mx-auto bg-card"
        style={{ boxShadow: dm ? '0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.60)' : '0 1px 0 rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.06)' }}
      >
        <div className="px-4 pt-3 pb-2">
          <h1 className="text-foreground text-[17px] font-black text-center uppercase tracking-[0.04em]"
            style={{ fontFamily: FF }}>Product Catalog</h1>
        </div>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted rounded-xl py-2 pl-8 pr-4 text-[14px] text-foreground focus:outline-none placeholder:text-muted-foreground"
              style={{ fontFamily: FF }}
            />
          </div>
        </div>
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className="flex-shrink-0 px-3.5 py-1 rounded-full text-[12px] font-medium transition-all capitalize"
              style={{
                backgroundColor: catFilter === cat ? '#E31E24' : pillInactiveBg,
                color:           catFilter === cat ? 'white' : pillInactiveText,
                fontFamily:      FF,
              }}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-[136px] pb-4">
        {alerts.length > 0 && (
          <div className="rounded-2xl p-3.5 flex items-center gap-3 mb-4"
            style={{ backgroundColor: alertBg, border: `1px solid rgba(227,30,36,0.25)` }}>
            <AlertTriangle size={16} className="text-[#E31E24] flex-shrink-0" />
            <p className="text-[#E31E24] text-[13px] font-medium flex-1" style={{ fontFamily: FF }}>
              {alerts.filter((a) => a.stock_level === 'out_of_stock').length > 0
                ? `${alerts.filter((a) => a.stock_level === 'out_of_stock').length} product(s) out of stock!`
                : `${alerts.length} product(s) running low`}
            </p>
            <span className="text-[#E31E24] text-[12px] font-semibold">Tap to order →</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product, i) => {
            const sc = STOCK_CFG_DM[product.stock_level];
            return (
              <motion.button
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(product)}
                className="bg-card rounded-2xl overflow-hidden text-left active:scale-[0.97] transition-all relative"
                style={{ boxShadow: cardShadow }}
              >
                <div className="h-1" style={{ backgroundColor: sc.dot }} />
                <div className="relative">
                  <img src={product.image_url} alt={product.model} className="w-full h-28 object-cover" />
                  {product.stock_level !== 'in_stock' && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: product.stock_level === 'out_of_stock' ? '#E31E24' : '#FF9500' }}>
                      <AlertTriangle size={11} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[#E31E24] text-[9px] font-semibold uppercase tracking-wider">{product.category}</p>
                  <p className="text-foreground text-[12px] font-medium mt-0.5 leading-tight" style={{ fontFamily: FF }}>{product.model}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-foreground text-[15px] font-black leading-none"
                        style={{ fontFamily: FF, fontVariantNumeric: 'tabular-nums' }}>
                        €{fmt(product.distributor_price)}
                      </p>
                      <p className="text-muted-foreground text-[9px]">dist. price</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[13px]" style={{ color: sc.color, fontVariantNumeric: 'tabular-nums' }}>{product.stock}</p>
                      <p className="text-muted-foreground text-[9px]">in stock</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: sc.bg, color: sc.color }}>
                      {sc.label}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
