class PageInfoDTO {
	/**
	 * @param {boolean} hasNextPage
	 * @param {string} endCursor
	 */
	constructor(hasNextPage, endCursor) {
		this.hasNextPage = hasNextPage;
		this.endCursor = endCursor;
	}
}

export default PageInfoDTO;
