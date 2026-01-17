<script lang="ts">
	import { languageStore, type Language } from '../stores/i18nStore';

	const languages: { code: Language; name: string; flag: string }[] = [
		{ code: 'en', name: 'English', flag: '🇬🇧' },
		{ code: 'de', name: 'Deutsch', flag: '🇩🇪' },
		{ code: 'ft', name: 'Español', flag: '🇪🇸' },
		{ code: 'fr', name: 'Français', flag: '🇫🇷' },
		{ code: 'it', name: 'Italiano', flag: '🇮🇹' }
	];

	let currentLanguage = $derived($languageStore);
	let isOpen = $state(false);

	function handleLanguageSelect(lang: Language) {
		languageStore.set(lang);
		isOpen = false;
	}

	function handleToggle() {
		isOpen = !isOpen;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.language-chooser')) {
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

<div class="language-chooser">
	<button class="language-button" onclick={handleToggle} aria-label="Select language">
		<span class="flag">{languages.find((l) => l.code === currentLanguage)?.flag || '🌐'}</span>
		<span class="language-code">{currentLanguage.toUpperCase()}</span>
		<span class="arrow">{isOpen ? '▲' : '▼'}</span>
	</button>

	{#if isOpen}
		<div class="language-dropdown">
			{#each languages as lang}
				<button
					class="language-option"
					class:active={lang.code === currentLanguage}
					onclick={() => handleLanguageSelect(lang.code)}
				>
					<span class="flag">{lang.flag}</span>
					<span class="name">{lang.name}</span>
					{#if lang.code === currentLanguage}
						<span class="check">✓</span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-chooser {
		position: relative;
		display: inline-block;
	}

	.language-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		background: white;
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s;
	}

	.language-button:hover {
		background: #f5f5f5;
		border-color: #007bff;
	}

	.flag {
		font-size: 1.2rem;
	}

	.language-code {
		font-weight: 500;
	}

	.arrow {
		font-size: 0.7rem;
		color: #666;
	}

	.language-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.25rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 4px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
		min-width: 150px;
		z-index: 1000;
		overflow: hidden;
	}

	.language-option {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		background: white;
		cursor: pointer;
		text-align: left;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	.language-option:hover {
		background: #f5f5f5;
	}

	.language-option.active {
		background: #e7f3ff;
		font-weight: 500;
	}

	.language-option .flag {
		font-size: 1.1rem;
	}

	.language-option .name {
		flex: 1;
	}

	.language-option .check {
		color: #007bff;
		font-weight: bold;
	}
</style>

