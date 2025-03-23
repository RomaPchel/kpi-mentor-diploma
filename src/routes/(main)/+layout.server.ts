import type { LayoutServerLoad } from '../../../.svelte-kit/types/src/routes/(main)/$types.js';
import ChatApi from '$lib/API/ChatApi.js';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({cookies}) => {
	try {
		const res = await fetch(`${PUBLIC_SERVER_URL}/api/auth/me`, {
			headers: {
				Authorization: `Bearer ${cookies.get('access_token')}`,
			}
		});

		const user = await res.json();
		ChatApi.initializeSocket(user.uuid, cookies.get('access_token') as string);

		return {
			isLoggedIn: !!user,
			user: user
		};
	}catch (e) {
		throw redirect(307, '/login');
	}

};