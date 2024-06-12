import LoginService from '$lib/service/loginService';
import { goto } from '$app/navigation';
import { base } from '$app/paths';

/**
 * Controller for the login page.
 *
 * @class LoginController
 */
class LoginController {
	/**
	 * @typedef {Object} LoginServiceInterface
	 * @property {() => Promise<void>} handleRedirect
	 */

	/**
	 * @type {LoginServiceInterface}
	 */
	#loginService;

	/**
	 * Creates an instance of LoginController.
	 * @constructor
	 * @param {LoginServiceInterface} [loginService=new LoginService()]
	 */
	constructor(loginService = new LoginService()) {
		this.#loginService = loginService;
	}

	/**
	 * Method for handling redirect to gitlab oauth.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async redirect() {
		try {
			await this.#loginService.handleRedirect();
		} catch (error) {
			sessionStorage.setItem('errorMessage', 'Failed to handle login redirect..');
			await goto(base + '/');
		}
	}
}

export default LoginController;
