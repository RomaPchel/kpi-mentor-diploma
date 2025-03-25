import { PUBLIC_SERVER_URL } from '$env/static/public';
import type {
	PageServerLoad
} from '../../../../../.svelte-kit/types/src/routes/(main)/mentorship/become-mentor/$types.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const motivation = data.get('motivation') as string;

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/user/become-mentor-request`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${cookies.get('access_token')}`,

			},
			body: JSON.stringify({ motivation: motivation })
		});

		console.log(response)

		return { success: true };
	}
};

export const load: PageServerLoad = async ({ cookies }) => {
	const res = await fetch(`${PUBLIC_SERVER_URL}/api/user/become-mentor-request`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})

	return {
		requestExists: await res.json(),
	};
};

