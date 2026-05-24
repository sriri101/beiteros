import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Play, Download, Eye, X, Search, Film, Image as ImageIcon,
  FileText, Share2, Layout, Megaphone, Globe, Star, Clock,
  ChevronRight, Check, Filter, Sparkles, ExternalLink,
} from 'lucide-react';
import { useDistributorStore } from '../store/useDistributorStore';
import BeiterLogo from '../../imports/Layer1-14078-2703';

const FF = "'Inter', sans-serif";

/* ── Asset types ── */
type AssetKind = 'video' | 'photo' | 'print' | 'social' | 'template';
type AssetFilter = 'all' | AssetKind;

interface MediaAsset {
  id: string;
  kind: AssetKind;
  title: string;
  subtitle: string;
  thumb: string;
  format: string;
  size: string;
  meta: string;          // duration / resolution / pages / templates
  langs: string[];
  isNew: boolean;
  featured?: boolean;
  uploadedDays: number;  // days ago
  tags: string[];
}

/* ── Mock asset library ── */
const ASSETS: MediaAsset[] = [
  /* ── Videos ── */
  {
    id: 'v1', kind: 'video',
    title: 'BRH70-20V – Cinematic Product Reveal',
    subtitle: 'Studio 4K reveal film with slow-motion detail shots and sound design',
    thumb: 'https://images.unsplash.com/photo-1756477436005-8ac1d0ecb78b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'MP4 · 4K', size: '4,2 GB', meta: '2:35', langs: ['DE', 'EN'], isNew: true, featured: true, uploadedDays: 3,
    tags: ['Rotary Hammer', 'BRH70-20V', 'Product'],
  },
  {
    id: 'v2', kind: 'video',
    title: 'BEITER Brand Film 2025',
    subtitle: 'Full brand story — factory, people, innovation and craftsmanship',
    thumb: 'https://images.unsplash.com/photo-1643512290109-3ad082e25b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'MP4 · 4K', size: '6,8 GB', meta: '3:45', langs: ['EN', 'DE', 'FR'], isNew: false, uploadedDays: 21,
    tags: ['Brand', 'Corporate'],
  },
  {
    id: 'v3', kind: 'video',
    title: 'TIGE-3DG Laser Level – Precision Demo',
    subtitle: 'On-site demonstration reel for flooring, tiling and levelling applications',
    thumb: 'https://images.unsplash.com/photo-1700257908452-582cb156b037?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'MP4 · 4K', size: '3,1 GB', meta: '2:10', langs: ['EN', 'DE', 'FR', 'AR'], isNew: true, uploadedDays: 5,
    tags: ['Laser Level', 'TIGE-3DG'],
  },
  {
    id: 'v4', kind: 'video',
    title: 'AG180 Angle Grinder – In Action',
    subtitle: 'High-energy industrial reel showing cutting, grinding and finishing work',
    thumb: 'https://images.unsplash.com/photo-1771591212071-ed8ad141b7e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'MP4 · 4K', size: '2,9 GB', meta: '1:55', langs: ['EN'], isNew: false, uploadedDays: 45,
    tags: ['Angle Grinder', 'AG180'],
  },
  {
    id: 'v5', kind: 'video',
    title: 'How-To: Rotary Hammer in Masonry',
    subtitle: 'Step-by-step tutorial for distributors to share with professional end-users',
    thumb: 'https://images.unsplash.com/photo-1766499431068-7686d755cec7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'MP4 · HD', size: '1,4 GB', meta: '5:20', langs: ['DE', 'EN'], isNew: false, uploadedDays: 60,
    tags: ['Tutorial', 'Rotary Hammer'],
  },

  /* ── Photography ── */
  {
    id: 'p1', kind: 'photo',
    title: 'BRH70-20V Studio Hero Shot',
    subtitle: '48MP studio photography — black seamless background, 3-light setup',
    thumb: 'https://images.unsplash.com/photo-1741968617681-e6dc171b9e81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'TIFF + JPG', size: '280 MB', meta: '48 MP · 8000×6000', langs: ['—'], isNew: true, uploadedDays: 3,
    tags: ['BRH70-20V', 'Hero', 'Studio'],
  },
  {
    id: 'p2', kind: 'photo',
    title: 'Full Product Line – Flat Lay Series',
    subtitle: '8 overhead flat-lay compositions covering the complete 2025 range',
    thumb: 'https://images.unsplash.com/photo-1759200165738-6366977a73c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'TIFF · 8 files', size: '1,1 GB', meta: '36 MP · 7000×5000', langs: ['—'], isNew: false, uploadedDays: 14,
    tags: ['All Products', 'Catalog'],
  },
  {
    id: 'p3', kind: 'photo',
    title: 'Workshop Lifestyle Series',
    subtitle: '12 high-resolution lifestyle shots of professionals using BEITER tools on-site',
    thumb: 'https://images.unsplash.com/photo-1643512290109-3ad082e25b92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'JPG · 12 files', size: '380 MB', meta: '24 MP · 6000×4000', langs: ['—'], isNew: false, uploadedDays: 30,
    tags: ['Lifestyle', 'Workshop', 'Pro User'],
  },
  {
    id: 'p4', kind: 'photo',
    title: 'Point-of-Sale Display Photography',
    subtitle: 'Retail shelf and display stand photography for use in dealer promotions',
    thumb: 'https://images.unsplash.com/photo-1770657986086-c1f20eef30ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'JPG · 6 files', size: '160 MB', meta: '20 MP · 5472×3648', langs: ['—'], isNew: false, uploadedDays: 55,
    tags: ['Retail', 'POS'],
  },

  /* ── Print & PDF ── */
  {
    id: 'r1', kind: 'print',
    title: 'Dealer Product Catalog – Q1 2025',
    subtitle: 'Full product catalog with pricing, specs, and order codes — ready to print or share digitally',
    thumb: 'https://images.unsplash.com/photo-1636247499734-893da2bcfc1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PDF · Print-ready', size: '48 MB', meta: '24 pages · A4', langs: ['DE', 'EN', 'FR'], isNew: false, uploadedDays: 20,
    tags: ['Catalog', 'Pricing'],
  },
  {
    id: 'r2', kind: 'print',
    title: 'BEITER Brand Guidelines v3.0',
    subtitle: 'Typography, color system, logo usage rules and co-branding instructions',
    thumb: 'https://images.unsplash.com/photo-1636247499734-893da2bcfc1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PDF', size: '22 MB', meta: '80 pages', langs: ['EN'], isNew: true, uploadedDays: 7,
    tags: ['Brand', 'Guidelines'],
  },
  {
    id: 'r3', kind: 'print',
    title: 'Point-of-Sale Display Kit',
    subtitle: 'Print-ready artwork for shelf wobblers, header cards, and floor stands',
    thumb: 'https://images.unsplash.com/photo-1759200165738-6366977a73c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'AI · PDF', size: '85 MB', meta: '6 formats', langs: ['DE', 'EN'], isNew: false, uploadedDays: 40,
    tags: ['POS', 'Retail', 'Print'],
  },
  {
    id: 'r4', kind: 'print',
    title: 'Product Comparison Sheet – Power Tools',
    subtitle: 'Two-page side-by-side comparison across all SKUs — ideal for showroom counters',
    thumb: 'https://images.unsplash.com/photo-1636247499734-893da2bcfc1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PDF · A4', size: '3,2 MB', meta: '2 pages', langs: ['DE', 'EN', 'FR', 'AR'], isNew: false, uploadedDays: 28,
    tags: ['Comparison', 'Sales'],
  },

  /* ── Social Media ── */
  {
    id: 's1', kind: 'social',
    title: 'Instagram Post Pack – Product Launch',
    subtitle: '12 fully branded templates in square and portrait formats for product promotions',
    thumb: 'https://images.unsplash.com/photo-1759393851741-674ee71fb498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PSD · Figma', size: '340 MB', meta: '12 templates', langs: ['DE', 'EN', 'FR', 'AR'], isNew: true, uploadedDays: 4,
    tags: ['Instagram', 'Social', 'Templates'],
  },
  {
    id: 's2', kind: 'social',
    title: 'Instagram & WhatsApp Stories Pack',
    subtitle: '9:16 animated templates with editable text and product image zones',
    thumb: 'https://images.unsplash.com/photo-1759393851741-674ee71fb498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PSD · After Effects', size: '520 MB', meta: '8 templates', langs: ['EN', 'AR'], isNew: true, uploadedDays: 4,
    tags: ['Stories', 'Instagram', 'WhatsApp'],
  },
  {
    id: 's3', kind: 'social',
    title: 'LinkedIn Banner & Post Set',
    subtitle: 'Company page cover and post graphics for professional channel management',
    thumb: 'https://images.unsplash.com/photo-1771591212071-ed8ad141b7e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PNG · PSD', size: '65 MB', meta: '6 assets', langs: ['EN', 'DE'], isNew: false, uploadedDays: 18,
    tags: ['LinkedIn', 'B2B'],
  },

  /* ── Templates ── */
  {
    id: 't1', kind: 'template',
    title: 'Dealer Presentation Deck 2025',
    subtitle: 'Editable 36-slide PowerPoint with embedded brand assets and pitch structure',
    thumb: 'https://images.unsplash.com/photo-1636247499734-893da2bcfc1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'PPTX · Keynote', size: '95 MB', meta: '36 slides', langs: ['DE', 'EN', 'FR'], isNew: false, uploadedDays: 25,
    tags: ['Presentation', 'Sales'],
  },
  {
    id: 't2', kind: 'template',
    title: 'Email Newsletter Template',
    subtitle: 'Responsive HTML email template for dealer newsletters — drag & drop sections',
    thumb: 'https://images.unsplash.com/photo-1759393851741-674ee71fb498?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'HTML · Mailchimp', size: '8 MB', meta: '3 layouts', langs: ['EN', 'DE', 'FR', 'AR'], isNew: false, uploadedDays: 50,
    tags: ['Email', 'Newsletter'],
  },
  {
    id: 't3', kind: 'template',
    title: 'Wholesale Price List Template',
    subtitle: 'Excel template auto-formatted for distributor price quotations with margin calculator',
    thumb: 'https://images.unsplash.com/photo-1636247499734-893da2bcfc1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
    format: 'XLSX', size: '2,4 MB', meta: 'Auto-formula', langs: ['EN', 'DE'], isNew: true, uploadedDays: 6,
    tags: ['Pricing', 'Operations'],
  },
];

