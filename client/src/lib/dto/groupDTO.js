/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import ProjectDTO from '$lib/dto/projectDTO';

class GroupDTO {
	/**
	 * @param {string} name
	 * @param {string} webUrl
	 * @param {string} avatarUrl
	 * @param {string} fullPath
	 * @param {ProjectDTO[]} projects
	 * @param {boolean} userCanRead
	 * @param {number} projectsCount
	 */
	constructor(name, webUrl, avatarUrl, fullPath, projects, userCanRead, projectsCount) {
		this.name = name;
		this.webUrl = webUrl;
		this.avatarUrl = avatarUrl;
		this.fullPath = fullPath;
		this.projects = projects;
		this.userCanRead = userCanRead;
		this.projectsCount = projectsCount;
	}
}

export default GroupDTO;
