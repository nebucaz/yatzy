<script lang="ts">
	import { gameStore } from '../stores/gameStore';
	import { SCORE_CATEGORIES, type ScoreCategory, type Player } from '../types';
	import { calculateBonus, calculateTotal } from '../utils/scoreCalculator';
	import PlayerHeader from './PlayerHeader.svelte';
	import ScoreCell from './ScoreCell.svelte';
	import ClearDialog from './ClearDialog.svelte';
	import ScoreEntryPopup from './ScoreEntryPopup.svelte';

	let showClearDialog = $state(false);
	let editingPlayerId: string | null = $state(null);
	let editingPlayerName = $state('');
	let showRemoveConfirm: string | null = $state(null);
	let popupState: {
		isOpen: boolean;
		playerId: string;
		category: ScoreCategory;
		categoryLabel: string;
	} | null = $state(null);

	let players = $derived($gameStore.players);

	function handleAddPlayer() {
		gameStore.addPlayer();
	}

	function handlePlayerHeaderClick(playerId: string) {
		const player = players.find((p) => p.id === playerId);
		if (player) {
			editingPlayerId = playerId;
			editingPlayerName = player.name;
		}
	}

	function handleUpdatePlayerName() {
		if (editingPlayerId && editingPlayerName.trim()) {
			gameStore.updatePlayerName(editingPlayerId, editingPlayerName.trim());
			editingPlayerId = null;
			editingPlayerName = '';
		} else {
			editingPlayerId = null;
		}
	}

	function handleRemovePlayer(playerId: string) {
		if (showRemoveConfirm === playerId) {
			gameStore.removePlayer(playerId);
			showRemoveConfirm = null;
			editingPlayerId = null;
		} else {
			showRemoveConfirm = playerId;
		}
	}

	function handleSetScore(
		playerId: string,
		category: ScoreCategory,
		score: number | null | undefined
	) {
		gameStore.setScore(playerId, category, score);
		popupState = null;
	}

	function handleCellClick(playerId: string, category: ScoreCategory) {
		if (category === 'bonus') {
			return; // Bonus is calculated, not editable
		}
		const categoryLabel = SCORE_CATEGORIES.find((c) => c.key === category)?.label || category;
		popupState = {
			isOpen: true,
			playerId,
			category,
			categoryLabel
		};
	}

	function handlePopupCancel() {
		popupState = null;
	}

	function handleClear() {
		showClearDialog = true;
	}

	function handleClearConfirm() {
		gameStore.clearGame();
		showClearDialog = false;
	}

	function handleClearCancel() {
		showClearDialog = false;
	}

	function getScore(player: Player, category: ScoreCategory): number | null | undefined {
		if (category === 'bonus') {
			return calculateBonus(player);
		}
		return player.scores[category];
	}
</script>

