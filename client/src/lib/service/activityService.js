import GitLabAuthenticationError from '$lib/errors/gitlabAuthenticationError';
import ActivityFetcher from '$lib/repository/data_fetchers/activityFetcher';
import ActivityDTO from '$lib/dto/activityDTO';
import AuthService from '$lib/service/authService';

/**
 * Service for the activity controller.
 *
 * @class ActivityService
 */
class ActivityService {
	/**
	 * @typedef {Object} ActivityFetcherInterface
	 * @param {number} amountOfActivities
	 * @param {number} page
	 * @property {(amountOfActivities, page) => Promise<Object[]>} fetchUserActivities
	 */

	/**
	 * @typedef {Object} AuthServiceInterface
	 * @property {() => Promise<void>} handleExpiredAccessToken
	 * @property {() => Promise<void>} handleUserSession
	 * @throws {RefreshTokenError}
	 */

	/**
	 * @type {ActivityFetcherInterface}
	 */
	#activityFetcher;

	/**
	 * @type {AuthServiceInterface}
	 */
	#authService;

	/**
	 * Creates an instance of ActivityService.
	 *
	 * @constructor
	 * @param {ActivityFetcherInterface} [activityFetcher=new ActivityFetcher()]
	 * @param {AuthServiceInterface} [authService=new AuthService()]
	 */
	constructor(activityFetcher = new ActivityFetcher(), authService = new AuthService()) {
		this.#activityFetcher = activityFetcher;
		this.#authService = authService;
	}

	/**
	 * Gets the users activities and returns an array of ActivityDTO.
	 *
	 * @async
	 * @returns {Promise<ActivityDTO[]>}
	 */
	async getActivities() {
		try {
			await this.#authService.handleUserSession();
			await this.#authService.handleExpiredAccessToken();
			const firstBatch = await this.#activityFetcher.fetchUserActivities(51, 1);
			if (firstBatch.length === 51) {
				const secondBatch = await this.#activityFetcher.fetchUserActivities(51, 2);
				const result = this.#dtoConverter(firstBatch, secondBatch);
				return result;
			}
			const result = this.#dtoConverter(firstBatch);
			return result;
		} catch (error) {
			if (error instanceof GitLabAuthenticationError) {
				this.#authService.handleExpiredAccessToken();
				return await this.getActivities();
			} else {
				throw error;
			}
		}
	}

	/**
	 * Method for converting multiple arrays of json data of user activity.
	 *
	 * @param {Object[]} jsonArrays
	 * @returns {ActivityDTO[]}
	 */
	#dtoConverter(...jsonArrays) {
		/**
		 * @type {ActivityDTO[]}
		 */
		let resultArray = [];
		jsonArrays.forEach((array) => {
			// @ts-ignore
			array.forEach((data) => {
				const { action_name, created_at, target_title, target_type } = data;
				resultArray.push(
					new ActivityDTO(
						action_name || '',
						created_at || '',
						target_title || '',
						target_type || ''
					)
				);
			});
		});
		return resultArray;
	}
}

export default ActivityService;
