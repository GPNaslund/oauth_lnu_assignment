import { goto } from '$app/navigation';
import { base } from '$app/paths';
/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import UserDTO from '$lib/dto/userDTO';
import ProfileService from '$lib/service/profileService';

/**
 * Controller for profile view.
 *
 * @class ProfileController
 */
class ProfileController {
	/**
	 * @typedef {Object} ProfileServiceInterface
	 * @property {() => Promise<UserDTO>} loadProfile
	 */

	/**
	 * @type {ProfileServiceInterface}
	 */
	#profileService;

	/**
	 * Creates an instance of ProfileController.
	 * @constructor
	 * @param {ProfileServiceInterface} [profileService=new ProfileService()]
	 */
	constructor(profileService = new ProfileService()) {
		this.#profileService = profileService;
	}

	/**
	 * Method for loading profile data.
	 *
	 * @returns {Promise<UserDTO>}
	 */
	async loadProfile() {
		try {
			const profileData = await this.#profileService.loadProfile();
			return profileData;
		} catch (error) {
			sessionStorage.setItem('errorMessage', 'Failed to load profile..');
			await goto(base + '/');
		}
	}
}

export default ProfileController;
