<script lang="ts">
	import type { Player } from '../types';

	interface Props {
		player: Player;
		onEdit: (playerId: string) => void;
	}

	let { player, onEdit }: Props = $props();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onEdit(player.id);
		}
	}
</script>

<div
	class="player-header"
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
	}

	.player-header:hover {
		background: #e0e0e0;
	}

	.player-name {
		font-weight: 600;
		text-align: center;
	}

	.player-header:focus {
		outline: 2px solid #007bff;
		outline-offset: -2px;
	}
</style>

