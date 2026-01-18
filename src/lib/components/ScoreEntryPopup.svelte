<script lang="ts">
	import type { ScoreCategory } from '../types';
	import { getPossibleValues } from '../utils/scoreValues';
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';
	import dice1 from '../assets/dice-1.svg';
	import dice2 from '../assets/dice-2.svg';
	import dice3 from '../assets/dice-3.svg';
	import dice4 from '../assets/dice-4.svg';
	import dice5 from '../assets/dice-5.svg';
	import dice6 from '../assets/dice-6.svg';

	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	interface Props {
		isOpen: boolean;
		category: ScoreCategory;
		categoryLabel: string;
		currentScore: number | null | undefined;
		onSetScore: (score: number | null | undefined) => void;
		onCancel: () => void;
	}

	let { isOpen, category, categoryLabel, currentScore, onSetScore, onCancel }: Props =
		$props();

	let numberPadValue = $state('');
	// A score is "skipped" if it's explicitly set to null (not undefined)
	let isSkipped = $derived(currentScore === null);
	// A score has a value if it's a number (not undefined, not null)
	let hasValue = $derived(typeof currentScore === 'number');

	let possibleValues = $derived(getPossibleValues(category));
	
	// Determine entry mode
	let useDiceIcons = $derived(['onePair', 'threeOfAKind', 'fourOfAKind'].includes(category));
	let useTwoPairs = $derived(category === 'twoPairs');
	let useFullHouse = $derived(category === 'fullHouse');
	let useMultipliers = $derived(['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(category));
	let useNumberPad = $derived(possibleValues === null && !useDiceIcons && !useMultipliers && !useTwoPairs && !useFullHouse);
	let isChance = $derived(category === 'chance');
	
	let validationError = $state('');
	
	// Two pairs: track selected dice in upper and lower rows
	let twoPairsUpperDice = $state<number | null>(null);
	let twoPairsLowerDice = $state<number | null>(null);
	
	// Full house: track selected dice for pair (upper) and three of a kind (lower)
	let fullHousePairDice = $state<number | null>(null);
	let fullHouseThreeDice = $state<number | null>(null);

	// Dice icons: SVG files
	const diceIcons = [
		{ value: 1, icon: dice1 },
		{ value: 2, icon: dice2 },
		{ value: 3, icon: dice3 },
		{ value: 4, icon: dice4 },
		{ value: 5, icon: dice5 },
		{ value: 6, icon: dice6 }
	];

	// Multipliers: 1x, 2x, 3x, 4x, 5x
	const multipliers = [1, 2, 3, 4, 5];

	// Get base value for multiplier calculation
	function getCategoryBaseValue(category: ScoreCategory): number {
		switch (category) {
			case 'ones': return 1;
			case 'twos': return 2;
			case 'threes': return 3;
			case 'fours': return 4;
			case 'fives': return 5;
			case 'sixes': return 6;
			default: return 0;
		}
	}

	// Calculate value for dice icon selection
	function calculateDiceValue(diceValue: number, category: ScoreCategory): number {
		switch (category) {
			case 'onePair':
				return diceValue * 2;
			case 'threeOfAKind':
				return diceValue * 3;
			case 'fourOfAKind':
				return diceValue * 4;
			default:
				return 0;
		}
	}

	// Calculate value for multiplier selection
	function calculateMultiplierValue(multiplier: number, category: ScoreCategory): number {
		const baseValue = getCategoryBaseValue(category);
		return baseValue * multiplier;
	}

	function handleDiceIconSelect(diceValue: number) {
		const calculatedValue = calculateDiceValue(diceValue, category);
		onSetScore(calculatedValue);
	}

	function handleTwoPairsUpperSelect(diceValue: number) {
		// Can't select if this dice is already selected in the lower row
		if (twoPairsLowerDice === diceValue) {
			return;
		}
		twoPairsUpperDice = diceValue;
		// Reset lower selection if it's the same as the new upper selection (shouldn't happen due to check above, but keep for safety)
		if (twoPairsLowerDice === diceValue) {
			twoPairsLowerDice = null;
		}
	}

	function handleTwoPairsLowerSelect(diceValue: number) {
		if (twoPairsUpperDice === null) return; // Can't select lower without upper
		if (diceValue === twoPairsUpperDice) return; // Can't select same as upper
		
		twoPairsLowerDice = diceValue;
		
		// If upper selection matches the lower selection, reset upper (shouldn't happen due to disabled state, but keep for safety)
		if (twoPairsUpperDice === diceValue) {
			twoPairsUpperDice = null;
			return;
		}
		
		// Calculate and set score: 2(a+b)
		const calculatedValue = 2 * (twoPairsUpperDice + diceValue);
		onSetScore(calculatedValue);
	}

	function handleFullHousePairSelect(diceValue: number) {
		// Can't select if this dice is already selected in the three of a kind row
		if (fullHouseThreeDice === diceValue) {
			return;
		}
		fullHousePairDice = diceValue;
		// Reset three of a kind selection if it's the same as the new pair selection (shouldn't happen due to check above, but keep for safety)
		if (fullHouseThreeDice === diceValue) {
			fullHouseThreeDice = null;
		}
	}

	function handleFullHouseThreeSelect(diceValue: number) {
		if (fullHousePairDice === null) return; // Can't select three of a kind without pair
		if (diceValue === fullHousePairDice) return; // Can't select same as pair
		
		fullHouseThreeDice = diceValue;
		
		// If pair selection matches the three of a kind selection, reset pair (shouldn't happen due to disabled state, but keep for safety)
		if (fullHousePairDice === diceValue) {
			fullHousePairDice = null;
			return;
		}
		
		// Calculate and set score: 2 * pairValue + 3 * threeOfAKindValue
		const calculatedValue = 2 * fullHousePairDice + 3 * diceValue;
		onSetScore(calculatedValue);
	}

	function handleMultiplierSelect(multiplier: number) {
		const calculatedValue = calculateMultiplierValue(multiplier, category);
		onSetScore(calculatedValue);
	}

	function handleValueSelect(value: number) {
		onSetScore(value);
	}

	function isDigitAllowed(digit: string): boolean {
		if (!isChance || digit === 'backspace' || digit === 'clear') {
			return true;
		}
		
		// After 2 digits are entered, all numbers are disabled
		if (numberPadValue.length >= 2) {
			return false;
		}
		
		if (numberPadValue === '') {
			// No number entered: disable 4 (too small as single digit, too big as first digit of two-digit number)
			// Enable 0-3 and 5-9
			return digit !== '4';
		}
		
		const firstDigit = numberPadValue[0];
		const firstDigitNum = parseInt(firstDigit, 10);
		
		if (firstDigitNum >= 0 && firstDigitNum <= 2) {
			// First digit is 0-2: all digits enabled
			return true;
		}
		
		if (firstDigitNum === 3) {
			// First digit is 3: only 0 is enabled
			return digit === '0';
		}
		
		// First digit is >3: all digits disabled
		return false;
	}

	function handleNumberPadInput(digit: string) {
		validationError = ''; // Clear validation error on input
		
		// Check if digit is allowed for chance category
		if (!isDigitAllowed(digit)) {
			return;
		}
		
		if (digit === 'backspace') {
			numberPadValue = numberPadValue.slice(0, -1);
		} else if (digit === 'clear') {
			numberPadValue = '';
		} else {
			numberPadValue += digit;
		}
	}

	function handleNumberPadConfirm() {
		const value = parseInt(numberPadValue, 10);
		if (isNaN(value)) {
			validationError = 'Please enter a valid number';
			return;
		}
		
		// Validate chance entry (5-30 range)
		if (isChance) {
			if (value < 5 || value > 30) {
				validationError = 'Chance value must be between 5 and 30';
				return;
			}
		} else if (value < 0) {
			validationError = 'Value must be 0 or greater';
			return;
		}
		
		onSetScore(value);
		numberPadValue = '';
		validationError = '';
	}

	function handleSkip() {
		onSetScore(null);
	}

	function handleUnskip() {
		// To unskip, we pass undefined which removes the score from the record
		onSetScore(undefined);
	}

	function handleClearValue() {
		// Clear the entered value by setting it to undefined
		onSetScore(undefined);
	}

	function handleCancel() {
		numberPadValue = '';
		onCancel();
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}

	$effect(() => {
		if (isOpen) {
			numberPadValue = '';
			twoPairsUpperDice = null;
			twoPairsLowerDice = null;
			fullHousePairDice = null;
			fullHouseThreeDice = null;
		}
	});
</script>

{#if isOpen}
	<div
		class="popup-overlay"
		onclick={handleCancel}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="popup-title"
		tabindex="-1"
	>
		<div class="popup" onclick={(e) => e.stopPropagation()} role="none">
			<h3 id="popup-title">{categoryLabel}</h3>

			{#if useDiceIcons}
				<!-- Dice icon selection for one pair, three of a kind, four of a kind -->
				<div class="dice-icons-container">
					<div class="dice-icons">
						{#each diceIcons as dice}
							<button
								class="dice-icon-btn"
								onclick={() => handleDiceIconSelect(dice.value)}
								title={dice.value.toString()}
							>
								<img src={dice.icon} alt={`Dice ${dice.value}`} class="dice-icon-large" />
							</button>
						{/each}
					</div>
					<div class="dice-help-text">
						{#if category === 'onePair'}
							{t('diceHelpOnePair', currentLang)}
						{:else if category === 'threeOfAKind'}
							{t('diceHelpThreeOfAKind', currentLang)}
						{:else if category === 'fourOfAKind'}
							{t('diceHelpFourOfAKind', currentLang)}
						{/if}
					</div>
				</div>
			{:else if useTwoPairs}
				<!-- Two pairs: two rows of dice selection -->
				<div class="two-pairs-container">
					<div class="two-pairs-row">
						<div class="two-pairs-label">{t('firstPair', currentLang)}</div>
						<div class="dice-icons">
							{#each diceIcons as dice}
								{@const isDisabled = dice.value === twoPairsLowerDice}
								<button
									class="dice-icon-btn"
									class:selected={twoPairsUpperDice === dice.value}
									disabled={isDisabled}
									onclick={() => handleTwoPairsUpperSelect(dice.value)}
									title={dice.value.toString()}
								>
									<img src={dice.icon} alt={`Dice ${dice.value}`} class="dice-icon-large" />
								</button>
							{/each}
						</div>
					</div>
					<div class="two-pairs-row">
						<div class="two-pairs-label">{t('secondPair', currentLang)}</div>
						<div class="dice-icons">
							{#each diceIcons as dice}
								{@const isDisabled = twoPairsUpperDice === null || dice.value === twoPairsUpperDice}
								<button
									class="dice-icon-btn"
									class:selected={twoPairsLowerDice === dice.value}
									disabled={isDisabled}
									onclick={() => handleTwoPairsLowerSelect(dice.value)}
									title={dice.value.toString()}
								>
									<img src={dice.icon} alt={`Dice ${dice.value}`} class="dice-icon-large" />
								</button>
							{/each}
						</div>
					</div>
					{#if twoPairsUpperDice !== null && twoPairsLowerDice !== null}
						<div class="two-pairs-result">
							{t('twoPairsResult', currentLang).replace('{0}', (2 * (twoPairsUpperDice + twoPairsLowerDice)).toString())}
						</div>
					{/if}
				</div>
			{:else if useFullHouse}
				<!-- Full house: two rows of dice selection (pair + three of a kind) -->
				<div class="two-pairs-container">
					<div class="two-pairs-row">
						<div class="two-pairs-label">{t('fullHousePair', currentLang)}</div>
						<div class="dice-icons">
							{#each diceIcons as dice}
								{@const isDisabled = dice.value === fullHouseThreeDice}
								<button
									class="dice-icon-btn"
									class:selected={fullHousePairDice === dice.value}
									disabled={isDisabled}
									onclick={() => handleFullHousePairSelect(dice.value)}
									title={dice.value.toString()}
								>
									<img src={dice.icon} alt={`Dice ${dice.value}`} class="dice-icon-large" />
								</button>
							{/each}
						</div>
					</div>
					<div class="two-pairs-row">
						<div class="two-pairs-label">{t('fullHouseThree', currentLang)}</div>
						<div class="dice-icons">
							{#each diceIcons as dice}
								{@const isDisabled = fullHousePairDice === null || dice.value === fullHousePairDice}
								<button
									class="dice-icon-btn"
									class:selected={fullHouseThreeDice === dice.value}
									disabled={isDisabled}
									onclick={() => handleFullHouseThreeSelect(dice.value)}
									title={dice.value.toString()}
								>
									<img src={dice.icon} alt={`Dice ${dice.value}`} class="dice-icon-large" />
								</button>
							{/each}
						</div>
					</div>
					{#if fullHousePairDice !== null && fullHouseThreeDice !== null}
						<div class="two-pairs-result">
							{t('fullHouseResult', currentLang).replace('{0}', (2 * fullHousePairDice + 3 * fullHouseThreeDice).toString())}
						</div>
					{/if}
				</div>
			{:else if useMultipliers}
				<!-- Multiplier selection for ones, twos, threes, fours, fives, sixes -->
				<div class="multipliers-container">
					<div class="multipliers">
						{#each multipliers as mult}
							<button
								class="multiplier-btn"
								onclick={() => handleMultiplierSelect(mult)}
							>
								{mult}×
							</button>
						{/each}
					</div>
					<div class="multiplier-help-text">
						{t('multiplierHelp', currentLang).replace('{0}', getCategoryBaseValue(category).toString())}
					</div>
				</div>
			{:else if useNumberPad}
				<!-- Number pad for arbitrary values (chance, bonus, etc.) -->
				<div class="number-pad-container">
					<div class="number-display">{numberPadValue || '0'}</div>
					{#if validationError}
						<div class="validation-error">{validationError}</div>
					{/if}
					{#if isChance}
						<div class="chance-hint">Enter a value between 5 and 30</div>
					{/if}
					<div class="number-pad">
						<button class="num-btn" disabled={!isDigitAllowed('1')} onclick={() => handleNumberPadInput('1')}>1</button>
						<button class="num-btn" disabled={!isDigitAllowed('2')} onclick={() => handleNumberPadInput('2')}>2</button>
						<button class="num-btn" disabled={!isDigitAllowed('3')} onclick={() => handleNumberPadInput('3')}>3</button>
						<button class="num-btn" disabled={!isDigitAllowed('4')} onclick={() => handleNumberPadInput('4')}>4</button>
						<button class="num-btn" disabled={!isDigitAllowed('5')} onclick={() => handleNumberPadInput('5')}>5</button>
						<button class="num-btn" disabled={!isDigitAllowed('6')} onclick={() => handleNumberPadInput('6')}>6</button>
						<button class="num-btn" disabled={!isDigitAllowed('7')} onclick={() => handleNumberPadInput('7')}>7</button>
						<button class="num-btn" disabled={!isDigitAllowed('8')} onclick={() => handleNumberPadInput('8')}>8</button>
						<button class="num-btn" disabled={!isDigitAllowed('9')} onclick={() => handleNumberPadInput('9')}>9</button>
						<button class="num-btn" disabled={!isDigitAllowed('0')} onclick={() => handleNumberPadInput('0')}>0</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('backspace')}>
							⌫
						</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('clear')}>C</button>
					</div>
					<button class="confirm-btn" onclick={handleNumberPadConfirm}>{t('confirm', currentLang)}</button>
				</div>
			{:else if possibleValues}
				<!-- Value buttons for limited options -->
				<div class="value-buttons">
					{#each possibleValues as value}
						<button
							class="value-btn"
							onclick={() => handleValueSelect(value)}
						>
							{value}
						</button>
					{/each}
				</div>
			{/if}

			<div class="popup-actions">
				{#if isSkipped}
					<button class="btn btn-unskip" onclick={handleUnskip}>{t('unskip', currentLang)}</button>
				{:else if hasValue}
					<button class="btn btn-clear-value" onclick={handleClearValue}>{t('clearValue', currentLang)}</button>
					<button class="btn btn-skip" onclick={handleSkip}>{t('skip', currentLang)}</button>
				{:else}
					<button class="btn btn-skip" onclick={handleSkip}>{t('skip', currentLang)}</button>
				{/if}
				<button class="btn btn-cancel" onclick={handleCancel}>{t('cancel', currentLang)}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.popup {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.popup h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		text-align: center;
	}

	.value-buttons {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.value-btn {
		padding: 0.75rem;
		font-size: 1.1rem;
		font-weight: 600;
		border: 2px solid #007bff;
		background: white;
		color: #007bff;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.value-btn:hover {
		background: #007bff;
		color: white;
	}

	.number-pad-container {
		margin-bottom: 1rem;
	}

	.number-display {
		text-align: center;
		font-size: 2rem;
		font-weight: 700;
		padding: 1rem;
		background: #f8f9fa;
		border: 2px solid #ddd;
		border-radius: 4px;
		margin-bottom: 1rem;
		min-height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.number-pad {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.num-btn {
		padding: 0.75rem;
		font-size: 1.2rem;
		font-weight: 600;
		border: 1px solid #ddd;
		background: white;
		color: #333;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.num-btn:hover:not(:disabled) {
		background: #f0f0f0;
		border-color: #007bff;
	}

	.num-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		background: #e9ecef;
		color: #6c757d;
	}

	.confirm-btn {
		width: 100%;
		padding: 0.75rem;
		font-size: 1.1rem;
		font-weight: 600;
		border: none;
		background: #28a745;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}

	.confirm-btn:hover {
		background: #218838;
	}

	.popup-actions {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		flex: 1;
	}

	.btn-skip {
		background: #6c757d;
		color: white;
	}

	.btn-skip:hover {
		background: #5a6268;
	}

	.btn-unskip {
		background: #ffc107;
		color: #000;
	}

	.btn-unskip:hover {
		background: #e0a800;
	}

	.btn-clear-value {
		background: #ff9800;
		color: white;
	}

	.btn-clear-value:hover {
		background: #f57c00;
	}

	.btn-cancel {
		background: #dc3545;
		color: white;
	}

	.btn-cancel:hover {
		background: #c82333;
	}

	.dice-icons-container {
		margin-bottom: 1rem;
	}

	.dice-icons {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		margin-bottom: 0.5rem;
	}

	.dice-icon-btn {
		padding: 0.1rem;
		font-size: 2rem;
		border: 2px solid #007bff;
		background: white;
		color: #007bff;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: auto;
	}

	.dice-icon-btn:hover:not(:disabled) {
		background: #007bff;
		transform: scale(1.05);
	}

	.dice-icon-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		border-color: #adb5bd;
		background: #e9ecef;
	}

	.dice-icon-large {
		width: 4rem;
		height: 4rem;
		object-fit: contain;
		filter: brightness(0) saturate(100%) invert(27%) sepia(96%) saturate(7500%) hue-rotate(210deg) brightness(100%) contrast(100%);
	}

	.dice-icon-btn:hover:not(:disabled) .dice-icon-large {
		filter: brightness(0) saturate(100%) invert(100%);
	}

	.dice-icon-btn:disabled .dice-icon-large {
		filter: brightness(0) saturate(0%) invert(50%);
		opacity: 0.5;
	}

	.dice-help-text {
		text-align: center;
		font-size: 0.9rem;
		color: #6c757d;
		margin-top: 0.5rem;
	}

	.two-pairs-container {
		margin-bottom: 1rem;
	}

	.two-pairs-row {
		margin-bottom: 1rem;
	}

	.two-pairs-label {
		font-weight: 600;
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
		color: #333;
		text-align: center;
	}

	.two-pairs-result {
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
		color: #007bff;
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #f0f8ff;
		border-radius: 4px;
	}

	.dice-icon-btn.selected {
		background: #007bff;
		border-color: #0056b3;
		box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
	}

	.dice-icon-btn.selected .dice-icon-large {
		filter: brightness(0) saturate(100%) invert(100%);
	}

	.multipliers-container {
		margin-bottom: 1rem;
	}

	.multipliers {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.multiplier-btn {
		padding: 0.75rem;
		font-size: 1.3rem;
		font-weight: 600;
		border: 2px solid #007bff;
		background: white;
		color: #007bff;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		min-height: 60px;
		width: 100%;
	}

	@media (max-width: 480px) {
		.multiplier-btn {
			padding: 0.6rem;
			font-size: 1.1rem;
			min-height: 55px;
		}
	}

	@media (max-width: 360px) {
		.multipliers {
			grid-template-columns: repeat(2, 1fr);
		}
		.multiplier-btn {
			padding: 0.5rem;
			font-size: 1rem;
			min-height: 50px;
		}
	}

	.multiplier-btn:hover {
		background: #007bff;
		color: white;
		transform: scale(1.05);
	}

	.multiplier-help-text {
		text-align: center;
		font-size: 0.9rem;
		color: #6c757d;
		margin-top: 0.5rem;
	}

	.validation-error {
		color: #dc3545;
		font-size: 0.9rem;
		text-align: center;
		margin-bottom: 0.5rem;
		padding: 0.5rem;
		background: #f8d7da;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
	}

	.chance-hint {
		text-align: center;
		font-size: 0.85rem;
		color: #6c757d;
		margin-bottom: 0.5rem;
		font-style: italic;
	}
</style>

