/**
 * Error to be thrown when failure to get access token.
 *
 * @class SessionTokenError
 * @extends {Error}
 */
class SessionTokenError extends Error {
	/**
	 * Creates an instance of SessionTokenError.
	 *
	 * @constructor
	 * @param {string} [message="Error trying to fetch session token"]
	 */
	constructor(message = 'Error trying to fetch session token') {
		super(message);
		this.name = 'SessionTokenError';
	}
}

export default SessionTokenError;
