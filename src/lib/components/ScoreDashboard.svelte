<script lang="ts">
	import { gameStore } from '../stores/gameStore';
	import { languageStore } from '../stores/i18nStore';
	import { SCORE_CATEGORIES, type ScoreCategory, type Player } from '../types';
	import { calculateBonus, calculateTotal, calculateTopSectionTotal } from '../utils/scoreCalculator';
	import { getPlayerColor } from '../utils/playerColors';
	import { t } from '../utils/i18n';
	import type { Translations } from '../utils/translations';
	import { clearGameHistory, loadGameHistory } from '../utils/historyStorage';
	import PlayerHeader from './PlayerHeader.svelte';
	import ScoreCell from './ScoreCell.svelte';
	import ScoreEntryPopup from './ScoreEntryPopup.svelte';
	import GameHistory from './GameHistory.svelte';
	import PlayerNameEditPopup from './PlayerNameEditPopup.svelte';
	import HamburgerMenu from './HamburgerMenu.svelte';
	import RankingPopup from './RankingPopup.svelte';
	import HighScorePopup from './HighScorePopup.svelte';
	import { triggerConfetti } from '../utils/confetti';
	import dice1 from '../assets/dice-1.svg';
	import dice2 from '../assets/dice-2.svg';
	import dice3 from '../assets/dice-3.svg';
	import dice4 from '../assets/dice-4.svg';
	import dice5 from '../assets/dice-5.svg';
	import dice6 from '../assets/dice-6.svg';

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
	
	// Track which cell should be animated
	let animatedCell: { playerId: string; category: ScoreCategory } | null = $state(null);
	
	// Track active player
	let activePlayerId = $state<string | null>(null);

	let rankingPopupState: {
		isOpen: boolean;
		title: string;
		rankings: Array<{ rank: number; playerName: string; total: number; colorIndex?: number }>;
	} | null = $state(null);

	let highScorePopupState: {
		isOpen: boolean;
		highScores: Array<{ playerName: string; score: number; date: string }>;
	} | null = $state(null);

	let players = $derived($gameStore.players);
	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	// Get dice icon for top section categories
	function getDiceIcon(category: ScoreCategory | 'summary'): string | null {
		switch (category) {
			case 'ones':
				return dice1;
			case 'twos':
				return dice2;
			case 'threes':
				return dice3;
			case 'fours':
				return dice4;
			case 'fives':
				return dice5;
			case 'sixes':
				return dice6;
			default:
				return null;
		}
	}

	// Check if any result cell is filled for any player
	function hasAnyResultCellFilled(): boolean {
		if (players.length === 0) return false;
		
		const editableCategories: ScoreCategory[] = [
			'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
			'onePair', 'twoPairs', 'threeOfAKind', 'fourOfAKind',
			'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yatzy'
		];
		
		return players.some((player) => {
			return editableCategories.some((category) => {
				const score = player.scores[category];
				return score !== undefined;
			});
		});
	}

	// Get the initial active player (leftmost if no cells filled)
	function getInitialActivePlayer(): string | null {
		if (players.length === 0) return null;
		if (!hasAnyResultCellFilled()) {
			return players[0].id; // Leftmost player
		}
		return null; // Will be determined by last entered cell
	}

	// Get next player in sequence (wraps around)
	function getNextPlayer(currentPlayerId: string | null): string | null {
		if (players.length === 0) return null;
		if (!currentPlayerId) return players[0].id;
		
		const currentIndex = players.findIndex((p) => p.id === currentPlayerId);
		if (currentIndex === -1) return players[0].id;
		
		const nextIndex = (currentIndex + 1) % players.length;
		return players[nextIndex].id;
	}

	// Initialize active player
	$effect(() => {
		if (activePlayerId === null && players.length > 0) {
			activePlayerId = getInitialActivePlayer();
		}
	});

	// Check if game is over (all cells filled or skipped for all players)
	function isGameOver(): boolean {
		if (players.length === 0) return false;
		
		// All categories except 'summary' and 'bonus' need to be filled
		const editableCategories: ScoreCategory[] = [
			'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
			'onePair', 'twoPairs', 'threeOfAKind', 'fourOfAKind',
			'smallStraight', 'largeStraight', 'fullHouse', 'chance', 'yatzy'
		];

		// Check if all players have all categories filled or skipped
		return players.every((player) => {
			return editableCategories.every((category) => {
				const score = player.scores[category];
				// Game is over if score is defined (either number or null for skipped)
				return score !== undefined;
			});
		});
	}

	// Get category label from translations
	function getCategoryLabel(category: ScoreCategory | 'summary'): string {
		if (category === 'summary') return t('sum', currentLang);
		// Map category keys to translation keys
		const translationMap: Record<ScoreCategory, keyof Translations> = {
			ones: 'ones',
			twos: 'twos',
			threes: 'threes',
			fours: 'fours',
			fives: 'fives',
			sixes: 'sixes',
			bonus: 'bonus',
			onePair: 'onePair',
			twoPairs: 'twoPairs',
			threeOfAKind: 'threeOfAKind',
			fourOfAKind: 'fourOfAKind',
			smallStraight: 'smallStraight',
			largeStraight: 'largeStraight',
			fullHouse: 'fullHouse',
			chance: 'chance',
			yatzy: 'yatzy'
		};
		return t(translationMap[category], currentLang);
	}

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

	function handleSetActivePlayer() {
		if (playerNameEditState) {
			activePlayerId = playerNameEditState.playerId;
			playerNameEditState = null; // Close the dialog
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
		const wasClearing = score === undefined;
		gameStore.setScore(playerId, category, score);
		
		// Trigger confetti if yatzy (50 points) is entered
		if (category === 'yatzy' && score === 50) {
			setTimeout(() => {
				triggerConfetti();
			}, 100);
		}
		
		popupState = null;
		
		// Trigger animation for the cell that was just updated
		animatedCell = { playerId, category };
		setTimeout(() => {
			animatedCell = null;
		}, 500);
		
		// Advance to next player after glow animation, but only if not clearing
		if (!wasClearing && activePlayerId === playerId) {
			setTimeout(() => {
				activePlayerId = getNextPlayer(activePlayerId);
			}, 500); // After glow animation completes
		}
	}

	function handleCellClick(playerId: string, category: ScoreCategory | 'summary') {
		if (category === 'bonus' || category === 'summary') {
			return; // Bonus and summary are calculated, not editable
		}
		const categoryLabel = getCategoryLabel(category);
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

	function handleShowRanking() {
		if (!isGameOver()) return;
		
		// Calculate rankings from current game
		const rankings = players
			.map((player) => ({
				playerName: player.name,
				total: calculateTotal(player),
				colorIndex: player.colorIndex ?? 0
			}))
			.sort((a, b) => b.total - a.total) // Sort descending by total
			.map((entry, index) => ({
				...entry,
				rank: index + 1
			}));

		rankingPopupState = {
			isOpen: true,
			title: t('ranking', currentLang),
			rankings
		};
		
		// Trigger confetti when ranking popup is shown
		setTimeout(() => {
			triggerConfetti();
		}, 100);
	}

	function handleCloseRanking() {
		rankingPopupState = null;
	}

	function handleShowHighScore() {
		// Calculate high scores from game history
		const history = loadGameHistory();
		
		// Collect all individual scores from all games
		const allScores: Array<{ playerName: string; score: number; date: string }> = [];
		
		history.forEach((entry) => {
			entry.results.forEach((result) => {
				allScores.push({
					playerName: result.playerName,
					score: result.total,
					date: entry.date
				});
			});
		});

		// Sort by score descending and take top 10
		const highScores = allScores
			.sort((a, b) => b.score - a.score)
			.slice(0, 10);

		highScorePopupState = {
			isOpen: true,
			highScores
		};
	}

	function handleCloseHighScore() {
		highScorePopupState = null;
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

	function handleNewGame() {
		gameStore.clearGame();
		// Reload history after clearing
		if (gameHistoryRef) {
			gameHistoryRef.reload();
		}
	}

	function handleClearScoreboard() {
		gameStore.clearScoreboard();
		// Reload history after clearing
		if (gameHistoryRef) {
			gameHistoryRef.reload();
		}
	}

	function handleClearHistory() {
		clearGameHistory();
		// Reload history after clearing
		if (gameHistoryRef) {
			gameHistoryRef.reload();
		}
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
		<h1>{t('scoreDashboard', currentLang)}</h1>
		<div class="header-actions">
			<button class="btn btn-add" onclick={handleAddPlayer}>{t('addPlayer', currentLang)}</button>
		<HamburgerMenu
			onNewGame={handleNewGame}
			onClearScoreboard={handleClearScoreboard}
			onClearHistory={handleClearHistory}
			onShowHighScore={handleShowHighScore}
		/>
		</div>
	</div>

	<div class="table-container">
		<table class="score-table">
			<thead>
				<tr>
					<th class="category-col category-label">{t('category', currentLang)}</th>
					{#each players as player (player.id)}
						{@const colorIndex = player.colorIndex ?? 0}
						{@const playerColor = getPlayerColor(colorIndex)}
						{@const isActive = activePlayerId === player.id}
						<th
							class="player-col"
							class:active={isActive}
							draggable="true"
							ondragstart={(e) => handleDragStart(e, player.id)}
							ondragover={(e) => handleDragOver(e)}
							ondrop={(e) => handleDrop(e, player.id)}
							ondragend={handleDragEnd}
							style={isActive ? `--active-border-color: ${playerColor.header};` : ''}
						>
							<PlayerHeader
								{player}
								playerIndex={colorIndex}
								onEdit={handlePlayerHeaderClick}
							/>
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each SCORE_CATEGORIES as { key: category } (category)}
					{@const diceIcon = getDiceIcon(category)}
					<tr>
						<td class="category-label">
							<span class="category-label-content">
								{getCategoryLabel(category)}
								{#if diceIcon}
									<img src={diceIcon} alt="" class="dice-icon" />
								{/if}
							</span>
						</td>
						{#each players as player (player.id)}
							{@const colorIndex = player.colorIndex ?? 0}
							{@const playerColor = getPlayerColor(colorIndex)}
							{@const isActive = activePlayerId === player.id}
							<td 
								class="score-cell-container"
								class:active={isActive}
								style={isActive ? `--active-border-color: ${playerColor.header};` : ''}
							>
								{#if category === 'summary'}
									<div
										class="summary-cell"
										style="background-color: {playerColor.cell}; color: {playerColor.text};"
									>
										{calculateTopSectionTotal(player)}
									</div>
								{:else}
									{@const scoreCategory = category as ScoreCategory}
									{@const cellScore = getScore(player, scoreCategory)}
									{@const hasValue = cellScore !== undefined && cellScore !== null}
									{@const isSkipped = cellScore === null}
									{@const isBonus = scoreCategory === 'bonus'}
									{@const shouldAnimate = animatedCell?.playerId === player.id && animatedCell?.category === scoreCategory}
									<ScoreCell
										score={cellScore}
										category={scoreCategory}
										isBonus={isBonus}
										isEditable={!isBonus}
										playerColor={isBonus || hasValue || isSkipped || shouldAnimate ? playerColor : null}
										isAnimated={shouldAnimate}
										onClick={() => handleCellClick(player.id, scoreCategory)}
									/>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
				<tr class="total-row">
					<td class="category-label total-label">{t('total', currentLang)}</td>
					{#each players as player (player.id)}
						{@const colorIndex = player.colorIndex ?? 0}
						{@const playerColor = getPlayerColor(colorIndex)}
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

	<div class="ranking-button-container">
		<button
			class="btn btn-ranking"
			class:disabled={!isGameOver()}
			onclick={handleShowRanking}
			disabled={!isGameOver()}
		>
			{t('ranking', currentLang)}
		</button>
	</div>

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
			onSetActive={handleSetActivePlayer}
		/>
	{/if}

	{#if rankingPopupState}
		<RankingPopup
			isOpen={rankingPopupState.isOpen}
			title={rankingPopupState.title}
			rankings={rankingPopupState.rankings}
			onClose={handleCloseRanking}
		/>
	{/if}

	{#if highScorePopupState}
		<HighScorePopup
			isOpen={highScorePopupState.isOpen}
			highScores={highScorePopupState.highScores}
			onClose={handleCloseHighScore}
		/>
	{/if}

	<GameHistory bind:this={gameHistoryRef} />
</div>

<style>
	.score-dashboard {
		padding: 1rem;
		max-width: 1400px;
		margin: 0 auto;
		--player-column-width: 100px;
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
		align-items: center;
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

	.score-table tbody tr {
		height: 3rem;
	}

	.score-table tbody tr.total-row {
		height: 3rem;
	}

	.category-col {
		width: auto;
		min-width: fit-content;
		background: #f8f9fa;
		text-align: left;
		padding: 1px;
	}

	.player-col {
		width: var(--player-column-width) !important;
		max-width: var(--player-column-width) !important;
		min-width: var(--player-column-width) !important;
		position: relative;
		box-sizing: border-box;
		overflow: hidden;
		border-left: 2px solid transparent;
		border-right: 2px solid transparent;
		transition: border-color 0.3s ease;
	}

	.player-col.active {
		border-left-color: var(--active-border-color, #007bff);
		border-right-color: var(--active-border-color, #007bff);
	}

	.player-col :global(.player-header) {
		width: 100%;
	}

	.player-col[draggable='true'] {
		cursor: move;
	}

	.ranking-button-container {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.btn-ranking {
		padding: 0.75rem 2rem;
		font-size: 1rem;
		font-weight: 600;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-ranking:hover:not(.disabled) {
		background: #0056b3;
	}

	.btn-ranking.disabled {
		background: #6c757d;
		cursor: not-allowed;
		opacity: 0.6;
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
		height: 3rem;
		box-sizing: border-box;
	}

	.category-label-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		height: 100%;
	}

	.dice-icon {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
		flex-shrink: 0;
	}

	.score-cell-container {
		padding: 0;
		border: 1px solid #ddd;
		border-left: 1px solid #ddd;
		border-right: 1px solid #ddd;
		width: var(--player-column-width) !important;
		max-width: var(--player-column-width) !important;
		min-width: var(--player-column-width) !important;
		transition: border-left-color 0.3s ease, border-right-color 0.3s ease;
	}

	.score-cell-container.active {
		border-left-color: var(--active-border-color, #007bff);
		border-right-color: var(--active-border-color, #007bff);
		border-left-width: 2px;
		border-right-width: 2px;
	}

	.summary-cell {
		padding: 0.5rem;
		text-align: center;
		font-weight: 600;
		background: #f8f9fa;
		border: 1px solid #ddd;
		height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
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
		width: var(--player-column-width) !important;
		max-width: var(--player-column-width) !important;
		min-width: var(--player-column-width) !important;
		height: 3rem;
		box-sizing: border-box;
		vertical-align: middle;
	}

</style>


