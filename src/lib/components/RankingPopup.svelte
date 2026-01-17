<script lang="ts">
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';
	import { getPlayerColor } from '../utils/playerColors';

	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	interface RankingEntry {
		rank: number;
		playerName: string;
		total: number;
		colorIndex?: number;
	}

	interface Props {
		isOpen: boolean;
		rankings: RankingEntry[];
		title: string;
		onClose: () => void;
	}

	let { isOpen, rankings, title, onClose }: Props = $props();

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleClose() {
		onClose();
	}
</script>

{#if isOpen}
	<div
		class="popup-overlay"
		onclick={handleClose}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="ranking-title"
		tabindex="-1"
	>
		<div class="popup" onclick={(e) => e.stopPropagation()} role="none">
			<h3 id="ranking-title">{title}</h3>

			<div class="ranking-table-container">
				<table class="ranking-table">
					<thead>
						<tr>
							<th class="rank-col">{t('rank', currentLang)}</th>
							<th class="player-col">{t('player', currentLang)}</th>
							<th class="score-col">{t('total', currentLang)}</th>
						</tr>
					</thead>
					<tbody>
						{#each rankings as entry (entry.playerName)}
							{@const playerColor = entry.colorIndex !== undefined ? getPlayerColor(entry.colorIndex) : null}
							<tr>
								<td class="rank-cell">
									<span class="rank-badge rank-{entry.rank}">
										{#if entry.rank === 1}
											🥇
										{:else if entry.rank === 2}
											🥈
										{:else if entry.rank === 3}
											🥉
										{:else}
											{entry.rank}
										{/if}
									</span>
								</td>
								<td
									class="player-cell"
									style={playerColor ? `background-color: ${playerColor.cell}; color: ${playerColor.text};` : ''}
								>
									{entry.playerName}
								</td>
								<td class="score-cell">{entry.total}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

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
		max-width: 500px;
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

	.ranking-table-container {
		margin-bottom: 1rem;
	}

	.ranking-table {
		width: 100%;
		border-collapse: collapse;
	}

	.ranking-table thead {
		background: #f8f9fa;
	}

	.ranking-table th {
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

	.ranking-table td {
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
		padding: 0.75rem;
		border-radius: 4px;
	}

	.score-cell {
		text-align: right;
		font-weight: 600;
		font-size: 1.1rem;
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

