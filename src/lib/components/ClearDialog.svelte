<script lang="ts">
	interface Props {
		isOpen?: boolean;
		title?: string;
		message?: string;
		confirmText?: string;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		isOpen = $bindable(false),
		title = 'Clear Score Dashboard',
		message = 'Are you sure you want to clear all scores? This action cannot be undone.',
		confirmText = 'Clear',
		onConfirm,
		onCancel
	}: Props = $props();

	function handleConfirm() {
		onConfirm();
		isOpen = false;
	}

	function handleCancel() {
		onCancel();
		isOpen = false;
	}

	function handleOverlayKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}
</script>

{#if isOpen}
	<div
		class="dialog-overlay"
		onclick={handleCancel}
		onkeydown={handleOverlayKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="dialog-title"
		tabindex="-1"
	>
		<div class="dialog" onclick={(e) => e.stopPropagation()} role="none">
			<h3 id="dialog-title">{title}</h3>
			<p>{message}</p>
			<div class="dialog-actions">
				<button class="btn btn-cancel" onclick={handleCancel}>Cancel</button>
				<button class="btn btn-confirm" onclick={handleConfirm}>{confirmText}</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.dialog-overlay {
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

	.dialog {
		background: white;
		border-radius: 8px;
		padding: 1.5rem;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.dialog h3 {
		margin: 0 0 1rem 0;
		font-size: 1.25rem;
	}

	.dialog p {
		margin: 0 0 1.5rem 0;
		color: #666;
	}

	.dialog-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.btn {
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.btn-cancel {
		background: #6c757d;
		color: white;
	}

	.btn-cancel:hover {
		background: #5a6268;
	}

	.btn-confirm {
		background: #dc3545;
		color: white;
	}

	.btn-confirm:hover {
		background: #c82333;
	}
</style>

