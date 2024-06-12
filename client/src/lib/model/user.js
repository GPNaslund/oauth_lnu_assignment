/**
 * Represents the users information that is stored locally.
 *
 * @class User
 */
class User {
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

	/**
	 * Method for checking if all fields are set on the User.
	 *
	 * @returns {boolean}
	 */
	isValid() {
		for (let key in this) {
			// Using call to avoid direct access
			if (Object.prototype.hasOwnProperty.call(this, key)) {
				const value = this[key];
				if (value === null || value === undefined || value === '') {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Checks if the User has no fields set.
	 *
	 * @returns {boolean}
	 */
	isEmpty() {
		for (let key in this) {
			// Using call to avoid direct access
			if (Object.prototype.hasOwnProperty.call(this, key)) {
				const value = this[key];
				if (value !== null && value !== undefined && value !== '') {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Checks if the user is lacking lastActivityOn and/or email data.
	 *
	 * @returns {boolean}
	 */
	isPartial() {
		const isActivityMissing =
			this.lastActivityOn === null ||
			this.lastActivityOn === undefined ||
			this.lastActivityOn === '';
		const isEmailMissing =
			this.primaryEmail === null || this.primaryEmail === undefined || this.primaryEmail === '';

		return isActivityMissing || isEmailMissing;
	}
}

export default User;
