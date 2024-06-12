import { goto } from '$app/navigation';
import LogoutService from '$lib/service/logoutService';
import { base } from '$app/paths';

/**
 * Controller for logout view/route.
 *
 * @class LogoutController
 */

class LogoutController {
	/**
	 * @typedef {Object} LogoutServiceInterface
	 * @property {() => Promise<void>} logout
	 */

	/**
	 * @type {LogoutServiceInterface}
	 */
	#logoutService;

	/**
	 * Creates an instance of LogoutController.
	 *
	 * @constructor
	 * @param {LogoutServiceInterface} [logoutService=new LogoutService()]
	 */
	constructor(logoutService = new LogoutService()) {
		this.#logoutService = logoutService;
	}

	/**
	 * Method for logging out the user.
	 *
	 * @returns {Promise<void>}
	 */
	async logout() {
		try {
			await this.#logoutService.logout();
			await goto(base + '/');
		} catch (error) {
			sessionStorage.setItem('errorMessage', 'Failed to handle logout..');
			await goto(base + '/');
		}
	}
}

export default LogoutController;
