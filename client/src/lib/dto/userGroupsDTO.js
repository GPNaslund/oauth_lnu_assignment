/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import GroupMembershipDTO from '$lib/dto/groupMembershipDTO';

class UserGroupsDTO {
	/**
	 * @param {number} groupCount
	 * @param {GroupMembershipDTO} groupMemberships
	 */
	constructor(groupCount, groupMemberships) {
		this.groupCount = groupCount;
		this.groupMemberships = groupMemberships;
	}
}

export default UserGroupsDTO;
