import type { ChatPreview } from '$lib/interfaces/Interfaces';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, cookies, fetch }) => {
	const parentData = await parent();
	const accessToken = cookies.get('access_token');

	let chats: ChatPreview[] = [];

	if (!accessToken) {
		return {
			chats,
			user: parentData.user,
			isLoggedIn: parentData.isLoggedIn
		};
	}

	try {
		const chatsResponse = await fetch('http://localhost:3000/api/chat', {
			headers: {
				'Authorization': `Bearer ${accessToken}`
			}
		});

		if (chatsResponse.ok) {
			chats = await chatsResponse.json();
		} else {
			const errorText = await chatsResponse.text();
			console.error(`Failed to fetch chats: Status ${chatsResponse.status}`, errorText);
		}
	} catch (error) {
		console.error('Error loading chat data:', error);
	}

	return {
		chats,
		user: parentData.user,
		isLoggedIn: parentData.isLoggedIn
	};
};
