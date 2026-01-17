<script lang="ts">
	import { languageStore } from '../stores/i18nStore';
	import { t } from '../utils/i18n';

	// Make component reactive to language changes
	let currentLang = $derived($languageStore);

	interface Props {
		isOpen: boolean;
		playerName: string;
		onSave: (name: string) => void;
		onRemove: () => void;
		onCancel: () => void;
	}

	let { isOpen, playerName, onSave, onRemove, onCancel }: Props = $props();

	let editName = $state('');
	let showRemoveConfirm = $state(false);

	function handleSave() {
		if (editName.trim()) {
			onSave(editName.trim());
		}
	}

	function handleCancel() {
		editName = playerName;
		showRemoveConfirm = false;
		onCancel();
	}

	function handleRemove() {
		if (showRemoveConfirm) {
			onRemove();
			showRemoveConfirm = false;
		} else {
			showRemoveConfirm = true;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleSave();
		} else if (e.key === 'Escape') {
			handleCancel();
		}
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}

	$effect(() => {
		if (isOpen) {
			editName = playerName;
			showRemoveConfirm = false;
		}
	});
</script>

{#if isOpen}
	<div
		class="popup-overlay"
		onclick={handleCancel}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="popup-title"
		tabindex="-1"
	>
		<div class="popup" onclick={(e) => e.stopPropagation()} role="none">
			<h3 id="popup-title">{t('editPlayerName', currentLang)}</h3>

			<div class="input-container">
				<label for="player-name-input">{t('playerName', currentLang)}</label>
				<input
					id="player-name-input"
					type="text"
					bind:value={editName}
					onkeydown={handleKeydown}
					class="name-input"
					placeholder={t('enterPlayerName', currentLang)}
				/>
			</div>

			<div class="popup-actions">
				<button class="btn btn-remove" onclick={handleRemove}>
					{showRemoveConfirm ? t('confirmRemove', currentLang) : t('removePlayer', currentLang)}
				</button>
				<button class="btn btn-cancel" onclick={handleCancel}>{t('cancel', currentLang)}</button>
				<button class="btn btn-save" onclick={handleSave}>{t('save', currentLang)}</button>
			</div>

			{#if showRemoveConfirm}
				<div class="remove-warning">
					<p>{t('removePlayerConfirmation', currentLang)}</p>
				</div>
			{/if}
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
		max-width: 400px;
		width: 90%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.popup h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
		text-align: center;
	}

	.input-container {
		margin-bottom: 1rem;
	}

	.input-container label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.name-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		box-sizing: border-box;
	}

	.name-input:focus {
		outline: none;
		border-color: #007bff;
	}

	.popup-actions {
		display: flex;
		justify-content: space-between;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		flex: 1;
	}

	.btn-save {
		background: #28a745;
		color: white;
	}

	.btn-save:hover {
		background: #218838;
	}

	.btn-cancel {
		background: #6c757d;
		color: white;
	}

	.btn-cancel:hover {
		background: #5a6268;
	}

	.btn-remove {
		background: #dc3545;
		color: white;
	}

	.btn-remove:hover {
		background: #c82333;
	}

	.remove-warning {
		margin-top: 1rem;
		padding: 0.75rem;
		background: #fff3cd;
		border-radius: 4px;
		border: 1px solid #ffc107;
	}

	.remove-warning p {
		margin: 0;
		font-size: 0.9rem;
		color: #856404;
	}
</style>

