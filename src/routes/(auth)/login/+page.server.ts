import { redirect } from '@sveltejs/kit';
import { AuthApi } from '$lib/API/AuthApi';

export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const response = await AuthApi.login({ email, password });

		if (response) {
			locals.accessToken = response.accessToken;
			locals.refreshToken = response.refreshToken;
			locals.isAuthenticated = true;

			throw redirect(303, '/dashboard');
		}
		return { success: false, error: 'Invalid credentials' };
	}
};
