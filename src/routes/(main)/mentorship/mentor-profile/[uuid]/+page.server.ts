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

	const accessToken = cookies.get('access_token');

	const mentorRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/profile/${uuid}`, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
	if (!mentorRes.ok) throw error(404, 'Mentor not found');
	const mentorData = await mentorRes.json();

	// Check if the user already requested mentorship
	const requestRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/already-requested/${mentorData.mentorUuid}`, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
	console.log(requestRes)
	if (requestRes.ok) {
		alreadyRequested = true;
	}

	// Check if mentor is in mentee's list
	const myMentorsRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/my-mentors`, {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
	if (myMentorsRes.ok) {
		const myMentors = await myMentorsRes.json();
		alreadyMyMentor = Array.isArray(myMentors) &&
			myMentors.some((mentor: { uuid: string }) => mentor.uuid === mentorData.mentorUuid);
	}

	// Check if user has already rated this mentor
	if (Array.isArray(mentorData.reviews)) {
		alreadyRated = mentorData.reviews.some((r: any) => r.reviewer?.uuid === currentUser.uuid);
	}

	console.log(alreadyRequested,
		alreadyMyMentor,
		alreadyRated)
	return {
		mentor: mentorData,
		alreadyRequested,
		alreadyMyMentor,
		alreadyRated
	};
};

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

		return {success: true};
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

		return redirect(303, `/mentorship/mentor-profile/${mentorUuid}`);
	}
};