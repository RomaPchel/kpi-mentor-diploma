import { type Handle, redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	console.log(event.url.pathname)
	if (event.url.pathname === '/login') {
		return resolve(event);
	}

	let token = event.cookies.get('access_token');
	const refreshToken = event.cookies.get('refresh_token');

	if (!token && !refreshToken){
		throw redirect(307, '/login')
	}

	// Try to refresh the token if needed
	if (!token && refreshToken) {
		try {
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

	// Fetch user data if token exists and store in locals
	if (token) {
		try {
			const userResponse = await fetch('http://localhost:3000/api/auth/me', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			
			if (userResponse.ok) {
				const userData = await userResponse.json();
				event.locals.user = userData;
				event.locals.accessToken = token;
				event.locals.refreshToken = refreshToken || '';
				event.locals.isAuthenticated = true;
			}
		} catch (error) {
			console.error('Error fetching user data:', error);
		}
	}

	// Add custom getClientAddress function
	event.locals.getClientAddress = () => {
		const forwarded = event.request.headers.get('x-forwarded-for');
		const realIp = event.request.headers.get('x-real-ip');
		
		const ip = forwarded 
			? forwarded.split(',')[0].trim() 
			: realIp 
				? realIp 
				: event.getClientAddress();
				
		return ip;
	};

	return resolve(event);
};
