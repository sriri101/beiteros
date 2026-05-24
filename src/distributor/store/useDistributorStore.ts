import { create } from 'zustand';
import { TOOL_IMAGES } from '../../app/assets/toolImages';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'in_repair';
export type StockLevel  = 'in_stock' | 'low_stock' | 'out_of_stock';
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PartnerTier = 'Silver' | 'Gold' | 'Platinum';
export type DistMgmtOrderStatus = 'draft' | 'submitted' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'partial';

// ─── Distributor Management Types ─────────────────────────────────────────────

export interface DistContact {
  id: string;
  name: string;
  contactName: string;
  phone: string;
  email: string;
  logo: string;
  notes: string;
  status: 'active' | 'inactive';
  lastOrderDate: string;
}

export interface DistProduct {
  id: string;
  distributorId: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  packSize: number;
  unitPrice: number;
  casePrice: number;
  moq: number;
  inStock: boolean;
  notes: string;
  lastUpdated: string;
}

export interface DistMgmtOrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  note: string;
  discount?: number;
}

export interface ShippingAddress {
  company: string;
  contactName: string;
  street: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
  instructions: string;
}

export interface DistMgmtOrder {
  id: string;
  distributorId: string;
  status: DistMgmtOrderStatus;
  createdAt: string;
  expectedDate: string;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  note: string;
  items: DistMgmtOrderItem[];
  poReference?: string;
  priority?: 'standard' | 'express' | 'urgent';
  shippingAddress?: ShippingAddress;
  shippingMethod?: string;
  paymentTerms?: string;
}

// ─── Initial data ─────────────────────────────────────────────────────────────

const RESELLERS: ResellerInfo[] = [
  { id: 'r1', name: 'Werkhaus Berlin-Mitte',         city: 'Berlin',               phone: '+49 30 120 34 567' },
  { id: 'r2', name: 'Norbau Potsdam-Center',          city: 'Potsdam',              phone: '+49 331 987 65 43' },
  { id: 'r3', name: 'Steinbach Berlin-Tempelhof',     city: 'Berlin',               phone: '+49 30 234 56 789' },
  { id: 'r4', name: 'Krafft Berlin',                  city: 'Berlin',               phone: '+49 30 345 67 890' },
  { id: 'r5', name: 'Vogt Werkzeuge Brandenburg',     city: 'Brandenburg a.d.H.',   phone: '+49 3381 123 456' },
];

const PROFILE: DistributorProfile = {
  id: 'd001',
  company: 'Werkhaus Berlin GmbH',
  contact: 'Klaus Müller',
  email: 'k.muller@beitertools.com',
  phone: '+49 30 120 45 678',
  address: 'Halenseestraße 1',
  city: 'Berlin, 10709',
  territory: 'Berlin & Brandenburg',
  partner_tier: 'Gold',
  partner_since: '2019-03-01',
  account_manager: 'Sarah Vogel',
  logo_initials: 'BB',
};

