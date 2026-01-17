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

export const SCORE_CATEGORIES: { key: ScoreCategory | 'summary'; label: string }[] = [
	{ key: 'ones', label: 'Ones' },
	{ key: 'twos', label: 'Twos' },
	{ key: 'threes', label: 'Threes' },
	{ key: 'fours', label: 'Fours' },
	{ key: 'fives', label: 'Fives' },
	{ key: 'sixes', label: 'Sixes' },
	{ key: 'summary', label: 'Sum' },
	{ key: 'bonus', label: 'Bonus' },
	{ key: 'onePair', label: 'One Pair' },
	{ key: 'twoPairs', label: 'Two Pairs' },
	{ key: 'threeOfAKind', label: 'Three of a Kind' },
	{ key: 'fourOfAKind', label: 'Four of a Kind' },
	{ key: 'smallStraight', label: 'Small Straight' },
	{ key: 'largeStraight', label: 'Large Straight' },
	{ key: 'fullHouse', label: 'Full House' },
	{ key: 'chance', label: 'Chance' },
	{ key: 'yatzy', label: 'Yatzy' }
];

export const BONUS_THRESHOLD = 63;
export const BONUS_POINTS = 35;
