import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import type {
	PageServerLoad
} from '../../../../../../.svelte-kit/types/src/routes/(main)/mentorship/mentor-profile/[uuid]/$types.js';

export const load: PageServerLoad = async ({ locals, cookies, params }) => {
	const uuid = params.uuid;
	const currentUser = locals.user;

	let alreadyRequested = false;
	let alreadyMyMentor = false;
	let alreadyRated = false;

	// Fetch mentor profile
	const mentorRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/profile/${uuid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	});

	if (!mentorRes.ok) {
		throw error(404, 'Mentor not found');
	}

	const mentorData = await mentorRes.json();

	console.log(`${PUBLIC_SERVER_URL}/api/mentees/already-requested/${mentorData.mentorUuid}`)
	const requestRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/already-requested/${mentorData.mentorUuid}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	});
	console.log(requestRes);

	if (requestRes.ok) {
		alreadyRequested = true;
	}

	const myMentorsRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/my-mentors`, {
		headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
	});
	if (myMentorsRes.ok) {
		const myMentors = await myMentorsRes.json();

		alreadyMyMentor = Array.isArray(myMentors) &&
			myMentors.some((mentor: { uuid: string }) => mentor.uuid === mentorData.mentorUuid);
	}

	if (Array.isArray(mentorData.reviews)) {
		alreadyRated = mentorData.reviews.some(
			(r: any) => r.reviewer?.uuid === currentUser.uuid
		);
	}

	return {
		mentor: mentorData,
		alreadyRequested: alreadyRequested,
		alreadyMyMentor: alreadyMyMentor,
		alreadyRated: alreadyRated
	};
};
;

export const actions = {
	become: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const mentorUuid = values.get('mentorUuid') as string;
		const motivation = values.get('motivation') as string;

		console.log(mentorUuid, motivation);

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/become-mentee-request`, {
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