<script>
	import { fade } from 'svelte/transition';

	let message;
	let visible;
	let inputWidth;

	/**
	 * Exported function to display a flash message that fades in and fades out.
	 */
	export function displayMessage(newMessage) {
		message = newMessage;
		visible = true;
		inputWidth = message.length * 15 + 'px';

		setTimeout(() => {
			visible = false;
		}, 3000);
	}
</script>

{#if visible}
	<input
		readonly
		type="text"
		value={message}
		style="width: {inputWidth};"
		transition:fade={{ duration: 500 }}
		aria-invalid="true"
		id="error-message"
	/>
{/if}

<style>
	#error-message {
		position: absolute;
		height: auto;
		left: 50%;
		transform: translate(-50%, 0);
		text-align: center;
	}
</style>
