import { redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export const actions = {
	default: async ({ request, locals, cookies }) => {
		const data = await request.formData();

		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const specializationTitle = data.get('specializationTitle') as string;
		const course = data.get('course') as string;
		const formOfEducation = data.get('formOfEducation') as string;
		const groupCode = data.get('groupCode') as string;
		const department = data.get('department') as string;

		const interests = data.getAll('interests').map((val) => val.toString());

		const response = await fetch(`${PUBLIC_SERVER_URL}/api/auth/register`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
				firstName,
				lastName,
				specializationTitle,
				formOfEducation,
				groupCode,
				department,
				interests,
				course,
			}),
		});

		if (response.ok) {
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

		return {
			success: false,
			error: 'Registration failed. Please check your data and try again.',
		};
	}
};
