import BadRequestError from '$lib/errors/badRequestError';
import GitLabAuthenticationError from '$lib/errors/gitlabAuthenticationError';
import { svelteTokenStore } from '$lib/repository/svelteStores';
import AccessTokenStore from '$lib/repository/tokenStore';
// @ts-ignore
import { PUBLIC_GITLAB_EVENTS_ENDPOINT } from '$env/static/public';

/**
 * Class for fetching user activities.
 *
 * @class ActivityFetcher
 */
class ActivityFetcher {
	/**
	 * Store with method for getting stored access token.
	 *
	 * @typedef {Object} TokenStore
	 * @property {() => string} getToken
	 */

	/**
	 * @type {TokenStore}
	 */
	#tokenStore;

	/**
	 * Creates an instance of ActivityFetcher.
	 *
	 * @constructor
	 * @param {TokenStore} [tokenStore=new AccessTokenStore(svelteTokenStore)]
	 */
	constructor(tokenStore = new AccessTokenStore(svelteTokenStore)) {
		this.#tokenStore = tokenStore;
	}

	/**
	 * Method for fetching the users activities.
	 *
	 * @param {number} amountOfActivities - The number of activities to fetch per page.
	 * @param {number} page - The page number of activities to fetch.
	 * @throws {BadRequestError} Thrown if the request is malformed (status code 400).
	 * @throws {GitLabAuthenticationError} Thrown if authentication fails (status code 401).
	 * @throws {Error} Throws a generic error for any other non-successful response, including the received status code.
	 * @returns {Promise<Object[]>} A promise that resolves to an array of activity objects fetched from GitLab.
	 */
	async fetchUserActivities(amountOfActivities, page) {
		const baseUrl = PUBLIC_GITLAB_EVENTS_ENDPOINT;
		const params = new URLSearchParams({
			per_page: amountOfActivities.toString(),
			page: page.toString()
		});
		const accessToken = this.#tokenStore.getToken();

		const response = await fetch(`${baseUrl}?${params}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			if (response.status === 400) {
				throw new BadRequestError('Bad request for fetching of activities');
			} else if (response.status === 401) {
				throw new GitLabAuthenticationError('Authentication for GitLab api request failed');
			} else {
				throw new Error(
					`GitLab api request for activities failed, status code: ${response.status}`
				);
			}
		}

		const activities = await response.json();
		return activities;
	}
}

export default ActivityFetcher;
