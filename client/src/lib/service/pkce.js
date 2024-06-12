/**
 * Class for generating PKCE variables.
 *
 * @class PkceGenerator
 */
class PkceGenerator {
	/**
	 * Creates an instance of PkceGenerator.
	 * @constructor
	 */
	constructor() {}

	/**
	 * Method for generating a random string with provided length.
	 *
	 * @param {number} length
	 * @returns {string}
	 */
	generateRandomString(length) {
		const array = new Uint8Array(length);
		window.crypto.getRandomValues(array);
		return Array.from(array)
			.map((b) => b.toString(36).padStart(2, '0'))
			.join('')
			.substring(0, length);
	}

	/**
	 * Method for generating code challenge from provided code verifier.
	 *
	 * @param {string} codeVerifier
	 * @returns {Promise<string>}
	 */
	async generateCodeChallenge(codeVerifier) {
		const encoder = new TextEncoder();
		const data = encoder.encode(codeVerifier);
		const digest = await crypto.subtle.digest('SHA-256', data);
		const base64url = btoa(String.fromCharCode(...new Uint8Array(digest)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
		return base64url;
	}
}

export default PkceGenerator;
