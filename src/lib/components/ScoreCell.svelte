<script lang="ts">
	import type { ScoreCategory } from '../types';

	interface PlayerColor {
		header: string;
		cell: string;
		text: string;
	}

	interface Props {
		score?: number | null;
		category: ScoreCategory;
		isBonus?: boolean;
		isEditable?: boolean;
		playerColor?: PlayerColor | null;
		onClick: () => void;
	}

	let { score, category, isBonus = false, isEditable = true, playerColor = null, onClick }: Props =
		$props();

	// Distinguish between empty (undefined) and skipped (null)
	let isEmpty = $derived(score === undefined);
	let isSkipped = $derived(score === null);
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
		class:skipped={isSkipped}
		class:bonus={isBonus}
		class:has-player-color={playerColor !== null}
		style={playerColor ? `background-color: ${playerColor.cell}; color: ${playerColor.text};` : ''}
		onclick={onClick}
		onkeydown={handleCellKeydown}
		role="button"
		tabindex="0"
	>
		<div class="score-value">
			{#if isSkipped}
				<span class="skipped-indicator">—</span>
			{:else}
				{displayValue}
			{/if}
		</div>
	</div>
{:else}
	<div
		class="score-cell"
		class:empty={isEmpty}
		class:skipped={isSkipped}
		class:bonus={isBonus}
		class:non-editable={true}
		class:has-player-color={playerColor !== null}
		style={playerColor ? `background-color: ${playerColor.cell}; color: ${playerColor.text};` : ''}
	>
		<div class="score-value">
			{#if isSkipped}
				<span class="skipped-indicator">—</span>
			{:else}
				{displayValue}
			{/if}
		</div>
	</div>
{/if}

<style>
	.score-cell {
		padding: 0.5rem;
		border: 1px solid #ddd;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		background: transparent;
		box-sizing: border-box;
	}

	.score-cell:hover {
		background: #f5f5f5;
	}

	.score-cell.empty {
		background: transparent;
	}

	.score-cell.empty:hover {
		background: #f5f5f5;
	}

	.score-cell.has-player-color:hover {
		opacity: 0.9;
	}

	.score-cell.skipped {
		border: 1px solid #ddd;
	}

	.score-cell.skipped:hover {
		opacity: 0.9;
	}

	.skipped-indicator {
		font-weight: 600;
		font-size: 1.2em;
	}

	.score-cell.bonus {
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

