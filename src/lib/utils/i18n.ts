import type { Language } from '../stores/i18nStore';
import { getTranslation } from './translations';
import type { Translations } from './translations';

// Translation function - pass the current language from $derived($languageStore)
// This ensures reactivity when language changes
export function t(key: keyof Translations, lang: Language): string {
	return getTranslation(key, lang);
}

