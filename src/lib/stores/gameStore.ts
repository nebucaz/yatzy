import { writable } from 'svelte/store';
import type { Player, ScoreCategory, GameState } from '../types';
import { loadGameState, saveGameState } from '../utils/storage';

function createGameStore() {
	const { subscribe, set, update } = writable<GameState>({ players: [] });

	// Load from localStorage on initialization
	const initialState = loadGameState();
	if (initialState.players.length > 0) {
		set(initialState);
	} else {
		// Initialize with one player if empty
		set({ players: [{ id: crypto.randomUUID(), name: 'Player 1', scores: {} }] });
	}

	return {
		subscribe,
		addPlayer: () => {
			update((state) => {
				const newPlayer: Player = {
					id: crypto.randomUUID(),
					name: `Player ${state.players.length + 1}`,
					scores: {}
				};
				const newState = { players: [...state.players, newPlayer] };
				saveGameState(newState);
				return newState;
			});
		},
		removePlayer: (playerId: string) => {
			update((state) => {
				const newState = {
					players: state.players.filter((p) => p.id !== playerId)
				};
				saveGameState(newState);
				return newState;
			});
		},
		updatePlayerName: (playerId: string, name: string) => {
			update((state) => {
				const newState = {
					players: state.players.map((p) =>
						p.id === playerId ? { ...p, name } : p
					)
				};
				saveGameState(newState);
				return newState;
			});
		},
		setScore: (playerId: string, category: ScoreCategory, score: number | null | undefined) => {
			update((state) => {
				const newState = {
					players: state.players.map((p) => {
						if (p.id === playerId) {
							const newScores = { ...p.scores };
							if (score === undefined) {
								// Remove the score (unset it)
								delete newScores[category];
							} else {
								// Set the score (null means skipped, number means actual score)
								newScores[category] = score;
							}
							return { ...p, scores: newScores };
						}
						return p;
					})
				};
				saveGameState(newState);
				return newState;
			});
		},
		clearGame: () => {
			const newState = { players: [{ id: crypto.randomUUID(), name: 'Player 1', scores: {} }] };
			saveGameState(newState);
			set(newState);
		},
		reorderPlayers: (newOrder: Player[]) => {
			const newState = { players: newOrder };
			saveGameState(newState);
			set(newState);
		}
	};
}

export const gameStore = createGameStore();