const CUSTOMERS: DistCustomer[] = [
  {
    id: 'c1', name: 'Thomas Weber', email: 't.weber@web.de', city: 'Berlin',
    phone: '+49 176 1234 5678', joined: '2024-03-12', last_purchase: '2025-01-15',
    tools_count: 3, warranty_active: 3, total_spent: 677, claims_count: 1, pending_claims: 1,
    user_type: 'Pro', reseller: RESELLERS[0],
    tools: [
      { model: 'BRH70-20V', serial: 'BRH70-2024-001', category: 'Rotary Hammer', purchased: '2024-03-12', warranty_until: '2026-03-12', status: 'active', image_url: TOOL_IMAGES.t1 },
      { model: 'BI-BTS125', serial: 'BTS125-2024-077', category: 'Circular Saw', purchased: '2024-08-20', warranty_until: '2026-08-20', status: 'active', image_url: TOOL_IMAGES.t2 },
      { model: 'AG180', serial: 'AG180-2025-012', category: 'Angle Grinder', purchased: '2025-01-15', warranty_until: '2027-01-15', status: 'active', image_url: TOOL_IMAGES.t3 },
    ],
  },
  {
    id: 'c2', name: 'Hans-Jürgen Schneider', email: 'hj.schneider@gmail.com', city: 'Potsdam',
    phone: '+49 176 8765 4321', joined: '2025-02-01', last_purchase: '2025-02-01',
    tools_count: 1, warranty_active: 1, total_spent: 249, claims_count: 0, pending_claims: 0,
    user_type: 'DIYer', reseller: RESELLERS[1],
    tools: [
      { model: 'BRH70-20V', serial: 'BRH70-2025-044', category: 'Rotary Hammer', purchased: '2025-02-01', warranty_until: '2027-02-01', status: 'active', image_url: TOOL_IMAGES.t1 },
    ],
  },
  {
    id: 'c3', name: 'Anna Becker', email: 'anna.becker@outlook.de', city: 'Berlin',
    phone: '+49 177 2345 6789', joined: '2023-11-05', last_purchase: '2024-11-10',
    tools_count: 2, warranty_active: 1, total_spent: 328, claims_count: 1, pending_claims: 1,
    user_type: 'DIYer', reseller: RESELLERS[2],
    tools: [
      { model: 'BI-BTS125', serial: 'BTS125-2023-033', category: 'Circular Saw', purchased: '2023-11-05', warranty_until: '2024-11-05', status: 'expired', image_url: TOOL_IMAGES.t2 },
      { model: 'TIGE-3DG', serial: 'TIGE-2024-088', category: 'Laser Level', purchased: '2024-11-10', warranty_until: '2025-11-10', status: 'active', image_url: TOOL_IMAGES.t_scan },
    ],
  },
  {
    id: 'c4', name: 'Peter Schmidt', email: 'p.schmidt@t-online.de', city: 'Brandenburg a.d.H.',
    phone: '+49 176 9876 5432', joined: '2025-02-10', last_purchase: '2025-02-10',
    tools_count: 1, warranty_active: 1, total_spent: 189, claims_count: 0, pending_claims: 0,
    user_type: 'DIYer', reseller: RESELLERS[4],
    tools: [
      { model: 'TIGE-3DG', serial: 'TIGE-2025-012', category: 'Laser Level', purchased: '2025-02-10', warranty_until: '2027-02-10', status: 'active', image_url: TOOL_IMAGES.t_scan },
    ],
  },
  {
    id: 'c5', name: 'Maria Fischer', email: 'maria.fischer@freenet.de', city: 'Berlin',
    phone: '+49 178 3456 7890', joined: '2022-06-18', last_purchase: '2025-01-08',
    tools_count: 4, warranty_active: 3, total_spent: 846, claims_count: 2, pending_claims: 0,
    user_type: 'Pro', reseller: RESELLERS[3],
    tools: [
      { model: 'AG180', serial: 'AG180-2022-005', category: 'Angle Grinder', purchased: '2022-06-18', warranty_until: '2024-06-18', status: 'expired', image_url: TOOL_IMAGES.t3 },
      { model: 'BRH70-20V', serial: 'BRH70-2023-029', category: 'Rotary Hammer', purchased: '2023-09-22', warranty_until: '2025-09-22', status: 'active', image_url: TOOL_IMAGES.t1 },
      { model: 'BI-BTS125', serial: 'BTS125-2024-055', category: 'Circular Saw', purchased: '2024-04-30', warranty_until: '2026-04-30', status: 'active', image_url: TOOL_IMAGES.t2 },
      { model: 'TIGE-3DG', serial: 'TIGE-2025-004', category: 'Laser Level', purchased: '2025-01-08', warranty_until: '2027-01-08', status: 'active', image_url: TOOL_IMAGES.t_scan },
    ],
  },
  {
    id: 'c6', name: 'Klaus Hoffmann', email: 'k.hoffmann@gmx.de', city: 'Berlin',
    phone: '+49 179 4567 8901', joined: '2023-04-14', last_purchase: '2024-12-20',
    tools_count: 2, warranty_active: 2, total_spent: 438, claims_count: 1, pending_claims: 0,
    user_type: 'DIYer', reseller: RESELLERS[0],
    tools: [
      { model: 'AG180', serial: 'AG180-2023-088', category: 'Angle Grinder', purchased: '2023-04-14', warranty_until: '2025-04-14', status: 'expiring', image_url: TOOL_IMAGES.t3 },
      { model: 'TIGE-3DG', serial: 'TIGE-2024-099', category: 'Laser Level', purchased: '2024-12-20', warranty_until: '2026-12-20', status: 'active', image_url: TOOL_IMAGES.t_scan },
    ],
  },
  {
    id: 'c7', name: 'Stefan Wagner', email: 's.wagner@yahoo.de', city: 'Potsdam',
    phone: '+49 176 5678 9012', joined: '2025-02-14', last_purchase: '2025-02-14',
    tools_count: 1, warranty_active: 1, total_spent: 249, claims_count: 1, pending_claims: 1,
    user_type: 'Pro', reseller: RESELLERS[1],
    tools: [
      { model: 'BRH70-20V', serial: 'BRH70-2025-067', category: 'Rotary Hammer', purchased: '2025-02-14', warranty_until: '2027-02-14', status: 'active', image_url: TOOL_IMAGES.t1 },
    ],
  },
  {
    id: 'c8', name: 'Lena Braun', email: 'l.braun@web.de', city: 'Berlin',
    phone: '+49 177 6789 0123', joined: '2023-01-09', last_purchase: '2024-10-05',
    tools_count: 3, warranty_active: 1, total_spent: 557, claims_count: 0, pending_claims: 0,
    user_type: 'DIYer', reseller: RESELLERS[2],
    tools: [
      { model: 'BI-BTS125', serial: 'BTS125-2023-011', category: 'Circular Saw', purchased: '2023-01-09', warranty_until: '2025-01-09', status: 'expiring', image_url: TOOL_IMAGES.t2 },
      { model: 'AG180', serial: 'AG180-2023-044', category: 'Angle Grinder', purchased: '2023-07-22', warranty_until: '2024-07-22', status: 'expired', image_url: TOOL_IMAGES.t3 },
      { model: 'TIGE-3DG', serial: 'TIGE-2024-071', category: 'Laser Level', purchased: '2024-10-05', warranty_until: '2026-10-05', status: 'active', image_url: TOOL_IMAGES.t_scan },
    ],
  },
];

