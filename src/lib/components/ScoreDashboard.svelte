<script lang="ts">
	import { gameStore } from '../stores/gameStore';
	import { SCORE_CATEGORIES, type ScoreCategory, type Player } from '../types';
	import { calculateBonus, calculateTotal, calculateTopSectionTotal } from '../utils/scoreCalculator';
	import { getPlayerColor } from '../utils/playerColors';
	import PlayerHeader from './PlayerHeader.svelte';
	import ScoreCell from './ScoreCell.svelte';
	import ClearDialog from './ClearDialog.svelte';
	import ScoreEntryPopup from './ScoreEntryPopup.svelte';
	import GameHistory from './GameHistory.svelte';
	import PlayerNameEditPopup from './PlayerNameEditPopup.svelte';

	let showClearDialog = $state(false);
	let playerNameEditState: {
		isOpen: boolean;
		playerId: string;
		playerName: string;
	} | null = $state(null);
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
			playerNameEditState = {
				isOpen: true,
				playerId: player.id,
				playerName: player.name
			};
		}
	}

	function handleSavePlayerName(name: string) {
		if (playerNameEditState) {
			gameStore.updatePlayerName(playerNameEditState.playerId, name);
			playerNameEditState = null;
		}
	}

	function handleRemovePlayer() {
		if (playerNameEditState) {
			gameStore.removePlayer(playerNameEditState.playerId);
			playerNameEditState = null;
		}
	}

	function handleCancelPlayerNameEdit() {
		playerNameEditState = null;
	}

	function handleSetScore(
		playerId: string,
		category: ScoreCategory,
		score: number | null | undefined
	) {
		gameStore.setScore(playerId, category, score);
		popupState = null;
	}

	function handleCellClick(playerId: string, category: ScoreCategory | 'summary') {
		if (category === 'bonus' || category === 'summary') {
			return; // Bonus and summary are calculated, not editable
		}
		const categoryLabel = SCORE_CATEGORIES.find((c) => c.key === category)?.label || category;
		popupState = {
			isOpen: true,
			playerId,
			category: category as ScoreCategory,
			categoryLabel
		};
	}

	function handlePopupCancel() {
		popupState = null;
	}

	function handleClear() {
		showClearDialog = true;
	}

	let gameHistoryRef: GameHistory | null = $state(null);
	let draggedPlayerId: string | null = $state(null);

	function handleDragStart(e: DragEvent, playerId: string) {
		draggedPlayerId = playerId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('text/plain', playerId);
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
	}

	function handleDrop(e: DragEvent, targetPlayerId: string) {
		e.preventDefault();
		if (draggedPlayerId && draggedPlayerId !== targetPlayerId) {
			const currentPlayers = [...players];
			const draggedIndex = currentPlayers.findIndex((p) => p.id === draggedPlayerId);
			const targetIndex = currentPlayers.findIndex((p) => p.id === targetPlayerId);

			if (draggedIndex !== -1 && targetIndex !== -1) {
				const [draggedPlayer] = currentPlayers.splice(draggedIndex, 1);
				currentPlayers.splice(targetIndex, 0, draggedPlayer);
				gameStore.reorderPlayers(currentPlayers);
			}
		}
		draggedPlayerId = null;
	}

	function handleDragEnd() {
		draggedPlayerId = null;
	}

	function handleClearConfirm() {
		gameStore.clearGame();
		showClearDialog = false;
		// Reload history after clearing
		if (gameHistoryRef) {
			gameHistoryRef.reload();
		}
	}

	function handleClearCancel() {
		showClearDialog = false;
	}

	function getScore(player: Player, category: ScoreCategory | 'summary'): number | null | undefined {
		if (category === 'bonus') {
			return calculateBonus(player);
		}
		if (category === 'summary') {
			return calculateTopSectionTotal(player);
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
					{#each players as player, index (player.id)}
						<th
							class="player-col"
							draggable="true"
							ondragstart={(e) => handleDragStart(e, player.id)}
							ondragover={(e) => handleDragOver(e)}
							ondrop={(e) => handleDrop(e, player.id)}
							ondragend={handleDragEnd}
						>
							<PlayerHeader
								{player}
								playerIndex={index}
								onEdit={handlePlayerHeaderClick}
							/>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each SCORE_CATEGORIES as { key: category, label } (category)}
					<tr>
						<td class="category-label">{label}</td>
						{#each players as player, playerIndex (player.id)}
							{@const playerColor = getPlayerColor(playerIndex)}
							<td class="score-cell-container">
								{#if category === 'summary'}
									<div
										class="summary-cell"
										style="background-color: {playerColor.cell}; color: {playerColor.text};"
									>
										{calculateTopSectionTotal(player)}
									</div>
								{:else}
									{@const scoreCategory = category as ScoreCategory}
									{@const hasValue = getScore(player, scoreCategory) !== undefined && getScore(player, scoreCategory) !== null}
									<ScoreCell
										score={getScore(player, scoreCategory)}
										category={scoreCategory}
										isBonus={scoreCategory === 'bonus'}
										isEditable={scoreCategory !== 'bonus'}
										playerColor={hasValue ? playerColor : null}
										onClick={() => handleCellClick(player.id, scoreCategory)}
									/>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
				<tr class="total-row">
					<td class="category-label total-label">Total</td>
					{#each players as player, playerIndex (player.id)}
						{@const playerColor = getPlayerColor(playerIndex)}
						<td
							class="total-cell"
							style="background-color: {playerColor.cell}; color: {playerColor.text};"
						>
							{calculateTotal(player)}
						</td>
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

	{#if playerNameEditState}
		<PlayerNameEditPopup
			isOpen={playerNameEditState.isOpen}
			playerName={playerNameEditState.playerName}
			onSave={handleSavePlayerName}
			onRemove={handleRemovePlayer}
			onCancel={handleCancelPlayerNameEdit}
		/>
	{/if}

	<GameHistory bind:this={gameHistoryRef} />
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
		width: auto;
		border-collapse: collapse;
		background: white;
		table-layout: auto;
	}

	.category-col {
		width: auto;
		min-width: fit-content;
		background: #f8f9fa;
	}

	.player-col {
		width: 150px !important;
		max-width: 150px !important;
		min-width: 150px !important;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
	}

	.player-col :global(.player-header) {
		width: 100%;
	}

	.player-col[draggable='true'] {
		cursor: move;
	}

	.player-col[draggable='true']:hover {
		opacity: 0.8;
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
		width: 150px !important;
		max-width: 150px !important;
		min-width: 150px !important;
		box-sizing: border-box;
	}

	.summary-cell {
		padding: 0.5rem;
		text-align: center;
		font-weight: 600;
		background: #f8f9fa;
		border: 1px solid #ddd;
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
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
		width: 150px !important;
		max-width: 150px !important;
		min-width: 150px !important;
		box-sizing: border-box;
	}

</style>


