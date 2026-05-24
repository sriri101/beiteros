import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film, Image as ImageIcon, FileText, Share2, Layout,
  Download, Eye, Play, X, Search, Megaphone, Check, Sparkles,
} from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';

const FF = "'Inter', sans-serif";
type AssetKind   = 'video' | 'photo' | 'print' | 'social' | 'template';
type AssetFilter = 'all' | AssetKind;

const KIND_CFG = {
  video:    { label: 'Video',    Icon: Film,      color: '#6366F1', bg: '#EEF2FF', bgDark: '#1A1A3A' },
  photo:    { label: 'Photo',    Icon: ImageIcon, color: '#FF9500', bg: '#FFF3E0', bgDark: '#3A2800' },
  print:    { label: 'Print',    Icon: FileText,  color: '#34C759', bg: '#E8F8EE', bgDark: '#0D2A1A' },
  social:   { label: 'Social',  Icon: Share2,    color: '#E31E24', bg: '#FFF0F0', bgDark: '#3A1010' },
  template: { label: 'Template', Icon: Layout,    color: '#FF9500', bg: '#FFF3E0', bgDark: '#3A2800' },
};

const ASSETS = [
  { id:'v1', kind:'video'   as AssetKind, title:'BRH70-20V – Cinematic Reveal',      format:'MP4 · 4K', meta:'2:35', langs:['DE','EN'],           isNew:true,  thumb:'https://images.unsplash.com/photo-1700225195169-37c331839340?w=400' },
  { id:'v2', kind:'video'   as AssetKind, title:'BEITER Brand Film 2025',             format:'MP4 · 4K', meta:'3:45', langs:['EN','DE','FR'],       isNew:false, thumb:'https://images.unsplash.com/photo-1612006767176-225f7f9af5d2?w=400' },
  { id:'v3', kind:'video'   as AssetKind, title:'TIGE-3DG Laser Level Demo',          format:'MP4 · 4K', meta:'2:10', langs:['EN','DE','FR','AR'],  isNew:true,  thumb:'https://images.unsplash.com/photo-1526593740665-f57a5d42dd0a?w=400' },
  { id:'v4', kind:'video'   as AssetKind, title:'AG180 Angle Grinder – In Action',   format:'MP4 · 4K', meta:'1:55', langs:['EN'],                 isNew:false, thumb:'https://images.unsplash.com/photo-1771591212071-ed8ad141b7e7?w=400' },
  { id:'p1', kind:'photo'   as AssetKind, title:'BRH70-20V Studio Hero Shot',         format:'TIFF + JPG', meta:'48 MP', langs:[],                 isNew:true,  thumb:'https://images.unsplash.com/photo-1700225195169-37c331839340?w=400' },
  { id:'p2', kind:'photo'   as AssetKind, title:'Full Product Line – Flat Lay',       format:'TIFF · 8 files', meta:'36 MP', langs:[],             isNew:false, thumb:'https://images.unsplash.com/photo-1683115097173-f24516d000c6?w=400' },
  { id:'p3', kind:'photo'   as AssetKind, title:'Workshop Lifestyle Series',          format:'JPG · 12 files', meta:'24 MP', langs:[],             isNew:false, thumb:'https://images.unsplash.com/photo-1612006767176-225f7f9af5d2?w=400' },
  { id:'r1', kind:'print'   as AssetKind, title:'Dealer Catalog Q1 2025',             format:'PDF', meta:'24 pages', langs:['DE','EN','FR'],       isNew:false, thumb:'https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?w=400' },
  { id:'r2', kind:'print'   as AssetKind, title:'Brand Guidelines v3.0',              format:'PDF', meta:'80 pages', langs:['EN'],                 isNew:true,  thumb:'https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?w=400' },
  { id:'s1', kind:'social'  as AssetKind, title:'Instagram Post Pack',                format:'PSD · Figma', meta:'12 templates', langs:['DE','EN','FR','AR'], isNew:true, thumb:'https://images.unsplash.com/photo-1758874384113-4059f76860c5?w=400' },
  { id:'s2', kind:'social'  as AssetKind, title:'Stories & WhatsApp Pack',            format:'PSD · AE', meta:'8 templates', langs:['EN','AR'],    isNew:true,  thumb:'https://images.unsplash.com/photo-1758874384113-4059f76860c5?w=400' },
  { id:'t1', kind:'template'as AssetKind, title:'Dealer Presentation Deck 2025',      format:'PPTX · Keynote', meta:'36 slides', langs:['DE','EN'], isNew:false, thumb:'https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?w=400' },
  { id:'t3', kind:'template'as AssetKind, title:'Wholesale Price List Template',      format:'XLSX', meta:'Auto-formula', langs:['EN','DE'],        isNew:true,  thumb:'https://images.unsplash.com/photo-1614036634955-ae5e90f9b9eb?w=400' },
];

