import { PUBLIC_SERVER_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			const values = await request.formData();
			const motivation = values.get('motivation') as string;

			// Validate input
			if (!motivation || motivation.trim().length < 50) {
				return fail(400, {
					success: false,
					message: 'Motivation must be at least 50 characters'
				});
			}

			console.log(motivation);
			// Make API request
			const response = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/requests`, {
				method: 'POST',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${cookies.get('access_token')}`,
				},
				body: JSON.stringify({ motivation })
			});

			if (!response.ok) {
				const error = await response.json();
				return fail(response.status, {
					success: false,
					message: error.message || 'Failed to submit request'
				});
			}

			return { success: true, message: 'Request submitted successfully!' };
		} catch (error) {
			console.error('Error submitting mentor request:', error);
			return fail(500, {
				success: false,
				message: 'An unexpected error occurred'
			});
		}
	}
};

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/requests`, {
			method: 'GET',
			headers: {
				"Authorization": `Bearer ${cookies.get('access_token')}`,
			}
		});

		if (!res.ok) {
			throw new Error('Failed to fetch request status');
		}

		const data = await res.json();
		return {
			requestExists: !!data
		};
	} catch (error) {
		console.error('Error loading mentor request status:', error);
		return {
			requestExists: false
		};
	}
};