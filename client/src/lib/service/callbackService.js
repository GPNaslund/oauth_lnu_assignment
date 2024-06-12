import CallbackError from '$lib/errors/callbackError';
import AuthService from '$lib/service/authService';

/**
 * Service class for callback controller.
 *
 * @class CallbackService
 */
class CallbackService {
	/**
	 * @typedef {Object} AuthServiceInterface
	 * @property {(code, verifier) => Promise<void>} handleCallbackTokenRequest
	 */

	/**
	 * @type {AuthServiceInterface}
	 */
	#authService;

	/**
	 * Creates an instance of CallbackService.
	 * @constructor
	 * @param {AuthServiceInterface} [authService=new AuthService()]
	 */
	constructor(authService = new AuthService()) {
		this.#authService = authService;
	}

	/**
	 * Method for validating callback params and handling data from auth endpoint.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async handleCallback() {
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const receivedState = urlParams.get('state');
		const receivedCode = urlParams.get('code');
		this.#validateCallbackParams(receivedState, receivedCode);

		const storedVerifier = sessionStorage.getItem('verifier');
		sessionStorage.removeItem('verifier');

		await this.#authService.handleCallbackTokenRequest(receivedCode, storedVerifier);
	}

	/**
	 * Method for validating callback parameters.
	 *
	 * @param {string} receivedState
	 * @param {string} receivedCode
	 */
	#validateCallbackParams(receivedState, receivedCode) {
		const storedState = sessionStorage.getItem('state');
		sessionStorage.removeItem('state');

		if (!storedState || !receivedState || !receivedCode) {
			throw new CallbackError();
		}

		if (storedState !== receivedState) {
			throw new CallbackError();
		}
	}
}

export default CallbackService;
