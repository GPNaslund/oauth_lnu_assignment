/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import GroupDTO from '$lib/dto/groupDTO';
/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import PageInfoDTO from '$lib/dto/pageInfoDTO';

class GroupMembershipDTO {
	/**
	 * @param {PageInfoDTO} pageInfo
	 * @param {GroupDTO[]} nodes
	 */
	constructor(pageInfo, nodes) {
		this.pageInfo = pageInfo;
		this.nodes = nodes;
	}
}

export default GroupMembershipDTO;
