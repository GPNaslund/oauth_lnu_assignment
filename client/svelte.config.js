import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
export default {
	kit: {
		adapter: adapter({
			pages: '../tm-backend/internal/public',
			assets: '../tm-backend/internal/public',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),
		paths: {
			base: ''
		}
	}
};
