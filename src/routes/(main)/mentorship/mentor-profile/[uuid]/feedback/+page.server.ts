import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export const actions: Actions = {
	report: async ({ request, cookies, params }) => {
		const clonedRequest = request.clone();
		const formData = await clonedRequest.formData();
		const message = formData.get('message')?.toString();
		const anonymous = formData.get('anonymous') === 'true';

		if (!message || typeof message !== 'string') {
			return fail(400, { message: 'Message is required.' });
		}
		console.log("ASDASDASDASDASDASD")

		console.log(`${PUBLIC_SERVER_URL}/api/mentors/${params.uuid}/report`)
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/mentors/${params.uuid}/report`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message, anonymous })
		});

		if (!res.ok) {
			return fail(res.status, { message: 'Failed to submit feedback' });
		}

		return { success: true };
	}
};
