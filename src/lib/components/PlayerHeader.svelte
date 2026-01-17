<script lang="ts">
	import type { Player } from '../types';
	import { getPlayerColor } from '../utils/playerColors';

	interface Props {
		player: Player;
		playerIndex: number;
		onEdit: (playerId: string) => void;
	}

	let { player, playerIndex, onEdit }: Props = $props();

	let color = $derived(getPlayerColor(playerIndex));

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onEdit(player.id);
		}
	}
</script>

<div
	class="player-header"
	style="background-color: {color.header}; color: white;"
	onclick={() => onEdit(player.id)}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
>
	<div class="player-name">{player.name}</div>
</div>

<style>
	.player-header {
		cursor: pointer;
		padding: 0.5rem;
		background: #f0f0f0;
		border: 1px solid #ddd;
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.player-header:hover {
		opacity: 0.9;
	}

	.player-name {
		font-weight: 600;
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 100%;
	}

	.player-header:focus {
		outline: 2px solid #007bff;
		outline-offset: -2px;
	}
</style>

