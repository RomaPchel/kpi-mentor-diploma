import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import type {
	PageServerLoad
} from '../../../../../../.svelte-kit/types/src/routes/(main)/mentorship/mentor-profile/[uuid]/$types.js';

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const  uuid  = params.uuid;
	const currentUser = locals.user;
	let alreadyRequested = false
	let alreadyMyMentor = false
	const mentor = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/profile/${uuid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})

	if (!mentor) {
		throw error(404, 'Mentor not found');
	}

	const mentorData = await mentor.json()
	const request = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/requests/${mentorData.mentorUuid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})


	const activeMentorsRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/students`, {
		headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
	})
	
	const myMentors = await activeMentorsRes.json()

	let alreadyRated = false;
	if (Array.isArray(mentorData.reviews)) {
		alreadyRated = mentorData.reviews.some(
			(r: any) => r.reviewer?.uuid === currentUser.uuid
		);
	}

	if (!request.ok || !!myMentors.find(
		(mentor: { uuid: string }) => mentor.uuid === mentorData.uuid
	) ) {
		alreadyRequested = true
		alreadyMyMentor = true
	}

	if (!myMentors.find(
		(mentor: { uuid: string }) => mentor.uuid === mentorData.mentorUuid
	)){
		alreadyRequested = false
	}

	return {
		mentor: mentorData,
		alreadyRequested: alreadyRequested,
		alreadyMyMentor: alreadyMyMentor,
		alreadyRated
	};
}

export const actions = {
	become: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const mentorUuid = values.get('mentorUuid') as string;
		const motivation = values.get('motivation') as string;

		console.log(mentorUuid, motivation);

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/requests`, {
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
	},
	rate: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const formData = await clonedRequest.formData();
		const mentorUuid = formData.get('mentorUuid') as string;
		const friendliness = Number(formData.get('friendliness'));
		const knowledge = Number(formData.get('knowledge'));
		const communication = Number(formData.get('communication'));
		const comment = formData.get('comment') as string | null;

		const payload = {
			friendliness,
			knowledge,
			communication,
			comment,
		};

		const res = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/rate/${mentorUuid}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
			body: JSON.stringify(payload),
		});

		if (!res.ok) {
			return {
				error: true,
				message: 'Failed to submit rating',
			};
		}

		// ✅ Do this directly if you want to redirect:
		return redirect(303, `/mentorship/mentor-profile/${mentorUuid}`);
	}
};