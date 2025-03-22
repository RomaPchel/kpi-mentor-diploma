import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;

		const response = await fetch('https://2e28-176-37-189-48.ngrok-free.app/api/auth/register', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: email, password: password, firstName: firstName, lastName: lastName }),
		});

		if (response) {
			const body = await response.json();
			locals.accessToken = body.accessToken;
			locals.refreshToken = body.refreshToken;
			locals.isAuthenticated = true;

			cookies.set('access_token', body.accessToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24
			});
			cookies.set('refresh_token', body.refreshToken, {
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
