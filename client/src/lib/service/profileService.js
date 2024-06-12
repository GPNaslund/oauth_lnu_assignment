import UserProfileFetcher from '$lib/repository/data_fetchers/userProfileFetcher';
import { svelteUserStore } from '$lib/repository/svelteStores';
import UserStore from '$lib/repository/userStore';
import AuthService from '$lib/service/authService';
import UserDTO from '$lib/dto/userDTO';
import User from '$lib/model/user';
import GitLabAuthenticationError from '$lib/errors/gitlabAuthenticationError';
// @ts-ignore
import { PUBLIC_GITLAB_ABSOLUTE_URL } from '$env/static/public';

/**
 * Service for the profile controller.
 * @class ProfileService
 */
class ProfileService {
	/**
	 * @typedef {Object} UserProfileFetcherInterface
	 */

	/**
	 * @typedef {Object} AuthServiceInterface
	 */

	/**
	 * @typedef {Object} UserProfileStoreInterface
	 */

	/**
	 * @type {UserProfileFetcherInterface}
	 * @param {() => Promise<any>} getCurrentUserPartialProfile
	 * @param {() => Promise<any>} getCurrentUserFullProfile
	 */
	#userProfileFetcher;

	/**
	 * @type {AuthServiceInterface}
	 * @param {() => Promise<void>} handleUserSession
	 */
	#authService;

	/**
	 * @type {UserProfileStoreInterface}
	 * @param {() => User} getUserInfo
	 * @param {(user) => void} setUserInfo
	 * @param {() => Promise<void>} handleExpiredAccessToken
	 *
	 */
	#userStore;

	/**
	 *
	 * @type {string}
	 */
	#gitLabAbsoluteUrl;

	/**
	 * Creates an instance of ProfileService.
	 *
	 * @constructor
	 * @param {UserProfileFetcherInterface} [userProfileFetcher=new UserProfileFetcher()]
	 * @param {AuthServiceInterface} [authService=new AuthService()]
	 * @param {UserProfileStoreInterface} [userStore=new UserStore(svelteUserStore)]
	 */
	constructor(
		userProfileFetcher = new UserProfileFetcher(),
		authService = new AuthService(),
		userStore = new UserStore(svelteUserStore)
	) {
		this.#userProfileFetcher = userProfileFetcher;
		this.#authService = authService;
		this.#userStore = userStore;
		this.#gitLabAbsoluteUrl = PUBLIC_GITLAB_ABSOLUTE_URL;
	}

	/**
	 * Method for returning profile data.
	 *
	 * @async
	 * @returns {Promise<UserDTO>}
	 */
	async loadProfile() {
		try {
			await this.#authService.handleUserSession();
			const profileData = await this.#loadNecessaryData();
			return profileData;
		} catch (error) {
			if (error instanceof GitLabAuthenticationError) {
				this.#authService.handleExpiredAccessToken();
				return await this.loadProfile();
			} else {
				throw error;
			}
		}
	}

	/**
	 * Method for loading the correct amount of profile data based on the amount
	 * that is stored in memory.
	 *
	 * @async
	 * @returns {Promise<UserDTO>}
	 */
	async #loadNecessaryData() {
		const storedProfileData = this.#userStore.getUserInfo();
		if (storedProfileData.isValid()) {
			return this.#dtoConverter(storedProfileData);
		} else if (storedProfileData.isEmpty()) {
			const result = await this.#handleFullProfileFetching();
			return result;
		} else if (storedProfileData.isPartial()) {
			const result = await this.#handlePartialProfileFetching(storedProfileData);
			return result;
		}
	}

	/**
	 * Method for fetching partial user profile data and returning a full user profile.
	 *
	 * @param {User} storedProfileData
	 * @returns {Promise<UserDTO>}
	 */
	async #handlePartialProfileFetching(storedProfileData) {
		/** @type {{publicEmail?: string, emails: {nodes: [{email: string}]}, lastActivityOn: string}} */
		const partialProfileData = await this.#userProfileFetcher.getCurrentUserPartialProfile();
		const primaryEmail =
			partialProfileData.publicEmail || partialProfileData.emails.nodes[0]?.email;
		const completeUser = new User(
			storedProfileData.name,
			storedProfileData.username,
			storedProfileData.userId,
			primaryEmail,
			storedProfileData.avatar,
			partialProfileData.lastActivityOn
		);
		this.#userStore.setUserInfo(completeUser);
		return this.#dtoConverter(completeUser);
	}

	/**
	 * Method for fetching a users profile data and returning a DTO containing the data.
	 *
	 * @async
	 * @returns {Promise<UserDTO>}
	 */
	async #handleFullProfileFetching() {
		const fullProfileData = await this.#userProfileFetcher.getCurrentUserFullProfile();

		let formattedId;
		const parts = fullProfileData.id.split('/');
		formattedId = parts[parts.length - 1];

		const primaryEmail = fullProfileData.publicEmail || fullProfileData.emails.nodes[0]?.email;

		const absoluteAvatarUrl = this.#ensureAbsoluteUrl(
			fullProfileData.avatarUrl,
			this.#gitLabAbsoluteUrl
		);

		const completeUser = new User(
			fullProfileData.name,
			fullProfileData.username,
			formattedId,
			primaryEmail,
			absoluteAvatarUrl,
			fullProfileData.lastActivityOn
		);

		this.#userStore.setUserInfo(completeUser);

		return this.#dtoConverter(completeUser);
	}

	/**
	 * Converts a User entity to a UserDTO.
	 *
	 * @param {User} userEntity The user entity to convert.
	 * @returns {UserDTO} The converted user DTO.
	 */
	#dtoConverter(userEntity) {
		return new UserDTO(
			userEntity.name,
			userEntity.username,
			userEntity.userId,
			userEntity.primaryEmail,
			userEntity.avatar,
			userEntity.lastActivityOn
		);
	}

	/**
	 * Makes sure an url is absolute.
	 *
	 * @param {string} possiblyRelativeUrl
	 * @param {string} absoluteBaseUrl
	 * @returns {string} The absolute url.
	 */
	#ensureAbsoluteUrl(possiblyRelativeUrl, absoluteBaseUrl) {
		try {
			const url = new URL(possiblyRelativeUrl);
			return url.href;
		} catch (e) {
			const absoluteUrl = new URL(possiblyRelativeUrl, absoluteBaseUrl);
			return absoluteUrl.href;
		}
	}
}

export default ProfileService;
