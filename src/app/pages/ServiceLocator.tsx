import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft, Search, MapPin, Phone, Clock, Navigation,
  Wrench, Package, Store
} from 'lucide-react';
import { useAppStore, ShopType } from '../store/useAppStore';
import { useTranslation } from '../i18n';
import { AnimatedMap } from '../components/AnimatedMap';

export default function ServiceLocator() {
  const navigate = useNavigate();
  const { shops } = useAppStore();
  const t = useTranslation();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | ShopType>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const filtered = shops.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || s.type === typeFilter || (typeFilter === 'both' && s.type === 'both');
    return matchSearch && matchType;
  });

  const typeConfigs: Record<ShopType, { label: string; bg: string; text: string; icon: React.ElementType }> = {
    distributor: { label: t.serviceLocator.distributorLabel, bg: '#FFF0F0', text: '#E31E24', icon: Package },
    repair:      { label: t.serviceLocator.repairLabel,      bg: '#E8F8EE', text: '#1A8A4A', icon: Wrench },
    both:        { label: t.serviceLocator.bothLabel,        bg: '#FFF3E0', text: '#B97A00', icon: Store },
  };

  const filterPills = [
    { value: 'all' as const, label: t.serviceLocator.allFilter },
    { value: 'distributor' as const, label: t.serviceLocator.distributors },
    { value: 'repair' as const, label: t.serviceLocator.repair },
    { value: 'both' as const, label: t.serviceLocator.both },
  ];

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      {/* Sub-header */}
      <div className="fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] transition-colors duration-300">
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-0.5 text-[#E31E24] active:opacity-60 transition-opacity"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="text-[15px]">Back</span>
          </button>
          <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">{t.serviceLocator.title}</h1>
          <div className="w-16" />
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder={t.serviceLocator.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#E8E8E8] dark:bg-[#2A2A2A] rounded-xl py-2 pl-8 pr-4 text-[15px] text-[#111111] dark:text-white focus:outline-none placeholder-[#8E8E93] transition-colors"
            />
          </div>
        </div>

        {/* List / Map toggle */}
        <div className="px-4 pb-3">
          <div className="bg-[#E8E8E8] dark:bg-[#2A2A2A] rounded-xl p-1 flex">
            {(['list', 'map'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex-1 py-1.5 rounded-lg text-[13px] font-medium transition-all capitalize ${
                  viewMode === mode
                    ? 'bg-white dark:bg-[#1A1A1A] text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6C6C70] dark:text-[#AAAAAA]'
                }`}
              >
                {mode === 'list' ? t.serviceLocator.listView : t.serviceLocator.mapView}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {filterPills.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all"
              style={{
                backgroundColor: typeFilter === f.value ? '#E31E24' : 'white',
                color: typeFilter === f.value ? 'white' : '#111111',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === 'map' ? (
        /* MAP VIEW */
        <div
          className="fixed left-0 right-0 max-w-md mx-auto"
          style={{ top: '260px', bottom: '80px' }}
        >
          <AnimatedMap shops={filtered} />
        </div>
      ) : (
        /* LIST VIEW */
        <div className="px-4 pt-[156px] pb-6 space-y-4">
          <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-semibold uppercase tracking-wide">
            {t.serviceLocator.locationsFound(filtered.length)}
          </p>

          {/* Shop Cards */}
          <div className="space-y-3">
            {filtered.map((shop, i) => {
              const typeConf = typeConfigs[shop.type];
              return (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300"
                >
                  <div className="px-4 pt-4 pb-3">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#111111] dark:text-white text-[16px] font-semibold">{shop.name}</h3>
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1"
                          style={{ backgroundColor: typeConf.bg, color: typeConf.text }}
                        >
                          <typeConf.icon size={9} /> {typeConf.label}
                        </span>
                      </div>
                      {shop.distance && (
                        <span className="flex items-center gap-1 text-[#E31E24] text-[13px] font-semibold ml-2 flex-shrink-0">
                          <Navigation size={11} /> {shop.distance}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center gap-2 text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">
                        <MapPin size={12} className="text-[#E31E24] flex-shrink-0" />
                        <span>{shop.address}, {shop.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[13px]">
                        <Phone size={12} className="text-[#E31E24] flex-shrink-0" />
                        <a href={`tel:${shop.phone}`} className="text-[#E31E24] font-medium">{shop.phone}</a>
                      </div>
                      <div className="flex items-center gap-2 text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">
                        <Clock size={12} className="text-[#E31E24] flex-shrink-0" />
                        <span>{shop.hours}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex border-t border-[#F0F0F0] dark:border-[#2A2A2A]">
                    <a
                      href={`https://maps.google.com/?q=${shop.lat},${shop.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[#E31E24] text-[14px] font-medium border-r border-[#F0F0F0] dark:border-[#2A2A2A] active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors"
                    >
                      <Navigation size={14} /> {t.serviceLocator.directions}
                    </a>
                    <a
                      href={`tel:${shop.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[#E31E24] text-[14px] font-medium active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors"
                    >
                      <Phone size={14} /> {t.serviceLocator.call}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <MapPin size={40} className="text-[#CCCCCC] dark:text-[#3A3A3A] mb-3" />
              <p className="text-[#111111] dark:text-white text-[16px] font-semibold">{t.serviceLocator.noLocations}</p>
              <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px] mt-1">{t.serviceLocator.tryDifferent}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}