const CLAIMS: WarrantyClaim[] = [
  {
    id: 'cl1', customer_id: 'c1', customer_name: 'Thomas Weber',
    tool_model: 'BRH70-20V Rotary Hammer', tool_serial: 'BRH70-2024-001',
    tool_image: TOOL_IMAGES.t1, category: 'Rotary Hammer',
    issue: 'Chuck wobble', issue_detail: 'Chuck wobbles noticeably after 3 months of regular use. Vibration is excessive and affects drilling accuracy.',
    submitted: '2025-02-18', status: 'pending',
    parts_needed: ['Chuck Assembly BRH70', 'Spindle Bearing Set'],
    estimated_completion: '2025-03-05',
  },
  {
    id: 'cl2', customer_id: 'c3', customer_name: 'Anna Becker',
    tool_model: 'BI-BTS125 Circular Saw', tool_serial: 'BTS125-2024-088',
    tool_image: TOOL_IMAGES.t2, category: 'Circular Saw',
    issue: 'Blade guard malfunction', issue_detail: 'Lower blade guard does not retract smoothly. Sticks intermittently posing a safety risk.',
    submitted: '2025-02-20', status: 'pending',
    parts_needed: ['Lower Guard Assembly BTS125'],
    estimated_completion: '2025-03-08',
  },
  {
    id: 'cl3', customer_id: 'c5', customer_name: 'Maria Fischer',
    tool_model: 'AG180 Angle Grinder', tool_serial: 'AG180-2022-005',
    tool_image: TOOL_IMAGES.t3, category: 'Angle Grinder',
    issue: 'Bearing noise', issue_detail: 'Loud grinding noise from motor bearing during operation. Started as intermittent and now constant.',
    submitted: '2025-01-30', status: 'approved',
    resolution: 'Motor bearing replaced under warranty. Full function restored.',
    technician: 'Michael Braun',
  },
  {
    id: 'cl4', customer_id: 'c6', customer_name: 'Klaus Hoffmann',
    tool_model: 'TIGE-3DG Laser Level', tool_serial: 'TIGE-2024-099',
    tool_image: TOOL_IMAGES.t_scan, category: 'Laser Level',
    issue: 'Physical damage', issue_detail: 'Unit does not power on. Customer reports accidental drop from 2m height. Casing cracked.',
    submitted: '2025-02-05', status: 'rejected',
    resolution: 'Claim rejected. Physical damage from drop is not covered under standard warranty (§5.3). Extended warranty not applicable. Repair quote: €148.',
    technician: 'Anna Kessler',
  },
  {
    id: 'cl5', customer_id: 'c7', customer_name: 'Stefan Wagner',
    tool_model: 'BRH70-20V Rotary Hammer', tool_serial: 'BRH70-2025-067',
    tool_image: TOOL_IMAGES.t1, category: 'Rotary Hammer',
    issue: 'Battery charging issue', issue_detail: 'Battery indicator shows full charge but tool loses power after 5 minutes. Battery replaced but issue persists.',
    submitted: '2025-02-22', status: 'in_repair',
    technician: 'Michael Braun',
    parts_needed: ['Battery Management PCB BRH70'],
    estimated_completion: '2025-03-02',
  },
];