const LANG_COLOR: Record<string, string> = { DE:'#2563EB', EN:'#059669', FR:'#7C3AED', AR:'#D97706' };

export default function MediaHub() {
  const { darkMode } = useDistributorStore();
  const dm = darkMode;

  const [filter,  setFilter]  = useState<AssetFilter>('all');
  const [query,   setQuery]   = useState('');
  const [preview, setPreview] = useState<typeof ASSETS[0] | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const BG     = dm ? '#0d0d0f' : '#f2f2f7';

  const filtered = useMemo(() => {
    let list = ASSETS;
    if (filter !== 'all') list = list.filter(a => a.kind === filter);
    if (query.trim()) { const q = query.toLowerCase(); list = list.filter(a => a.title.toLowerCase().includes(q)); }
    return list;
  }, [filter, query]);

  const TABS: { key: AssetFilter; Icon: React.ElementType; label: string }[] = [
    { key: 'all',      Icon: Megaphone, label: 'All'       },
    { key: 'video',    Icon: Film,      label: 'Video'     },
    { key: 'photo',    Icon: ImageIcon, label: 'Photos'    },
    { key: 'print',    Icon: FileText,  label: 'Print'     },
    { key: 'social',   Icon: Share2,    label: 'Social'    },
    { key: 'template', Icon: Layout,    label: 'Templates' },
  ];

  return (
    <div style={{ background: BG, minHeight: '100svh', fontFamily: FF, paddingBottom: 80 }}>

      {/* Header */}
      <div style={{ background: dm ? '#111' : '#fff', padding: '16px 16px 0', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: '#E31E24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Megaphone size={14} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 16, fontWeight: 900, color: TEXT, margin: 0, letterSpacing: '-0.02em' }}>Marketing Hub</p>
            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Factory-direct branded assets</p>
          </div>
          <span style={{ marginLeft: 'auto', padding: '3px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: '#E31E24', color: '#fff' }}>{ASSETS.filter(a => a.isNew).length} NEW</span>
        </div>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: 10, padding: '8px 12px', marginBottom: 12 }}>
          <Search size={13} style={{ color: MUTED }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search assets…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: TEXT, flex: 1, fontFamily: FF }} />
        </div>

        {/* Filter scroll tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12 }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} style={{ flexShrink: 0, height: 32, padding: '0 14px', borderRadius: 99, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FF, background: filter === key ? '#E31E24' : (dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'), color: filter === key ? '#fff' : TEXT }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* New assets strip */}
      {filter === 'all' && !query && (
        <div style={{ padding: '16px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Sparkles size={12} style={{ color: '#FFD60A' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: TEXT }}>New This Week</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {ASSETS.filter(a => a.isNew).map((asset) => {
              const cfg = KIND_CFG[asset.kind];
              return (
                <button key={asset.id} onClick={() => setPreview(asset)} style={{ flexShrink: 0, width: 140, borderRadius: 14, overflow: 'hidden', border: `1px solid ${BORDER}`, background: CARD, textAlign: 'left', cursor: 'pointer', fontFamily: FF, padding: 0 }}>
                  <div style={{ position: 'relative', height: 80 }}>
                    <img src={asset.thumb} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }} />
                    <span style={{ position: 'absolute', top: 6, right: 6, fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 99, background: '#E31E24', color: '#fff' }}>NEW</span>
                    {asset.kind === 'video' && (
                      <div style={{ position: 'absolute', bottom: 6, left: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Play size={8} color="#fff" fill="#fff" />
                        <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>{asset.meta}</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '8px 8px 9px' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: cfg.color, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cfg.label}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: TEXT, margin: 0, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{asset.title}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Asset list */}
      <div style={{ padding: '16px 16px 0' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: MUTED }}>
            <Search size={28} style={{ opacity: 0.4, marginBottom: 10 }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 4px' }}>No assets found</p>
          </div>
        ) : filtered.map((asset) => {
          const cfg = KIND_CFG[asset.kind];
          return (
            <motion.div key={asset.id} whileTap={{ scale: 0.98 }}
              onClick={() => setPreview(asset)}
              style={{ background: CARD, borderRadius: 14, marginBottom: 10, border: `1px solid ${BORDER}`, display: 'flex', overflow: 'hidden', cursor: 'pointer' }}>
              {/* Thumb */}
              <div style={{ width: 80, flexShrink: 0, position: 'relative' }}>
                <img src={asset.thumb} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {asset.kind === 'video' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
                    <Play size={16} color="#fff" fill="#fff" />
                  </div>
                )}
                {asset.isNew && (
                  <span style={{ position: 'absolute', top: 4, left: 4, fontSize: 7, fontWeight: 700, padding: '2px 4px', borderRadius: 4, background: '#E31E24', color: '#fff' }}>NEW</span>
                )}
              </div>
              {/* Content */}
              <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', borderRadius: 99, background: dm ? cfg.bgDark : cfg.bg }}>
                      <cfg.Icon size={9} style={{ color: cfg.color }} />
                      <span style={{ fontSize: 9, fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: '0 0 2px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{asset.title}</p>
                  <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{asset.format} · {asset.meta}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {asset.langs.slice(0, 3).map(l => (
                      <span key={l} style={{ padding: '1px 5px', borderRadius: 4, fontSize: 8, fontWeight: 800, background: `${LANG_COLOR[l] ?? '#888'}22`, color: LANG_COLOR[l] ?? MUTED }}>{l}</span>
                    ))}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setDownloaded(asset.id); setTimeout(() => setDownloaded(null), 2000); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 8, background: downloaded === asset.id ? '#34C75922' : '#E31E2415', border: 'none', cursor: 'pointer', color: downloaded === asset.id ? '#34C759' : '#E31E24', fontSize: 11, fontWeight: 700, fontFamily: FF }}>
                    {downloaded === asset.id ? <><Check size={10} /> Done</> : <><Download size={10} /> Get</>}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview sheet */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreview(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 100, backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 280 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: CARD, borderRadius: '20px 20px 0 0', zIndex: 101, maxHeight: '85svh', overflowY: 'auto', fontFamily: FF }}>
              {/* Thumb */}
              <div style={{ position: 'relative', height: 200 }}>
                <img src={preview.thumb} alt={preview.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent 50%)' }} />
                {preview.kind === 'video' && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                      <Play size={20} color="#fff" fill="#fff" style={{ marginLeft: 2 }} />
                    </div>
                  </div>
                )}
                <button onClick={() => setPreview(null)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={13} color="#fff" />
                </button>
                <div style={{ position: 'absolute', bottom: 14, left: 16 }}>
                  <p style={{ fontSize: 16, fontWeight: 900, color: '#fff', margin: 0 }}>{preview.title}</p>
                </div>
              </div>
              <div style={{ padding: '16px 18px 32px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {[{ l: 'Format', v: preview.format }, { l: 'Spec', v: preview.meta }].map(r => (
                    <div key={r.l} style={{ flex: 1, background: dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', borderRadius: 10, padding: '10px 12px' }}>
                      <p style={{ fontSize: 9, color: MUTED, fontWeight: 700, textTransform: 'uppercase', margin: '0 0 3px' }}>{r.l}</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: TEXT, margin: 0 }}>{r.v}</p>
                    </div>
                  ))}
                </div>
                {preview.langs.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                    {preview.langs.map(l => (
                      <span key={l} style={{ padding: '3px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: `${LANG_COLOR[l] ?? '#888'}22`, color: LANG_COLOR[l] ?? MUTED }}>{l}</span>
                    ))}
                  </div>
                )}
                <button onClick={() => { setDownloaded(preview.id); setPreview(null); setTimeout(() => setDownloaded(null), 2000); }}
                  style={{ width: '100%', height: 50, borderRadius: 13, border: 'none', background: 'linear-gradient(135deg, #C8161C, #E31E24)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Download size={16} /> Download
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
