import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import AccessTokenStore from '$lib/repository/tokenStore';
import { svelteTokenStore } from '$lib/repository/svelteStores';
import GitLabAuthenticationError from '$lib/errors/gitlabAuthenticationError';
import GitLabFetchingError from '$lib/errors/gitlabFetchingError';
// @ts-ignore
import { PUBLIC_GITLAB_GRAPHQL_ENDPOINT } from '$env/static/public';

/**
 * Class for creating a custom apollo client with auth link that appends
 * access token to graphql requests and an error link that throws custom errors based
 * on the response.
 *
 * @class CustomApolloClient
 */
class CustomApolloClient {
	/**
	 * Object with method for getting access token.
	 *
	 * @typedef {Object} TokenStore
	 * @property {() => string} getToken
	 */

	/**
	 *
	 * @type {TokenStore}
	 */
	#accessTokenStore;

	/**
	 * Creates an instance of CustomApolloClient.
	 *
	 * @constructor
	 * @param {TokenStore} [tokenStore=new AccessTokenStore(svelteTokenStore)]
	 */
	constructor(tokenStore = new AccessTokenStore(svelteTokenStore)) {
		this.#accessTokenStore = tokenStore;
	}

	/**
	 * Method for getting the apollo client.
	 *
	 * @returns {ApolloClient<import('@apollo/client').NormalizedCacheObject>}
	 */
	getClient() {
		const httpLink = new HttpLink({ uri: PUBLIC_GITLAB_GRAPHQL_ENDPOINT });
		const authLink = this.#createAuthLink();
		const errorLink = this.#createErrorLink();
		const link = ApolloLink.from([authLink, errorLink, httpLink]);
		const client = new ApolloClient({
			link,
			cache: new InMemoryCache()
		});
		return client;
	}

	/**
	 * Method for creating the auth link that is setting the
	 * authorization header for the requests.
	 *
	 * @returns {ApolloLink}
	 */
	#createAuthLink() {
		const authLink = new ApolloLink((operation, forward) => {
			const token = this.#getAccessToken();
			operation.setContext({
				headers: {
					Authorization: token ? `Bearer ${token}` : ''
				}
			});
			return forward(operation);
		});
		return authLink;
	}

	/**
	 * Creates an Apollo Link for error handling that logs GraphQL errors and throws specific errors
	 * for authentication failures or other fetching errors.
	 *
	 * @throws {GitLabAuthenticationError} Thrown if an authentication error is detected either in GraphQL
	 *         errors with code 'UNAUTHENTICATED' or network errors with a 401 status code.
	 * @throws {GitLabFetchingError} Thrown for all other errors, indicating a generic fetching problem.
	 *
	 * @returns {ApolloLink} An Apollo Link that handles errors by logging, categorizing, and throwing
	 *          them as appropriate.
	 */
	#createErrorLink() {
		const errorLink = onError(({ graphQLErrors, networkError }) => {
			let isAuthError = false;
			if (graphQLErrors) {
				graphQLErrors.forEach(({ message, locations, path, extensions }) => {
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					);

					if (extensions?.code === 'UNAUTHENTICATED' || message.includes('not authenticated')) {
						isAuthError = true;
					}
				});

				if (isAuthError) {
					throw new GitLabAuthenticationError();
				}
			}

			if (networkError) {
				// @ts-ignore
				if (networkError.statusCode === 401) {
					throw new GitLabAuthenticationError();
				} else {
					throw new GitLabFetchingError();
				}
			}

			if (graphQLErrors && !isAuthError) {
				throw new GitLabFetchingError();
			}
		});

		return errorLink;
	}

	/**
	 * Method for returning the stored access token from the store.
	 *
	 * @returns {string}
	 */
	#getAccessToken() {
		return this.#accessTokenStore.getToken();
	}
}

export default CustomApolloClient;
