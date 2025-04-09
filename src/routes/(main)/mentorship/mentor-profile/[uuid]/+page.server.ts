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

	const mentorData = await mentor.json()
	console.log(mentorData)
	const request = await fetch(`${PUBLIC_SERVER_URL}/api/user/mentee-request/${mentorData.mentorUuid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})


	return {
		mentor: mentorData,
		alreadyRequested: !!await request.json(),
	};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const mentorUuid = values.get('mentorUuid') as string;
		const motivation = values.get('motivation') as string;

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/user/become-mentee-request`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
			body: JSON.stringify({ mentorUuid, motivation }),
		});

		if (!response.ok) {
			return {
				error: true,
				message: 'Failed to submit request'
			};
		}

		return redirect(303, '/mentorship/requests');
	}
};