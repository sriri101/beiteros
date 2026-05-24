import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Bookmark, BookmarkCheck, CheckCircle, Zap } from 'lucide-react';
import { useAppStore, TipCategory } from '../store/useAppStore';
import { useTranslation } from '../i18n';

const categoryColors: Record<TipCategory, { bg: string; text: string }> = {
  Safety:      { bg: '#FFEEEE', text: '#C0392B' },
  Maintenance: { bg: '#FFF0F0', text: '#E31E24' },
  Productivity:{ bg: '#E8F8EE', text: '#1A8A4A' },
};
const categoryBorderColor: Record<TipCategory, string> = {
  Safety:      '#E31E24',
  Maintenance: '#E31E24',
  Productivity:'#34C759',
};

export default function DailyTips() {
  const navigate = useNavigate();
  const { tips, markTipRead, toggleTipSave } = useAppStore();
  const t = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState<TipCategory | 'all'>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const filtered = tips.filter((tip) => {
    const matchCat = categoryFilter === 'all' || tip.category === categoryFilter;
    const matchSaved = !showSavedOnly || tip.saved;
    return matchCat && matchSaved && tip.is_active;
  });

  const categoryLabels: Record<TipCategory | 'all', string> = {
    all: t.tips.allFilter,
    Safety: t.tips.safety,
    Maintenance: t.tips.maintenance,
    Productivity: t.tips.productivity,
  };

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
          <h1 className="text-[#1D1D1F] dark:text-white text-[17px] font-semibold">{t.tips.title}</h1>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {(['all', 'Safety', 'Maintenance', 'Productivity'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all"
              style={{
                backgroundColor: categoryFilter === cat ? '#E31E24' : 'white',
                color: categoryFilter === cat ? 'white' : '#111111',
              }}
            >
              {categoryLabels[cat]}
            </button>
          ))}
          <button
            onClick={() => setShowSavedOnly(!showSavedOnly)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all flex items-center gap-1.5"
            style={{
              backgroundColor: showSavedOnly ? '#111111' : 'white',
              color: showSavedOnly ? 'white' : '#111111',
            }}
          >
            <Bookmark size={11} /> {t.tips.saved}
          </button>
        </div>
      </div>

      {/* pt = sub-header: title(54) + filters(50) = 104px */}
      <div className="px-4 pt-[100px] pb-4 space-y-3">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center mb-4">
              <Zap size={28} className="text-[#E31E24]" />
            </div>
            <p className="text-[#111111] dark:text-white text-[16px] font-semibold">{t.tips.noTips}</p>
            <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px] mt-1">{t.tips.tryFilter}</p>
          </div>
        )}
        <AnimatePresence>
          {filtered.map((tip, i) => {
            const c = categoryColors[tip.category];
            const borderCol = categoryBorderColor[tip.category];
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.03 }}
                className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300"
                style={{ borderLeft: `4px solid ${borderCol}` }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: c.bg, color: c.text }}
                        >
                          {tip.category}
                        </span>
                        {tip.read && (
                          <span className="flex items-center gap-1 text-[#34C759] text-[10px] font-medium">
                            <CheckCircle size={10} /> {t.tips.read}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[#111111] dark:text-white text-[15px] font-semibold leading-tight mb-1.5">{tip.title}</h3>
                      <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] leading-relaxed">{tip.body}</p>
                    </div>
                    <button
                      onClick={() => toggleTipSave(tip.id)}
                      className="flex-shrink-0 active:opacity-60 transition-opacity mt-0.5"
                    >
                      {tip.saved
                        ? <BookmarkCheck size={20} className="text-[#E31E24]" fill="#E31E24" />
                        : <Bookmark size={20} className="text-[#CCCCCC] dark:text-[#3A3A3A]" />
                      }
                    </button>
                  </div>
                  {!tip.read && (
                    <button
                      onClick={() => markTipRead(tip.id)}
                      className="mt-3 flex items-center gap-1.5 text-[#E31E24] text-[12px] font-medium active:opacity-60 transition-opacity"
                    >
                      <CheckCircle size={13} /> {t.tips.markRead} <span className="text-[#8E8E93]">(+25 pts)</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}