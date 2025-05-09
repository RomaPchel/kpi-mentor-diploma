import { redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;


		const response = await fetch(`${PUBLIC_SERVER_URL}/api/auth/login`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email, password: password })
		});

		if (response.ok) {
			const body = await response.json();

			console.log(body);
			const accessToken = body.accessToken;
			const refreshToken = body.refreshToken;
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

		const errorBody = await response.json();

		return {
			success: false,
			error: errorBody
		};
	}
};