const CATALOG: CatalogProduct[] = [
  {
    id: 'p1', model: 'BRH70-20V', full_name: 'BRH70-20V Cordless Rotary Hammer',
    category: 'Rotary Hammer', image_url: TOOL_IMAGES.t1,
    msrp: 249, distributor_price: 187, stock: 12, stock_level: 'in_stock',
    min_order: 5, units_sold_mtd: 8, units_sold_ytd: 45,
    lead_time_days: 5, sku: 'BT-BRH70-20V', battery_platform: 'BOS 20V MAX',
    warranty_months: 24,
  },
  {
    id: 'p2', model: 'BI-BTS125', full_name: 'BI-BTS125 Circular Saw',
    category: 'Circular Saw', image_url: TOOL_IMAGES.t2,
    msrp: 179, distributor_price: 135, stock: 8, stock_level: 'in_stock',
    min_order: 5, units_sold_mtd: 5, units_sold_ytd: 31,
    lead_time_days: 5, sku: 'BT-BTS125', battery_platform: 'BOS 18V LXT',
    warranty_months: 24,
  },
  {
    id: 'p3', model: 'AG180', full_name: 'AG180 Professional Angle Grinder',
    category: 'Angle Grinder', image_url: TOOL_IMAGES.t3,
    msrp: 129, distributor_price: 97, stock: 15, stock_level: 'in_stock',
    min_order: 10, units_sold_mtd: 11, units_sold_ytd: 62,
    lead_time_days: 3, sku: 'BT-AG180', battery_platform: 'Corded 230V',
    warranty_months: 12,
  },
  {
    id: 'p4', model: 'TIGE-3DG', full_name: 'TIGE-3DG 360° Green Laser Level',
    category: 'Laser Level', image_url: TOOL_IMAGES.t_scan,
    msrp: 189, distributor_price: 143, stock: 4, stock_level: 'low_stock',
    min_order: 5, units_sold_mtd: 4, units_sold_ytd: 22,
    lead_time_days: 7, sku: 'BT-TIGE3DG', battery_platform: 'Li-Ion (internal)',
    warranty_months: 36,
  },
  {
    id: 'p5', model: 'BOS-D18', full_name: 'BOS-D18 Brushless Drill/Driver',
    category: 'Drill / Driver', image_url: TOOL_IMAGES.t1,
    msrp: 149, distributor_price: 112, stock: 0, stock_level: 'out_of_stock',
    min_order: 5, units_sold_mtd: 0, units_sold_ytd: 19,
    lead_time_days: 10, sku: 'BT-BOSD18', battery_platform: 'BOS 18V LXT',
    warranty_months: 24,
  },
  {
    id: 'p6', model: 'BOS-ID18', full_name: 'BOS-ID18 Impact Driver 18V',
    category: 'Impact Driver', image_url: TOOL_IMAGES.t2,
    msrp: 159, distributor_price: 120, stock: 7, stock_level: 'in_stock',
    min_order: 5, units_sold_mtd: 3, units_sold_ytd: 28,
    lead_time_days: 5, sku: 'BT-BOSID18', battery_platform: 'BOS 18V LXT',
    warranty_months: 24,
  },
];

const ORDERS: StockOrder[] = [
  {
    id: 'ord001', order_date: '2025-02-10', expected_delivery: '2025-02-15',
    status: 'delivered', total: 4720, invoice_number: 'INV-2025-0088',
    items: [
      { model: 'BRH70-20V', qty: 10, unit_price: 187 },
      { model: 'AG180', qty: 20, unit_price: 97 },
    ],
  },
  {
    id: 'ord002', order_date: '2025-02-19', expected_delivery: '2025-02-26',
    status: 'shipped', total: 2158, invoice_number: 'INV-2025-0109',
    items: [
      { model: 'BI-BTS125', qty: 8, unit_price: 135 },
      { model: 'TIGE-3DG', qty: 7, unit_price: 143 },
    ],
  },
  {
    id: 'ord003', order_date: '2025-02-23', expected_delivery: '2025-03-02',
    status: 'processing', total: 1750, invoice_number: 'INV-2025-0122',
    items: [
      { model: 'BOS-ID18', qty: 10, unit_price: 120 },
      { model: 'BRH70-20V', qty: 5, unit_price: 110 },
    ],
  },
];

const REVENUE: RevenueData[] = [
  { month: 'Sep',  revenue: 38200, units: 148, registrations: 14 },
  { month: 'Okt',  revenue: 42500, units: 163, registrations: 17 },
  { month: 'Nov',  revenue: 51800, units: 192, registrations: 21 },
  { month: 'Dez',  revenue: 56300, units: 208, registrations: 24 },
  { month: 'Jan',  revenue: 31400, units: 112, registrations: 11 },
  { month: 'Feb',  revenue: 48750, units: 179, registrations: 23 },
];

const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'claim', title: 'New Warranty Claim', body: 'Thomas Weber submitted a claim for BRH70-20V (chuck wobble)', time: '2 Std. ago', read: false },
  { id: 'n2', type: 'claim', title: 'New Warranty Claim', body: 'Anna Becker submitted a claim for BI-BTS125 (blade guard)', time: '3 Std. ago', read: false },
  { id: 'n3', type: 'stock', title: 'Low Stock Alert', body: 'TIGE-3DG stock is at 4 units — below minimum threshold of 5', time: '5 Std. ago', read: false },
  { id: 'n4', type: 'registration', title: 'New Registration', body: 'Stefan Wagner registered BRH70-20V at your shop', time: '1 Tag ago', read: true },
  { id: 'n5', type: 'order', title: 'Order Shipped', body: 'Order INV-2025-0109 has been dispatched — ETA 26 Feb', time: '2 Tage ago', read: true },
  { id: 'n6', type: 'registration', title: 'New Registration', body: 'Peter Schmidt registered TIGE-3DG Laser Level', time: '3 Tage ago', read: true },
  { id: 'n7', type: 'alert', title: 'Gold Tier Renewal', body: 'Your Gold Partner tier renews on 01.03.2025. Target: €250k YTD sales', time: '5 Tage ago', read: true },
];

