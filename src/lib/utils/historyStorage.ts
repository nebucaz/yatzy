import type { GameHistoryEntry } from '../types';

const HISTORY_STORAGE_KEY = 'yatzy-game-history';

export function saveGameHistory(entry: GameHistoryEntry): void {
	if (typeof window === 'undefined') return;
	try {
		const existing = loadGameHistory();
		const updated = [entry, ...existing];
		localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
	} catch (error) {
		console.error('Failed to save game history:', error);
	}
}

export function loadGameHistory(): GameHistoryEntry[] {
	if (typeof window === 'undefined') return [];
	try {
		const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('Failed to load game history:', error);
	}
	return [];
}

export function clearGameHistory(): void {
	if (typeof window === 'undefined') return;
	try {
		localStorage.removeItem(HISTORY_STORAGE_KEY);
	} catch (error) {
		console.error('Failed to clear game history:', error);
	}
}

