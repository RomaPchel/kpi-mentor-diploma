import { type Handle, redirect } from '@sveltejs/kit';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(event.url.pathname);
	if (event.url.pathname === '/login' || event.url.pathname === '/register') {
		return resolve(event);
	}

	let token = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	if (!token && !refreshToken) {
		throw redirect(307, '/login');
	}

	if (!token && refreshToken) {
		try {
			const refreshResponse = await fetch(
				`${PUBLIC_SERVER_URL}/api/auth/refresh/${refreshToken}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				}
			);

			if (refreshResponse.ok) {
				const data = await refreshResponse.json();
				token = data.accessToken;

				event.cookies.set('access_token', token as string, {
					path: '/',
					httpOnly: true,
					sameSite: 'lax'
				});
			}
		} catch (err) {
			console.error('Error refreshing token pre-request:', err);
		}
	}

	// Fetch user data if token exists and store in locals
	if (token) {
		try {
			const userResponse = await fetch(`${PUBLIC_SERVER_URL}/api/auth/me`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (userResponse.ok) {
				event.locals.user = await userResponse.json();
				event.locals.accessToken = token;
				event.locals.refreshToken = refreshToken || '';
				event.locals.isAuthenticated = true;
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	}

	return resolve(event);
};
