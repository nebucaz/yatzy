<script lang="ts">
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';
	import LanguageChooser from './LanguageChooser.svelte';
	import ClearDialog from './ClearDialog.svelte';

	interface Props {
		onNewGame: () => void;
		onClearScoreboard: () => void;
		onClearHistory: () => void;
	}

	let { onNewGame, onClearScoreboard, onClearHistory }: Props = $props();

	let isOpen = $state(false);
	let showNewGameDialog = $state(false);
	let showClearScoreboardDialog = $state(false);
	let showClearHistoryDialog = $state(false);

	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	function handleToggle() {
		isOpen = !isOpen;
	}

	function handleNewGameClick() {
		showNewGameDialog = true;
		isOpen = false;
	}

	function handleClearScoreboardClick() {
		showClearScoreboardDialog = true;
		isOpen = false;
	}

	function handleClearHistoryClick() {
		showClearHistoryDialog = true;
		isOpen = false;
	}

	function handleNewGameConfirm() {
		onNewGame();
		showNewGameDialog = false;
	}

	function handleClearScoreboardConfirm() {
		onClearScoreboard();
		showClearScoreboardDialog = false;
	}

	function handleClearHistoryConfirm() {
		onClearHistory();
		showClearHistoryDialog = false;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.hamburger-menu')) {
			isOpen = false;
		}
	}

	$effect(() => {
		if (isOpen) {
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<div class="hamburger-menu">
	<button class="hamburger-button" onclick={handleToggle} aria-label="Menu" aria-expanded={isOpen}>
		<span class="hamburger-icon">
			<span class="line"></span>
			<span class="line"></span>
			<span class="line"></span>
		</span>
	</button>

	{#if isOpen}
		<div class="menu-dropdown">
			<div class="menu-section">
				<LanguageChooser />
			</div>
			<div class="menu-divider"></div>
			<div class="menu-section">
				<button class="menu-item" onclick={handleNewGameClick}>
					{t('newGame', currentLang)}
				</button>
				<button class="menu-item" onclick={handleClearScoreboardClick}>
					{t('clearScoreboard', currentLang)}
				</button>
				<button class="menu-item" onclick={handleClearHistoryClick}>
					{t('clearHistory', currentLang)}
				</button>
			</div>
		</div>
	{/if}

	<ClearDialog
		isOpen={showNewGameDialog}
		title={t('newGame', currentLang)}
		message={t('newGameConfirmation', currentLang)}
		confirmText={t('confirm', currentLang)}
		onConfirm={handleNewGameConfirm}
		onCancel={() => (showNewGameDialog = false)}
	/>

	<ClearDialog
		isOpen={showClearScoreboardDialog}
		title={t('clearScoreboard', currentLang)}
		message={t('clearScoreboardConfirmation', currentLang)}
		confirmText={t('confirm', currentLang)}
		onConfirm={handleClearScoreboardConfirm}
		onCancel={() => (showClearScoreboardDialog = false)}
	/>

	<ClearDialog
		isOpen={showClearHistoryDialog}
		title={t('clearHistory', currentLang)}
		message={t('clearHistoryConfirmation', currentLang)}
		confirmText={t('confirm', currentLang)}
		onConfirm={handleClearHistoryConfirm}
		onCancel={() => (showClearHistoryDialog = false)}
	/>
</div>

<style>
	.hamburger-menu {
		position: relative;
		display: inline-block;
	}

	.hamburger-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		padding: 0;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		transition: all 0.2s;
	}

	.hamburger-button:hover {
		background: #f5f5f5;
		border-color: #007bff;
	}

	.hamburger-icon {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 20px;
		height: 16px;
	}

	.line {
		width: 100%;
		height: 2px;
		background: #333;
		border-radius: 1px;
		transition: all 0.3s;
	}

	.menu-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.25rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		min-width: 200px;
		z-index: 1000;
		overflow: hidden;
	}

	.menu-section {
		padding: 0.5rem;
	}

	.menu-divider {
		height: 1px;
		background: #e0e0e0;
		margin: 0.25rem 0;
	}

	.menu-item {
		display: block;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: white;
		cursor: pointer;
		text-align: left;
		font-size: 0.9rem;
		transition: background 0.2s;
		border-radius: 4px;
	}

	.menu-item:hover {
		background: #f5f5f5;
	}

	.menu-item:active {
		background: #e0e0e0;
	}
</style>