<div class="score-dashboard">
	<div class="dashboard-header">
		<h1>Yatzy Score Dashboard</h1>
		<div class="header-actions">
			<button class="btn btn-add" onclick={handleAddPlayer}>+ Add Player</button>
			<button class="btn btn-clear" onclick={handleClear}>Clear</button>
		</div>
	</div>

	<div class="table-container">
		<table class="score-table">
			<thead>
				<tr>
					<th class="category-col">Category</th>
					{#each players as player (player.id)}
						<th class="player-col">
							<PlayerHeader
								{player}
								onEdit={handlePlayerHeaderClick}
							/>
							{#if editingPlayerId === player.id}
								<div class="name-edit-dialog">
									<input
										type="text"
										bind:value={editingPlayerName}
										onkeydown={(e) => {
											if (e.key === 'Enter') handleUpdatePlayerName();
											if (e.key === 'Escape') editingPlayerId = null;
										}}
										onblur={handleUpdatePlayerName}
									/>
									<div class="edit-actions">
										<button
											class="btn-remove-small"
											onclick={() => handleRemovePlayer(player.id)}
										>
											Remove
										</button>
									</div>
									{#if showRemoveConfirm === player.id}
										<div class="remove-confirm">
											<p>Remove this player?</p>
											<button
												class="btn-confirm-small"
												onclick={() => handleRemovePlayer(player.id)}
											>
												Yes
											</button>
											<button
												class="btn-cancel-small"
												onclick={() => (showRemoveConfirm = null)}
											>
												No
											</button>
										</div>
									{/if}
								</div>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each SCORE_CATEGORIES as { key: category, label } (category)}
					<tr>
						<td class="category-label">{label}</td>
						{#each players as player (player.id)}
							<td class="score-cell-container">
								<ScoreCell
									score={getScore(player, category)}
									category={category}
									isBonus={category === 'bonus'}
									isEditable={category !== 'bonus'}
									onClick={() => handleCellClick(player.id, category)}
								/>
							</td>
						{/each}
					</tr>
				{/each}
				<tr class="total-row">
					<td class="category-label total-label">Total</td>
					{#each players as player (player.id)}
						<td class="total-cell">{calculateTotal(player)}</td>
					{/each}
				</tr>
			</tbody>
		</table>
	</div>

	<ClearDialog
		isOpen={showClearDialog}
		onConfirm={handleClearConfirm}
		onCancel={handleClearCancel}
	/>

	{#if popupState}
		<ScoreEntryPopup
			isOpen={popupState.isOpen}
			category={popupState.category}
			categoryLabel={popupState.categoryLabel}
			currentScore={getScore(
				players.find((p) => p.id === popupState!.playerId)!,
				popupState.category
			)}
			onSetScore={(score: number | null | undefined) =>
				handleSetScore(popupState!.playerId, popupState!.category, score)
			}
			onCancel={handlePopupCancel}
		/>
	{/if}
</div>

<style>
	.score-dashboard {
		padding: 1rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	.dashboard-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.dashboard-header h1 {
		margin: 0;
		font-size: 1.75rem;
	}

	.header-actions {
		display: flex;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.btn-add {
		background: #28a745;
		color: white;
	}

	.btn-add:hover {
		background: #218838;
	}

	.btn-clear {
		background: #dc3545;
		color: white;
	}

	.btn-clear:hover {
		background: #c82333;
	}

	.table-container {
		overflow-x: auto;
		border: 1px solid #ddd;
		border-radius: 4px;
	}

	.score-table {
		width: 100%;
		border-collapse: collapse;
		background: white;
	}

	.category-col {
		width: 150px;
		min-width: 150px;
		background: #f8f9fa;
	}

	.player-col {
		width: auto;
		min-width: fit-content;
		max-width: 150px;
		position: relative;
	}

	.player-col :global(.player-header) {
		width: 100%;
	}

	.category-label {
		padding: 0.5rem;
		text-align: left;
		font-weight: 500;
		border: 1px solid #ddd;
		background: #f8f9fa;
	}

	.score-cell-container {
		padding: 0;
		border: 1px solid #ddd;
	}

	.total-row {
		background: #e9ecef;
	}

	.total-label {
		font-weight: 700;
		font-size: 1.1rem;
	}

	.total-cell {
		padding: 0.5rem;
		text-align: center;
		font-weight: 700;
		font-size: 1.1rem;
		border: 1px solid #ddd;
		background: #e9ecef;
	}

	.name-edit-dialog {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		background: white;
		border: 1px solid #ddd;
		border-top: none;
		padding: 0.5rem;
		z-index: 10;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.name-edit-dialog input {
		width: 100%;
		padding: 0.25rem;
		border: 1px solid #999;
		border-radius: 4px;
		margin-bottom: 0.5rem;
	}

	.edit-actions {
		margin-top: 0.25rem;
	}

	.btn-remove-small {
		padding: 0.25rem 0.5rem;
		background: #dc3545;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.75rem;
		width: 100%;
	}

	.btn-remove-small:hover {
		background: #c82333;
	}

	.remove-confirm {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #fff3cd;
		border-radius: 4px;
		border: 1px solid #ffc107;
	}

	.remove-confirm p {
		margin: 0 0 0.5rem 0;
		font-size: 0.8rem;
	}

	.remove-confirm button {
		padding: 0.25rem 0.5rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.75rem;
		margin-right: 0.25rem;
	}

	.btn-confirm-small {
		background: #dc3545;
		color: white;
	}

	.btn-confirm-small:hover {
		background: #c82333;
	}

	.btn-cancel-small {
		background: #6c757d;
		color: white;
	}

	.btn-cancel-small:hover {
		background: #5a6268;
	}
</style>

