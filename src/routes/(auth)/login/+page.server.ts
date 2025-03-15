import { redirect } from '@sveltejs/kit';
import { AuthApi } from '$lib/API/AuthApi';
import type { TokenSet } from '$lib/interfaces/Interfaces';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;

		const response: TokenSet = await AuthApi.login({ email, password });

		if (response) {
			const accessToken = response.accessToken;
			const refreshToken = response.refreshToken;
			cookies.set('access_token', accessToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24
			});
			cookies.set('refresh_token', refreshToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7
			});
			locals.accessToken = accessToken;
			locals.refreshToken = refreshToken;
			locals.isAuthenticated = true;

			throw redirect(303, '/dashboard');
		}
		return { success: false, error: 'Invalid credentials' };
	}
};
