import { writable } from 'svelte/store';
import type { translations } from '../utils/translations';

export type Language = 'en' | 'de' | 'es' | 'fr' | 'it';

const DEFAULT_LANGUAGE: Language = 'de';

// Load language from localStorage or use default
function getStoredLanguage(): Language {
	if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
	const stored = localStorage.getItem('yatzy-language');
	if (stored && (stored === 'en' || stored === 'de' || stored === 'es' || stored === 'fr' || stored === 'it')) {
		return stored as Language;
	}
	return DEFAULT_LANGUAGE;
}

// Save language to localStorage
function saveLanguage(lang: Language) {
	if (typeof window === 'undefined') return;
	localStorage.setItem('yatzy-language', lang);
}

export const languageStore = writable<Language>(getStoredLanguage());

// Subscribe to changes and save to localStorage
languageStore.subscribe((lang) => {
	saveLanguage(lang);
});