// ─── Distributor Management Mock Data ─────────────────────────────────────────

const DIST_CONTACTS: DistContact[] = [
  { id: 'dc1', name: 'Werkhaus GmbH', contactName: 'Franz Kellner', phone: '+49 89 120 34 500', email: 'orders@werkhaus-gmbh.de', logo: 'WH', notes: 'Key Munich account — prefers consolidated monthly bulk orders. Priority support tier.', status: 'active', lastOrderDate: '2025-02-25' },
  { id: 'dc2', name: 'Vogt Werkzeuge', contactName: 'Elisabeth Vogt', phone: '+49 40 987 65 43', email: 'einkauf@vogt-werkzeuge.de', logo: 'VW', notes: 'Specialises in laser & measuring equipment. Consistently fast payer (avg 8 days).', status: 'active', lastOrderDate: '2025-02-18' },
  { id: 'dc3', name: 'Norbau Retail AG', contactName: 'Markus Norden', phone: '+49 30 445 67 100', email: 'm.norden@norbau.de', logo: 'NR', notes: 'Berlin flagship — highest volume account. Integrated EDI system for orders.', status: 'active', lastOrderDate: '2025-02-10' },
  { id: 'dc4', name: 'Krafft GmbH & Co.', contactName: 'Heinz Krafft', phone: '+49 711 234 56 78', email: 'h.krafft@krafft-tools.de', logo: 'KG', notes: '⚠️ Outstanding invoice BB-INV-2025-0022 (€1.478). 2nd reminder sent 03.03.2025.', status: 'active', lastOrderDate: '2025-01-28' },
  { id: 'dc5', name: 'Steinbach AG', contactName: 'Walter Steinbach', phone: '+49 69 888 77 66', email: 'w.steinbach@steinbach-ag.de', logo: 'SA', notes: 'Frankfurt region. Strong Q4 performer. Interested in expanding to South Asian line.', status: 'active', lastOrderDate: '2025-01-15' },
  { id: 'dc6', name: 'Bauer Profi-Tools', contactName: 'Gerhard Bauer', phone: '+49 221 345 67 89', email: 'g.bauer@bauer-profi.de', logo: 'BP', notes: 'New Cologne prospect — onboarding in progress.', status: 'inactive', lastOrderDate: '' },
];

