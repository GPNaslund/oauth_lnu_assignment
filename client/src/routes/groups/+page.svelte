<script>
	// EsLint disabled due to conflicts with pico css styling that could not be disabled more specific.
	/* eslint-disable */
	import container from '$lib/config/bootstrap';
	import { onMount } from 'svelte';

	let loading = true;
	/**
	 * @type {any[]}
	 */
	let allGroups = [];
	let groupCount = 0;

	/**
	 * Gets called when the component gets mounted.
	 */
	onMount(async () => {
		const groupController = container.resolve('GroupControllerSingleton');
		const groupData = await groupController.getGroupData();
		groupCount = groupData.groupCount;
		allGroups = groupData.groupMemberships.nodes;
		loading = false;
	});
</script>

<div class="container">
	{#if loading}
		<div>Loading data...</div>
	{/if}

	{#if !loading}
		{#if groupCount > 3}
			<div>Found more than three groups</div>
		{:else}
			<div>Found {groupCount} groups</div>
		{/if}

		{#each allGroups as group}
			<details>
				<summary role="button" class="outline">Group: {group.name}</summary>
				<div class="grid">
					<ul>
						{#if group.projectsCount > 5}
							<li>Found more than five projects</li>
						{/if}
						<li>Link: <a href={group.webUrl}>{group.webUrl}</a></li>
						<li>Path: {group.fullPath}</li>
					</ul>
					{#if group.avatarUrl}
						<div>
							<img src={group.avatarUrl} alt="Group Avatar" />
						</div>
					{/if}
				</div>
				{#each group.projects as project}
					<details>
						<summary role="button" class="outline contrast">Project name: {project.name}</summary>
						<div class="container">
							<ul>
								<li>Link: <a href={project.webUrl}>{project.webUrl}</a></li>
								<li>Path: {project.fullPath}</li>
							</ul>
							{#if project.avatarUrl}
								<div>
									<img src={project.avatarUrl} alt="Project Avatar" />
								</div>
							{/if}
						</div>
						{#if project.lastCommit}
							<details>
								<summary role="button" class="outline secondary"
									>Last commit: {project.lastCommit.commitedDate}</summary
								>
								<div class="container">
									<ul>
										<li>Author details</li>
										<li>
											Name: {#if project.lastCommit.authorName}{project.lastCommit
													.authorName}{:else}[No data available]{/if}
										</li>
										<li>
											Username: {#if project.lastCommit.authorUsername}{project.lastCommit
													.authorUsername}{:else}[No data available]{/if}
										</li>
									</ul>
									{#if project.lastCommit.authorAvatarUrl}
										<div>
											<img src={project.lastCommit.authorAvatarUrl} alt="Author Avatar" />
										</div>
									{/if}
								</div>
							</details>
						{/if}
					</details>
				{/each}
			</details>
		{/each}
	{/if}
</div>
