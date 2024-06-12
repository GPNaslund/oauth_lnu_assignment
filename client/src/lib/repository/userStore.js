import { writable, get } from 'svelte/store';
import User from '$lib/model/user';

/**
 * Wrapper class for the store storing the User entity.
 *
 * @class UserStore
 */
class UserStore {
	/**
	 * @type {import('svelte/store').Writable<User>}
	 */
	#store;

	/**
	 * Creates an instance of UserStore.
	 *
	 * @constructor
	 * @param {import('svelte/store').Writable<User>} [store=writable(new User("", "", "", "", "", ""))]
	 */
	constructor(store = writable(new User('', '', '', '', '', ''))) {
		this.#store = store;
	}

	/**
	 * Gets the stored user.
	 *
	 * @returns {User}
	 */
	getUserInfo() {
		return get(this.#store);
	}

	/**
	 * Sets the provided user in the store.
	 *
	 * @param {User} user
	 */
	setUserInfo(user) {
		this.#store.set(user);
	}
}

export default UserStore;
