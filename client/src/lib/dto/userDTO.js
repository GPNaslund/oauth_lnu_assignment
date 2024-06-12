class UserDTO {
	/**
	 * @param {string} name
	 * @param {string} username
	 * @param {string} userId
	 * @param {string} primaryEmail
	 * @param {string} avatar
	 * @param {string} lastActivityOn
	 */
	constructor(name, username, userId, primaryEmail, avatar, lastActivityOn) {
		this.name = name;
		this.username = username;
		this.userId = userId;
		this.primaryEmail = primaryEmail;
		this.avatar = avatar;
		this.lastActivityOn = lastActivityOn;
	}
}

export default UserDTO;
