import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Send, AlertTriangle, Users,
  Package, BarChart2, Star, RefreshCw, Target, TrendingUp,
} from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
const RED = '#E31E24';
const ADAM_BG   = '#18181B';
const ADAM_CARD = '#27272A';
const ADAM_BORDER = 'rgba(255,255,255,0.09)';
const ADAM_MUTED  = '#71717A';
const ADAM_TEXT   = '#F4F4F5';

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Message {
  id: string;
  role: 'user' | 'adam';
  content: string | AdamCard[];
  timestamp: Date;
}

interface AdamCard {
  type: 'kpi' | 'item' | 'alert' | 'tip' | 'divider';
  label?: string;
  value?: string;
  sub?: string;
  color?: string;
  icon?: string;
}

/* ─── Quick question chips ───────────────────────────────────────────────────── */

const QUICK_QUESTIONS = [
  { label: 'What should I focus on today?',    emoji: '🎯', Icon: Target      },
  { label: 'Urgent claims to handle?',          emoji: '⚠️', Icon: AlertTriangle },
  { label: 'Which customers need attention?',  emoji: '👥', Icon: Users       },
  { label: 'Stock health check',               emoji: '📦', Icon: Package     },
  { label: 'Revenue trend analysis',           emoji: '📈', Icon: TrendingUp  },
  { label: 'Top customers breakdown',          emoji: '⭐', Icon: Star        },
  { label: 'Products to reorder?',             emoji: '🔄', Icon: RefreshCw   },
  { label: 'Full business summary',            emoji: '📊', Icon: BarChart2   },
];

/* ─── Response Engine ────────────────────────────────────────────────────────── */

