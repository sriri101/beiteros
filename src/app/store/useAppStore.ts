import { create } from 'zustand';
import type { Language } from '../i18n/translations';
import { TOOL_IMAGES } from '../assets/toolImages';

export type UserType = 'DIYer' | 'Pro';
export type WarrantyStatus = 'active' | 'expired' | 'expiring';
export type MaintenanceStatus = 'ok' | 'due' | 'overdue';
export type TipCategory = 'Safety' | 'Maintenance' | 'Productivity';
export type ShopType = 'distributor' | 'repair' | 'both';
export type ChatRole = 'user' | 'assistant';

export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  user_type: UserType;
  points: number;
  level: number;
  referral_code: string;
  preferred_distributor: string;
  avatar: string;
  profile_completed: number; // 0-100
}

export interface ToolSpec {
  [key: string]: string;
}

export interface Tool {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  image_url: string;
  specs: ToolSpec;
  battery_platform: string;
  category: string;
  purchase_date: string;
  distributor: string;
  warranty_start: string;
  warranty_end: string;
  extension_applied: boolean;
  is_stolen: boolean;
  next_maintenance: string;
  warranty_status: WarrantyStatus;
  maintenance_status: MaintenanceStatus;
  satisfaction_score: number;
  compatible_accessories: string[];
  documents: { name: string; type: 'manual' | 'guide' | 'certificate'; url: string }[];
  maintenance_log: { date: string; type: string; notes: string; technician: string }[];
}

export interface Tip {
  id: string;
  title: string;
  category: TipCategory;
  body: string;
  publish_date: string;
  is_active: boolean;
  saved: boolean;
  read: boolean;
}

export interface Receipt {
  id: string;
  tool_id: string | null;
  tool_name: string | null;
  file_url: string;
  upload_date: string;
  distributor: string;
  amount: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
}

export interface ServiceShop {
  id: string;
  name: string;
  type: ShopType;
  address: string;
  city: string;
  phone: string;
  lat: number;
  lng: number;
  distance?: string;
  hours: string;
}

export interface AppState {
  isAuthenticated: boolean;
  authMode: 'login' | 'signup';
  darkMode: boolean;
  language: Language;
  user: User;
  tools: Tool[];
  tips: Tip[];
  receipts: Receipt[];
  chatMessages: ChatMessage[];
  activeTab: string;
  selectedToolId: string | null;
  shops: ServiceShop[];
  scanStep: 'choose' | 'scan' | 'identify' | 'warranty' | 'success';
  scanResult: Tool | null;

  // Actions
  setAuthenticated: (val: boolean) => void;
  setAuthMode: (mode: 'login' | 'signup') => void;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
  setUser: (user: Partial<User>) => void;
  addTool: (tool: Tool) => void;
  updateTool: (id: string, data: Partial<Tool>) => void;
  reportStolen: (id: string) => void;
  markTipRead: (id: string) => void;
  toggleTipSave: (id: string) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  addReceipt: (receipt: Receipt) => void;
  setActiveTab: (tab: string) => void;
  setSelectedTool: (id: string | null) => void;
  addPoints: (pts: number) => void;
  setScanStep: (step: AppState['scanStep']) => void;
  setScanResult: (tool: Tool | null) => void;
  setToolSatisfaction: (id: string, score: number) => void;
  setLanguage: (lang: Language) => void;
}

const LEVEL_THRESHOLDS = [0, 500, 1500, 3000, 5500, 9000, 14000, 21000, 30000, 42000];

function getLevel(points: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return Math.min(level, 10);
}

export function getNextLevelThreshold(level: number): number {
  return LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] || 42000;
}

export function getLevelName(level: number): string {
  const names = ['Newcomer', 'Hobbyist', 'Apprentice', 'Builder', 'Craftsman', 'Expert', 'Master', 'Pro Builder', 'Legend', 'Elite'];
  return names[Math.min(level - 1, names.length - 1)];
}

