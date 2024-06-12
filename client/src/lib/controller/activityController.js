import ActivityService from '$lib/service/activityService';
/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import ActivityDTO from '$lib/dto/activityDTO';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

/**
 * Controller for the activities page.
 *
 * @class ActivityController
 */
class ActivityController {
	/**
	 * @typedef {Object} ActivityServiceInterface
	 * @param {() => Promise<ActivityDTO[]>} getActivities
	 */

	/**
	 * @type {ActivityServiceInterface}
	 */
	#activityService;

	/**
	 * Creates an instance of ActivityController.
	 *
	 * @constructor
	 * @param {ActivityServiceInterface} [activityService=new ActivityService()]
	 */
	constructor(activityService = new ActivityService()) {
		this.#activityService = activityService;
	}

	/**
	 * Method for getting view data.
	 *
	 * @async
	 * @returns {Promise<Object>}
	 */
	async getActivities() {
		try {
			let moreThan101 = false;
			const activities = await this.#activityService.getActivities();
			if (activities && activities.length > 101) {
				moreThan101 = true;
				activities.pop();
			}

			const paginatedActivities = this.#splitArrayIntoGroups(activities, 15);
			return {
				amountOfActivities: activities.length,
				hasMoreThan101: moreThan101,
				allActivities: paginatedActivities
			};
		} catch (error) {
			sessionStorage.setItem('errorMessage', 'Failed to get activities..');
			await goto(base + '/');
			return;
		}
	}

	/**
	 * Method for splitting the array with activities data into groups for pagination.
	 *
	 * @param {ActivityDTO[]} array
	 * @param {number} groupSize
	 */
	#splitArrayIntoGroups(array, groupSize) {
		const groups = [];
		for (let i = 0; i < array.length; i += groupSize) {
			groups.push(array.slice(i, i + groupSize));
		}
		return groups;
	}
}

export default ActivityController;
