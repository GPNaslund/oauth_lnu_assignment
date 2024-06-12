import { writable, get } from 'svelte/store';

/**
 * Wrapper class for the store holding the access token.
 *
 * @class AccessTokenStore
 */
class AccessTokenStore {
	/**
	 *
	 * @type {import('svelte/store').Writable}
	 */
	#store;

	/**
	 * Creates an instance of AccessTokenStore.
	 *
	 * @constructor
	 * @param {import('svelte/store').Writable} [store=writable("")]
	 */
	constructor(store = writable('')) {
		this.#store = store;
	}

	/**
	 * Gets the token from the store.
	 *
	 * @returns {string}
	 */
	getToken() {
		return get(this.#store);
	}

	/**
	 * Sets the provided token in the store.
	 *
	 * @param {string} newToken
	 */
	setToken(newToken) {
		this.#store.set(newToken);
	}
}

export default AccessTokenStore;
