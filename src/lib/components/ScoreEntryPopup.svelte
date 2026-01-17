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

	let possibleValues = $derived(getPossibleValues(category));
	let useNumberPad = $derived(possibleValues === null || possibleValues.length > 9);

	function handleValueSelect(value: number) {
		onSetScore(value);
	}

	function handleNumberPadInput(digit: string) {
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
		if (!isNaN(value) && value >= 0) {
			onSetScore(value);
			numberPadValue = '';
		}
	}

	function handleSkip() {
		onSetScore(null);
	}

	function handleUnskip() {
		// To unskip, we pass undefined which removes the score from the record
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

			{#if useNumberPad}
				<!-- Number pad for arbitrary values -->
				<div class="number-pad-container">
					<div class="number-display">{numberPadValue || '0'}</div>
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

	.btn-cancel {
		background: #dc3545;
		color: white;
	}

	.btn-cancel:hover {
		background: #c82333;
	}
</style>

