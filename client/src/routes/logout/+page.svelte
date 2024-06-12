<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import container from '$lib/config/bootstrap';
	import { onMount } from 'svelte';

	/**
	 * Gets called when the component gets mounted.
	 */
	onMount(async () => {
		const logoutController = container.resolve('LogoutControllerSingleton');
		await logoutController.logout();
		goto(base + '/');
	});
</script>
