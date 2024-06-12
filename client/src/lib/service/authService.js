import AuthApiClient from '$lib/authentication/authApiClient';
import RefreshTokenError from '$lib/errors/refreshTokenError';
import User from '$lib/model/user';
import { svelteTokenStore, svelteUserStore } from '$lib/repository/svelteStores';
import AccessTokenStore from '$lib/repository/tokenStore';
import UserStore from '$lib/repository/userStore';

/**
 * Class with methods for handling the users current session.
 *
 * @class AuthService
 */
class AuthService {
	/**
	 * @typedef {Object} AccessTokenStoreInterface
	 * @property {() => string} getToken
	 * @property {(token) => void} setToken
	 */

	/**
	 * @typedef {Object} AuthApiClientInterface
	 * @property {() => Promise<string>} getNewAccessToken
	 * @property {() => Promise<string>} getAccessToken
	 * @property {(code, verifier) => Promise<Object>} getDataAfterRedirect
	 * @property {() => Promise<void>} endSession
	 */

	/**
	 * @typedef {Object} UserStoreInterface
	 * @property {(user) => void} setUserInfo
	 */

	/**
	 * @type {AccessTokenStoreInterface}
	 */
	#tokenStore;

	/**
	 * @type {AuthApiClientInterface}
	 */
	#authApiClient;

	/**
	 * @type {UserStoreInterface}
	 */
	#userStore;

	/**
	 * Creates an instance of AuthService.
	 *
	 * @constructor
	 * @param {AccessTokenStoreInterface} [tokenStore=new AccessTokenStore(svelteTokenStore)]
	 * @param {AuthApiClientInterface} [authApiClient=new AuthApiClient()]
	 */
	constructor(
		tokenStore = new AccessTokenStore(svelteTokenStore),
		authApiClient = new AuthApiClient(),
		userStore = new UserStore(svelteUserStore)
	) {
		this.#tokenStore = tokenStore;
		this.#authApiClient = authApiClient;
		this.#userStore = userStore;
	}

	/**
	 * Method for getting a new token.
	 *
	 * @async
	 * @returns {Promise<void>}
	 * @throws {RefreshTokenError}
	 */
	async handleExpiredAccessToken() {
		try {
			const newToken = await this.#authApiClient.getNewAccessToken();
			this.#tokenStore.setToken(newToken);
		} catch (error) {
			throw new RefreshTokenError();
		}
	}

	/**
	 * Method for checking if user has a stored access token, if not it fetches
	 * the associated access token for the user from the auth api.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async handleUserSession() {
		const userHasSession = this.#haveSession();
		if (!userHasSession) {
			const accessToken = await this.#authApiClient.getAccessToken();
			this.#tokenStore.setToken(accessToken);
		}
	}

	/**
	 * Method for call the api backend to retrieve access token + user info after oauth callback.
	 *
	 * @param {string} code
	 * @param {string} verifier
	 */
	async handleCallbackTokenRequest(code, verifier) {
		const data = await this.#authApiClient.getDataAfterRedirect(code, verifier);
		this.#tokenStore.setToken(data.access_token);
		const userData = new User(
			data.user_data.name,
			data.user_data.preferred_username,
			data.user_data.sub,
			'',
			data.user_data.picture,
			''
		);
		this.#userStore.setUserInfo(userData);
	}

	/**
	 * Method for clearing stores and calling logout endpoint of backend.
	 * @returns {Promise<void>}
	 */
	async handleLogout() {
		await this.#authApiClient.endSession();
		this.#tokenStore.setToken('');
		this.#userStore.setUserInfo(new User('', '', '', '', '', ''));
	}

	/**
	 * Method for checking if the user has a stored access token.
	 *
	 * @returns {boolean}
	 */
	#haveSession() {
		const storedSession = this.#tokenStore.getToken();
		if (!storedSession || storedSession === '') {
			return false;
		}
		return true;
	}
}

export default AuthService;
