import BadRequestError from '$lib/errors/badRequestError';
import RefreshTokenError from '$lib/errors/refreshTokenError';
import ServerError from '$lib/errors/serverError';
import SessionTokenError from '$lib/errors/sessionTokenError';
// @ts-ignore
import {
	PUBLIC_API_AUTH_ENDPOINT,
	PUBLIC_API_REFRESH_ENDPOINT,
	PUBLIC_API_LOGOUT_ENDPOINT,
	PUBLIC_API_LOGIN_ENDPOINT,
	PUBLIC_API_TOKEN_ENDPOINT
} from '$env/static/public';

/**
 * Class for making calls to the token mediating back-end.
 *
 * @class AuthApiClient
 */
class AuthApiClient {
	/**
	 * Creates an instance of AuthApiClient.
	 *
	 * @constructor
	 */
	constructor() {}

	/**
	 * Method for getting a token from an active session.
	 *
	 * @async
	 * @returns {Promise<string>} The access token.
	 * @throws {SessionTokenError} If no session is found.
	 * @throws {ServerError} If the server encounters a problem.
	 */
	async getAccessToken() {
		const response = await fetch(PUBLIC_API_AUTH_ENDPOINT, {
			credentials: 'include'
		});

		if (response.status === 401) {
			throw new SessionTokenError(`No session found, please log in again!`);
		} else if (response.status === 500) {
			throw new ServerError('The server had a problem.. Try again later!');
		}

		const data = await response.json();

		if (data.access_token) {
			return data.access_token;
		} else {
			throw new ServerError('The server did not respond as expected.. Try again later!');
		}
	}

	/**
	 * Method for refreshing and obtaining a new access token from an active session.
	 *
	 * @async
	 * @returns {Promise<string>} The new access token.
	 * @throws {RefreshTokenError} If the session is invalid or expired, indicating the user needs to log in again.
	 * @throws {ServerError} If the server encounters an internal error or cannot process the request.
	 */
	async getNewAccessToken() {
		const response = await fetch(PUBLIC_API_REFRESH_ENDPOINT, {
			credentials: 'include',
			method: 'POST'
		});

		if (response.status === 401) {
			throw new RefreshTokenError('No session found, please log in again!');
		} else if (response.status === 500) {
			throw new ServerError('The server had a problem.. Try again later!');
		}

		const data = await response.json();
		if (data.access_token) {
			return data.access_token;
		} else {
			throw new ServerError('The server did not respond as expected.. Try again later!');
		}
	}

	/**
	 * Method for ending the current user session.
	 *
	 * @async
	 * @throws {ServerError} If the server encounters an internal error during the logout process.
	 */
	async endSession() {
		const response = await fetch(PUBLIC_API_LOGOUT_ENDPOINT, {
			credentials: 'include',
			method: 'DELETE'
		});

		if (response.status === 500) {
			throw new ServerError('The server had a problem.. Try again later!');
		}
	}

	/**
	 * Asynchronously retrieves an OAuth redirect URI.
	 *
	 * @param {string} state - The unique state parameter used for preventing CSRF attacks.
	 * @param {string} codeChallenge - The code challenge derived from the code verifier for PKCE.
	 *
	 * @throws {BadRequestError} Thrown if the server returns a 400 status, indicating a bad request.
	 * @throws {ServerError} Thrown if the server returns a 500 status, indicating an internal server error.
	 * @returns {Promise<Object>} A promise that resolves to the JSON object retrieved from the response.
	 */
	async getOauthRedirectUri(state, codeChallenge) {
		const url = new URL(PUBLIC_API_LOGIN_ENDPOINT);
		url.searchParams.append('state', state);
		url.searchParams.append('code_challenge', codeChallenge);
		const response = await fetch(url.toString(), { credentials: 'include' });

		if (response.status === 400) {
			throw new BadRequestError('The request did not fulfill the server requirements');
		} else if (response.status === 500) {
			throw new ServerError('The server had a problem.. Try again later!');
		}
		const data = await response.json();
		return data;
	}

	/**
	 * Asynchronously retrieves an authentication token.
	 *
	 * @param {string} code - The authorization code received from the OAuth server.
	 * @param {string} verifier - The code verifier for PKCE, used to secure the exchange of the authorization code for a token.
	 *
	 * @throws {ServerError} Thrown if the server returns a 500 status, indicating an internal server error.
	 * @throws {BadRequestError} Thrown if the server returns a 400 status, indicating a bad request.
	 * @returns {Promise<Object>} A promise that resolves to the JSON object.
	 */
	async getDataAfterRedirect(code, verifier) {
		const url = new URL(PUBLIC_API_TOKEN_ENDPOINT);
		const formData = new URLSearchParams();
		formData.append('code', code);
		formData.append('code_verifier', verifier);

		const response = await fetch(url.toString(), {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData
		});

		if (response.status === 500) {
			throw new ServerError('The server had a problem.. Try again later!');
		} else if (response.status === 400) {
			throw new BadRequestError('The request did not fulfill the server requirements');
		}

		const data = await response.json();
		return data;
	}
}

export default AuthApiClient;
