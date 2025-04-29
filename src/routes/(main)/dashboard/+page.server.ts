import { redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export async function load({ parent, cookies }) {
	const parentData = await parent();
	const user = parentData.user;
	if (!user) throw redirect(303, '/login');

	const mentors = await fetch(`${PUBLIC_SERVER_URL}/api/mentors`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})



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
		console.log(mentees);

		const menteesData = await mentees.json();
		return {
			role: 'MENTOR',
			user,
			requests: data.requests,
			stats: {
				totalRequests: data.requests.length,
				activeMentees: menteesData.length,
			}
		};
	}

	if (user.role === 'student') {

		return {
			role: 'STUDENT',
			user,
			mentors: await mentors.json()
		};
	}

	throw redirect(303, '/unauthorized');
}
