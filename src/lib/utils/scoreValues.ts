import type { ScoreCategory } from '../types';

/**
 * Calculates the possible values that can be entered for a given score category.
 * Returns an array of allowed values, or null if arbitrary values are allowed (>9 options).
 */
export function getPossibleValues(category: ScoreCategory): number[] | null {
	switch (category) {
		case 'ones':
			return [1, 2, 3, 4, 5];
		case 'twos':
			return [2, 4, 6, 8, 10];
		case 'threes':
			return [3, 6, 9, 12, 15];
		case 'fours':
			return [4, 8, 12, 16, 20];
		case 'fives':
			return [5, 10, 15, 20, 25];
		case 'sixes':
			return [6, 12, 18, 24, 30];
		case 'onePair':
			// One pair: 2, 4, 6, 8, 10, 12
			return [2, 4, 6, 8, 10, 12];
		case 'twoPairs':
			// Two pairs: predefined values 6,8,10,12,14,16,18,20,22
			return [6, 8, 10, 12, 14, 16, 18, 20, 22];
		case 'threeOfAKind':
			// Three of a kind: 3, 6, 9, 12, 15, 18
			return [3, 6, 9, 12, 15, 18];
		case 'fourOfAKind':
			// Four of a kind: 4, 8, 12, 16, 20, 24
			return [4, 8, 12, 16, 20, 24];
		case 'yatzy':
			// Yatzy: 50
			return [50];
		case 'smallStraight':
			// Small straight: fixed value 15
			return [15];
		case 'largeStraight':
			// Large straight: fixed value 25
			return [25];
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