const initialTools: Tool[] = [
  {
    id: 't1',
    brand: 'BeiterOS',
    model: 'BRH70-20V Rotary Hammer',
    serial_number: 'BRH70-20V-2024-001',
    image_url: TOOL_IMAGES.t1,
    specs: {
      'Rated Voltage': '20V',
      'Battery Capacity': '5,0 Ah',
      'No Load Speed': '0–1.600 RPM',
      'Impact Rate': '0–4.500 BPM',
      'Impact Energy': '2,0 J',
      'Drilling Capacity': 'Wood 28mm / Steel 13mm / Concrete 22mm',
      'Chuck Size': '8–12 mm',
      'Charging Time': '100 min',
      'Weight': '2,6 kg (bare)',
      'Accessories': '2× Li-ion Batteries, Charger, Tool Box',
    },
    battery_platform: 'BOS-20V',
    category: 'Rotary Hammer',
    purchase_date: '2024-03-15',
    distributor: 'Werkhaus Berlin',
    warranty_start: '2024-03-15',
    warranty_end: '2026-03-15',
    extension_applied: true,
    is_stolen: false,
    next_maintenance: '2025-09-15',
    warranty_status: 'active',
    maintenance_status: 'due',
    satisfaction_score: 8,
    compatible_accessories: ['BOS-20V 5,0 Ah Akku', 'BRH70 SDS-Bohrer-Set', 'BRH70 Meißel-Set', 'BOS-20V Doppelladegerät'],
    documents: [
      { name: 'Sicherheitshandbuch', type: 'manual', url: '#' },
      { name: 'Schnellstartanleitung', type: 'guide', url: '#' },
      { name: 'Garantiezertifikat', type: 'certificate', url: '#' },
    ],
    maintenance_log: [
      { date: '2024-09-15', type: 'Routineservice', notes: 'Kohlebürsten geprüft, Getriebe gefettet', technician: 'Klaus M.' },
      { date: '2024-03-15', type: 'Ersteinrichtung', notes: 'Akkukalibration durchgeführt', technician: 'Werkhaus Berlin' },
    ],
  },
  {
    id: 't2',
    brand: 'BeiterOS',
    model: 'BI-BTS125 Circular Saw',
    serial_number: 'BI-BTS125-2024-042',
    image_url: TOOL_IMAGES.t2,
    specs: {
      'Motor': 'Lithium-Ion Power Brushless',
      'Voltage': '20V',
      'No Load Speed': '7.000 RPM',
      'Blade Ø': '125 mm',
      'Inner Ø': '20 mm',
      '90° Cutting': '43 mm',
      '45° Cutting': '31 mm',
      'Base Rotation': '0–45°',
    },
    battery_platform: 'BOS-20V',
    category: 'Saw',
    purchase_date: '2024-06-01',
    distributor: 'Norbau München',
    warranty_start: '2024-06-01',
    warranty_end: '2025-06-01',
    extension_applied: false,
    is_stolen: false,
    next_maintenance: '2025-12-01',
    warranty_status: 'expiring',
    maintenance_status: 'ok',
    satisfaction_score: 9,
    compatible_accessories: ['BOS-20V 4,0 Ah Akku', 'BI-BTS125 Sägeblatt 125mm', 'BI-BTS125 Feinschnittblatt', 'Staubbeutel'],
    documents: [
      { name: 'Sicherheitshandbuch', type: 'manual', url: '#' },
      { name: 'Schnellstartanleitung', type: 'guide', url: '#' },
    ],
    maintenance_log: [
      { date: '2024-12-01', type: 'Blattwechsel', notes: 'Originalblatt gegen Feinschnittblatt ausgetauscht', technician: 'Selbst' },
    ],
  },
  {
    id: 't3',
    brand: 'BeiterOS',
    model: 'BA618-20V Angle Grinder',
    serial_number: 'BA618-20V-2023-118',
    image_url: TOOL_IMAGES.t3,
    specs: {
      'Rated Voltage': '20V',
      'Battery Capacity': '5,0 Ah',
      'No Load Speed': '10.000 RPM',
      'Grinding Wheel Ø': '100 mm',
      'Hole Ø': '16 mm',
      'Spindle Thread': 'M10',
      'Weight': '1,4 kg',
      'Accessories': '2× Li-ion Batteries, Charger',
    },
    battery_platform: 'BOS-20V',
    category: 'Grinder',
    purchase_date: '2023-11-20',
    distributor: 'Steinbach Köln',
    warranty_start: '2023-11-20',
    warranty_end: '2024-11-20',
    extension_applied: false,
    is_stolen: false,
    next_maintenance: '2025-02-20',
    warranty_status: 'expired',
    maintenance_status: 'overdue',
    satisfaction_score: 7,
    compatible_accessories: ['BA618 Schleifscheibe 100mm', 'BA618 Trennscheibe 100mm', 'BOS-20V 5,0 Ah Akku', 'Schutzhaube-Set'],
    documents: [
      { name: 'Sicherheitshandbuch', type: 'manual', url: '#' },
      { name: 'Schnellstartanleitung', type: 'guide', url: '#' },
    ],
    maintenance_log: [],
  },
];