function fmt(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function daysSince(dateStr: string): number {
  const d = new Date(dateStr);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

function generateAdamResponse(
  question: string,
  store: ReturnType<typeof useDistributorStore.getState>,
): string {
  const { customers, claims, catalog, orders, profile } = store;
  const q = question.toLowerCase();

  /* ── Derived metrics ── */
  const pendingClaims   = claims.filter(c => c.status === 'pending');
  const inRepairClaims  = claims.filter(c => c.status === 'in_repair');
  const approvedClaims  = claims.filter(c => c.status === 'approved');
  const rejectedClaims  = claims.filter(c => c.status === 'rejected');
  const totalRevenue    = customers.reduce((s, c) => s + c.total_spent, 0);
  const proCustomers    = customers.filter(c => c.user_type === 'Pro');
  const diyCustomers    = customers.filter(c => c.user_type === 'DIYer');
  const atRiskCustomers = customers.filter(c => c.pending_claims > 0);
  const expiringTools   = customers.flatMap(c => c.tools.filter(t => t.status === 'expiring'));
  const expiredTools    = customers.flatMap(c => c.tools.filter(t => t.status === 'expired'));
  const lowStockItems   = catalog.filter(p => p.stock_level === 'low_stock');
  const outOfStockItems = catalog.filter(p => p.stock_level === 'out_of_stock');
  const topCustomers    = [...customers].sort((a, b) => b.total_spent - a.total_spent);
  const processingOrders = orders.filter(o => o.status === 'processing');
  const totalTools      = customers.reduce((s, c) => s + c.tools_count, 0);
  const totalClaims     = claims.length;
  const claimsRate      = totalClaims > 0 ? ((pendingClaims.length / totalClaims) * 100).toFixed(0) : '0';

  /* ────────────────────────────────────────────────────────── */
  /*  FOCUS TODAY                                               */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('focus') || q.includes('today') || q.includes('priority')) {
    const items: string[] = [];
    if (pendingClaims.length > 0)
      items.push(`🔴 ${pendingClaims.length} pending claim${pendingClaims.length > 1 ? 's' : ''} require your immediate review — oldest is ${daysSince(pendingClaims[0].submitted)} days old.`);
    if (atRiskCustomers.length > 0)
      items.push(`⚠️ ${atRiskCustomers.length} customer${atRiskCustomers.length > 1 ? 's' : ''} (${atRiskCustomers.map(c => c.name.split(' ')[0]).join(', ')}) have open claims — reach out before trust erodes.`);
    if (outOfStockItems.length > 0)
      items.push(`📦 ${outOfStockItems.map(p => p.model).join(', ')} ${outOfStockItems.length === 1 ? 'is' : 'are'} out of stock — lost sales risk. Reorder immediately.`);
    if (lowStockItems.length > 0)
      items.push(`🟡 ${lowStockItems.map(p => p.model).join(', ')} running low — reorder before you hit zero.`);
    if (expiringTools.length > 0)
      items.push(`⏳ ${expiringTools.length} tool warranty${expiringTools.length > 1 ? 'ies' : 'y'} expiring soon — great opportunity to offer renewal or upgrade.`);
    if (processingOrders.length > 0)
      items.push(`🚚 ${processingOrders.length} order${processingOrders.length > 1 ? 's' : ''} currently processing — expected delivery incoming.`);

    if (items.length === 0)
      return "✅ Great news — no urgent actions today! All claims are resolved, stock is healthy and your customers are in good shape. A good day to focus on proactive outreach or reviewing your Q1 targets.";

    return `Here's your priority radar for today, Klaus:\n\n${items.join('\n\n')}\n\n💡 Start with the pending claims — unresolved warranty issues are the #1 driver of customer churn in power tools distribution.`;
  }

  /* ────────────────────────────────────────────────────────── */
  /*  URGENT CLAIMS                                             */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('claim') || q.includes('urgent') || q.includes('warranty')) {
    if (pendingClaims.length === 0 && inRepairClaims.length === 0)
      return "✅ No urgent claims right now. All ${totalClaims} claims have been processed. Keep up the fast turnaround — it's a competitive differentiator.";

    let out = `You have ${pendingClaims.length} pending and ${inRepairClaims.length} in-repair claims:\n\n`;

    pendingClaims.forEach(cl => {
      const age = daysSince(cl.submitted);
      const urgency = age >= 7 ? '🔴 OVERDUE' : age >= 3 ? '🟡 Aging' : '🔵 New';
      out += `${urgency} · ${cl.customer_name} — ${cl.tool_model}\n   Issue: "${cl.issue}" · Submitted ${age}d ago\n\n`;
    });

    inRepairClaims.forEach(cl => {
      out += `🔧 In Repair · ${cl.customer_name} — ${cl.tool_model}\n   Technician: ${cl.technician} · Due: ${cl.estimated_completion}\n\n`;
    });

    const claimRate = totalClaims > 0 ? ((pendingClaims.length + inRepairClaims.length) / totalClaims * 100).toFixed(0) : '0';
    out += `📊 Active claim rate: ${claimRate}% of total claims portfolio.\n\n💡 Recommendation: Prioritise the oldest pending claim first. Customers expect resolution within 5 business days — delays risk negative reviews.`;
    return out;
  }

  /* ──────────────��─────────────────────────────────────────── */
  /*  CUSTOMERS NEEDING ATTENTION                               */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('customer') && (q.includes('attention') || q.includes('need') || q.includes('at risk'))) {
    if (atRiskCustomers.length === 0 && expiringTools.length === 0)
      return `✅ All ${customers.length} customers look healthy right now — no pending claims and no immediately expiring warranties. Consider scheduling quarterly check-in calls with your top 3 spenders.`;

    let out = `I've identified ${atRiskCustomers.length + (expiringTools.length > 0 ? 1 : 0)} customer situations requiring attention:\n\n`;

    atRiskCustomers.forEach(c => {
      out += `🔴 ${c.name} (${c.city}) — ${c.pending_claims} open claim${c.pending_claims > 1 ? 's' : ''}\n   Spent: €${fmt(c.total_spent)} · Tools: ${c.tools_count} · Type: ${c.user_type}\n\n`;
    });

    const customersWithExpiring = customers.filter(c => c.tools.some(t => t.status === 'expiring'));
    if (customersWithExpiring.length > 0) {
      out += `⏳ Warranty expiring soon:\n`;
      customersWithExpiring.forEach(c => {
        const exp = c.tools.filter(t => t.status === 'expiring');
        out += `   · ${c.name} — ${exp.map(t => t.model).join(', ')}\n`;
      });
      out += `\n`;
    }

    out += `💡 For customers with open claims, a proactive call (not just email) increases resolution satisfaction by ~40%. For expiring warranties, offer an upgrade bundle — ${proCustomers.length > 0 ? 'Pro users especially respond well to tool bundles.' : 'personalised outreach works best.'}`;
    return out;
  }

  /* ────────────────────────────────────────────────────────── */
  /*  STOCK HEALTH                                              */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('stock') || q.includes('inventory') || q.includes('reorder')) {
    const inStock = catalog.filter(p => p.stock_level === 'in_stock');
    let out = `📦 Stock Health Report — ${catalog.length} SKUs tracked:\n\n`;

    if (outOfStockItems.length > 0) {
      out += `🔴 Out of Stock (urgent):\n`;
      outOfStockItems.forEach(p => {
        out += `   · ${p.model} — ${p.full_name}\n     Sold ${p.units_sold_ytd} units YTD · Lead time: ${p.lead_time_days}d · Min order: ${p.min_order} units\n`;
      });
      out += `\n`;
    }

    if (lowStockItems.length > 0) {
      out += `🟡 Low Stock (reorder soon):\n`;
      lowStockItems.forEach(p => {
        out += `   · ${p.model} — ${p.stock} units left · Selling ${p.units_sold_mtd} units/month\n`;
      });
      out += `\n`;
    }

    out += `✅ Healthy Stock (${inStock.length} items):\n`;
    inStock.forEach(p => {
      out += `   · ${p.model} — ${p.stock} units\n`;
    });

    const totalStockValue = catalog.reduce((s, p) => s + p.stock * p.distributor_price, 0);
    out += `\n💰 Total inventory value: €${fmt(totalStockValue)}\n\n`;
    out += `💡 The ${outOfStockItems.map(p => p.model).join(' and ')} stockout is your most critical issue — ${outOfStockItems.reduce((s, p) => s + p.units_sold_ytd, 0)} units sold YTD shows consistent demand. Place a reorder today.`;
    return out;
  }

  /* ────────────────────────────────────────────────────────── */
  /*  REVENUE TREND                                             */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('revenue') || q.includes('trend') || q.includes('sales') || q.includes('performance')) {
    const revenue = store.revenue ?? [];
    if (revenue.length < 2)
      return `Customer-side revenue in the portal shows €${fmt(totalRevenue)} across ${customers.length} registered customers. For full B2B revenue analytics, navigate to the Analytics tab.`;

    const latest = revenue[revenue.length - 1];
    const prev   = revenue[revenue.length - 2];
    const growth = prev.revenue > 0 ? (((latest.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : '0';
    const ytd    = revenue.reduce((s, r) => s + r.revenue, 0);
    const best   = revenue.reduce((a, b) => a.revenue > b.revenue ? a : b);
    const worst  = revenue.reduce((a, b) => a.revenue < b.revenue ? a : b);

    const trend = parseFloat(growth) >= 0 ? '📈' : '📉';
    let out = `${trend} Revenue Trend Analysis (last ${revenue.length} months):\n\n`;
    out += `📅 ${latest.month}: €${fmt(latest.revenue)} (${growth}% vs prior month)\n`;
    out += `💰 YTD total: €${fmt(ytd)}\n`;
    out += `🏆 Best month: ${best.month} — €${fmt(best.revenue)} (${best.units} units)\n`;
    out += `📉 Slowest: ${worst.month} — €${fmt(worst.revenue)} (${worst.units} units)\n\n`;

    const avgRevenue = ytd / revenue.length;
    const latestVsAvg = (((latest.revenue - avgRevenue) / avgRevenue) * 100).toFixed(1);
    out += `📊 ${latest.month} is ${parseFloat(latestVsAvg) >= 0 ? '+' : ''}${latestVsAvg}% vs 6-month average.\n\n`;

    if (parseFloat(growth) > 0)
      out += `💡 Strong momentum — ${latest.month} growth of ${growth}% suggests your market penetration is improving. Consider pitching larger orders to Werkhaus Berlin reseller to capitalise on the trend.`;
    else
      out += `💡 Revenue dipped ${Math.abs(parseFloat(growth))}% this month. January/February typically see seasonal slowdowns in construction. Focus on Pro customers — they have more consistent purchasing cycles.`;

    return out;
  }

  /* ────────────────────────────────────────────────────────── */
  /*  TOP CUSTOMERS                                             */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('top customer') || q.includes('best customer') || q.includes('breakdown')) {
    let out = `⭐ Customer Portfolio Breakdown — ${customers.length} registered:\n\n`;
    out += `👔 Pro users: ${proCustomers.length} (${((proCustomers.length / customers.length) * 100).toFixed(0)}%)\n`;
    out += `🏠 DIYers: ${diyCustomers.length} (${((diyCustomers.length / customers.length) * 100).toFixed(0)}%)\n`;
    out += `💰 Total customer-side spend: €${fmt(totalRevenue)}\n\n`;
    out += `🏆 Top 3 by spend:\n`;
    topCustomers.slice(0, 3).forEach((c, i) => {
      const medals = ['🥇', '🥈', '🥉'];
      const avgPerTool = c.tools_count > 0 ? (c.total_spent / c.tools_count).toFixed(0) : '0';
      out += `${medals[i]} ${c.name} (${c.city}) — €${fmt(c.total_spent)} · ${c.tools_count} tools · ${c.user_type}\n    €${avgPerTool}/tool avg · Claims: ${c.claims_count}\n\n`;
    });

    const avgSpend = totalRevenue / customers.length;
    out += `📊 Average spend per customer: €${fmt(avgSpend)}\n`;
    const highSpenders = customers.filter(c => c.total_spent > avgSpend);
    out += `🎯 ${highSpenders.length} customers above average spend\n\n`;
    out += `💡 ${topCustomers[0].name} is your most valuable customer at €${fmt(topCustomers[0].total_spent)}. With ${topCustomers[0].pending_claims} pending claim${topCustomers[0].pending_claims !== 1 ? 's' : ''}, resolving their issue quickly protects your highest-value relationship.`;
    return out;
  }

  /* ────────────────────────────────────────────────────────── */
  /*  PRODUCTS TO REORDER                                       */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('reorder') || q.includes('order') || q.includes('product')) {
    let out = `🛒 Reorder Recommendations:\n\n`;
    const needsReorder = catalog.filter(p => p.stock_level !== 'in_stock' || p.stock < p.min_order * 1.5);

    if (needsReorder.length === 0) {
      out += `✅ All products are well-stocked relative to minimum order quantities. No urgent reorders needed.\n\n`;
    } else {
      needsReorder.forEach(p => {
        const urgency = p.stock_level === 'out_of_stock' ? '🔴 URGENT' : p.stock_level === 'low_stock' ? '🟡 Soon' : '🟢 Optional';
        const suggestedQty = Math.max(p.min_order * 2, 10);
        const orderCost = suggestedQty * p.distributor_price;
        out += `${urgency} · ${p.model}\n   Stock: ${p.stock} units · Suggest ordering: ${suggestedQty} units\n   Est. cost: €${fmt(orderCost)} · Lead time: ${p.lead_time_days} days\n\n`;
      });
    }

    const processingVal = processingOrders.reduce((s, o) => s + o.total, 0);
    if (processingOrders.length > 0)
      out += `🚚 Note: You have ${processingOrders.length} order${processingOrders.length > 1 ? 's' : ''} currently processing (€${fmt(processingVal)} total) — check delivery timelines before duplicating orders.\n\n`;

    out += `💡 Prioritise the ${outOfStockItems.map(p => p.model).join(' + ')} reorder. Stockouts on fast-moving SKUs can push customers to competitors and are very difficult to recover from.`;
    return out;
  }

  /* ────────────────────────────────────────────────────────── */
  /*  FULL BUSINESS SUMMARY                                     */
  /* ────────────────────────────────────────────────────────── */
  if (q.includes('summary') || q.includes('overview') || q.includes('business') || q.includes('full')) {
    const warrantyHealth = totalTools > 0
      ? ((customers.reduce((s, c) => s + c.warranty_active, 0) / totalTools) * 100).toFixed(0)
      : '0';
    const resolvedClaims = approvedClaims.length + rejectedClaims.length;
    const resolutionRate = totalClaims > 0 ? ((resolvedClaims / totalClaims) * 100).toFixed(0) : '0';
    const totalInventoryValue = catalog.reduce((s, p) => s + p.stock * p.distributor_price, 0);

    return `📋 Full Business Summary — ${profile.company} · ${profile.territory}\n\n` +
      `👥 CUSTOMERS (${customers.length} total)\n` +
      `   Pro: ${proCustomers.length} · DIYers: ${diyCustomers.length}\n` +
      `   Revenue: €${fmt(totalRevenue)} · Avg: €${fmt(totalRevenue / customers.length)}/customer\n` +
      `   At risk: ${atRiskCustomers.length} with open claims\n\n` +
      `🔧 TOOLS (${totalTools} registered)\n` +
      `   Active warranty: ${warrantyHealth}%\n` +
      `   Expiring: ${expiringTools.length} · Expired: ${expiredTools.length}\n\n` +
      `📋 CLAIMS (${totalClaims} total)\n` +
      `   Pending: ${pendingClaims.length} · In repair: ${inRepairClaims.length}\n` +
      `   Resolved: ${resolvedClaims} · Resolution rate: ${resolutionRate}%\n` +
      `   Avg claim age: ${pendingClaims.length > 0 ? daysSince(pendingClaims[0].submitted) : 0}d (oldest pending)\n\n` +
      `📦 CATALOG (${catalog.length} SKUs)\n` +
      `   In stock: ${catalog.filter(p => p.stock_level === 'in_stock').length} · Low: ${lowStockItems.length} · Out: ${outOfStockItems.length}\n` +
      `   Inventory value: €${fmt(totalInventoryValue)}\n\n` +
      `🚚 ORDERS (${orders.length} total)\n` +
      `   Processing: ${processingOrders.length} · Shipped: ${orders.filter(o => o.status === 'shipped').length}\n` +
      `   Delivered: ${orders.filter(o => o.status === 'delivered').length}\n\n` +
      `💡 TOP PRIORITY: Resolve the ${pendingClaims.length} pending claim${pendingClaims.length !== 1 ? 's' : ''} and reorder ${outOfStockItems.map(p => p.model).join(', ')} immediately. These two actions will have the biggest positive impact on your business this week.`;
  }

  /* ── Fallback / general ── */
  return `I'm Adam, your BEITER distribution intelligence assistant. I've analysed your portal data across ${customers.length} customers, ${claims.length} claims, ${catalog.length} catalog SKUs and ${orders.length} orders.\n\nHere's what I'm watching:\n🔴 ${pendingClaims.length} pending claim${pendingClaims.length !== 1 ? 's' : ''} need action\n📦 ${outOfStockItems.length + lowStockItems.length} stock issue${(outOfStockItems.length + lowStockItems.length) !== 1 ? 's' : ''} to address\n👥 ${atRiskCustomers.length} at-risk customer${atRiskCustomers.length !== 1 ? 's' : ''}\n\nTry one of the quick questions below, or ask me anything about your business.`;
}

