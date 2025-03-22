import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/api/auth/refresh') {
		return resolve(event);
	}

	let token = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');


	if (!token && refreshToken) {
		try {
			console.log("refreshing")
			const refreshResponse = await fetch(`http:localhost:3000/api/auth/refresh/${refreshToken}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				},
			});

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

	return resolve(event);
};
