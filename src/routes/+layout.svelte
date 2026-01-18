<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { preloadYatzySound } from '$lib/utils/audio';
	import { onMount } from 'svelte';

	let { children } = $props();

	// Preload audio when page loads
	onMount(() => {
		preloadYatzySound();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Yatzy Score Dashboard</title>
</svelte:head>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background: #f5f5f5;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>

{@render children()}
