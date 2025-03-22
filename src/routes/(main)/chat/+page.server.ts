import type { ChatPreview } from '$lib/interfaces/Interfaces';
import type { PageServerLoad } from './$types';
import ChatApi from '$lib/API/ChatApi';


export const load: PageServerLoad = async ({ parent, cookies, fetch, locals }) => {
	const parentData = await parent();
	const accessToken = cookies.get('access_token');

	if (parentData.user && parentData.user.uuid) {
		locals.user = parentData.user;
	}

	ChatApi.initializeSocket(parentData.user.uuid, cookies.get('access_token') as string);

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
			method: 'GET',
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		if (chatsResponse.ok) {
			chats = await chatsResponse.json();
			
			// Process chats for display
			chats = chats.map((chat: any) => {
				// Make sure messages array exists
				if (!chat.messages) {
					chat.messages = [];
				}
				
				// Add unread count if not present
				if (chat.unreadCount === undefined) {
					chat.unreadCount = 0;
				}
				
				return chat;
			});
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
