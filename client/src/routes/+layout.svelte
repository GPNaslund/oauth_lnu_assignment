<script>
	import { base } from '$app/paths';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import container from '$lib/config/bootstrap';

	let controller;
	let showMenuLinks = false;

	/**
	 * Runs when the component gets mounted.
	 */
	onMount(async () => {
		controller = container.resolve('NavBarControllerSingleton');
		await checkAuthorizationStatus();
	});

	/**
	 * Runs after navigation on client side routing.
	 */
	afterNavigate(async () => {
		await checkAuthorizationStatus();
	});

	/**
	 * Method for checking if user is logged in and toggles the
	 * visibility of the navbar based on that.
	 */
	async function checkAuthorizationStatus() {
		showMenuLinks = await controller.userIsLoggedIn();
	}
</script>

<nav class="container">
	<ul>
		<li><strong>WT1</strong></li>
	</ul>
	<ul>
		{#if showMenuLinks}
			<li><a href={`${base}/logout`} class="secondary">Logout</a></li>
			<li><a href={`${base}/profile`}>Profile</a></li>
			<li><a href={`${base}/activity`}>Activity</a></li>
			<li><a href={`${base}/groups`}>Groups</a></li>
		{/if}
	</ul>
</nav>
<slot />
