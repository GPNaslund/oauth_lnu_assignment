class CommitDTO {
	/**
	 * @param {string} commitedDate
	 * @param {string} authorName
	 * @param {string} authorAvatarUrl
	 * @param {string} authorUsername
	 */
	constructor(commitedDate, authorName, authorAvatarUrl, authorUsername) {
		this.commitedDate = commitedDate;
		this.authorName = authorName;
		this.authorAvatarUrl = authorAvatarUrl;
		this.authorUsername = authorUsername;
	}
}

export default CommitDTO;
