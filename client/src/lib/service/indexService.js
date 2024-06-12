import AuthService from '$lib/service/authService';

/**
 * Class for index controller.
 *
 * @class IndexService
 */
class IndexService {
	/**
	 * @typedef {Object} AuthServiceInterface
	 * @property {() => Promise<void>} handleUserSession
	 */

	/**
	 * @type {AuthServiceInterface}
	 */
	#authService;

	/**
	 * Creates an instance of IndexService.
	 * @constructor
	 */
	constructor(authService = new AuthService()) {
		this.#authService = authService;
	}

	/**
	 * Method for redirecting user based on response from auth endpoint.
	 * @async
	 * @returns {Promise<void>}
	 */
	async handlePageLoad() {
		await this.#authService.handleUserSession();
	}
}

export default IndexService;
