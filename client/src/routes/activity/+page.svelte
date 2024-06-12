<script>
	import container from '$lib/config/bootstrap';
	import { onMount } from 'svelte';

	let moreThan101 = false;
	let paginatedGroups = [];
	let amountOfActivities = 0;
	let currentGroup = 1;
	let loading = true;

	/**
	 * Runs when the component is mounted.
	 */
	onMount(async () => {
		const activityController = container.resolve('ActivityControllerSingleton');
		const activityData = await activityController.getActivities();
		moreThan101 = activityData.hasMoreThan101;
		paginatedGroups = activityData.allActivities;
		amountOfActivities = activityData.amountOfActivities;
		loading = false;
	});

	/**
	 * Method for advancing the current group. Used for client side pagination.
	 */
	function nextGroup() {
		if (currentGroup < paginatedGroups.length) {
			currentGroup += 1;
		}
	}

	/**
	 * Method for regressing the current group.Used for client side pagination.
	 */
	function previousGroup() {
		if (currentGroup > 1) {
			currentGroup -= 1;
		}
	}
</script>

{#if loading}
	<div class="container">Loading data..</div>
{/if}
{#if !loading}
	<div class="container">
		{#if moreThan101}
			<div>Found more than 101 activities..</div>
		{:else if amountOfActivities > 0}
			<div>Found {amountOfActivities} activities</div>
		{:else}
			<div>No activities found..</div>
		{/if}

		{#if amountOfActivities > 0}
			<table>
				<thead>
					<tr>
						<th scope="col">Action Name</th>
						<th scope="col">Created At</th>
						<th scope="col">Target Title</th>
						<th scope="col">Target Type</th>
					</tr>
				</thead>
				{#each paginatedGroups as group, index}
					<tbody class:hidden={index + 1 !== currentGroup}>
						{#each group as activity}
							<tr>
								<td>{activity.actionName}</td>
								<td>{activity.createdAt}</td>
								<td>{activity.targetTitle}</td>
								<td>{activity.targetType}</td>
							</tr>
						{/each}
					</tbody>
				{/each}
			</table>
		{/if}

		{#if paginatedGroups.length > 1}
			<div>
				<button class="outline secondary" on:click={previousGroup} disabled={currentGroup === 1}
					>Previous group</button
				>
				<button
					class="outline"
					on:click={nextGroup}
					disabled={currentGroup === paginatedGroups.length}>Next group</button
				>
			</div>
		{/if}
	</div>
{/if}

<style>
	.hidden {
		display: none;
	}
</style>