/* ─── Typing indicator ───────────────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          style={{ width: 6, height: 6, borderRadius: '50%', background: ADAM_MUTED }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─── Message bubble ─────────────────────────────────────────────────────────── */
function MessageBubble({ msg }: { msg: Message }) {
  const isAdam = msg.role === 'adam';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{ display: 'flex', flexDirection: isAdam ? 'row' : 'row-reverse', gap: 10, alignItems: 'flex-end' }}
    >
      {/* Avatar */}
      {isAdam && (
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #E31E24 0%, #7C0A0D 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 12px rgba(227,30,36,0.35)',
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>A</span>
        </div>
      )}

      {/* Bubble */}
      <div style={{
        maxWidth: '82%',
        background: isAdam ? ADAM_CARD : RED,
        borderRadius: isAdam ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        padding: '11px 14px',
        border: isAdam ? `1px solid ${ADAM_BORDER}` : 'none',
        boxShadow: isAdam ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 12px rgba(227,30,36,0.25)',
      }}>
        <p style={{
          fontSize: 13, lineHeight: 1.65, color: isAdam ? ADAM_TEXT : '#fff',
          margin: 0, fontFamily: FF, whiteSpace: 'pre-line',
          fontWeight: 400,
        }}>
          {typeof msg.content === 'string' ? msg.content : ''}
        </p>
        <p style={{ fontSize: 10, color: isAdam ? ADAM_MUTED : 'rgba(255,255,255,0.5)', margin: '5px 0 0', textAlign: 'right', fontFamily: FF }}>
          {msg.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */

interface AdamAIProps {
  open: boolean;
  onClose: () => void;
}

export function AdamAI({ open, onClose }: AdamAIProps) {
  const store = useDistributorStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const [greeted, setGreeted]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  /* Welcome message */
  useEffect(() => {
    if (open && !greeted) {
      setGreeted(true);
      setTimeout(() => {
        const { customers, claims, catalog } = store;
        const pending = claims.filter(c => c.status === 'pending').length;
        const outOfStock = catalog.filter(p => p.stock_level === 'out_of_stock').length;
        addAdamMessage(
          `Hey Klaus 👋 I'm **Adam**, your BEITER distribution intelligence assistant.\n\nI've just scanned your entire portal:\n🔴 ${pending} pending claim${pending !== 1 ? 's' : ''} waiting\n📦 ${outOfStock} out-of-stock SKU${outOfStock !== 1 ? 's' : ''}\n👥 ${customers.length} registered customers\n\nWhat do you want to know?`
        );
      }, 400);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Auto-scroll */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  /* Focus input on open */
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  const addAdamMessage = useCallback((text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'adam',
      content: text,
      timestamp: new Date(),
    }]);
  }, []);

  const sendQuestion = useCallback((question: string) => {
    if (!question.trim()) return;
    /* Add user message */
    setMessages(prev => [...prev, {
      id: Date.now().toString() + 'u',
      role: 'user',
      content: question,
      timestamp: new Date(),
    }]);
    setInput('');
    setTyping(true);

    /* Simulate Adam thinking */
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      setTyping(false);
      const storeState = useDistributorStore.getState();
      const response = generateAdamResponse(question, storeState);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'a',
        role: 'adam',
        content: response,
        timestamp: new Date(),
      }]);
    }, delay);
  }, []);

  const handleSend = () => sendQuestion(input);
  const handleKey  = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  /* Stat pills at top */
  const { customers, claims, catalog } = store;
  const pending   = claims.filter(c => c.status === 'pending').length;
  const outStock  = catalog.filter(p => p.stock_level === 'out_of_stock').length;
  const atRisk    = customers.filter(c => c.pending_claims > 0).length;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 8000, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
              background: ADAM_BG, zIndex: 8001,
              display: 'flex', flexDirection: 'column',
              fontFamily: FF,
              boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
              borderLeft: `1px solid ${ADAM_BORDER}`,
            }}
          >
            {/* ── Header ── */}
            <div style={{
              padding: '16px 18px 14px',
              borderBottom: `1px solid ${ADAM_BORDER}`,
              flexShrink: 0,
              background: 'linear-gradient(180deg, #1A1A1D 0%, #18181B 100%)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {/* Adam avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #E31E24 0%, #7C0A0D 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(227,30,36,0.4), 0 0 40px rgba(227,30,36,0.15)',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>A</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p style={{ fontSize: 15, fontWeight: 900, color: ADAM_TEXT, margin: 0, letterSpacing: '-0.02em' }}>Adam</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 99, background: 'rgba(227,30,36,0.15)', border: '1px solid rgba(227,30,36,0.3)' }}>
                        <motion.div
                          style={{ width: 5, height: 5, borderRadius: '50%', background: RED }}
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span style={{ fontSize: 9, fontWeight: 700, color: RED, letterSpacing: '0.06em' }}>LIVE</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 10, color: ADAM_MUTED, margin: '1px 0 0', fontWeight: 500 }}>BEITER AI Distribution Consultant</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={15} style={{ color: ADAM_MUTED }} />
                </button>
              </div>

              {/* Live stat pills */}
              <div style={{ display: 'flex', gap: 6 }}>
                {[
                  { label: `${pending} Pending`, color: pending > 0 ? RED : '#34C759', Icon: AlertTriangle },
                  { label: `${atRisk} At Risk`, color: atRisk > 0 ? '#FF9500' : '#34C759', Icon: Users },
                  { label: `${outStock} Out of Stock`, color: outStock > 0 ? RED : '#34C759', Icon: Package },
                ].map(pill => (
                  <div key={pill.label} style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 8px', borderRadius: 8,
                    background: `${pill.color}18`,
                    border: `1px solid ${pill.color}30`,
                  }}>
                    <pill.Icon size={10} style={{ color: pill.color }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: pill.color }}>{pill.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Messages ���─ */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '16px 16px 8px',
              display: 'flex', flexDirection: 'column', gap: 14,
            }}>
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}
                  >
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #E31E24 0%, #7C0A0D 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>A</span>
                    </div>
                    <div style={{
                      background: ADAM_CARD, borderRadius: '4px 16px 16px 16px',
                      padding: '11px 14px', border: `1px solid ${ADAM_BORDER}`,
                    }}>
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* ── Quick questions ── */}
            <div style={{ padding: '10px 14px 6px', borderTop: `1px solid ${ADAM_BORDER}`, flexShrink: 0 }}>
              <p style={{ fontSize: 9, fontWeight: 700, color: ADAM_MUTED, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Quick analysis
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {QUICK_QUESTIONS.map(q => (
                  <button
                    key={q.label}
                    onClick={() => sendQuestion(q.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '5px 10px', borderRadius: 8, cursor: 'pointer',
                      background: 'rgba(255,255,255,0.05)',
                      border: `1px solid ${ADAM_BORDER}`,
                      color: ADAM_TEXT, fontSize: 11, fontWeight: 500, fontFamily: FF,
                      transition: 'all 0.15s', whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(227,30,36,0.12)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(227,30,36,0.35)';
                      (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = ADAM_BORDER;
                      (e.currentTarget as HTMLButtonElement).style.color = ADAM_TEXT;
                    }}
                  >
                    <span>{q.emoji}</span>
                    <span>{q.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── Input ── */}
            <div style={{ padding: '10px 14px 16px', flexShrink: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: ADAM_CARD, borderRadius: 14,
                padding: '10px 10px 10px 14px',
                border: `1px solid ${ADAM_BORDER}`,
              }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask Adam anything about your business…"
                  style={{
                    flex: 1, background: 'none', border: 'none', outline: 'none',
                    fontSize: 13, color: ADAM_TEXT, fontFamily: FF,
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || typing}
                  style={{
                    width: 34, height: 34, borderRadius: 10, border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                    background: input.trim() && !typing ? RED : 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s', flexShrink: 0,
                  }}
                >
                  <Send size={14} style={{ color: input.trim() && !typing ? '#fff' : ADAM_MUTED }} />
                </button>
              </div>
              <p style={{ fontSize: 10, color: ADAM_MUTED, margin: '6px 0 0', textAlign: 'center', fontFamily: FF }}>
                Adam analyses live portal data · BEITER Distributor AI
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}