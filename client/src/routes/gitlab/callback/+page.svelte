<script>
	import container from '$lib/config/bootstrap';
	import { onMount } from 'svelte';

	/**
	 * Runs when component is mounted.
	 */
	onMount(async () => {
		const callbackController = container.resolve('CallbackControllerSingleton');
		await callbackController.handleCallback();
	});
</script>
