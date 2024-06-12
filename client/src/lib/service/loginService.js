import AuthApiClient from '$lib/authentication/authApiClient';
import PkceGenerator from '$lib/service/pkce';

/**
 * Service for login controller.
 *
 * @class LoginService
 */
class LoginService {
	/**
	 * @typedef {Object} AuthApiClientInterface
	 * @property {(state, codeChallenge) => Promise<Object>} getOauthRedirectUri
	 */

	/**
	 * @typedef {Object} PKCEGeneratorInterface
	 * @property {(stringLength) => string} generateRandomString
	 * @property {(string) => Promise<string>} generateCodeChallenge
	 */

	/**
	 * @type {AuthApiClientInterface}
	 */
	#authApiClient;

	/**
	 * @type {PKCEGeneratorInterface}
	 */
	#generator;

	/**
	 * Creates an instance of LoginService.
	 *
	 * @constructor
	 * @param {PKCEGeneratorInterface} [pkceGenerator=new PkceGenerator()]
	 * @param {AuthApiClientInterface} [authApiClient=new AuthApiClient()]
	 */
	constructor(pkceGenerator = new PkceGenerator(), authApiClient = new AuthApiClient()) {
		this.#generator = pkceGenerator;
		this.#authApiClient = authApiClient;
	}

	/**
	 * Method for generating PKCE data and redirecting to OAuth login.
	 *
	 * @async
	 * @returns {Promise<void>}
	 */
	async handleRedirect() {
		const state = this.#generator.generateRandomString(43);
		const codeVerifier = this.#generator.generateRandomString(43);
		const codeChallenge = await this.#generator.generateCodeChallenge(codeVerifier);

		const data = await this.#authApiClient.getOauthRedirectUri(state, codeChallenge);

		sessionStorage.setItem('state', state);
		sessionStorage.setItem('verifier', codeVerifier);
		window.location.href = data.url;
	}
}

export default LoginService;
