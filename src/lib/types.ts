export type ScoreCategory =
	| 'ones'
	| 'twos'
	| 'threes'
	| 'fours'
	| 'fives'
	| 'sixes'
	| 'bonus'
	| 'onePair'
	| 'twoPairs'
	| 'threeOfAKind'
	| 'fourOfAKind'
	| 'smallStraight'
	| 'largeStraight'
	| 'fullHouse'
	| 'chance'
	| 'yatzy';

export interface Player {
	id: string;
	name: string;
	scores: Partial<Record<ScoreCategory, number | null>>;
}

export interface GameState {
	players: Player[];
}

export interface GameResult {
	playerName: string;
	total: number;
}

export interface GameHistoryEntry {
	id: string;
	date: string; // ISO date string
	timestamp: string; // ISO timestamp string
	results: GameResult[];
}

// Note: Labels are now handled by translations
// This array defines the structure and order of categories
export const SCORE_CATEGORIES: { key: ScoreCategory | 'summary' }[] = [
	{ key: 'ones' },
	{ key: 'twos' },
	{ key: 'threes' },
	{ key: 'fours' },
	{ key: 'fives' },
	{ key: 'sixes' },
	{ key: 'summary' },
	{ key: 'bonus' },
	{ key: 'onePair' },
	{ key: 'twoPairs' },
	{ key: 'threeOfAKind' },
	{ key: 'fourOfAKind' },
	{ key: 'smallStraight' },
	{ key: 'largeStraight' },
	{ key: 'fullHouse' },
	{ key: 'chance' },
	{ key: 'yatzy' }
];

export const BONUS_THRESHOLD = 63;
export const BONUS_POINTS = 25;
