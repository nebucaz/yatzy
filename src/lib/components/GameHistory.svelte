<script lang="ts">
	import { onMount } from 'svelte';
	import { loadGameHistory, clearGameHistory } from '../utils/historyStorage';
	import type { GameHistoryEntry } from '../types';
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';
	import ClearDialog from './ClearDialog.svelte';

	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	let history = $state<GameHistoryEntry[]>([]);
	let showDeleteDialog = $state(false);

	function loadHistory() {
		const loaded = loadGameHistory();
		// Create a new sorted array instead of mutating
		history = [...loaded].sort(
			(a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
		);
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString();
	}

	function formatTime(timestamp: string): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString();
	}

	// Load history on mount
	onMount(() => {
		loadHistory();
	});

	// Expose reload function for parent component
	export function reload() {
		loadHistory();
	}

	function handleDeleteClick() {
		showDeleteDialog = true;
	}

	function handleDeleteConfirm() {
		clearGameHistory();
		loadHistory();
		showDeleteDialog = false;
	}

	function handleDeleteCancel() {
		showDeleteDialog = false;
	}
</script>

{#if history.length > 0}
	<div class="game-history">
		<div class="history-header">
			<h2>{t('gameHistory', currentLang)}</h2>
			<button class="btn btn-delete" onclick={handleDeleteClick}>{t('deleteHistory', currentLang)}</button>
		</div>
		<div class="history-table-container">
			<table class="history-table">
				<thead>
					<tr>
						<th class="date-col">{t('date', currentLang)}</th>
						<th class="time-col">{t('time', currentLang)}</th>
						{#if history.length > 0}
							{#each history[0].results as result, index (index)}
								<th class="player-col">{result.playerName}</th>
							{/each}
						{/if}
					</tr>
				</thead>
				<tbody>
					{#each history as entry (entry.id)}
						<tr>
							<td class="date-cell">{formatDate(entry.date)}</td>
							<td class="time-cell">{formatTime(entry.timestamp)}</td>
							{#each entry.results as result (result.playerName)}
								<td class="score-cell">{result.total}</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<ClearDialog
			isOpen={showDeleteDialog}
			title={t('deleteGameHistory', currentLang)}
			message={t('deleteHistoryConfirmation', currentLang)}
			confirmText={t('delete', currentLang)}
			onConfirm={handleDeleteConfirm}
			onCancel={handleDeleteCancel}
		/>
	</div>
{/if}

<style>
	.game-history {
		margin-top: 2rem;
		padding: 1rem;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.game-history h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.btn-delete {
		background: #dc3545;
		color: white;
	}

	.btn-delete:hover {
		background: #c82333;
	}

	.history-table-container {
		overflow-x: auto;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.history-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	.history-table thead {
		background: #f8f9fa;
	}

	.history-table th {
		padding: 0.75rem;
		text-align: left;
		font-weight: 600;
		border: 1px solid #ddd;
	}

	.date-col {
		min-width: 100px;
	}

	.time-col {
		min-width: 100px;
	}

	.player-col {
		min-width: 120px;
	}

	.history-table td {
		padding: 0.75rem;
		border: 1px solid #ddd;
	}

	.date-cell {
		font-weight: 500;
	}

	.time-cell {
		color: #666;
		font-size: 0.9rem;
	}

	.score-cell {
		text-align: center;
		font-weight: 500;
	}
</style>

