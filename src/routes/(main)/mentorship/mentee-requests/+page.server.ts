import { error, redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import type {
	PageServerLoad
} from '../../../../../.svelte-kit/types/src/routes/(main)/mentorship/mentee-requests/$types.js';

export const load: PageServerLoad = async ({ cookies }) => {
	const requests = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/requests`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	})

	const data = await requests.json();
	return {
		requests: data.requests,
	};
}

export const actions = {
	approve: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const uuid = values.get('uuid')?.toString();

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/requests/${uuid}/approve`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		});

		return redirect(303, '/chat');
	},

	reject: async ({ request, cookies }) => {
		const clonedRequest = request.clone();
		const values = await clonedRequest.formData();
		const uuid = values.get('uuid')?.toString();

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/mentees/requests/${uuid}/reject`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${cookies.get('access_token')}`,
			},
		});

		return redirect(303, '/mentorship/mentee-requests');
	}
};