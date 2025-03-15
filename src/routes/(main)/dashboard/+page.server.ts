import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ( {cookies}) => {
	const res = await fetch('http://localhost:3000/api/auth/me', {
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	});

	const user = await res.json();

	return {
		user: user
	};
};