/* ── Kind config — BEITER accent palette only ── */
const KIND_CFG: Record<AssetKind, { label: string; Icon: React.ElementType; color: string; bgDark: string; bgLight: string }> = {
  video:    { label: 'Video',    Icon: Film,        color: '#E31E24', bgDark: '#3A1010', bgLight: '#FFF0F0' },
  photo:    { label: 'Photo',    Icon: ImageIcon,   color: '#FF6B00', bgDark: '#3A2000', bgLight: '#FFF3E0' },
  print:    { label: 'Print',    Icon: FileText,    color: '#C0392B', bgDark: '#2A0D0D', bgLight: '#FFEEEE' },
  social:   { label: 'Social',   Icon: Share2,      color: '#E31E24', bgDark: '#3A1010', bgLight: '#FFF0F0' },
  template: { label: 'Template', Icon: Layout,      color: '#FF6B00', bgDark: '#3A2000', bgLight: '#FFF3E0' },
};

const FILTER_TABS: { key: AssetFilter; label: string; Icon: React.ElementType }[] = [
  { key: 'all',      label: 'All Assets', Icon: Megaphone  },
  { key: 'video',    label: 'Videos',     Icon: Film        },
  { key: 'photo',    label: 'Photography',Icon: ImageIcon   },
  { key: 'print',    label: 'Print & PDF',Icon: FileText    },
  { key: 'social',   label: 'Social Media',Icon: Share2     },
  { key: 'template', label: 'Templates',  Icon: Layout      },
];

