import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import type { Language } from '../i18n/translations';

const LANGUAGES: { code: Language; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
];

interface Props {
  /** 'sheet' = bottom sheet (default), 'inline' = inline pills */
  variant?: 'sheet' | 'inline';
  label?: string;
}

export function LanguageSelector({ variant = 'sheet', label }: Props) {
  const { language, setLanguage } = useAppStore();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find((l) => l.code === language)!;

  if (variant === 'inline') {
    return (
      <div className="relative">
        {/* Trigger button */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-[#E0E7EF] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1628] text-xs font-semibold transition-all hover:border-[#00AEEF]"
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span className="text-[#333333] dark:text-[#CBD5E1]">{current.native}</span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#94A3B8] dark:text-[#64748B] leading-none"
          >
            ▾
          </motion.span>
        </button>

        {/* Dropdown menu */}
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop to close on outside click */}
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -6 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-[#112240] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[#E0E7EF] dark:border-[#1E3A5F] overflow-hidden min-w-[160px]"
              >
                {LANGUAGES.map((lang, i) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                      ${i !== LANGUAGES.length - 1 ? 'border-b border-[#F4F7F9] dark:border-[#1E3A5F]' : ''}
                      ${language === lang.code
                        ? 'bg-[#E8F9FF] dark:bg-[#00AEEF]/10'
                        : 'hover:bg-[#F4F7F9] dark:hover:bg-[#0A1628]'
                      }`}
                  >
                    <span className="text-lg leading-none">{lang.flag}</span>
                    <span className={`flex-1 text-xs font-semibold ${language === lang.code ? 'text-[#002B49] dark:text-[#E2E8F0]' : 'text-[#333333] dark:text-[#CBD5E1]'}`}>
                      {lang.native}
                    </span>
                    {language === lang.code && (
                      <Check size={12} className="text-[#00AEEF] flex-shrink-0" />
                    )}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      {/* Trigger row */}
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between py-2.5"
      >
        <div className="flex items-center gap-2">
          <Globe size={14} className="text-[#00AEEF]" />
          <span className="text-[#94A3B8] dark:text-[#64748B] text-xs">{label || 'Language'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{current.flag}</span>
          <span className="text-[#333333] dark:text-[#CBD5E1] text-xs font-semibold">{current.native}</span>
        </div>
      </button>

      {/* Bottom sheet */}
      <AnimatePresence>
        {open && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#112240] rounded-t-3xl w-full max-w-md mx-auto p-6 pb-10 transition-colors duration-300"
            >
              <div className="w-10 h-1 bg-[#D1D9E0] dark:bg-[#1E3A5F] rounded-full mx-auto mb-5" />
              <div className="flex items-center gap-2 mb-4">
                <Globe size={18} className="text-[#00AEEF]" />
                <h3 className="text-[#002B49] dark:text-[#E2E8F0] font-bold text-base">
                  {label || 'Select Language'}
                </h3>
              </div>

              <div className="space-y-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                      language === lang.code
                        ? 'border-[#00AEEF] bg-[#E8F9FF] dark:bg-[#00AEEF]/10'
                        : 'border-[#E0E7EF] dark:border-[#1E3A5F] bg-white dark:bg-[#0A1628]'
                    }`}
                  >
                    <span className="text-2xl leading-none">{lang.flag}</span>
                    <div className="flex-1">
                      <p className="text-[#333333] dark:text-[#CBD5E1] font-bold text-sm">{lang.native}</p>
                      <p className="text-[#94A3B8] dark:text-[#64748B] text-xs">{lang.label}</p>
                    </div>
                    {language === lang.code && (
                      <div className="w-6 h-6 rounded-full bg-[#00AEEF] flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}