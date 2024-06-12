/**
 * Class representing a bad request error.
 *
 * @class BadRequestError
 * @extends {Error}
 */
class BadRequestError extends Error {
	/**
	 * Creates an instance of BadRequestError.
	 * @constructor
	 * @param {string} [message="The request was invalid"]
	 */
	constructor(message = 'The request was invalid') {
		super(message);
		this.name = 'BadRequestError';
	}
}

export default BadRequestError;
