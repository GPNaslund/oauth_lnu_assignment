/**
 * Class representing a gitlab authentication error.
 *
 * @class GitLabAuthenticationError
 * @extends {Error}
 */
class GitLabAuthenticationError extends Error {
	/**
	 * Creates an instance of GitLabAuthenticationError.
	 *
	 * @constructor
	 * @param {string} [message="Gitlab authentication failed"]
	 */
	constructor(message = 'Gitlab authentication failed') {
		super(message);
		this.name = 'GitLabAuthenticationError';
	}
}

export default GitLabAuthenticationError;