const DIST_PRODUCTS: DistProduct[] = [
  // Werkhaus GmbH (dc1) — 6 products
  { id: 'dp01', distributorId: 'dc1', name: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 218.00, casePrice: 1308.00, moq: 5, inStock: true,  notes: 'Top seller — keep 15+ units', lastUpdated: '2025-02-20' },
  { id: 'dp02', distributorId: 'dc1', name: 'BI-BTS125 Circular Saw', sku: 'BT-BTS125', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 155.00, casePrice: 930.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-02-20' },
  { id: 'dp03', distributorId: 'dc1', name: 'AG180 Angle Grinder', sku: 'BT-AG180', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 112.00, casePrice: 672.00,  moq: 10, inStock: true,  notes: 'High volume — use bundle pricing', lastUpdated: '2025-02-15' },
  { id: 'dp04', distributorId: 'dc1', name: 'TIGE-3DG 360° Laser Level', sku: 'BT-TIGE3DG', category: 'Measuring', unit: 'each', packSize: 1, unitPrice: 163.00, casePrice: 978.00,  moq: 5, inStock: false, notes: 'Back-order — ETA mid-March', lastUpdated: '2025-02-28' },
  { id: 'dp05', distributorId: 'dc1', name: 'BOS-D18 Brushless Drill/Driver', sku: 'BT-BOSD18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 130.00, casePrice: 780.00,  moq: 5, inStock: false, notes: 'Out of stock at factory', lastUpdated: '2025-01-30' },
  { id: 'dp06', distributorId: 'dc1', name: 'BOS-ID18 Impact Driver 18V', sku: 'BT-BOSID18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 140.00, casePrice: 840.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-02-10' },
  // Vogt Werkzeuge (dc2) — 4 products
  { id: 'dp07', distributorId: 'dc2', name: 'TIGE-3DG 360° Laser Level', sku: 'BT-TIGE3DG', category: 'Measuring', unit: 'each', packSize: 1, unitPrice: 163.00, casePrice: 978.00,  moq: 5, inStock: true,  notes: 'Core line for Vogt', lastUpdated: '2025-02-18' },
  { id: 'dp08', distributorId: 'dc2', name: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 218.00, casePrice: 1308.00, moq: 5, inStock: true,  notes: '', lastUpdated: '2025-02-18' },
  { id: 'dp09', distributorId: 'dc2', name: 'AG180 Angle Grinder', sku: 'BT-AG180', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 112.00, casePrice: 672.00,  moq: 10, inStock: true,  notes: '', lastUpdated: '2025-01-20' },
  { id: 'dp10', distributorId: 'dc2', name: 'BI-BTS125 Circular Saw', sku: 'BT-BTS125', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 155.00, casePrice: 930.00,  moq: 5, inStock: false, notes: '', lastUpdated: '2025-01-20' },
  // Norbau Retail AG (dc3) — 6 products
  { id: 'dp11', distributorId: 'dc3', name: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 218.00, casePrice: 1308.00, moq: 5, inStock: true,  notes: 'EDI auto-replenish at 10 units', lastUpdated: '2025-02-10' },
  { id: 'dp12', distributorId: 'dc3', name: 'BI-BTS125 Circular Saw', sku: 'BT-BTS125', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 155.00, casePrice: 930.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-02-10' },
  { id: 'dp13', distributorId: 'dc3', name: 'AG180 Angle Grinder', sku: 'BT-AG180', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 112.00, casePrice: 672.00,  moq: 10, inStock: true,  notes: '', lastUpdated: '2025-02-08' },
  { id: 'dp14', distributorId: 'dc3', name: 'TIGE-3DG 360° Laser Level', sku: 'BT-TIGE3DG', category: 'Measuring', unit: 'each', packSize: 1, unitPrice: 163.00, casePrice: 978.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-02-08' },
  { id: 'dp15', distributorId: 'dc3', name: 'BOS-D18 Brushless Drill/Driver', sku: 'BT-BOSD18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 130.00, casePrice: 780.00,  moq: 5, inStock: false, notes: 'Awaiting factory restock', lastUpdated: '2025-01-15' },
  { id: 'dp16', distributorId: 'dc3', name: 'BOS-ID18 Impact Driver 18V', sku: 'BT-BOSID18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 140.00, casePrice: 840.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-02-10' },
  // Krafft GmbH (dc4) — 4 products
  { id: 'dp17', distributorId: 'dc4', name: 'AG180 Angle Grinder', sku: 'BT-AG180', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 112.00, casePrice: 672.00,  moq: 10, inStock: true,  notes: '', lastUpdated: '2025-01-28' },
  { id: 'dp18', distributorId: 'dc4', name: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 218.00, casePrice: 1308.00, moq: 5, inStock: true,  notes: '', lastUpdated: '2025-01-28' },
  { id: 'dp19', distributorId: 'dc4', name: 'BOS-D18 Brushless Drill/Driver', sku: 'BT-BOSD18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 130.00, casePrice: 780.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-01-10' },
  { id: 'dp20', distributorId: 'dc4', name: 'BOS-ID18 Impact Driver 18V', sku: 'BT-BOSID18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 140.00, casePrice: 840.00,  moq: 5, inStock: false, notes: '', lastUpdated: '2025-01-10' },
  // Steinbach AG (dc5) — 5 products
  { id: 'dp21', distributorId: 'dc5', name: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 218.00, casePrice: 1308.00, moq: 5, inStock: true,  notes: '', lastUpdated: '2025-01-15' },
  { id: 'dp22', distributorId: 'dc5', name: 'BI-BTS125 Circular Saw', sku: 'BT-BTS125', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 155.00, casePrice: 930.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-01-15' },
  { id: 'dp23', distributorId: 'dc5', name: 'TIGE-3DG 360° Laser Level', sku: 'BT-TIGE3DG', category: 'Measuring', unit: 'each', packSize: 1, unitPrice: 163.00, casePrice: 978.00,  moq: 5, inStock: true,  notes: 'Expanding laser range — see notes', lastUpdated: '2025-01-10' },
  { id: 'dp24', distributorId: 'dc5', name: 'BOS-D18 Brushless Drill/Driver', sku: 'BT-BOSD18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 130.00, casePrice: 780.00,  moq: 5, inStock: false, notes: '', lastUpdated: '2025-01-05' },
  { id: 'dp25', distributorId: 'dc5', name: 'BOS-ID18 Impact Driver 18V', sku: 'BT-BOSID18', category: 'Power Tools', unit: 'each', packSize: 1, unitPrice: 140.00, casePrice: 840.00,  moq: 5, inStock: true,  notes: '', lastUpdated: '2025-01-15' },
];

const DIST_MGMT_ORDERS: DistMgmtOrder[] = [
  {
    id: 'dmo001', distributorId: 'dc1', status: 'delivered',
    createdAt: '2025-02-25', expectedDate: '2025-02-28', subtotal: 2340, tax: 444.60, shipping: 0, total: 2784.60, note: 'Consolidated monthly order.',
    items: [
      { id: 'dmi01', orderId: 'dmo001', productId: 'dp01', productName: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', quantity: 6,  unitPrice: 218, lineTotal: 1308, note: '' },
      { id: 'dmi02', orderId: 'dmo001', productId: 'dp03', productName: 'AG180 Angle Grinder',               sku: 'BT-AG180',     quantity: 8,  unitPrice: 112, lineTotal: 896,  note: 'Urgent — display restock' },
      { id: 'dmi03', orderId: 'dmo001', productId: 'dp06', productName: 'BOS-ID18 Impact Driver 18V',        sku: 'BT-BOSID18',  quantity: 1,  unitPrice: 140, lineTotal: 140,  note: '' },
    ],
  },
  {
    id: 'dmo002', distributorId: 'dc2', status: 'confirmed',
    createdAt: '2025-02-18', expectedDate: '2025-02-24', subtotal: 1890, tax: 359.10, shipping: 25, total: 2274.10, note: '',
    items: [
      { id: 'dmi04', orderId: 'dmo002', productId: 'dp07', productName: 'TIGE-3DG 360° Laser Level',         sku: 'BT-TIGE3DG',  quantity: 5,  unitPrice: 163, lineTotal: 815,  note: '' },
      { id: 'dmi05', orderId: 'dmo002', productId: 'dp08', productName: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', quantity: 5,  unitPrice: 218, lineTotal: 1090, note: '' },
    ],
  },
  {
    id: 'dmo003', distributorId: 'dc3', status: 'shipped',
    createdAt: '2025-02-10', expectedDate: '2025-02-15', subtotal: 3120, tax: 592.80, shipping: 0, total: 3712.80, note: 'EDI auto-order — threshold trigger.',
    items: [
      { id: 'dmi06', orderId: 'dmo003', productId: 'dp11', productName: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', quantity: 8,  unitPrice: 218, lineTotal: 1744, note: '' },
      { id: 'dmi07', orderId: 'dmo003', productId: 'dp16', productName: 'BOS-ID18 Impact Driver 18V',        sku: 'BT-BOSID18',  quantity: 10, unitPrice: 140, lineTotal: 1400, note: '' },
    ],
  },
  {
    id: 'dmo004', distributorId: 'dc4', status: 'submitted',
    createdAt: '2025-01-28', expectedDate: '2025-02-05', subtotal: 1478, tax: 280.82, shipping: 35, total: 1793.82, note: '',
    items: [
      { id: 'dmi08', orderId: 'dmo004', productId: 'dp17', productName: 'AG180 Angle Grinder',               sku: 'BT-AG180',     quantity: 7,  unitPrice: 112, lineTotal: 784,  note: '' },
      { id: 'dmi09', orderId: 'dmo004', productId: 'dp19', productName: 'BOS-D18 Brushless Drill/Driver',    sku: 'BT-BOSD18',   quantity: 5,  unitPrice: 130, lineTotal: 650,  note: '' },
    ],
  },
  {
    id: 'dmo005', distributorId: 'dc5', status: 'delivered',
    createdAt: '2025-01-15', expectedDate: '2025-01-20', subtotal: 2720, tax: 516.80, shipping: 0, total: 3236.80, note: 'Year-start stock build.',
    items: [
      { id: 'dmi10', orderId: 'dmo005', productId: 'dp21', productName: 'BRH70-20V Cordless Rotary Hammer', sku: 'BT-BRH70-20V', quantity: 5,  unitPrice: 218, lineTotal: 1090, note: '' },
      { id: 'dmi11', orderId: 'dmo005', productId: 'dp22', productName: 'BI-BTS125 Circular Saw',            sku: 'BT-BTS125',   quantity: 6,  unitPrice: 155, lineTotal: 930,  note: '' },
      { id: 'dmi12', orderId: 'dmo005', productId: 'dp25', productName: 'BOS-ID18 Impact Driver 18V',        sku: 'BT-BOSID18',  quantity: 5,  unitPrice: 140, lineTotal: 700,  note: '' },
    ],
  },
  {
    id: 'dmo006', distributorId: 'dc1', status: 'draft',
    createdAt: '2025-03-01', expectedDate: '', subtotal: 560, tax: 106.40, shipping: 0, total: 666.40, note: 'Quick top-up order.',
    items: [
      { id: 'dmi13', orderId: 'dmo006', productId: 'dp03', productName: 'AG180 Angle Grinder',               sku: 'BT-AG180',     quantity: 5,  unitPrice: 112, lineTotal: 560,  note: '' },
    ],
  },
  {
    id: 'dmo007', distributorId: 'dc3', status: 'partial',
    createdAt: '2025-02-05', expectedDate: '2025-02-12', subtotal: 2590, tax: 492.10, shipping: 0, total: 3082.10, note: 'Partial delivery — BOS-D18 on backorder.',
    items: [
      { id: 'dmi14', orderId: 'dmo007', productId: 'dp12', productName: 'BI-BTS125 Circular Saw',            sku: 'BT-BTS125',   quantity: 8,  unitPrice: 155, lineTotal: 1240, note: '' },
      { id: 'dmi15', orderId: 'dmo007', productId: 'dp15', productName: 'BOS-D18 Brushless Drill/Driver',    sku: 'BT-BOSD18',   quantity: 10, unitPrice: 130, lineTotal: 1300, note: 'Partially delivered — 4/10 units pending' },
    ],
  },
  {
    id: 'dmo008', distributorId: 'dc2', status: 'cancelled',
    createdAt: '2025-01-05', expectedDate: '2025-01-12', subtotal: 815, tax: 154.85, shipping: 25, total: 994.85, note: 'Cancelled — customer changed forecast.',
    items: [
      { id: 'dmi16', orderId: 'dmo008', productId: 'dp07', productName: 'TIGE-3DG 360° Laser Level',         sku: 'BT-TIGE3DG',  quantity: 5,  unitPrice: 163, lineTotal: 815,  note: '' },
    ],
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface DistributorState {
  isAuthenticated: boolean;
  profile: DistributorProfile;
  customers: DistCustomer[];
  claims: WarrantyClaim[];
  catalog: CatalogProduct[];
  orders: StockOrder[];
  revenue: RevenueData[];
  notifications: Notification[];
  darkMode: boolean;
  learnMode: boolean;
  activeTab: string;
  selectedCustomerId: string | null;
  selectedClaimId: string | null;

  setAuthenticated: (v: boolean) => void;
  toggleDarkMode: () => void;
  toggleLearnMode: () => void;
  setActiveTab: (tab: string) => void;
  setSelectedCustomer: (id: string | null) => void;
  setSelectedClaim: (id: string | null) => void;
  updateClaimStatus: (id: string, status: ClaimStatus, resolution?: string) => void;
  markAllNotificationsRead: () => void;
  addOrder: (order: StockOrder) => void;
  updateCatalogProduct: (id: string, updates: Partial<CatalogProduct>) => void;
  distContacts: DistContact[];
  distProducts: DistProduct[];
  distOrders: DistMgmtOrder[];

  addDistContact: (c: DistContact) => void;
  updateDistContact: (id: string, updates: Partial<DistContact>) => void;
  deleteDistContact: (id: string) => void;
  addDistProduct: (p: DistProduct) => void;
  updateDistProduct: (id: string, updates: Partial<DistProduct>) => void;
  deleteDistProduct: (id: string) => void;
  addDistOrder: (o: DistMgmtOrder) => void;
  updateDistOrder: (id: string, updates: Partial<DistMgmtOrder>) => void;
}

export const useDistributorStore = create<DistributorState>((set) => ({
  isAuthenticated: false,
  profile: PROFILE,
  customers: CUSTOMERS,
  claims: CLAIMS,
  catalog: CATALOG,
  orders: ORDERS,
  revenue: REVENUE,
  notifications: NOTIFICATIONS,
  darkMode: false,
  learnMode: false,
  activeTab: 'home',
  selectedCustomerId: null,
  selectedClaimId: null,

  setAuthenticated: (v) => set({ isAuthenticated: v }),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  toggleLearnMode: () => set((s) => ({ learnMode: !s.learnMode })),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedCustomer: (id) => set({ selectedCustomerId: id }),
  setSelectedClaim: (id) => set({ selectedClaimId: id }),
  updateClaimStatus: (id, status, resolution) =>
    set((s) => ({
      claims: s.claims.map((c) =>
        c.id === id ? { ...c, status, resolution: resolution || c.resolution } : c
      ),
    })),
  markAllNotificationsRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
  addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
  updateCatalogProduct: (id, updates) =>
    set((s) => ({
      catalog: s.catalog.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
  distContacts: DIST_CONTACTS,
  distProducts: DIST_PRODUCTS,
  distOrders:   DIST_MGMT_ORDERS,

  addDistContact: (c) => set((s) => ({ distContacts: [...s.distContacts, c] })),
  updateDistContact: (id, u) => set((s) => ({ distContacts: s.distContacts.map(c => c.id === id ? { ...c, ...u } : c) })),
  deleteDistContact: (id) => set((s) => ({ distContacts: s.distContacts.filter(c => c.id !== id) })),
  addDistProduct: (p) => set((s) => ({ distProducts: [...s.distProducts, p] })),
  updateDistProduct: (id, u) => set((s) => ({ distProducts: s.distProducts.map(p => p.id === id ? { ...p, ...u } : p) })),
  deleteDistProduct: (id) => set((s) => ({ distProducts: s.distProducts.filter(p => p.id !== id) })),
  addDistOrder: (o) => set((s) => ({ distOrders: [o, ...s.distOrders] })),
  updateDistOrder: (id, u) => set((s) => ({ distOrders: s.distOrders.map(o => o.id === id ? { ...o, ...u } : o) })),
}));