const initialTips: Tip[] = [
  {
    id: 'tip1',
    title: 'Always Wear Eye Protection When Grinding',
    category: 'Safety',
    body: 'Flying sparks and debris from angle grinders can cause permanent eye damage. Always wear ANSI-rated safety glasses or a full face shield — even for short tasks.',
    publish_date: '2025-02-22',
    is_active: true,
    saved: false,
    read: false,
  },
  {
    id: 'tip2',
    title: 'Extend Battery Life with Proper Storage',
    category: 'Maintenance',
    body: 'Store Li-Ion batteries at 40–60% charge in a cool, dry place. Avoid leaving batteries fully discharged for extended periods — this can cause irreversible cell damage.',
    publish_date: '2025-02-21',
    is_active: true,
    saved: true,
    read: true,
  },
  {
    id: 'tip3',
    title: 'Pre-Drill Pilot Holes for Cleaner Results',
    category: 'Productivity',
    body: 'When driving screws into hardwood or near edges, pre-drilling a pilot hole prevents splitting and gives you much more accurate screw placement with less effort.',
    publish_date: '2025-02-20',
    is_active: true,
    saved: false,
    read: false,
  },
  {
    id: 'tip4',
    title: 'Clean Blades After Each Use',
    category: 'Maintenance',
    body: 'Pitch and resin buildup on saw blades reduce cutting efficiency and can cause dangerous binding. Clean blades with blade-cleaning spray and a soft brush after every use.',
    publish_date: '2025-02-19',
    is_active: true,
    saved: false,
    read: false,
  },
  {
    id: 'tip5',
    title: 'Choose the Right Drill Bit for the Material',
    category: 'Productivity',
    body: 'HSS bits for metal, masonry bits for concrete, brad-point for wood. Using the wrong bit type causes overheating, poor results, and premature wear on your drill.',
    publish_date: '2025-02-18',
    is_active: true,
    saved: false,
    read: false,
  },
  {
    id: 'tip6',
    title: 'Check Cord & Battery Connections Regularly',
    category: 'Safety',
    body: 'Damaged battery contacts or corroded terminals reduce power delivery and can cause overheating. Inspect contacts monthly and clean with a dry cloth or contact cleaner.',
    publish_date: '2025-02-17',
    is_active: true,
    saved: false,
    read: false,
  },
];

const initialReceipts: Receipt[] = [
  {
    id: 'r1',
    tool_id: 't1',
    tool_name: 'BRH70-20V Rotary Hammer',
    file_url: '#',
    upload_date: '2024-03-15',
    distributor: 'Werkhaus Berlin',
    amount: '€ 249,00',
  },
  {
    id: 'r2',
    tool_id: 't2',
    tool_name: 'BI-BTS125 Circular Saw',
    file_url: '#',
    upload_date: '2024-06-01',
    distributor: 'Norbau München',
    amount: '€ 189,99',
  },
  {
    id: 'r3',
    tool_id: null,
    tool_name: null,
    file_url: '#',
    upload_date: '2025-01-10',
    distributor: 'Steinbach Köln',
    amount: '€ 84,50',
  },
];

const initialShops: ServiceShop[] = [
  { id: 's1', name: 'Werkhaus Service Center', type: 'both', address: 'Kantstraße 12, Berlin-Charlottenburg', city: 'Berlin', phone: '+49 30 8900 4400', lat: 52.500, lng: 13.300, distance: '1,2 km', hours: 'Mo–Sa 08:00–20:00 Uhr' },
  { id: 's2', name: 'Norbau Werkzeugmarkt München', type: 'distributor', address: 'Schleißheimer Str. 420, München', city: 'München', phone: '+49 89 3570 8800', lat: 48.160, lng: 11.550, distance: '3,5 km', hours: 'Mo–Sa 07:00–20:00 Uhr' },
  { id: 's3', name: 'Krafft Werkzeuge GmbH', type: 'repair', address: 'Osterbekstraße 90a, Hamburg', city: 'Hamburg', phone: '+49 40 2850 7700', lat: 53.590, lng: 10.050, distance: '5,1 km', hours: 'Mo–Fr 07:30–18:00 Uhr' },
  { id: 's4', name: 'Steinbach Service Center', type: 'distributor', address: 'Kölner Str. 55, Frechen', city: 'Köln', phone: '+49 2234 9500 200', lat: 50.920, lng: 6.930, distance: '12,4 km', hours: 'Mo–Sa 07:00–22:00 Uhr' },
  { id: 's5', name: 'Vogt Werkzeuge GmbH', type: 'repair', address: 'Hanauer Landstraße 147, Frankfurt', city: 'Frankfurt am Main', phone: '+49 69 4050 3300', lat: 50.120, lng: 8.720, distance: '18,7 km', hours: 'Mo–Fr 08:00–17:00 Uhr' },
];

