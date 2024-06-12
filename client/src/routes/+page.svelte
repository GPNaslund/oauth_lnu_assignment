<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { afterNavigate } from '$app/navigation';
	import container from '$lib/config/bootstrap';
	import ErrorMessage from '$lib/components/errorMessage.svelte';

	let indexController;
	let errorComponent;

	/**
	 * Gets called when component mounts.
	 */
	onMount(async () => {
		indexController = container.resolve('IndexControllerSingleton');
		await indexController.handlePageLoad();
		handleErrorMessage();
	});

	afterNavigate(() => {
		handleErrorMessage();
	});

	function handleErrorMessage() {
		const storedMessage = sessionStorage.getItem('errorMessage');
		if (storedMessage) {
			errorComponent.displayMessage(storedMessage);
			sessionStorage.removeItem('errorMessage');
		}
	}
</script>

<ErrorMessage bind:this={errorComponent} />
<div class="grid container">
	<div></div>
	<a href={`${base}/login`} role="button" id="sign-in-btn">
		<img src={`${base}/images/gitlab-logo-500.png`} id="gitlab-icon" alt="gitlab" />
		Login using gitlab.lnu.se
	</a>
	<div></div>
</div>
<div id="cookie-text">
	This web app uses cookies, and by continuing using this app you as a user accept this.
</div>

<style>
	.container {
		margin-top: 10%;
	}

	#cookie-text {
		text-align: center;
	}
</style>
