import { redirect } from '@sveltejs/kit';
import { AuthApi } from '$lib/API/AuthApi';
import type { TokenSet } from '$lib/interfaces/Interfaces';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;

		const response: TokenSet = await AuthApi.register({ email, password, firstName, lastName });

		if (response) {
			locals.accessToken = response.accessToken;
			locals.refreshToken = response.refreshToken;
			locals.isAuthenticated = true;

			cookies.set('access_token', response.accessToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24
			});
			cookies.set('refresh_token', response.refreshToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});

			throw redirect(303, '/dashboard');
		}
		return { success: false, error: 'Invalid credentials' };
	}
};
