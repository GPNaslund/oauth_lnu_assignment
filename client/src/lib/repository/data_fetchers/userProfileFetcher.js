import CustomApolloClient from '$lib/repository/data_fetchers/apolloClient';
/* eslint-disable-next-line no-unused-vars -- Ignoring unused import for JSDoc annotation */
import { ApolloClient, gql } from '@apollo/client';

/**
 * Class for fetching the users profile data, fully or partially.
 *
 * @class UserProfileFetcher
 */
class UserProfileFetcher {
	/**
	 * @typedef {Object} ApolloClientWithLinks
	 * @property {() => ApolloClient} getClient
	 */

	/**
	 * @type {ApolloClientWithLinks}
	 */
	#apolloClient;

	/**
	 * @type {ApolloClient}
	 */
	#client;

	/**
	 * Creates an instance of UserProfileFetcher.
	 * @constructor
	 * @param {ApolloClientWithLinks} [apolloClient=new CustomApolloClient()]
	 */
	constructor(apolloClient = new CustomApolloClient()) {
		this.#apolloClient = apolloClient;
		this.#client = this.#apolloClient.getClient();
	}

	/**
	 * Method for getting the current users last activity and email.
	 *
	 * @async
	 * @returns {Promise<any>}
	 */
	async getCurrentUserPartialProfile() {
		const { data } = await this.#client.query({
			query: gql`
				query GetCurrentUserPartialProfile {
					currentUser {
						lastActivityOn
						publicEmail
						emails(first: 1) {
							nodes {
								email
							}
						}
					}
				}
			`
		});

		return data.currentUser;
	}

	/**
	 * Method for getting the users full profile.
	 *
	 * @async
	 * @returns {Promise<any>}
	 */
	async getCurrentUserFullProfile() {
		const { data } = await this.#client.query({
			query: gql`
				query GetCurrentUserFullProfile {
					currentUser {
						name
						lastActivityOn
						username
						id
						publicEmail
						avatarUrl
						emails(first: 1) {
							nodes {
								email
							}
						}
					}
				}
			`
		});

		return data.currentUser;
	}
}

export default UserProfileFetcher;
