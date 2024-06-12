/**
 * Generic error for gitlab fetching errors.
 *
 * @class GitLabFetchingError
 * @extends {Error}
 */
class GitLabFetchingError extends Error {
	/**
	 * Creates an instance of GitLabFetchingError.
	 *
	 * @constructor
	 * @param {string} [message="Something went wrong with the GitLab query"]
	 */
	constructor(message = 'Something went wrong with the GitLab query') {
		super(message);
		this.name = 'GitLabFetchingError';
	}
}

export default GitLabFetchingError;
