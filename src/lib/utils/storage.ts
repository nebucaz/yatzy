import type { GameState } from '../types';

const STORAGE_KEY = 'yatzy-game-state';

export function saveGameState(state: GameState): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (error) {
		console.error('Failed to save game state:', error);
	}
}

export function loadGameState(): GameState {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('Failed to load game state:', error);
	}
	return { players: [] };
}

