/**
 * Class representing an error during callback
 *
 * @class CallbackError
 * @extends {Error}
 */
class CallbackError extends Error {
	/**
	 * Creates an instance of CallbackError.
	 * @constructor
	 * @param {string} [message="Something went wrong with the callback"]
	 */
	constructor(message = 'Something went wrong with the callback') {
		super(message);
		this.name = 'CallbackError';
	}
}

export default CallbackError;
