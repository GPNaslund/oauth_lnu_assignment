import AuthService from '$lib/service/authService';

/**
 * Controller for the navigation bar.
 *
 */
class NavBarController {
	/**
	 * Holds the service for the controller.
	 */
	#authService;

	constructor(authService = new AuthService()) {
		this.#authService = authService;
	}

	/**
	 * Method for checking if the user has an active session.
	 * @returns {Promise<boolean>}
	 */
	async userIsLoggedIn() {
		try {
			await this.#authService.handleUserSession();
			return true;
		} catch (error) {
			return false;
		}
	}
}

export default NavBarController;