const LANG_COLOR: Record<string, string> = {
  DE: '#2563EB', EN: '#059669', FR: '#7C3AED', AR: '#D97706', '—': '#8E8E93',
};

/* ── Preview modal ── */
function AssetPreview({ asset, onClose, onDownload, dm }: { asset: MediaAsset; onClose: () => void; onDownload: () => void; dm: boolean }) {
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const cfg    = KIND_CFG[asset.kind];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, backdropFilter: 'blur(8px)', fontFamily: FF }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background: CARD, borderRadius: 24, overflow: 'hidden', width: '100%', maxWidth: 860, boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', height: 320, background: '#111', overflow: 'hidden' }}>
          <img src={asset.thumb} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18 }} />

          {/* Solid dark brand layer */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.80)' }} />

          {/* Bottom gradient for text */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%)' }} />

          {/* Centred BEITER logo — larger in the modal */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: 200, height: 54 }}>
              <BeiterLogo />
            </div>
          </div>

          {asset.kind === 'video' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                <Play size={24} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
              </div>
            </div>
          )}
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            <X size={15} color="#fff" />
          </button>
          {asset.isNew && (
            <span style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', borderRadius: 99, fontSize: 10, fontWeight: 700, background: '#E31E24', color: '#fff', letterSpacing: '0.06em' }}>NEW</span>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 11px', borderRadius: 99, background: dm ? cfg.bgDark : cfg.bgLight }}>
                <cfg.Icon size={11} style={{ color: cfg.color }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{cfg.label}</span>
              </div>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{asset.meta}</span>
            </div>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{asset.title}</p>
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, color: MUTED, margin: '0 0 16px', lineHeight: 1.5 }}>{asset.subtitle}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {asset.tags.map((t) => (
                <span key={t} style={{ padding: '4px 11px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', color: MUTED }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {asset.langs.filter(l => l !== '—').map((l) => (
                <span key={l} style={{ padding: '4px 10px', borderRadius: 7, fontSize: 11, fontWeight: 700, background: `${LANG_COLOR[l]}22`, color: LANG_COLOR[l] }}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{ width: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Format', val: asset.format },
              { label: 'File Size', val: asset.size },
              { label: 'Spec', val: asset.meta },
              { label: 'Added', val: asset.uploadedDays <= 7 ? `${asset.uploadedDays} days ago` : asset.uploadedDays <= 30 ? `${Math.floor(asset.uploadedDays / 7)} wks ago` : `${Math.floor(asset.uploadedDays / 30)} mo. ago` },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: MUTED, fontWeight: 600 }}>{row.label}</span>
                <span style={{ fontSize: 13, color: TEXT, fontWeight: 700 }}>{row.val}</span>
              </div>
            ))}
            <div style={{ height: 1, background: BORDER, margin: '4px 0' }} />
            <button
              onClick={onDownload}
              style={{ width: '100%', height: 42, borderRadius: 11, border: 'none', background: 'linear-gradient(135deg, #C8161C, #E31E24)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: FF, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
            >
              <Download size={14} /> Download
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Asset card ── */
function AssetCard({ asset, onPreview, dm }: { asset: MediaAsset; onPreview: () => void; dm: boolean }) {
  const [hovered,    setHovered]    = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const cfg    = KIND_CFG[asset.kind];

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ background: CARD, borderRadius: 18, overflow: 'hidden', cursor: 'pointer', border: `1px solid ${BORDER}`, boxShadow: hovered ? (dm ? '0 16px 40px rgba(0,0,0,0.5)' : '0 16px 40px rgba(0,0,0,0.12)') : (dm ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.05)'), transition: 'box-shadow 0.2s' }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 168, overflow: 'hidden', background: '#111' }}>
        <img src={asset.thumb} alt={asset.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />

        {/* Solid black brand overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.82)' }} />

        {/* Bottom gradient for text legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }} />

        {/* Centred BEITER logo */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <div style={{ width: 124, height: 34 }}>
            <BeiterLogo />
          </div>
        </div>

        {/* Top badges */}
        <div style={{ position: 'absolute', top: 10, left: 10, right: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 99, background: `${cfg.color}33`, backdropFilter: 'blur(6px)', border: `1px solid ${cfg.color}55` }}>
            <cfg.Icon size={9} style={{ color: cfg.color }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{cfg.label}</span>
          </div>
          {asset.isNew && (
            <span style={{ padding: '3px 8px', borderRadius: 99, fontSize: 9, fontWeight: 700, background: '#E31E24', color: '#fff', letterSpacing: '0.06em' }}>NEW</span>
          )}
        </div>

        {/* Video play indicator */}
        {asset.kind === 'video' && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Play size={10} color="#fff" fill="#fff" style={{ marginLeft: 1 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{asset.meta}</span>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, backdropFilter: 'blur(2px)', pointerEvents: hovered ? 'auto' : 'none' }}
        >
          <button onClick={(e) => { e.stopPropagation(); onPreview(); }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#1d1d1f', fontFamily: FF }}>
            <Eye size={12} /> Preview
          </button>
          <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: '#E31E24', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: '#fff', fontFamily: FF }}>
            {downloaded ? <><Check size={12} /> Saved!</> : <><Download size={12} /> Download</>}
          </button>
        </motion.div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: TEXT, margin: '0 0 5px', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{asset.title}</p>
        <p style={{ fontSize: 12, color: MUTED, margin: '0 0 10px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{asset.subtitle}</p>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: MUTED }}>{asset.format}</span>
            <span style={{ fontSize: 11, color: MUTED }}>·</span>
            <span style={{ fontSize: 12, color: MUTED }}>{asset.size}</span>
          </div>
          {/* Language pills */}
          <div style={{ display: 'flex', gap: 4 }}>
            {asset.langs.filter(l => l !== '—').slice(0, 3).map((l) => (
              <span key={l} style={{ padding: '2px 6px', borderRadius: 5, fontSize: 10, fontWeight: 800, background: `${LANG_COLOR[l]}22`, color: LANG_COLOR[l] }}>{l}</span>
            ))}
            {asset.langs.filter(l => l !== '—').length > 3 && (
              <span style={{ padding: '2px 6px', borderRadius: 5, fontSize: 10, fontWeight: 700, color: MUTED }}>+{asset.langs.filter(l => l !== '—').length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */
export default function WebMediaHub() {
  const { darkMode } = useDistributorStore();
  const dm = darkMode;

  const [filter,   setFilter]   = useState<AssetFilter>('all');
  const [query,    setQuery]    = useState('');
  const [preview,  setPreview]  = useState<MediaAsset | null>(null);
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const BG     = dm ? '#0d0d0f' : '#f0f0f5';
  const CARD   = dm ? '#1c1c1e' : '#ffffff';
  const BORDER = dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.08)';
  const TEXT   = dm ? '#f2f2f7' : '#1d1d1f';
  const MUTED  = dm ? '#636366' : '#8E8E93';
  const SHADOW = dm ? '0 2px 12px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.07)';

  const filtered = useMemo(() => {
    let list = ASSETS;
    if (filter !== 'all') list = list.filter(a => a.kind === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  }, [filter, query]);

  const newCount   = ASSETS.filter(a => a.isNew).length;
  const videoCount = ASSETS.filter(a => a.kind === 'video').length;
  const photoCount = ASSETS.filter(a => a.kind === 'photo').length;
  const featured   = ASSETS.find(a => a.featured);

  const handleDownload = (asset: MediaAsset) => {
    setDownloaded(asset.id);
    setTimeout(() => setDownloaded(null), 2500);
  };

  return (
    <div style={{ background: BG, minHeight: '100%', padding: 32, fontFamily: FF }}>

      {/* ── Hero banner ── */}
      <div style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 26, position: 'relative', background: '#111', height: 210 }}>
        {featured && (
          <img src={featured.thumb} alt="hero" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.35 }} />
        )}
        {/* Red gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(227,30,36,0.9) 0%, rgba(80,10,14,0.85) 55%, rgba(10,10,15,0.9) 100%)' }} />
        {/* Texture dots */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div style={{ position: 'relative', padding: '28px 32px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '5px 14px', marginBottom: 10, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Megaphone size={13} color="#fff" />
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Marketing Hub</span>
              </div>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.03em', lineHeight: 1.1 }}>Branded Assets &</h1>
              <h1 style={{ fontSize: 28, fontWeight: 900, color: 'rgba(255,255,255,0.75)', margin: '3px 0 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Marketing Support</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '9px 0 0', fontWeight: 400 }}>Factory-direct premium assets to amplify your market presence</p>
            </div>
            {/* Stat chips */}
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              {[
                { val: ASSETS.length, label: 'Total Assets' },
                { val: newCount,      label: 'New This Week' },
                { val: videoCount,    label: '4K Videos' },
              ].map((s) => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 14, padding: '12px 16px', textAlign: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  <p style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0 }}>{s.val}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '3px 0 0', fontWeight: 600 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Featured new asset strip */}
          {featured && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 12, padding: '9px 16px', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', width: 'fit-content' }}>
              <Sparkles size={13} color="#FFD60A" />
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>Latest drop:</span>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{featured.title}</span>
              <button onClick={() => setPreview(featured)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: FF }}>
                View <ChevronRight size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 22 }}>
        {Object.entries(KIND_CFG).map(([k, cfg]) => {
          const count = ASSETS.filter(a => a.kind === k).length;
          const newC  = ASSETS.filter(a => a.kind === k && a.isNew).length;
          return (
            <button key={k} onClick={() => setFilter(k as AssetFilter)}
              style={{ background: filter === k ? (dm ? cfg.bgDark : cfg.bgLight) : CARD, borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${filter === k ? cfg.color + '55' : BORDER}`, boxShadow: SHADOW, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', fontFamily: FF }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: dm ? cfg.bgDark : cfg.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <cfg.Icon size={15} style={{ color: cfg.color }} />
                </div>
                {newC > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: '#E31E24', color: '#fff' }}>{newC} NEW</span>}
              </div>
              <p style={{ fontSize: 22, fontWeight: 900, color: filter === k ? cfg.color : TEXT, margin: '0 0 3px', fontVariantNumeric: 'tabular-nums' }}>{count}</p>
              <p style={{ fontSize: 12, color: filter === k ? cfg.color : MUTED, margin: 0, fontWeight: 600 }}>{cfg.label}s</p>
            </button>
          );
        })}
      </div>

      {/* ── Controls bar ── */}
      <div style={{ background: CARD, borderRadius: 18, padding: '14px 18px', boxShadow: SHADOW, border: `1px solid ${BORDER}`, marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 200, background: dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: 11, padding: '10px 16px' }}>
            <Search size={16} style={{ color: MUTED, flexShrink: 0 }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, type, or tag…" style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: TEXT, flex: 1, fontFamily: FF }} />
            {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><X size={14} style={{ color: MUTED }} /></button>}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {FILTER_TABS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)}
                style={{ height: 40, padding: '0 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: FF, whiteSpace: 'nowrap', background: filter === key ? '#E31E24' : (dm ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)'), color: filter === key ? '#fff' : TEXT, transition: 'all 0.15s' }}>
                {label} {key !== 'all' ? `(${ASSETS.filter(a => a.kind === key).length})` : `(${ASSETS.length})`}
              </button>
            ))}
          </div>

          {/* Results count */}
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 600, whiteSpace: 'nowrap' }}>{filtered.length} asset{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* ── New this week banner ── */}
      {filter === 'all' && !query && (
        <div style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 16 }}>
            <Sparkles size={16} style={{ color: '#FFD60A' }} />
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT }}>New This Week</span>
            <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: '#E31E24', color: '#fff' }}>{newCount}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {ASSETS.filter(a => a.isNew).map((asset) => (
              <AssetCard key={asset.id} asset={asset} onPreview={() => setPreview(asset)} dm={dm} />
            ))}
          </div>
        </div>
      )}

      {/* ── Main grid, grouped by section when 'all' ── */}
      {filter === 'all' && !query ? (
        Object.entries(KIND_CFG).map(([k, cfg]) => {
          const group = ASSETS.filter(a => a.kind === k && !a.isNew);
          if (!group.length) return null;
          return (
            <div key={k} style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: dm ? cfg.bgDark : cfg.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <cfg.Icon size={13} style={{ color: cfg.color }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{cfg.label}s</span>
                <span style={{ fontSize: 12, color: MUTED }}>({group.length})</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
                {group.map((asset) => (
                  <AssetCard key={asset.id} asset={asset} onPreview={() => setPreview(asset)} dm={dm} />
                ))}
              </div>
            </div>
          );
        })
      ) : (
        filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 28 }}>
            {filtered.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onPreview={() => setPreview(asset)} dm={dm} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: MUTED }}>
            <Search size={32} style={{ color: MUTED, marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 15, fontWeight: 700, color: TEXT, margin: '0 0 6px' }}>No assets found</p>
            <p style={{ fontSize: 13, margin: 0 }}>Try adjusting your search or filter</p>
          </div>
        )
      )}

      {/* ── Upload request CTA ── */}
      <div style={{ background: dm ? 'rgba(227,30,36,0.08)' : 'rgba(227,30,36,0.04)', borderRadius: 18, border: '1.5px dashed rgba(227,30,36,0.3)', padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Megaphone size={15} style={{ color: '#E31E24' }} />
            <span style={{ fontSize: 14, fontWeight: 700, color: TEXT }}>Need custom assets or a specific format?</span>
          </div>
          <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Contact your BEITER account manager to request bespoke marketing material for your market.</p>
        </div>
        <button style={{ flexShrink: 0, height: 40, padding: '0 20px', borderRadius: 11, background: 'linear-gradient(135deg, #C8161C, #E31E24)', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: FF, display: 'flex', alignItems: 'center', gap: 7 }}>
          <ExternalLink size={13} /> Request Assets
        </button>
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <AssetPreview key="preview" asset={preview} onClose={() => setPreview(null)} onDownload={() => { handleDownload(preview); setPreview(null); }} dm={dm} />
        )}
      </AnimatePresence>
    </div>
  );
}