<script lang="ts">
	import type { ScoreCategory } from '../types';

	interface Props {
		score?: number | null;
		category: ScoreCategory;
		isBonus?: boolean;
		isEditable?: boolean;
		onClick: () => void;
	}

	let { score, category, isBonus = false, isEditable = true, onClick }: Props = $props();

	let isEmpty = $derived(score === undefined || score === null);
	let displayValue = $derived(
		isBonus && score === null ? '-' : score?.toString() || ''
	);

	function handleCellKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onClick();
		}
	}
</script>

{#if isEditable}
	<div
		class="score-cell"
		class:empty={isEmpty}
		class:bonus={isBonus}
		onclick={onClick}
		onkeydown={handleCellKeydown}
		role="button"
		tabindex="0"
	>
		<div class="score-value">{displayValue}</div>
	</div>
{:else}
	<div
		class="score-cell"
		class:empty={isEmpty}
		class:bonus={isBonus}
		class:non-editable={true}
	>
		<div class="score-value">{displayValue}</div>
	</div>
{/if}

<style>
	.score-cell {
		padding: 0.5rem;
		border: 1px solid #ddd;
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background: white;
	}

	.score-cell:hover {
		background: #f5f5f5;
	}

	.score-cell.empty {
		background: #fff3cd;
	}

	.score-cell.empty:hover {
		background: #ffeaa7;
	}

	.score-cell.bonus {
		background: #e7f3ff;
		font-weight: 600;
	}

	.score-cell.non-editable {
		cursor: default;
	}

	.score-cell.non-editable:hover {
		background: inherit;
	}

	.score-value {
		text-align: center;
	}
</style>

