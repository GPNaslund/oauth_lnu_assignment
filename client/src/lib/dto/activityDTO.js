class ActivityDTO {
	/**
	 * @param {string} actionName
	 * @param {string} createdAt
	 * @param {string} targetTitle
	 * @param {string} targetType
	 */
	constructor(actionName, createdAt, targetTitle, targetType) {
		this.actionName = actionName;
		this.createdAt = createdAt;
		this.targetTitle = targetTitle;
		this.targetType = targetType;
	}
}

export default ActivityDTO;
