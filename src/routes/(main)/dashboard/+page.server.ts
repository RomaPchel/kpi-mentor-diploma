import { redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export async function load({ parent, cookies }) {
	const parentData = await parent();
	const user = parentData.user;
	if (!user) throw redirect(303, '/login');

	if (user.role === 'mentor') {
		const requests = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/mentee-requests`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			}
		})

		const mentees = await fetch(`${PUBLIC_SERVER_URL}/api/mentees`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			}
		})
		const data = await requests.json();

		const menteesData = await mentees.json();
		return {
			role: 'MENTOR',
			user,
			requests: data.requests,
			activeMentors: [],
			stats: {
				totalRequests: data.requests.length,
				activeMentees: menteesData.length,
			}
		};
	}

	if (user.role === 'admin') {
		const allRequests = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/become-mentor-request/all`, {
			headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
		});

		const requestsData = await allRequests.json();

		return {
			role: 'ADMIN',
			user,
			allRequests: requestsData ?? []
		};
	}

	if (user.role === 'student') {
		const  mentorsRes= await fetch(`${PUBLIC_SERVER_URL}/api/mentors`, {
			headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
			})

		const activeMentorsRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/my-mentors`, {
			headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
		})

		const mentors = await mentorsRes.json();
		const activeMentors = await activeMentorsRes.json();

		const activeMentorUuids = new Set(activeMentors.map((m: { uuid: string }) => m.uuid));

		const availableMentors = mentors.filter((m: { mentorUuid: string }) => {
			const normalized = m.mentorUuid.trim();
			const isActive = activeMentorUuids.has(normalized);
			if (isActive) {
				console.log('Excluded active mentor:', normalized);
			}
			return !isActive;
		});


		return {
			role: 'STUDENT',
			user,
			availableMentors,
			activeMentors: activeMentors ?? []
		};
	}

	throw redirect(303, '/unauthorized');
}

export const actions = {
	approve: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const data = await clonedRequest.formData();
		const uuid = data.get('uuid')?.toString();

		console.log(uuid)
		await fetch(`${PUBLIC_SERVER_URL}/api/mentors/become-mentor-request/${uuid}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`
			},
			body: JSON.stringify({status: 'approved'}),
		});

		return redirect(303, '/dashboard');
	},

	reject: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const data = await clonedRequest.formData();
		const uuid = data.get('uuid')?.toString();

		await fetch(`${PUBLIC_SERVER_URL}/api/mentors/become-mentor-request/${uuid}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`
			},
			body: JSON.stringify({status: 'rejected'}),

		});

		return redirect(303, '/dashboard');
	}
};
