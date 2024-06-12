/**
 * Error indicating a failed attempt to refresh access token.
 *
 * @class RefreshTokenError
 * @extends {Error}
 */
class RefreshTokenError extends Error {
	/**
	 * Creates an instance of RefreshTokenError.
	 *
	 * @constructor
	 * @param {string} [message="Refresh token request failed"]
	 */
	constructor(message = 'Refresh token request failed') {
		super(message);
		this.name = 'RefreshTokenError';
	}
}

export default RefreshTokenError;
