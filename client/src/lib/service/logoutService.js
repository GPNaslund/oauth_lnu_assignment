import AuthService from '$lib/service/authService';

/**
 * Service for logout controller.
 *
 * @class LogoutService
 */
class LogoutService {
	/**
	 * @typedef {Object} AuthServiceInterface
	 * @property {() => Promise<void>} handleLogout
	 */

	/**
	 * @type {AuthServiceInterface}
	 */
	#authService;

	/**
	 * Creates an instance of LogoutService.
	 * @constructor
	 * @param {AuthServiceInterface} [authService=new AuthService()]
	 */
	constructor(authService = new AuthService()) {
		this.#authService = authService;
	}

	/**
	 * Method for logging out the user.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async logout() {
		await this.#authService.handleLogout();
	}
}

export default LogoutService;
