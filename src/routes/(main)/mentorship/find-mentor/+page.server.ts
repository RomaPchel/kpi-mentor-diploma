import type { PageServerLoad } from './$types';
import { PUBLIC_SERVER_URL } from '$env/static/public';


export const load: PageServerLoad = async ({ cookies }) => {
	const mentors = await fetch(`${PUBLIC_SERVER_URL}/api/user/mentors`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})

	return {
		mentors: await mentors.json(),
	};
};
