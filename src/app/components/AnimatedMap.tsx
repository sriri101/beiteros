import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Navigation, X, Clock, MapPin } from 'lucide-react';
import { ServiceShop } from '../store/useAppStore';

/* ─────────────────────────────────────────────────────────────
   Apple Maps colour palette — modelled on the Singapore screenshot
───────────────────────────────────────────────────────────── */
const C = {
  sea:      '#AAD3DF',   // bright light blue water
  land:     '#F2EDE0',   // warm cream land
  park:     '#C8DAAD',   // muted sage green parks
  urban:    '#E5DDD0',   // slightly darker cream for urban patches
  river:    '#AAD3DF',   // rivers same hue as sea
  hwyFill:  '#F5C518',   // golden yellow highway (key Apple Maps trait)
  hwyCsg:   '#C9A200',   // amber casing / outline under roads
  border:   '#B8AF9E',   // country border stroke
  cityLbl:  '#1A1A1A',   // bold city name text
  sub:      '#555555',   // secondary text
  shieldBg: '#3370D4',   // Autobahn shield blue
};

/* ─── viewBox 0 0 360 480  ────────────────────────────────── */
const p = (lng: number, lat: number) => ({
  x: +(( lng - 5.5) * 36).toFixed(1),
  y: +((55.5 - lat) * 58).toFixed(1),
});

/* ─── Germany outline ─────────────────────────────────────── */
const GERMANY = `
  M 61 121 L 111 116 L 158 116
  L 140 62  L 140 40  L 162 23
  L 187 93  L 273 69  L 309 93
  L 324 108 L 338 261
  L 313 290 L 248 313
  L 288 348 L 218 454 L 180 470
  L 144 458 L 76 458
  L 83 406  L 32 348
  L 14 272  L 14 261
  L 50 128 Z
`.trim();

/* ─── Parks / forests ─────────────────────────────────────── */
const PARKS = [
  { cx: 94,  cy: 418, rx: 20, ry: 32 },
  { cx: 278, cy: 378, rx: 15, ry: 22 },
  { cx: 180, cy: 214, rx: 24, ry: 13 },
  { cx: 163, cy: 144, rx: 26, ry: 15 },
  { cx: 200, cy: 440, rx: 16, ry: 10 },
];

/* ─── Urban blobs ─────────────────────────────────────────── */
const URBAN_BLOBS = [
  { ...p(13.40, 52.50), r: 17 },  // Berlin
  { ...p(11.55, 48.16), r: 14 },  // München
  { ...p(10.05, 53.59), r: 13 },  // Hamburg
  { ...p(6.93,  50.92), r: 12 },  // Köln/Ruhr
  { ...p(8.72,  50.12), r: 11 },  // Frankfurt
  { ...p(9.18,  48.77), r: 10 },  // Stuttgart
  { ...p(12.37, 51.34), r: 9  },  // Leipzig
  { ...p(9.73,  52.37), r: 9  },  // Hannover
  { ...p(7.47,  51.51), r: 8  },  // Dortmund
];

/* ─── Rivers ──────────────────────────────────────────────── */
const RIVERS = [
  { d: 'M 75 461 L 104 377 L 101 320 L 86 320 L 75 298 L 53 264 L 47 248 L 25 212', w: 3.5 },
  { d: 'M 295 259 L 220 198 L 162 113', w: 2.8 },
  { d: 'M 212 313 L 158 330 L 115 313 L 100 320', w: 2.2 },
  { d: 'M 108 440 L 161 412 L 213 391 L 238 376 L 287 402', w: 2.8 },
  { d: 'M 144 228 L 134 185 L 138 140 L 148 110', w: 2.0 },
];

