/**
 * Class representing a server error.
 *
 * @class ServerError
 * @extends {Error}
 */

class ServerError extends Error {
	/**
	 * Creates an instance of ServerError.
	 *
	 * @constructor
	 * @param {string} [message="A server error occured"]
	 */
	constructor(message = 'A server error occured') {
		super(message);
		this.name = 'ServerError';
	}
}

export default ServerError;
