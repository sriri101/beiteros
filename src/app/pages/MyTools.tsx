import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Search, AlertTriangle, Plus, Zap, QrCode } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';

export default function MyTools() {
  const navigate = useNavigate();
  const { tools, setSelectedTool, setActiveTab } = useAppStore();
  const t = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expiring' | 'expired'>('all');

  const filtered = tools.filter((tool) => {
    const matchSearch =
      tool.model.toLowerCase().includes(search.toLowerCase()) ||
      tool.serial_number.toLowerCase().includes(search.toLowerCase()) ||
      tool.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || tool.warranty_status === filter;
    return matchSearch && matchFilter;
  });

  const warrantyStyles: Record<string, { bg: string; text: string }> = {
    active: { bg: '#E8F8EE', text: '#1A8A4A' },
    expiring: { bg: '#FFF3E0', text: '#B97A00' },
    expired: { bg: '#FFEEEE', text: '#C0392B' },
  };
  const maintStyles: Record<string, { bg: string; text: string }> = {
    due: { bg: '#FFF3E0', text: '#B97A00' },
    overdue: { bg: '#FFEEEE', text: '#C0392B' },
  };

  const warrantyLabels: Record<string, string> = {
    active: t.tools.activeBadge,
    expiring: t.tools.expiringBadge,
    expired: t.tools.expiredBadge,
  };
  const maintLabels: Record<string, string> = {
    due: t.tools.maintDueBadge,
    overdue: t.tools.overdueBadge,
  };

  const filterPills = [
    { key: 'all' as const, label: t.tools.allTools },
    { key: 'active' as const, label: t.tools.active },
    { key: 'expiring' as const, label: t.tools.expiring },
    { key: 'expired' as const, label: t.tools.expired },
  ];

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      {/* Sub-header */}
      <div className="fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] transition-colors duration-300">
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
          <div className="w-16" />
          <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">{t.tools.myToolbox}</h1>
          <button
            onClick={() => { setActiveTab('scan'); navigate('/app/scan'); }}
            className="w-8 h-8 rounded-full bg-[#E31E24] flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
        {/* iOS Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder={t.tools.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#E8E8E8] dark:bg-[#2A2A2A] rounded-xl py-2 pl-8 pr-4 text-[15px] text-[#111111] dark:text-white focus:outline-none placeholder-[#8E8E93] dark:placeholder-[#8E8E93] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-[104px] pb-4 space-y-4">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {filterPills.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all"
              style={{
                backgroundColor: filter === f.key ? '#E31E24' : 'white',
                color: filter === f.key ? 'white' : '#111111',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px]">
          {t.tools.toolsRegistered(filtered.length)}
        </p>

        {/* Tool Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center mb-4">
              <Zap size={28} className="text-[#E31E24]" />
            </div>
            <p className="text-[#111111] dark:text-white text-[16px] font-semibold">{t.tools.noToolsFound}</p>
            <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px] mt-1">{t.tools.tryDifferentSearch}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((tool, i) => {
              const ws = warrantyStyles[tool.warranty_status] || warrantyStyles.expired;
              const ms = maintStyles[tool.maintenance_status];
              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { setSelectedTool(tool.id); navigate(`/app/tools/${tool.id}`); }}
                  className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-3 text-left relative overflow-hidden active:opacity-80 transition-opacity"
                >
                  {tool.is_stolen && (
                    <div className="absolute top-0 left-0 right-0 bg-[#E31E24] text-white text-[9px] font-bold py-0.5 text-center">
                      {t.tools.reportedStolen}
                    </div>
                  )}
                  {tool.maintenance_status !== 'ok' && !tool.is_stolen && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-[#E31E24] rounded-full flex items-center justify-center">
                      <AlertTriangle size={10} className="text-white" />
                    </div>
                  )}
                  <div className={tool.is_stolen ? 'mt-4' : ''}>
                    <img
                      src={tool.image_url}
                      alt={tool.model}
                      className="w-full h-28 object-cover rounded-xl mb-2.5"
                    />
                    <p className="text-[#E31E24] text-[9px] font-bold uppercase tracking-wide">{tool.category}</p>
                    <p className="text-[#111111] dark:text-white text-[13px] font-semibold mt-0.5 leading-tight line-clamp-2">{tool.model}</p>
                    <p className="text-[#8E8E93] text-[10px] mt-0.5 font-mono">{tool.serial_number}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: ws.bg, color: ws.text }}>
                        {warrantyLabels[tool.warranty_status] || t.tools.unknownBadge}
                      </span>
                      {tool.maintenance_status !== 'ok' && ms && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: ms.bg, color: ms.text }}>
                          {maintLabels[tool.maintenance_status]}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Register CTA */}
        <button
          onClick={() => { setActiveTab('scan'); navigate('/app/scan'); }}
          className="w-full border-2 border-dashed border-[#CCCCCC] dark:border-[#3A3A3A] rounded-2xl py-5 flex flex-col items-center justify-center gap-2 active:opacity-60 transition-opacity"
        >
          <div className="w-10 h-10 rounded-full bg-[#E31E24] flex items-center justify-center">
            <QrCode size={18} className="text-white" />
          </div>
          <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.tools.registerNewTool}</p>
          <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">{t.tools.scanOrSerial}</p>
        </button>
      </div>
    </div>
  );
}