import GroupMembershipDTO from '$lib/dto/groupMembershipDTO';
import UserGroupsDTO from '$lib/dto/userGroupsDTO';
import GitLabAuthenticationError from '$lib/errors/gitlabAuthenticationError';
import GroupFetcher from '$lib/repository/data_fetchers/groupFetcher';
import AuthService from '$lib/service/authService';
// @ts-ignore
import { PUBLIC_GITLAB_ABSOLUTE_URL } from '$env/static/public';
/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import GroupDTO from '$lib/dto/groupDTO';

/**
 * Service for group controller.
 *
 * @class GroupService
 */
class GroupService {
	/**
	 * @typedef {Object} GroupFetcherInterface
	 * @property {(firstGroups, afterGroup, firstProjects, includeSubgroups) => Promise<UserGroupsDTO>} fetchUserGroupsAndProjects
	 */

	/**
	 * @typedef {Object} AuthServiceInterface
	 * @property {() => Promise<void>} handleExpiredAccessToken
	 * @property {() => Promise<void>} handleUserSession
	 */

	/**
	 * @type {GroupFetcherInterface}
	 */
	#groupFetcher;

	/**
	 * @type {AuthServiceInterface}
	 */
	#authService;

	/**
	 *
	 * @type {string}
	 */
	#gitLabAbsoluteUrl;

	/**
	 * Creates an instance of GroupService.
	 * @constructor
	 * @param {GroupFetcherInterface} [groupFetcher=new GroupFetcher()]
	 */
	constructor(groupFetcher = new GroupFetcher(), authService = new AuthService()) {
		this.#groupFetcher = groupFetcher;
		this.#authService = authService;
		this.#gitLabAbsoluteUrl = PUBLIC_GITLAB_ABSOLUTE_URL;
	}

	/**
	 * Method for getting group data.
	 *
	 * @async
	 * @returns {Promise<UserGroupsDTO>}
	 */
	async getGroupData() {
		try {
			await this.#authService.handleUserSession();
			let groupsWithReadAccess = [];
			let afterGroup = null;
			let keepFetching = true;
			let pageInfo = null;
			let userGroupCount = 0;

			while (keepFetching) {
				const groupData = await this.#groupFetcher.fetchUserGroupsAndProjects(
					3,
					afterGroup,
					5,
					true
				);
				userGroupCount = groupData.groupCount;

				const readableGroups = groupData.groupMemberships.nodes.filter(
					(group) => group.userCanRead
				);

				readableGroups.forEach((group) => {
					this.#ensureAvatarUrlsForGroupIsAbsolute(group);
				});

				groupsWithReadAccess.push(...readableGroups);

				pageInfo = groupData.groupMemberships.pageInfo;

				if (groupsWithReadAccess.length >= 3 || !pageInfo.hasNextPage) {
					keepFetching = false;
				} else {
					afterGroup = pageInfo.endCursor;
				}
			}

			groupsWithReadAccess = groupsWithReadAccess.slice(0, 3);
			const filteredGroupMembership = new GroupMembershipDTO(pageInfo, groupsWithReadAccess);
			return new UserGroupsDTO(userGroupCount, filteredGroupMembership);
		} catch (error) {
			if (error instanceof GitLabAuthenticationError) {
				this.#authService.handleExpiredAccessToken();
				return await this.getGroupData();
			} else {
				throw error;
			}
		}
	}

	/**
	 * Ensures that avatarUrl for group, project and last commit author is absolute.
	 * Modifies the provided group if avatarUrl is relative.
	 *
	 * @param {GroupDTO} group
	 */
	#ensureAvatarUrlsForGroupIsAbsolute(group) {
		if (group.avatarUrl) {
			group.avatarUrl = this.#ensureAbsoluteUrl(group.avatarUrl, this.#gitLabAbsoluteUrl);
		}

		group.projects.forEach((project) => {
			if (project.avatarUrl) {
				project.avatarUrl = this.#ensureAbsoluteUrl(project.avatarUrl, this.#gitLabAbsoluteUrl);
			}

			const lastCommit = project.lastCommit;
			if (lastCommit && lastCommit.authorAvatarUrl) {
				lastCommit.authorAvatarUrl = this.#ensureAbsoluteUrl(
					lastCommit.authorAvatarUrl,
					this.#gitLabAbsoluteUrl
				);
			}
		});
	}

	/**
	 * Makes sure an url is absolute.
	 *
	 * @param {string} possiblyRelativeUrl
	 * @param {string} absoluteBaseUrl
	 * @returns {string} The absolute url.
	 */
	#ensureAbsoluteUrl(possiblyRelativeUrl, absoluteBaseUrl) {
		try {
			const url = new URL(possiblyRelativeUrl);
			return url.href;
		} catch (e) {
			const absoluteUrl = new URL(possiblyRelativeUrl, absoluteBaseUrl);
			return absoluteUrl.href;
		}
	}
}

export default GroupService;
