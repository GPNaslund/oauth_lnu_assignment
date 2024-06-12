import { writable } from 'svelte/store';
import User from '$lib/model/user';

/**
 * Writable store for user data.
 *
 * @type {import('svelte/store').Writable}
 */
export const svelteUserStore = writable(new User('', '', '', '', '', ''));

/**
 * Writable store for the access token.
 *
 * @type {import('svelte/store').Writable}
 */
export const svelteTokenStore = writable('');
