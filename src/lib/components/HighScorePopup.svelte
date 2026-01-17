<script lang="ts">
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';
	import { triggerConfetti } from '../utils/confetti';
	import { onMount } from 'svelte';

	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	interface HighScoreEntry {
		playerName: string;
		score: number;
		date: string;
	}

	interface Props {
		isOpen: boolean;
		highScores: HighScoreEntry[];
		onClose: () => void;
	}

	let { isOpen, highScores, onClose }: Props = $props();

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleClose() {
		onClose();
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString(currentLang, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Trigger confetti when popup opens
	$effect(() => {
		if (isOpen && highScores.length > 0) {
			// Small delay to ensure popup is visible
			setTimeout(() => {
				triggerConfetti();
			}, 100);
		}
	});
</script>

{#if isOpen}
	<div
		class="popup-overlay"
		onclick={handleClose}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="highscore-title"
		tabindex="-1"
	>
		<div class="popup" onclick={(e) => e.stopPropagation()} role="none">
			<h3 id="highscore-title">{t('highScore', currentLang)}</h3>

			{#if highScores.length === 0}
				<div class="no-scores">
					<p>{t('noHighScores', currentLang)}</p>
				</div>
			{:else}
				<div class="highscore-table-container">
					<table class="highscore-table">
						<thead>
							<tr>
								<th class="rank-col">{t('rank', currentLang)}</th>
								<th class="player-col">{t('player', currentLang)}</th>
								<th class="score-col">{t('total', currentLang)}</th>
								<th class="date-col">{t('date', currentLang)}</th>
							</tr>
						</thead>
						<tbody>
							{#each highScores as entry, index (entry.playerName + entry.score + entry.date)}
								<tr>
									<td class="rank-cell">
										<span class="rank-badge rank-{index + 1}">
											{#if index === 0}
												🥇
											{:else if index === 1}
												🥈
											{:else if index === 2}
												🥉
											{:else}
												{index + 1}
											{/if}
										</span>
									</td>
									<td class="player-cell">{entry.playerName}</td>
									<td class="score-cell">{entry.score}</td>
									<td class="date-cell">{formatDate(entry.date)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}

			<div class="popup-actions">
				<button class="btn btn-close" onclick={handleClose}>{t('close', currentLang)}</button>
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
		max-width: 600px;
		width: 90%;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.popup h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		text-align: center;
	}

	.no-scores {
		text-align: center;
		padding: 2rem;
		color: #6c757d;
	}

	.highscore-table-container {
		margin-bottom: 1rem;
	}

	.highscore-table {
		width: 100%;
		border-collapse: collapse;
	}

	.highscore-table thead {
		background: #f8f9fa;
	}

	.highscore-table th {
		padding: 0.75rem;
		text-align: left;
		font-weight: 600;
		border: 1px solid #ddd;
	}

	.rank-col {
		width: 80px;
		text-align: center;
	}

	.player-col {
		width: auto;
	}

	.score-col {
		width: 100px;
		text-align: right;
	}

	.date-col {
		width: 150px;
		text-align: left;
	}

	.highscore-table td {
		padding: 0.75rem;
		border: 1px solid #ddd;
	}

	.rank-cell {
		text-align: center;
	}

	.rank-badge {
		display: inline-block;
		font-weight: 700;
		font-size: 1.2rem;
		min-width: 2rem;
		text-align: center;
	}

	.player-cell {
		font-weight: 500;
	}

	.score-cell {
		text-align: right;
		font-weight: 600;
		font-size: 1.1rem;
	}

	.date-cell {
		color: #6c757d;
		font-size: 0.9rem;
	}

	.popup-actions {
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.btn-close {
		background: #007bff;
		color: white;
		min-width: 100px;
	}

	.btn-close:hover {
		background: #0056b3;
	}
</style>

