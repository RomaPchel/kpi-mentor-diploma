import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes/$types';

export const load: LayoutServerLoad = async ({cookies}) => {
	const res = await fetch('http://localhost:3000/api/auth/me', {
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	});


	const user = await res.json();

	return {
		isLoggedIn: !!user,
		user: user
	};
};