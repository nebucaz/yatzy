import type { Player, ScoreCategory } from '../types';
import { BONUS_THRESHOLD, BONUS_POINTS } from '../types';

export function calculateTopSectionTotal(player: Player): number {
	const topCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
	return topCategories.reduce((sum, category) => {
		const score = player.scores[category];
		return sum + (score ?? 0);
	}, 0);
}

export function calculateBonus(player: Player): number | null {
	const topTotal = calculateTopSectionTotal(player);
	return topTotal >= BONUS_THRESHOLD ? BONUS_POINTS : null;
}

export function calculateTotal(player: Player): number {
	let total = 0;

	// Add top section scores
	const topCategories: ScoreCategory[] = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'];
	topCategories.forEach((category) => {
		const score = player.scores[category];
		if (score !== undefined && score !== null) {
			total += score;
		}
	});

	// Add bonus if applicable
	const bonus = calculateBonus(player);
	if (bonus !== null) {
		total += bonus;
	}

	// Add bottom section scores
	const bottomCategories: ScoreCategory[] = [
		'onePair',
		'twoPairs',
		'threeOfAKind',
		'fourOfAKind',
		'smallStraight',
		'largeStraight',
		'fullHouse',
		'chance',
		'yatzy'
	];
	bottomCategories.forEach((category) => {
		const score = player.scores[category];
		if (score !== undefined && score !== null) {
			total += score;
		}
	});

	return total;
}

