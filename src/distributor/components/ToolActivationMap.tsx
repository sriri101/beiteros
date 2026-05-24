import { useEffect, useRef, useMemo, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useDistributorStore } from '../store/useDistributorStore';
import { MapPin, AlertTriangle, Users, Target, Wrench } from 'lucide-react';

const FF = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

/* ─── City coordinates ───────────────────────────────────────────────────── */
const CITY_COORDS: Record<string, [number, number]> = {
  'Berlin':              [52.52,   13.405],
  'Potsdam':             [52.3906, 13.0645],
  'Brandenburg a.d.H.': [52.4126, 12.537],
};

interface CityStats {
  city:            string;
  coords:          [number, number];
  customers:       number;
  total_tools:     number;
  active_warranty: number;
  expiring:        number;
  expired:         number;
  pending_claims:  number;
  total_claims:    number;
  customer_names:  string[];
  focus_score:     number;
}

function urgencyColor(s: CityStats) {
  if (s.pending_claims > 0) return { fill: '#E31E24', stroke: '#C0392B' };
  if (s.expiring > 0)       return { fill: '#FF9500', stroke: '#D4800A' };
  return                           { fill: '#34C759', stroke: '#2AA14A' };
}
function urgencyLabel(s: CityStats): string {
  if (s.pending_claims > 0) return 'Needs attention';
  if (s.expiring > 0)       return 'Warranty expiring soon';
  return 'All clear';
}

/* ─── Tile URLs — CARTO Basemaps (free, no API key required) ──────────── */
const TILE_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_DARK  = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR  = '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> © <a href="https://carto.com/attributions" target="_blank">CARTO</a>';

