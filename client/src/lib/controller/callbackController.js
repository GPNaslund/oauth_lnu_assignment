import { goto } from '$app/navigation';
import { base } from '$app/paths';
import CallbackService from '$lib/service/callbackService';

/**
 * Controller for handling the auth callback route.
 *
 * @class CallbackController
 */
class CallbackController {
	/**
	 * @typedef {Object} CallbackServiceInterface
	 * @property {() => Promise<void>} handleCallback
	 */

	/**
	 * @type {CallbackServiceInterface}
	 */
	#callbackService;

	/**
	 * Creates an instance of CallbackController.
	 * @constructor
	 * @param {CallbackServiceInterface} [callbackservice=new CallbackService()]
	 */
	constructor(callbackservice = new CallbackService()) {
		this.#callbackService = callbackservice;
	}

	/**
	 * Method for handling the oauth callback.
	 */
	async handleCallback() {
		try {
			await this.#callbackService.handleCallback();
			await goto(base + '/profile');
		} catch {
			sessionStorage.setItem('errorMessage', 'Failed to handle callback..');
			await goto(base + '/');
		}
	}
}

export default CallbackController;
