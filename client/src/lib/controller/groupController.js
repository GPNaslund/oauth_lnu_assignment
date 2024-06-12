import { goto } from '$app/navigation';
import { base } from '$app/paths';
/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import UserGroupsDTO from '$lib/dto/userGroupsDTO';
import GroupService from '$lib/service/groupService';

/**
 * Controller for the groups view.
 *
 * @class GroupController
 */
class GroupController {
	/**
	 * @typedef {Object} GroupServiceInterface
	 * @property {() => Promise<UserGroupsDTO>} getGroupData
	 */

	/**
	 * @type {GroupServiceInterface}
	 */
	#groupService;

	/**
	 * Creates an instance of GroupController.
	 * @constructor
	 * @param {GroupServiceInterface} [groupService=new GroupService()]
	 */
	constructor(groupService = new GroupService()) {
		this.#groupService = groupService;
	}

	/**
	 * Method for getting group data.
	 *
	 * @async
	 * @returns {Promise<UserGroupsDTO>}
	 */
	async getGroupData() {
		try {
			const data = await this.#groupService.getGroupData();
			return data;
		} catch (error) {
			sessionStorage.setItem('errorMessage', 'Failed to get group data..');
			await goto(base + '/');
			return;
		}
	}
}

export default GroupController;