/* ─── Golden yellow Autobahns ─────────────────────────────── */
const HIGHWAYS = [
  { d: 'M 164 111 L 155 200 L 148 260 L 150 380 L 185 420 L 218 426', label: 'A7',  lx: 148, ly: 310 },
  { d: 'M 281 174 L 268 220 L 256 270 L 245 330 L 218 426',           label: 'A9',  lx: 263, ly: 235 },
  { d: 'M 51 266 L 116 312 L 180 300 L 256 270 L 281 174',            label: 'A3',  lx: 165, ly: 290 },
  { d: 'M 51 266 L 140 228 L 200 210 L 281 174',                      label: 'A2',  lx: 163, ly: 212 },
  { d: 'M 164 111 L 220 140 L 281 174',                               label: 'A24', lx: 219, ly: 130 },
  { d: 'M 116 312 L 150 395 L 218 426',                               label: 'A5',  lx: 146, ly: 390 },
  { d: 'M 116 312 L 108 355 L 108 390',                               label: 'A81', lx: 100, ly: 358 },
];

/* ─── City labels on map ─────────────────────────────────── */
const CITY_LABELS = [
  { ...p(13.40, 52.50), name: 'Berlin',    size: 13, weight: '700' },
  { ...p(11.55, 48.16), name: 'München',   size: 11, weight: '600' },
  { ...p(10.05, 53.59), name: 'Hamburg',   size: 11, weight: '600' },
  { ...p(6.93,  50.92), name: 'Köln',      size: 10, weight: '600' },
  { ...p(8.72,  50.12), name: 'Frankfurt', size: 10, weight: '600' },
  { ...p(9.18,  48.77), name: 'Stuttgart', size: 9,  weight: '500' },
  { ...p(12.37, 51.34), name: 'Leipzig',   size: 9,  weight: '500' },
  { ...p(9.73,  52.37), name: 'Hannover',  size: 9,  weight: '500' },
];

/* ─── Shop map positions (exact store lat/lng) ─────────────
   s1 Werkhaus  Berlin    52.500 / 13.300  → both
   s2 Norbau    München   48.160 / 11.550  → distributor
   s3 Krafft    Hamburg   53.590 / 10.050  → repair
   s4 Steinbach Köln      50.920 /  6.930  → distributor
   s5 Vogt      Frankfurt 50.120 /  8.720  → repair
──────────────────────────────────────────────────────────── */
const SHOP_POS: Record<string, { x: number; y: number }> = {
  s1: p(13.30, 52.50),
  s2: p(11.55, 48.16),
  s3: p(10.05, 53.59),
  s4: p(6.93,  50.92),
  s5: p(8.72,  50.12),
};

/* User dot slightly offset from Berlin centre */
const USER = { x: p(13.40, 52.52).x - 10, y: p(13.40, 52.52).y + 12 };

/* ─── Type → colour ──────────────────────────────────────── */
const TYPE_CFG: Record<string, { color: string; label: string }> = {
  distributor: { color: '#00AEEF', label: 'Distributor' },
  repair:      { color: '#34C759', label: 'Repair Center' },
  both:        { color: '#FF9500', label: 'Service & Sales' },
};

/* ─── Teardrop pin path ───────────────────────────────────── */
function pinPath(cx: number, tipY: number, r: number): string {
  const hy = tipY - 2 * r;
  return [
    `M ${cx} ${tipY}`,
    `C ${cx - r * 0.42} ${tipY - r * 0.75}`,
    `  ${cx - r} ${tipY - r * 1.55} ${cx - r} ${hy}`,
    `A ${r} ${r} 0 0 0 ${cx + r} ${hy}`,
    `C ${cx + r} ${tipY - r * 1.55}`,
    `  ${cx + r * 0.42} ${tipY - r * 0.75} ${cx} ${tipY}`,
    'Z',
  ].join(' ');
}

/* ─── Component ───────────────────────────────────────────── */
interface AnimatedMapProps { shops: ServiceShop[] }

