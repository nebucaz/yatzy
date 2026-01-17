import { writable } from 'svelte/store';
import type { Player, ScoreCategory, GameState, GameHistoryEntry, GameResult } from '../types';
import { loadGameState, saveGameState } from '../utils/storage';
import { saveGameHistory } from '../utils/historyStorage';
import { calculateTotal } from '../utils/scoreCalculator';

function createGameStore() {
	const { subscribe, set, update } = writable<GameState>({ players: [] });
	
	// Helper to get current state
	function getCurrentState(): GameState {
		let currentState: GameState = { players: [] };
		subscribe((state) => {
			currentState = state;
		})();
		return currentState;
	}

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
			// Save current game results to history before clearing
			const currentState = getCurrentState();
			if (currentState.players.length > 0) {
				const results: GameResult[] = currentState.players.map((player) => ({
					playerName: player.name,
					total: calculateTotal(player)
				}));

				// Only save if at least one player has a score
				const hasScores = results.some((r) => r.total > 0);
				if (hasScores) {
					const now = new Date();
					const historyEntry: GameHistoryEntry = {
						id: crypto.randomUUID(),
						date: now.toISOString().split('T')[0], // YYYY-MM-DD
						timestamp: now.toISOString(),
						results
					};
					saveGameHistory(historyEntry);
				}
			}

			// Retain players but clear their scores
			const newState = {
				players: currentState.players.map((player) => ({
					...player,
					scores: {}
				}))
			};
			// If no players exist, create one default player
			if (newState.players.length === 0) {
				newState.players = [{ id: crypto.randomUUID(), name: 'Player 1', scores: {} }];
			}
			saveGameState(newState);
			set(newState);
		},
		reorderPlayers: (newOrder: Player[]) => {
			const newState = { players: newOrder };
			saveGameState(newState);
			set(newState);
		},
		clearScoreboard: () => {
			// Reset to one default player (startup state)
			const newState = {
				players: [{ id: crypto.randomUUID(), name: 'Player 1', scores: {} }]
			};
			saveGameState(newState);
			set(newState);
		}
	};
}

export const gameStore = createGameStore();