export const MOCK_SCAN_TOOL: Tool = {
  id: 't_new',
  brand: 'BeiterOS',
  model: 'TIGE-3DG Laser Level',
  serial_number: 'TIGE-3DG-2025-077',
  image_url: TOOL_IMAGES.t_scan,
  specs: {
    'Working Range': 'Red 30m / Green 40m / 70m with Receiver',
    'Accuracy': '±2mm @ 10m',
    'Self-leveling Range': '±3°',
    'Laser Class': 'Class II – Red 660nm / Green 532nm',
    'Protection': 'IP54 Waterproof & Dustproof',
    'Power Supply': 'Li-Ion Battery',
    'Operating Temp.': '-10°C ~ +40°C',
    'Incline Mode': 'Transport Lock & Individually Shiftable',
    'Out-of-level Alert': 'Optical Signal & Audio Alert',
    'Tripod Thread': '1/4"',
  },
  battery_platform: 'Li-Ion (internal)',
  category: 'Laser Level',
  purchase_date: '',
  distributor: '',
  warranty_start: '',
  warranty_end: '',
  extension_applied: false,
  is_stolen: false,
  next_maintenance: '2026-08-22',
  warranty_status: 'active',
  maintenance_status: 'ok',
  satisfaction_score: 0,
  compatible_accessories: ['TIGE Receiver', 'Magnetic Pivot Base', '1/4" Tripod Adapter', 'Carrying Case'],
  documents: [
    { name: 'Sicherheitshandbuch', type: 'manual', url: '#' },
    { name: 'Schnellstartanleitung', type: 'guide', url: '#' },
  ],
  maintenance_log: [],
};

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  authMode: 'login',
  darkMode: typeof window !== 'undefined' && localStorage.getItem('beiteros-dark') === 'true',
  language: (typeof window !== 'undefined' ? (localStorage.getItem('beiteros-lang') as Language) : null) || 'en',
  user: {
    id: 'u1',
    name: 'Timothy Ho',
    email: 'timothy.ho@email.com',
    country: 'Deutschland',
    user_type: 'DIYer',
    points: 2350,
    level: 3,
    referral_code: 'BEITER-THO5K',
    preferred_distributor: 'Werkhaus Berlin',
    avatar: '',
    profile_completed: 85,
  },
  tools: initialTools,
  tips: initialTips,
  receipts: initialReceipts,
  chatMessages: [],
  activeTab: 'home',
  selectedToolId: null,
  shops: initialShops,
  scanStep: 'choose',
  scanResult: null,

  setAuthenticated: (val) => set({ isAuthenticated: val }),
  setAuthMode: (mode) => set({ authMode: mode }),
  toggleDarkMode: () => set((s) => {
    const next = !s.darkMode;
    localStorage.setItem('beiteros-dark', String(next));
    return { darkMode: next };
  }),
  setDarkMode: (val) => {
    localStorage.setItem('beiteros-dark', String(val));
    set({ darkMode: val });
  },
  setUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),

  addTool: (tool) =>
    set((s) => ({
      tools: [...s.tools, tool],
      user: {
        ...s.user,
        points: s.user.points + 500,
        level: getLevel(s.user.points + 500),
      },
    })),

  updateTool: (id, data) =>
    set((s) => ({
      tools: s.tools.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  reportStolen: (id) =>
    set((s) => ({
      tools: s.tools.map((t) => (t.id === id ? { ...t, is_stolen: true } : t)),
    })),

  markTipRead: (id) =>
    set((s) => ({
      tips: s.tips.map((t) => (t.id === id ? { ...t, read: true } : t)),
      user: {
        ...s.user,
        points: s.user.points + 25,
        level: getLevel(s.user.points + 25),
      },
    })),

  toggleTipSave: (id) =>
    set((s) => ({
      tips: s.tips.map((t) => (t.id === id ? { ...t, saved: !t.saved } : t)),
    })),

  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

  clearChat: () => set({ chatMessages: [] }),

  addReceipt: (receipt) =>
    set((s) => ({ receipts: [...s.receipts, receipt] })),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedTool: (id) => set({ selectedToolId: id }),

  addPoints: (pts) =>
    set((s) => ({
      user: {
        ...s.user,
        points: s.user.points + pts,
        level: getLevel(s.user.points + pts),
      },
    })),

  setScanStep: (step) => set({ scanStep: step }),
  setScanResult: (tool) => set({ scanResult: tool }),

  setToolSatisfaction: (id, score) =>
    set((s) => ({
      tools: s.tools.map((t) => (t.id === id ? { ...t, satisfaction_score: score } : t)),
    })),

  setLanguage: (lang) => {
    if (typeof window !== 'undefined') localStorage.setItem('beiteros-lang', lang);
    set({ language: lang });
  },
}));