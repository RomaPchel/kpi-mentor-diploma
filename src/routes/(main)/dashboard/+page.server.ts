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

	if (user.role === 'student') {
		const  mentorsRes= await fetch(`${PUBLIC_SERVER_URL}/api/mentors`, {
			headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
			})
		console.log(mentorsRes)

		const activeMentorsRes = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/my-mentors`, {
			headers: { Authorization: `Bearer ${cookies.get('access_token')}` }
		})

		const mentors = await mentorsRes.json();
		const activeMentors = await activeMentorsRes.json();
		return {
			role: 'STUDENT',
			user,
			mentors,
			activeMentors: activeMentors ?? []
		};
	}

	throw redirect(303, '/unauthorized');
}
