import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Bell, Zap, ChevronRight, AlertTriangle, CheckCircle,
  Clock, BookOpen, Star, Wrench, Bookmark, MapPin, Receipt, ScanLine
} from 'lucide-react';
import { useAppStore, getLevelName, getNextLevelThreshold } from '../store/useAppStore';
import { useTranslation } from '../i18n';

function WarrantyDot({ status }: { status: string }) {
  const color = status === 'active' ? '#34C759' : status === 'expiring' ? '#FF9500' : '#FF3B30';
  return <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />;
}

function WarrantyBadge({ status, t }: { status: string; t: any }) {
  const styles: Record<string, { bg: string; text: string }> = {
    active: { bg: '#E8F8EE', text: '#1A8A4A' },
    expiring: { bg: '#FFF3E0', text: '#B97A00' },
    expired: { bg: '#FFEEEE', text: '#C0392B' },
  };
  const s = styles[status] || styles.expired;
  const label = status === 'active' ? t.common.warrantyActive : status === 'expiring' ? t.common.warrantyExpiring : t.common.warrantyExpired;
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {label}
    </span>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user, tools, tips, setSelectedTool, setActiveTab, markTipRead } = useAppStore();
  const t = useTranslation();
  const [notifVisible, setNotifVisible] = useState(true);

  const nextThreshold = getNextLevelThreshold(user.level);
  const prevThreshold = getNextLevelThreshold(user.level - 1) || 0;
  const progress = ((user.points - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  const maintenanceDue = tools.filter((tool) => tool.maintenance_status !== 'ok');
  const unreadTips = tips.filter((tip) => !tip.read && tip.is_active);

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      <div className="px-4 pt-5 pb-5 space-y-6">
        {/* Greeting + Level Card */}
        <div
          className="relative rounded-3xl p-5 space-y-4 overflow-hidden"
          style={{ background: 'linear-gradient(141deg, #111111 8%, #1A1A1A 50%, #E31E24 92%)' }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 200, height: 200, top: -60, right: -40, background: '#E31E24', opacity: 0.15 }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 160, height: 160, bottom: -40, left: -40, background: '#E31E24', opacity: 0.10 }}
          />

          {/* Top row: greeting + avatar */}
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-white/60 text-[15px]">{t.home.greeting},</p>
              <h2 className="text-white text-[28px] font-bold mt-0.5">{user.name.split(' ')[0]} 👋</h2>
            </div>
            <div className="w-14 h-14 rounded-full bg-[#E31E24] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[18px] font-bold">
                {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          {/* Level + Progress inner card */}
          <div className="relative bg-white/10 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/60 text-[11px] font-semibold uppercase tracking-wider text-[#ffffffb3]">
                  {t.common.level} {user.level} · {getLevelName(user.level)}
                </p>
                <p className="text-white text-[28px] font-bold mt-0.5">
                  {user.points.toLocaleString('de-DE')} pts
                </p>
              </div>
              <div className="w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center flex-shrink-0 bg-[#0000001c]">
                <span className="text-[24px] font-bold text-[#ffe0e0]">{user.level}</span>
              </div>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-[#E31E24] rounded-full"
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-white/50 text-[11px] text-[#ffffffe6]">{user.points.toLocaleString('de-DE')} pts</p>
              <p className="text-white/50 text-[11px] text-[#ffffffe6]">
                Progress to {getLevelName(user.level + 1)}: {nextThreshold.toLocaleString('de-DE')}
              </p>
            </div>
          </div>
        </div>

        {/* Maintenance Alert */}
        {maintenanceDue.length > 0 && notifVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-[#FF9500]" />
                <span className="text-[#111111] dark:text-white text-[14px] font-semibold">{t.home.needsAttention}</span>
              </div>
              <button onClick={() => setNotifVisible(false)} className="text-[#E31E24] text-[14px]">{t.home.dismiss}</button>
            </div>
            {maintenanceDue.map((tool, i) => (
              <button
                key={tool.id}
                onClick={() => { setSelectedTool(tool.id); setActiveTab('tools'); navigate(`/app/tools/${tool.id}`); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left ${i < maintenanceDue.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''} active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors`}
              >
                <img src={tool.image_url} alt={tool.model} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] dark:text-white text-[14px] font-medium truncate">{tool.model}</p>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px]">{t.home.next} {tool.next_maintenance}</p>
                </div>
                <span
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: tool.maintenance_status === 'due' ? '#FFF3E0' : '#FFEEEE',
                    color: tool.maintenance_status === 'due' ? '#B97A00' : '#C0392B',
                  }}
                >
                  {tool.maintenance_status === 'due' ? t.home.due : t.home.overdue}
                </span>
              </button>
            ))}
          </motion.div>
        )}

        {/* Quick Stats */}
        <div className="space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t.home.registered, value: tools.length, icon: Wrench, color: '#E31E24', bg: '#FFF0F0' },
              { label: t.home.activeWarranty, value: tools.filter(tl => tl.warranty_status === 'active').length, icon: CheckCircle, color: '#34C759', bg: '#E8F8EE' },
              { label: t.home.tipsSaved, value: tips.filter(tip => tip.saved).length, icon: Bookmark, color: '#FF9500', bg: '#FFF3E0' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-3.5 text-center transition-colors duration-300">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ backgroundColor: stat.bg }}
                >
                  <stat.icon size={17} style={{ color: stat.color }} />
                </div>
                <p className="text-[#111111] dark:text-white text-[22px] font-bold">{stat.value}</p>
                <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[10px] leading-tight mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick-access receipt buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Open Receipt Vault */}
            <button
              onClick={() => { setActiveTab('receipts'); navigate('/app/receipts'); }}
              className="bg-white dark:bg-[#1A1A1A] rounded-2xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.97] transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF3E0] dark:bg-[#FF9500]/15 flex items-center justify-center flex-shrink-0">
                <Receipt size={18} className="text-[#FF9500]" />
              </div>
              <div className="text-left">
                <p className="text-[#111111] dark:text-white text-[13px] font-semibold leading-tight">Receipt Vault</p>
                <p className="text-[#8E8E93] text-[11px] mt-0.5">{tools.length} receipts</p>
              </div>
            </button>

            {/* Scan new receipt */}
            <button
              onClick={() => { setActiveTab('receipts'); navigate('/app/receipts?add=true'); }}
              className="bg-[#E31E24] rounded-2xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.97] transition-all duration-150"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <ScanLine size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-white text-[13px] font-semibold leading-tight">Scan Receipt</p>
                <p className="text-white/70 text-[11px] mt-0.5">Add to vault</p>
              </div>
            </button>
          </div>
        </div>

        {/* My Toolbox */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-semibold uppercase tracking-wide">{t.home.myToolbox}</p>
            <button
              onClick={() => { setActiveTab('tools'); navigate('/app/tools'); }}
              className="text-[#E31E24] text-[14px] flex items-center gap-0.5 active:opacity-60 transition-opacity"
            >
              {t.common.viewAll} <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => { setSelectedTool(tool.id); setActiveTab('tools'); navigate(`/app/tools/${tool.id}`); }}
                className="flex-shrink-0 w-44 bg-white dark:bg-[#1A1A1A] rounded-2xl p-3 text-left active:opacity-80 transition-opacity"
              >
                <div className="relative mb-2.5">
                  <img src={tool.image_url} alt={tool.model} className="w-full h-28 object-cover rounded-xl" />
                  {tool.maintenance_status !== 'ok' && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#E31E24] rounded-full flex items-center justify-center">
                      <AlertTriangle size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-[#E31E24] text-[10px] font-bold uppercase tracking-wide">{tool.category}</p>
                <p className="text-[#111111] dark:text-white text-[13px] font-medium mt-0.5 leading-tight line-clamp-2">{tool.model}</p>
                <div className="mt-2">
                  <WarrantyBadge status={tool.warranty_status} t={t} />
                </div>
              </button>
            ))}
            <button
              onClick={() => { setActiveTab('scan'); navigate('/app/scan'); }}
              className="flex-shrink-0 w-36 border-2 border-dashed border-[#CCCCCC] dark:border-[#3A3A3A] rounded-2xl p-3 flex flex-col items-center justify-center gap-2 active:opacity-60 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center">
                <Zap size={18} className="text-[#E31E24]" />
              </div>
              <p className="text-[#111111] dark:text-white text-[12px] font-medium text-center">{t.home.registerNewTool}</p>
            </button>
          </div>
        </div>

        {/* Daily Tips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <BookOpen size={12} /> {t.home.dailyTips}
            </p>
            <button
              onClick={() => navigate('/app/tips')}
              className="text-[#E31E24] text-[14px] flex items-center gap-0.5 active:opacity-60 transition-opacity"
            >
              {t.home.allTips} <ChevronRight size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {unreadTips.slice(0, 5).map((tip) => {
              const categoryColors: Record<string, { bg: string; text: string }> = {
                Safety: { bg: '#FFEEEE', text: '#C0392B' },
                Maintenance: { bg: '#FFF0F0', text: '#E31E24' },
                Productivity: { bg: '#E8F8EE', text: '#1A8A4A' },
              };
              const c = categoryColors[tip.category] || categoryColors.Maintenance;
              return (
                <div key={tip.id} className="flex-shrink-0 w-56 bg-white dark:bg-[#1A1A1A] rounded-2xl p-4">
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: c.bg, color: c.text }}
                  >
                    {tip.category}
                  </span>
                  <h3 className="text-[#111111] dark:text-white text-[13px] font-semibold mt-2 mb-1.5 leading-tight">{tip.title}</h3>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] leading-relaxed line-clamp-3">{tip.body}</p>
                  <button
                    onClick={() => markTipRead(tip.id)}
                    className="mt-3 text-[#E31E24] text-[12px] font-medium flex items-center gap-1 active:opacity-60 transition-opacity"
                  >
                    {t.home.markRead} (+25 <Star size={10} />)
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Locator */}
        <button
          onClick={() => navigate('/app/service-locator')}
          className="w-full bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-4 text-left active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center flex-shrink-0">
            <MapPin size={22} className="text-[#E31E24]" />
          </div>
          <div className="flex-1">
            <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.home.findServiceCenters}</p>
            <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] mt-0.5">{t.home.repairShopsNearby}</p>
          </div>
          <ChevronRight size={16} className="text-[#CCCCCC] dark:text-[#3A3A3A]" />
        </button>

        {/* Reminders */}
        <div>
          <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-semibold uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <Clock size={12} /> {t.home.reminders}
          </p>
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
            {tools.map((tool, i) => (
              <div
                key={tool.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < tools.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}
              >
                <WarrantyDot status={tool.maintenance_status === 'ok' ? 'active' : tool.maintenance_status === 'due' ? 'expiring' : 'expired'} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] dark:text-white text-[14px] font-medium truncate">{tool.model}</p>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px]">{t.home.maintenanceDue} {tool.next_maintenance}</p>
                </div>
                <ChevronRight size={15} className="text-[#CCCCCC] dark:text-[#3A3A3A]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}