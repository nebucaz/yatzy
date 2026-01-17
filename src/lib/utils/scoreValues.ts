import type { ScoreCategory } from '../types';

/**
 * Calculates the possible values that can be entered for a given score category.
 * Returns an array of allowed values, or null if arbitrary values are allowed (>9 options).
 */
export function getPossibleValues(category: ScoreCategory): number[] | null {
	switch (category) {
		case 'ones':
		case 'twos':
		case 'threes':
		case 'fours':
		case 'fives':
		case 'sixes':
			// These use multiplier entry mode (1x, 2x, 3x, 4x, 5x)
			return null;
		case 'onePair':
		case 'threeOfAKind':
		case 'fourOfAKind':
			// These use dice icon entry mode (⚀ ⚁ ⚂ ⚃ ⚄ ⚅)
			return null;
		case 'twoPairs':
			// Two pairs: predefined values 6,8,10,12,14,16,18,20,22
			return [6, 8, 10, 12, 14, 16, 18, 20, 22];
		case 'yatzy':
			// Yatzy: 50
			return [50];
		case 'smallStraight':
			// Small straight: fixed value 15
			return [15];
		case 'largeStraight':
			// Large straight: fixed value 25
			return [20];
		case 'fullHouse':
			// Full house: predefined values 7,8,9,11,12,13,14,15,16,17,18,19,20,21,22,23,24,26,27,28
			return [7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28];
		case 'chance':
		case 'bonus':
			// These categories allow arbitrary values (use number pad)
			return null;
		default:
			return null;
	}
}

