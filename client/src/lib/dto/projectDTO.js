/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import CommitDTO from '$lib/dto/commitDTO';

class ProjectDTO {
	/**
	 * @param {string} name
	 * @param {string} webUrl
	 * @param {string} avatarUrl
	 * @param {string} fullPath
	 * @param {CommitDTO} lastCommit
	 */
	constructor(name, webUrl, avatarUrl, fullPath, lastCommit) {
		this.name = name;
		this.webUrl = webUrl;
		this.avatarUrl = avatarUrl;
		this.fullPath = fullPath;
		this.lastCommit = lastCommit;
	}
}

export default ProjectDTO;
