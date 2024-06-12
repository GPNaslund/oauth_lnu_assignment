import { goto } from '$app/navigation';
import IndexService from '$lib/service/indexService';
import { base } from '$app/paths';

/**
 * Controller for the index page.
 *
 * @class IndexController
 */
class IndexController {
	/**
	 * @typedef {Object} IndexServiceInterface
	 * @property {() => Promise<void>} handlePageLoad
	 */

	/**
	 * @type {IndexServiceInterface}
	 */
	#indexService;

	/**
	 * Creates an instance of IndexController.
	 * @constructor
	 * @param {IndexServiceInterface} [indexService=new IndexService()]
	 */
	constructor(indexService = new IndexService()) {
		this.#indexService = indexService;
	}

	/**
	 * Method for handling logic when index page has loaded.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async handlePageLoad() {
		try {
			await this.#indexService.handlePageLoad();
			await goto(base + '/profile');
		} catch (error) {
			return;
		}
	}
}

export default IndexController;
