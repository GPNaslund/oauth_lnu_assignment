<script>
	import container from '$lib/config/bootstrap';
	import { onMount } from 'svelte';

	/**
	 * Gets called when the component gets mounted.
	 */
	onMount(async () => {
		const loginController = container.resolve('LoginControllerSingleton');
		await loginController.redirect();
	});
</script>