export function AnimatedMap({ shops }: AnimatedMapProps) {
  const [selected, setSelected] = useState<ServiceShop | null>(null);
  const toggle = (s: ServiceShop) =>
    setSelected(prev => prev?.id === s.id ? null : s);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#AAD3DF]">

      {/* ══════════════════════════════════════════════════════
          SVG MAP — Apple Maps aesthetic
      ══════════════════════════════════════════════════════ */}
      <motion.svg
        viewBox="0 0 360 480"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.07 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ transformOrigin: '180px 240px' }}
      >
        <defs>
          {/* Land drop shadow */}
          <filter id="am-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="8"
              floodColor="#8C7B6A" floodOpacity="0.20" />
          </filter>
          {/* Autobahn glow */}
          <filter id="hwy-glow" x="-20%" y="-100%" width="140%" height="300%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Soft edge vignette */}
          <radialGradient id="vig" cx="50%" cy="50%" r="70%">
            <stop offset="55%" stopColor="transparent" />
            <stop offset="100%" stopColor="#9ABECC" stopOpacity="0.22" />
          </radialGradient>
        </defs>

        {/* Water / sea background */}
        <rect width="360" height="480" fill={C.sea} />

        {/* Germany land mass */}
        <motion.path
          d={GERMANY}
          fill={C.land}
          stroke={C.border}
          strokeWidth="1.2"
          strokeLinejoin="round"
          filter="url(#am-shadow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Urban blobs */}
        {URBAN_BLOBS.map((u, i) => (
          <circle key={i} cx={u.x} cy={u.y} r={u.r} fill={C.urban} />
        ))}

        {/* Parks */}
        {PARKS.map((pk, i) => (
          <ellipse key={i} cx={pk.cx} cy={pk.cy} rx={pk.rx} ry={pk.ry} fill={C.park} />
        ))}

        {/* Bodensee */}
        <ellipse cx={139} cy={457} rx={22} ry={7} fill={C.river} />

        {/* Rivers — draw-in animation */}
        {RIVERS.map((r, i) => (
          <motion.path
            key={i} d={r.d}
            fill="none" stroke={C.river}
            strokeWidth={r.w} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.0, delay: 0.2 + i * 0.07, ease: 'easeInOut' }}
          />
        ))}

        {/* ── Golden Autobahns ──── draw-in, amber casing first */}
        {/* Casing (darker amber outline) */}
        {HIGHWAYS.map((h, i) => (
          <motion.path
            key={`csg-${i}`} d={h.d}
            fill="none" stroke={C.hwyCsg}
            strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.65, delay: 0.45 + i * 0.06, ease: 'easeInOut' }}
          />
        ))}
        {/* Fill (golden yellow) */}
        {HIGHWAYS.map((h, i) => (
          <motion.path
            key={`rd-${i}`} d={h.d}
            fill="none" stroke={C.hwyFill}
            strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"
            filter="url(#hwy-glow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.65, delay: 0.45 + i * 0.06, ease: 'easeInOut' }}
          />
        ))}

        {/* ── Autobahn shield badges ───────────────────────── */}
        {HIGHWAYS.map((h, i) => (
          <motion.g
            key={`shield-${i}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9 + i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
            style={{ transformOrigin: `${h.lx}px ${h.ly}px` }}
          >
            {/* Blue pill background */}
            <rect
              x={h.lx - 10} y={h.ly - 7}
              width={h.label.length > 2 ? 24 : 20}
              height={13}
              rx={3} ry={3}
              fill={C.shieldBg}
            />
            <text
              x={h.lx + (h.label.length > 2 ? 2 : 0)} y={h.ly + 3}
              textAnchor="middle"
              fill="white"
              fontSize={7}
              fontWeight="700"
              fontFamily="Inter, -apple-system, sans-serif"
              letterSpacing="0.2"
            >
              {h.label}
            </text>
          </motion.g>
        ))}

        {/* ── Bold city name labels ─────────────────────────── */}
        {CITY_LABELS.map((cl, i) => (
          <motion.text
            key={i}
            x={cl.x} y={cl.y - 20}
            textAnchor="middle"
            fill={C.cityLbl}
            fontSize={cl.size}
            fontWeight={cl.weight}
            fontFamily="Inter, -apple-system, sans-serif"
            letterSpacing="0.1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ delay: 0.55 + i * 0.04 }}
          >
            {cl.name}
          </motion.text>
        ))}

        {/* Vignette */}
        <rect width="360" height="480" fill="url(#vig)" />

        {/* ── User location — flat Apple Maps blue dot ──────── */}
        {/* Accuracy ring */}
        <motion.circle
          cx={USER.x} cy={USER.y} r={18}
          fill="#007AFF" fillOpacity={0.13}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          style={{ transformOrigin: `${USER.x}px ${USER.y}px` }}
        />
        {/* Pulse */}
        <motion.circle
          cx={USER.x} cy={USER.y} r={13}
          fill="none" stroke="#007AFF" strokeWidth="1.5"
          initial={{ opacity: 0.6, scale: 1 }}
          animate={{ opacity: 0, scale: 2.6 }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeOut', repeatDelay: 0.5 }}
          style={{ transformOrigin: `${USER.x}px ${USER.y}px` }}
        />
        {/* White ring */}
        <circle cx={USER.x} cy={USER.y} r={9}
          fill="white"
          style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.28))' }}
        />
        {/* Blue fill — exactly like screenshot */}
        <circle cx={USER.x} cy={USER.y} r={6.5} fill="#007AFF" />

        {/* ── Shop pins ──────────────────────────────────────── */}
        {shops.map((shop, i) => {
          const sp = SHOP_POS[shop.id];
          if (!sp) return null;
          const color = TYPE_CFG[shop.type]?.color ?? '#00AEEF';
          const active = selected?.id === shop.id;
          const r = active ? 13 : 10;
          const tipY = sp.y + 2;

          return (
            <motion.g
              key={shop.id}
              style={{ transformOrigin: `${sp.x}px ${sp.y - r}px`, cursor: 'pointer' }}
              initial={{ y: -28, opacity: 0, scale: 0.4 }}
              animate={{ y: 0, opacity: 1, scale: active ? 1.18 : 1 }}
              transition={
                active
                  ? { type: 'spring', stiffness: 500, damping: 26 }
                  : { type: 'spring', stiffness: 300, damping: 26, delay: 0.9 + i * 0.1 }
              }
              onClick={() => toggle(shop)}
            >
              {/* Ground shadow ellipse */}
              <ellipse
                cx={sp.x} cy={tipY + 1.5}
                rx={r * 0.65} ry={r * 0.22}
                fill="#000" fillOpacity={0.14}
              />
              {/* Teardrop body */}
              <path
                d={pinPath(sp.x, tipY, r)}
                fill={color}
                style={{
                  filter: active
                    ? `drop-shadow(0 3px 12px ${color}99)`
                    : 'drop-shadow(0 2px 5px rgba(0,0,0,0.30))',
                }}
              />
              {/* Inner white dot */}
              <circle cx={sp.x} cy={tipY - 2 * r} r={r * 0.36} fill="white" />

              {/* City label below pin — shop name when active */}
              <text
                x={sp.x} y={tipY + 13}
                textAnchor="middle"
                fill={active ? color : C.cityLbl}
                fontSize={active ? 8.5 : 7.5}
                fontWeight={active ? '800' : '600'}
                fontFamily="Inter, -apple-system, sans-serif"
                style={{
                  paintOrder: 'stroke',
                  stroke: 'white',
                  strokeWidth: active ? 3 : 2.5,
                  strokeLinejoin: 'round',
                }}
              >
                {active ? shop.name : shop.city}
              </text>
            </motion.g>
          );
        })}
      </motion.svg>

      {/* ══════════════════════════════════════════════════════
          OVERLAY UI
      ══════════════════════════════════════════════════════ */}

      {/* Location chip — top-left */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.38 }}
        className="absolute top-3 left-3 flex items-center gap-2 rounded-full px-3 py-1.5"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
        }}
      >
        {/* Animated blue dot */}
        <motion.div
          className="w-2.5 h-2.5 rounded-full bg-[#007AFF] flex-shrink-0"
          animate={{ scale: [1, 1.45, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span className="text-[12px] font-semibold" style={{ color: C.cityLbl }}>
          Berlin, Deutschland
        </span>
      </motion.div>

      {/* Legend — top-right */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.62, duration: 0.38 }}
        className="absolute top-3 right-3 rounded-2xl px-3 py-2.5 space-y-1.5"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.14)',
        }}
      >
        {Object.entries(TYPE_CFG).map(([type, cfg]) => (
          <div key={type} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
              style={{ backgroundColor: cfg.color }} />
            <span className="text-[10px] font-semibold" style={{ color: C.sub }}>
              {cfg.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Count pill — bottom-right */}
      <AnimatePresence>
        {!selected && (
          <motion.div
            key="count"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 1.3 } }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="absolute bottom-4 right-3 rounded-full px-3.5 py-1.5"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
            }}
          >
            <span className="text-[11px] font-bold" style={{ color: C.sub }}>
              {shops.length} locations
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Selected shop bottom sheet ─────────────────────── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 42 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl"
            style={{ boxShadow: '0 -6px 28px rgba(0,0,0,0.14)' }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
            </div>

            <div className="px-5 pt-3 pb-2">
              {/* Header row */}
              <div className="flex items-start gap-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: `${TYPE_CFG[selected.type]?.color}1A` }}
                >
                  <MapPin size={20} style={{ color: TYPE_CFG[selected.type]?.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: TYPE_CFG[selected.type]?.color }}
                  >
                    {TYPE_CFG[selected.type]?.label}
                  </span>
                  <h3
                    className="text-[17px] font-bold mt-0.5 leading-snug truncate"
                    style={{ color: C.cityLbl }}
                  >
                    {selected.name}
                  </h3>
                  <p className="text-[13px] mt-0.5 truncate" style={{ color: C.sub }}>
                    {selected.address}
                  </p>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 active:opacity-60 transition-opacity bg-[#F2F2F7]"
                >
                  <X size={14} style={{ color: C.sub }} />
                </button>
              </div>

              {/* Meta pills */}
              <div className="flex items-center gap-2.5 mt-3 mb-4 flex-wrap">
                {selected.distance && (
                  <div className="flex items-center gap-1.5 bg-[#F2F2F7] rounded-full px-3 py-1">
                    <Navigation size={11} style={{ color: '#00AEEF' }} />
                    <span className="text-[12px] font-semibold" style={{ color: C.cityLbl }}>
                      {selected.distance}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 bg-[#F2F2F7] rounded-full px-3 py-1">
                  <Clock size={11} style={{ color: '#00AEEF' }} />
                  <span className="text-[12px] font-semibold" style={{ color: C.cityLbl }}>
                    {selected.hours.split(' ').slice(0, 3).join(' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ backgroundColor: `${TYPE_CFG[selected.type]?.color}1A` }}>
                  <div className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: TYPE_CFG[selected.type]?.color }} />
                  <span className="text-[12px] font-semibold"
                    style={{ color: TYPE_CFG[selected.type]?.color }}>
                    {selected.city}
                  </span>
                </div>
              </div>

              {/* CTA row */}
              <div className="flex gap-3 pb-5">
                <motion.a
                  href={`https://maps.google.com/?q=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 text-white text-[14px] font-bold py-3.5 rounded-2xl"
                  style={{ backgroundColor: '#00AEEF' }}
                >
                  <Navigation size={15} />
                  Directions
                </motion.a>
                <motion.a
                  href={`tel:${selected.phone}`}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 text-[14px] font-semibold py-3.5 rounded-2xl bg-[#F2F2F7]"
                  style={{ color: C.cityLbl }}
                >
                  <Phone size={15} style={{ color: '#00AEEF' }} />
                  Call
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}