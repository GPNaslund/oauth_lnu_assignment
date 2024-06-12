/**
 * Defines the scope types for dependencies.
 * @readonly
 * @enum {string}
 */
export const SCOPES = {
	SINGLETON: 'singleton',
	TRANSIENT: 'transient'
};

/**
 * A simple Inversion of Control (IoC) container for managing dependencies.
 */
class IoCContainer {
	constructor() {
		/**
		 * @type {Object<string, any>}
		 * Maps dependency names to their singleton instances.
		 */
		this.dependencyMap = {};

		/**
		 * @type {Object<string, {constructor: new (...args: any[]) => any, scope: string}>}
		 * Stores the constructor and scope for each registered dependency.
		 */
		this.dependencyConfig = {};
	}

	/**
	 * Registers a dependency with the IoC container.
	 *
	 * @param {string} name The name of the dependency.
	 * @param {new (...args: any[]) => any} constructor The constructor function for the dependency.
	 * @param {string} scope The scope of the dependency, 'singleton' or 'transient'.
	 */
	register(name, constructor, scope) {
		this.dependencyConfig[name] = { constructor, scope };
	}

	/**
	 * Resolves and returns an instance of the requested dependency.
	 *
	 * @param {string} name The name of the dependency to resolve.
	 * @returns {any} The resolved dependency instance.
	 * @throws {Error} Throws an error if the dependency cannot be found or if an invalid scope is specified.
	 */
	resolve(name) {
		const config = this.dependencyConfig[name];
		if (!config) {
			throw new Error(`No dependency found for: ${name}`);
		}
		if (config.scope === SCOPES.SINGLETON) {
			if (!this.dependencyMap[name]) {
				this.dependencyMap[name] = new config.constructor();
			}
			return this.dependencyMap[name];
		} else if (config.scope === SCOPES.TRANSIENT) {
			return new config.constructor();
		} else {
			throw new Error(`Invalid scope specified for: ${name}`);
		}
	}
}

export default IoCContainer;
