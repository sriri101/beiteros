export { translations, RTL_LANGS } from './translations';
export type { Language, Translations } from './translations';

import { useAppStore } from '../store/useAppStore';
import { translations } from './translations';

export function useTranslation() {
  const language = useAppStore((s) => s.language);
  return translations[language];
}