/* ─── Popup HTML builder ─────────────────────────────────────────────────── */
function popupHTML(s: CityStats, dm: boolean): string {
  const bg    = dm ? '#1c1c1e' : '#ffffff';
  const text  = dm ? '#f2f2f7' : '#1d1d1f';
  const muted = '#8E8E93';
  const card  = dm ? 'rgba(255,255,255,0.08)' : '#f4f4f6';
  const { fill } = urgencyColor(s);
  const warPct = s.total_tools > 0 ? Math.round((s.active_warranty / s.total_tools) * 100) : 0;

  const cells = [
    { label: 'Customers', val: s.customers,      hi: false },
    { label: 'Tools',     val: s.total_tools,    hi: false },
    { label: 'Active',    val: s.active_warranty, hi: false },
    { label: 'Pending',   val: s.pending_claims,  hi: s.pending_claims > 0 },
  ];

  return `
    <div style="font-family:${FF};min-width:210px;background:${bg};border-radius:12px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <div style="width:8px;height:8px;border-radius:50%;background:${fill};flex-shrink:0"></div>
        <strong style="font-size:14px;font-weight:900;color:${text}">${s.city}</strong>
      </div>
      <p style="font-size:10px;color:${fill};font-weight:700;text-transform:uppercase;letter-spacing:.08em;margin:0 0 10px">${urgencyLabel(s)}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px">
        ${cells.map(c => `
          <div style="background:${card};border-radius:8px;padding:7px 10px">
            <div style="font-size:9px;color:${muted};font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px">${c.label}</div>
            <div style="font-size:16px;font-weight:900;color:${c.hi ? '#E31E24' : text}">${c.val}</div>
          </div>`).join('')}
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px">
          <span style="font-size:10px;color:${muted};font-weight:600">Warranty health</span>
          <span style="font-size:10px;font-weight:700;color:${text}">${warPct}%</span>
        </div>
        <div style="height:4px;background:${dm ? 'rgba(255,255,255,0.12)' : '#E5E5EA'};border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${warPct}%;background:#34C759;border-radius:99px"></div>
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export function ToolActivationMap({ dm }: { dm: boolean }) {
  const { customers } = useDistributorStore();

  /* ── Responsive: track window width ── */
  const [winWidth, setWinWidth] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1400);
  useEffect(() => {
    const onResize = () => setWinWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isCompact = winWidth < 1340;

  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const CARD2  = dm ? '#242424' : '#f8f8fa';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const SHADOW = dm ? '0 1px 8px rgba(0,0,0,0.4)' : '0 1px 8px rgba(0,0,0,0.07)';

  /* ── Aggregate customers → cities ── */
  const cityStats = useMemo<CityStats[]>(() => {
    const acc: Record<string, CityStats> = {};
    customers.forEach(c => {
      if (!acc[c.city]) {
        acc[c.city] = {
          city: c.city, coords: CITY_COORDS[c.city] ?? [52.52, 13.405],
          customers: 0, total_tools: 0, active_warranty: 0,
          expiring: 0, expired: 0, pending_claims: 0,
          total_claims: 0, customer_names: [], focus_score: 0,
        };
      }
      const s = acc[c.city];
      s.customers       += 1;
      s.total_tools     += c.tools_count;
      s.active_warranty += c.warranty_active;
      s.pending_claims  += c.pending_claims;
      s.total_claims    += c.claims_count;
      s.customer_names.push(c.name);
      c.tools.forEach(t => {
        if (t.status === 'expiring') s.expiring += 1;
        if (t.status === 'expired')  s.expired  += 1;
      });
    });
    Object.values(acc).forEach(s => {
      s.focus_score = s.pending_claims * 4 + s.expiring * 2 + s.total_tools * 0.5;
    });
    return Object.values(acc).sort((a, b) => b.focus_score - a.focus_score);
  }, [customers]);

  const maxTools     = useMemo(() => Math.max(...cityStats.map(c => c.total_tools), 1), [cityStats]);
  const totalTools   = customers.reduce((a, c) => a + c.tools_count, 0);
  const totalPending = customers.reduce((a, c) => a + c.pending_claims, 0);

  /* ── Vanilla Leaflet refs ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const tileRef      = useRef<L.TileLayer | null>(null);
  const markersRef   = useRef<L.CircleMarker[]>([]);
  const dmRef        = useRef(dm);

  /* ── Initialise map once ── */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center:             [52.46, 12.98],
      zoom:               8,
      zoomControl:        true,
      attributionControl: false,
    });

    L.control.attribution({ prefix: false }).addTo(map);

    const tile = L.tileLayer(dm ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      maxZoom: 18,
    }).addTo(map);

    tileRef.current = tile;
    mapRef.current  = map;

    return () => {
      map.remove();
      mapRef.current  = null;
      tileRef.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Swap tile layer when dark mode changes ── */
  useEffect(() => {
    dmRef.current = dm;
    const map  = mapRef.current;
    const tile = tileRef.current;
    if (!map || !tile) return;

    map.removeLayer(tile);
    const newTile = L.tileLayer(dm ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      maxZoom: 18,
    }).addTo(map);
    tileRef.current = newTile;

    // Rebuild markers with updated popup colours
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    cityStats.forEach(s => addMarker(map, s, maxTools));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dm]);

  /* ── Add/update city markers ── */
  function addMarker(map: L.Map, s: CityStats, mxTools: number) {
    const { fill, stroke } = urgencyColor(s);
    const radius = 14 + Math.round((s.total_tools / mxTools) * 22);

    const marker = L.circleMarker(s.coords, {
      radius,
      fillColor:   fill,
      fillOpacity: 0.88,
      color:       stroke,
      weight:      2.5,
    });

    marker.bindPopup(
      popupHTML(s, dmRef.current),
      {
        className:   'beiter-lf-popup',
        offset:      L.point(0, -(radius + 6)),
        maxWidth:    260,
        closeButton: false,
      }
    );

    marker.addTo(map);
    markersRef.current.push(marker);
  }

  /* ── Sync markers whenever city data changes ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    cityStats.forEach(s => addMarker(map, s, maxTools));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityStats, maxTools]);

  /* ── Invalidate map size when layout changes (compact ↔ wide) ── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Small delay to let CSS layout settle before recalculating
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [isCompact]);

  const RANK_BG  = [dm ? '#3A1010' : '#FFF0F0', dm ? '#3A2800' : '#FFF3E0', dm ? '#0D2A1A' : '#E8F8EE'];
  const RANK_DOT = ['#E31E24', '#FF9500', '#34C759'];

  return (
    <div style={{
      background: CARD, borderRadius: 20, boxShadow: SHADOW,
      border: `1px solid ${BORDER}`, fontFamily: FF,
      /* Contain Leaflet's stacking context so it never bleeds above Adam */
      position: 'relative', isolation: 'isolate', zIndex: 0,
    }}>

      {/* ── Header ── */}
      <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: dm ? '#3A1010' : '#FFF0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} style={{ color: '#E31E24' }} />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Territory Activation Map</p>
            <p style={{ fontSize: 12, color: MUTED, margin: '2px 0 0', fontWeight: 500 }}>
              Berlin & Brandenburg · {customers.length} customers · {totalTools} tools registered
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {[
            { color: '#E31E24', label: 'Needs attention' },
            { color: '#FF9500', label: 'Expiring soon'   },
            { color: '#34C759', label: 'All clear'       },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'flex', flexDirection: isCompact ? 'column' : 'row', height: isCompact ? 'auto' : 440, overflow: 'hidden', borderRadius: '0 0 20px 20px' }}>

        {/* Map canvas */}
        <div style={{ flex: isCompact ? 'none' : 1, height: isCompact ? 360 : '100%', minWidth: 0, position: 'relative' }}>
          <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

          {/* BEITER live badge */}
          <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 500, background: 'rgba(227,30,36,0.92)', borderRadius: 8, padding: '3px 10px', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)', pointerEvents: 'none' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'btr-pulse 2s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>LIVE · BeiterOS</span>
          </div>
        </div>

        {/* ── Priority Sidebar ── */}
        <div style={{ width: isCompact ? '100%' : 300, flexShrink: 0, borderLeft: isCompact ? 'none' : `1px solid ${BORDER}`, borderTop: isCompact ? `1px solid ${BORDER}` : 'none', background: CARD2, display: 'flex', flexDirection: 'column', maxHeight: isCompact ? 320 : undefined }}>
          <div style={{ padding: '14px 18px 10px', borderBottom: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={13} style={{ color: '#E31E24' }} />
              <p style={{ fontSize: 12, fontWeight: 700, color: TEXT, margin: 0 }}>Focus Priority</p>
            </div>
            <p style={{ fontSize: 11, color: MUTED, margin: '3px 0 0' }}>Ranked by pending claims & density</p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0 }}>
            {cityStats.map((s, i) => {
              const { fill } = urgencyColor(s);
              const rankBg  = RANK_BG[i]  ?? (dm ? '#1A1A3A' : '#EEF2FF');
              const rankDot = RANK_DOT[i] ?? '#6366F1';
              const warPct  = s.total_tools > 0 ? (s.active_warranty / s.total_tools) * 100 : 0;

              return (
                <div key={s.city} style={{ background: rankBg, borderRadius: 14, padding: 14, border: `1px solid ${i === 0 ? fill + '44' : BORDER}`, position: 'relative', flexShrink: 0 }}>
                  <div style={{ position: 'absolute', top: 12, right: 12, width: 22, height: 22, borderRadius: '50%', background: rankDot, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#fff' }}>{i + 1}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: fill, marginTop: 4, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 900, color: TEXT, margin: 0 }}>{s.city}</p>
                      <p style={{ fontSize: 10, color: fill, fontWeight: 700, margin: '1px 0 0' }}>{urgencyLabel(s)}</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 10 }}>
                    {[
                      { label: 'Customers', val: s.customers,      Icon: Users,         hi: false },
                      { label: 'Tools',     val: s.total_tools,    Icon: Wrench,        hi: false },
                      { label: 'Pending',   val: s.pending_claims, Icon: AlertTriangle, hi: s.pending_claims > 0 },
                    ].map(({ label, val, Icon, hi }) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <Icon size={11} style={{ color: hi ? '#E31E24' : MUTED }} />
                        <p style={{ fontSize: 16, fontWeight: 900, color: hi ? '#E31E24' : TEXT, margin: '2px 0 0' }}>{val}</p>
                        <p style={{ fontSize: 9, color: MUTED, margin: '1px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>Active warranties</span>
                      <span style={{ fontSize: 10, color: TEXT, fontWeight: 700 }}>{s.active_warranty}/{s.total_tools}</span>
                    </div>
                    <div style={{ height: 5, background: dm ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${warPct}%`, background: '#34C759', borderRadius: 99, transition: 'width 1s ease' }} />
                    </div>
                  </div>

                  {(s.expiring > 0 || s.expired > 0) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                      {s.expiring > 0 && <span style={{ fontSize: 10, color: '#FF9500', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}><AlertTriangle size={9} />{s.expiring} expiring</span>}
                      {s.expired  > 0 && <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>{s.expired} expired</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '12px 18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: 'Territory',   val: 'Berlin & BB',               color: TEXT },
                { label: 'Coverage',    val: `${cityStats.length} cities`, color: TEXT },
                { label: 'Total Tools', val: totalTools,                   color: TEXT },
                { label: 'Pending',     val: totalPending,                 color: totalPending > 0 ? '#E31E24' : '#34C759' },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>{s.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 900, color: s.color, margin: '2px 0 0' }}>{s.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet & popup CSS overrides */}
      <style>{`
        .leaflet-container { font-family: ${FF}; }
        .beiter-lf-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
          padding: 14px 16px !important;
          border: 1px solid rgba(0,0,0,0.07);
        }
        .beiter-lf-popup .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4;
        }
        .beiter-lf-popup .leaflet-popup-tip-container { display: none !important; }
        .leaflet-control-zoom a {
          border-radius: 8px !important;
          font-family: ${FF} !important;
        }
        .leaflet-control-attribution {
          font-size: 9px !important;
          background: rgba(255,255,255,0.7) !important;
          backdrop-filter: blur(4px);
        }
        @keyframes btr-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}