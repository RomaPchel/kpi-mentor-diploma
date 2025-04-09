import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import type {
	PageServerLoad
} from '../../../../../../.svelte-kit/types/src/routes/(main)/mentorship/mentor-profile/[uuid]/$types.js';

export const load: PageServerLoad = async ({ cookies, params }) => {
	const  uuid  = params.uuid;

	const mentor = await fetch(`${PUBLIC_SERVER_URL}/api/user/mentors/${uuid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})

	if (!mentor) {
		throw error(404, 'Mentor not found');
	}

	return {
		mentor: await mentor.json()
	};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const mentorUuid = values.get('mentorUuid') as string;

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
			body: JSON.stringify({ mentorUuid }),
		});


		if (!response.ok) {
			return {
				error: true,
				message: 'Failed to create chat'
			};
		}

		return redirect(303, '/chat');
	}
};