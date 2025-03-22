import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes/$types';
import ChatApi from '$lib/API/ChatApi';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({cookies}) => {
	const res = await fetch('https://2e28-176-37-189-48.ngrok-free.app/api/auth/me', {
		headers: {
			Authorization: `Bearer ${cookies.get('access_token')}`,
		}
	});

	if (!res.ok) {
		throw redirect(307, '/login')
	}

	const user = await res.json();
	ChatApi.initializeSocket(user.uuid, cookies.get('access_token') as string);

	return {
		isLoggedIn: !!user,
		user: user
	};
};