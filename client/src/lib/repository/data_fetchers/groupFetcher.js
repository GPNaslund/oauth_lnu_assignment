/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import { ApolloClient, gql } from '@apollo/client';
import CustomApolloClient from '$lib/repository/data_fetchers/apolloClient';
import CommitDTO from '$lib/dto/commitDTO';
import ProjectDTO from '$lib/dto/projectDTO';
import GroupDTO from '$lib/dto/groupDTO';
import PageInfoDTO from '$lib/dto/pageInfoDTO';
import UserGroupsDTO from '$lib/dto/userGroupsDTO';
import GroupMembershipDTO from '$lib/dto/groupMembershipDTO';

/**
 * Class with methods for getting group and project data of the user.
 *
 * @class GroupFetcher
 */
class GroupFetcher {
	/**
	 * @typedef {Object} ApolloClientWithLinks
	 * @property {() => ApolloClient} getClient
	 */

	/**
	 * @type {ApolloClientWithLinks}
	 */
	#apolloClient;

	/**
	 * @type {ApolloClient}
	 */
	#client;
	/**
	 * Creates an instance of GroupFetcher.
	 * @constructor
	 * @param {ApolloClientWithLinks} [apolloClient=new CustomApolloClient()]
	 */
	constructor(apolloClient = new CustomApolloClient()) {
		this.#apolloClient = apolloClient;
		this.#client = this.#apolloClient.getClient();
	}

	/**
	 * Method for fetching the users groups and projects.
	 *
	 * @async
	 * @param {number} [firstGroups=3]
	 * @param {string} [afterGroup=null]
	 * @param {number} [firstProjects=5]
	 * @param {boolean} [includeSubgroups=true]
	 * @returns {Promise<UserGroupsDTO>}
	 */
	async fetchUserGroupsAndProjects(
		firstGroups = 3,
		afterGroup = null,
		firstProjects = 5,
		includeSubgroups = true
	) {
		const { data } = await this.#client.query({
			query: GET_USER_GROUPS_WITH_PROJECTS,
			variables: { firstGroups, afterGroup, firstProjects, includeSubgroups },
			fetchPolicy: 'network-only'
		});

		return this.#createUserGroupsDTO(data);
	}

	/**
	 * Method for converting response from fetch to DTO's.
	 *
	 * @param {Object} data
	 * @returns {UserGroupsDTO}
	 */
	#createUserGroupsDTO(data) {
		const groupMemberships = data.currentUser.groupMemberships.nodes.map((node) => {
			const projects = node.group.projects.nodes.map((project) => {
				let lastCommit = null;

				if (project.repository.tree.lastCommit) {
					const commitDate = project.repository.tree.lastCommit.committedDate;
					let authorName, authorAvatarUrl, authorUsername;

					if (project.repository.tree.lastCommit.author) {
						authorName = project.repository.tree.lastCommit.author.name;
						authorAvatarUrl = project.repository.tree.lastCommit.author.avatarUrl || undefined;
						authorUsername = project.repository.tree.lastCommit.author.username;
					}

					lastCommit = new CommitDTO(commitDate, authorName, authorAvatarUrl, authorUsername);
				}

				return new ProjectDTO(
					project.name,
					project.webUrl,
					project.avatarUrl || undefined,
					project.fullPath,

					lastCommit
				);
			});

			return new GroupDTO(
				node.group.name,
				node.group.webUrl,
				node.group.avatarUrl || undefined,
				node.group.fullPath,
				projects,
				node.userPermissions.readGroup,
				node.group.projectsCount
			);
		});

		const pageInfo = new PageInfoDTO(
			data.currentUser.groupMemberships.pageInfo.hasNextPage,
			data.currentUser.groupMemberships.pageInfo.endCursor
		);

		return new UserGroupsDTO(
			data.currentUser.groupCount,
			new GroupMembershipDTO(pageInfo, groupMemberships)
		);
	}
}

export default GroupFetcher;

/**
 * The query to be used within the Apollo client.
 *
 * @type {import('@apollo/client').DocumentNode}
 */
const GET_USER_GROUPS_WITH_PROJECTS = gql`
	query GetUserGroupsWithProjects(
		$firstGroups: Int!
		$afterGroup: String
		$firstProjects: Int!
		$includeSubgroups: Boolean!
	) {
		currentUser {
			groupCount
			groupMemberships(first: $firstGroups, after: $afterGroup) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					userPermissions {
						readGroup
					}
					group {
						name
						webUrl
						avatarUrl
						fullPath
						projectsCount
						projects(first: $firstProjects, includeSubgroups: $includeSubgroups) {
							nodes {
								name
								webUrl
								avatarUrl
								fullPath
								repository {
									tree {
										lastCommit {
											committedDate
											author {
												name
												avatarUrl
												username
											}
										}
									}
								}
							}
							pageInfo {
								hasNextPage
								endCursor
							}
						}
					}
				}
			}
		}
	}
`;
