import { redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export async function load({ parent, cookies }) {
	const parentData = await parent();
	const user = parentData.user;
	if (!user) throw redirect(303, '/login');

	let roleLabel: string;

	switch (user.role) {
		case 'student':
			roleLabel = 'STUDENT';
			break;
		case 'admin':
			roleLabel = 'ADMIN';
			break;
		case 'mentor':
			roleLabel = 'MENTOR';
			break;
		default:
			throw redirect(303, '/unauthorized');
	}

	const events = await fetch(`${PUBLIC_SERVER_URL}/api/events`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`
		}
	});

	const users = await fetch(`${PUBLIC_SERVER_URL}/api/users`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`
		}
	});

	const eventsData = await events.json();
	const usersData = await users.json();

	return {
		role: roleLabel,
		user,
		events: eventsData,
		users: usersData
	};
}

export const actions = {
	create: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		console.log(values);
		const url = values.get('url') as string;
		const timestampInput = values.get('timestamp') as string;
		const timestamp = new Date(timestampInput).getTime().toString();
		const participants = values.getAll('participants') as string[];

		await fetch(`${PUBLIC_SERVER_URL}/api/events`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`
			},
			body: JSON.stringify({ url, timestamp, participants })
		});

		return redirect(303, '/events');
	},

	update: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const id = values.get('id')?.toString();
		const url = values.get('url') as string;
		const status = values.get('status') as string;
		const timestampInput = values.get('timestamp') as string;
		const timestamp = new Date(timestampInput).getTime().toString(); // gives 13 digits
		const participants = values.getAll('participants') as string[];

		await fetch(`${PUBLIC_SERVER_URL}/api/events/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`
			},
			body: JSON.stringify({ url, timestamp, status, participants })
		});

		return redirect(303, '/events');
	}
};
