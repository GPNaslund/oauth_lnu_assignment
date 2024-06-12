<script>
	import { onMount } from 'svelte';
	import container from '$lib/config/bootstrap';

	let profileData = {
		name: '',
		username: '',
		userId: '',
		primaryEmail: '',
		lastActivityOn: '',
		avatar: ''
	};
	let isLoading = true;

	/**
	 * Gets called when the component gets mounted.
	 */
	onMount(async () => {
		const profileController = container.resolve('ProfileControllerSingleton');
		const data = await profileController.loadProfile();
		if (data) {
			profileData = data;
		}
		isLoading = false;
	});
</script>

<div class="grid container">
	{#if isLoading}
		<p>Loading profile...</p>
	{:else}
		<div>
			<div>Name: <span>{profileData.name || 'N/A'}</span></div>
			<div>Username: <span>{profileData.username || 'N/A'}</span></div>
			<div>User ID: <span>{profileData.userId || 'N/A'}</span></div>
			<div>Email: <span>{profileData.primaryEmail || 'N/A'}</span></div>
			<div>Last activity: <span>{profileData.lastActivityOn || 'N/A'}</span></div>
		</div>
		<div>
			{#if profileData.avatar}
				<img src={profileData.avatar} alt="profile" />
			{/if}
		</div>
	{/if}
</div>
