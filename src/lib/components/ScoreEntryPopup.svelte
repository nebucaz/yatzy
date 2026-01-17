<script lang="ts">
	import type { ScoreCategory } from '../types';
	import { getPossibleValues } from '../utils/scoreValues';
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';

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
	let useMultipliers = $derived(['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(category));
	let useNumberPad = $derived(possibleValues === null && !useDiceIcons && !useMultipliers);
	let isChance = $derived(category === 'chance');
	
	let validationError = $state('');

	// Dice icons: ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
	const diceIcons = [
		{ value: 1, icon: '⚀' },
		{ value: 2, icon: '⚁' },
		{ value: 3, icon: '⚂' },
		{ value: 4, icon: '⚃' },
		{ value: 5, icon: '⚄' },
		{ value: 6, icon: '⚅' }
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

	function handleMultiplierSelect(multiplier: number) {
		const calculatedValue = calculateMultiplierValue(multiplier, category);
		onSetScore(calculatedValue);
	}

	function handleValueSelect(value: number) {
		onSetScore(value);
	}

	function handleNumberPadInput(digit: string) {
		validationError = ''; // Clear validation error on input
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
								<span class="dice-icon-large">{dice.icon}</span>
							</button>
						{/each}
					</div>
					<div class="dice-help-text">
						{#if category === 'onePair'}
							Select a dice value (value = dice × 2)
						{:else if category === 'threeOfAKind'}
							Select a dice value (value = dice × 3)
						{:else if category === 'fourOfAKind'}
							Select a dice value (value = dice × 4)
						{/if}
					</div>
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
						Select a multiplier (value = {getCategoryBaseValue(category)} × multiplier)
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
						<button class="num-btn" onclick={() => handleNumberPadInput('1')}>1</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('2')}>2</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('3')}>3</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('4')}>4</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('5')}>5</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('6')}>6</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('7')}>7</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('8')}>8</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('9')}>9</button>
						<button class="num-btn" onclick={() => handleNumberPadInput('0')}>0</button>
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

	.num-btn:hover {
		background: #f0f0f0;
		border-color: #007bff;
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

	.dice-icon-btn:hover {
		background: #007bff;
		transform: scale(1.05);
	}

	.dice-icon-large {
		font-size: 4rem;
		line-height: 1;
	}

	.dice-help-text {
		text-align: center;
		font-size: 0.9rem;
		color: #6c757d;
		margin-top: 0.5rem;
	}

	.multipliers-container {
		margin-bottom: 1rem;
	}

	.multipliers {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.multiplier-btn {
		padding: 1rem;
		font-size: 1.5rem;
		font-weight: 600;
		border: 2px solid #007bff;
		background: white;
		color: #007bff;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s;
		min-height: 70px;
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

