import type { Chat, ChatMessage, ChatPreview } from '$lib/interfaces/Interfaces';
import { io, Socket } from 'socket.io-client';

export default class ChatApi {
	private static readonly AUTH_API_BASE_URL = 'http://localhost:3000/';
	private static socket: Socket | null = null;
	private static messageListeners: Map<string, (message: any) => void> = new Map();
	private static connectionAttempts = 0;
	private static readonly MAX_RECONNECT_ATTEMPTS = 5;
	private static isConnecting = false;
	private static accessToken = "";

	public static initializeSocket(userId: string, accessToken: string): void {
		this.accessToken = accessToken;
		if (this.socket && this.socket.connected) {
			this.socket.emit('authenticate', { userId });

			console.log('Socket already connected, reusing existing connection');
			return;
		}

		if (this.isConnecting) {
			console.log('Socket connection already in progress');
			return;
		}

		if (this.connectionAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
			console.log('Max reconnection attempts reached. Please refresh the page.');
			return;
		}

		this.isConnecting = true;
		this.connectionAttempts++;
		console.log(`Initializing socket connection (attempt ${this.connectionAttempts})...`);

		try {
			this.socket = io(this.AUTH_API_BASE_URL, {
				withCredentials: true,
				reconnectionAttempts: this.MAX_RECONNECT_ATTEMPTS,
				timeout: 10000,
				transports: ['websocket', 'polling'],
				auth: {
					token: this.accessToken,
					userId: userId,
				}
			});


			this.socket.on('connect', () => {
				console.log('Socket connected with ID:', this.socket?.id);
				this.connectionAttempts = 0;
				this.isConnecting = false;
				if (userId) {
					this.socket?.emit('authenticate', { userId });
				}
			});


			if (userId) {
				console.log(`Authenticating socket with user ID: ${userId}`);
				this.socket.emit('authenticate', { userId });
			} else {
				console.warn('No user ID available for socket authentication');
			}

			this.socket.on('connect_error', (error) => {
				console.error('Socket connection error:', error);
				this.isConnecting = false;
			});

			this.socket.on('disconnect', (reason) => {
				console.log('Socket disconnected:', reason);
				this.isConnecting = false;
			});

			this.socket.on('error', (error) => {
				console.error('Socket error:', error);
				this.isConnecting = false;
			});

			// Listen for messages and dispatch them to all registered listeners
			this.socket.on('message', (data: any) => {
				console.log('Received message via socket:', data);
				this.messageListeners.forEach((callback) => {
					callback(data);
				});
			});
		} catch (error) {
			console.error('Error initializing socket:', error);
			this.isConnecting = false;
		}
	}

	// Helper method that waits for the socket to connect.
	private static waitForConnection(timeout = 5000): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.socket && this.socket.connected) {
				resolve();
			} else {
				const timer = setTimeout(() => {
					reject(new Error("Socket connection timeout"));
				}, timeout);
				this.socket?.once('connect', () => {
					clearTimeout(timer);
					resolve();
				});
			}
		});
	}

	public static addMessageListener(callback: (message: any) => void): () => void {
		const id = Date.now().toString();
		this.messageListeners.set(id, callback);
		console.log(`Added message listener with ID: ${id}`);
		return () => {
			this.messageListeners.delete(id);
			console.log(`Removed message listener with ID: ${id}`);
		};
	}

	public static removeMessageListener(callback: (message: any) => void): void {
		let foundId: string | null = null;
		this.messageListeners.forEach((cb, id) => {
			if (cb === callback) {
				foundId = id;
			}
		});
		if (foundId) {
			this.messageListeners.delete(foundId);
			console.log(`Removed message listener with ID: ${foundId}`);
		}
	}

	public static async sendMessage(chat: Chat, content: string, senderUuid: string): Promise<ChatMessage | null> {
		console.log(`Sending message to chat ${chat.uuid}:`, content);

		if (!chat.uuid || !content.trim()) {
			console.error('Invalid chat ID or empty message');
			return null;
		}

		// Ensure socket is connected before sending
		if (!this.socket || !this.socket.connected) {
			console.log('Socket not connected, attempting to initialize...');
			this.initializeSocket(senderUuid, this.accessToken);
			try {
				await this.waitForConnection();
			} catch (error) {
				console.error('Failed to connect to chat server:', error);
				throw new Error('Could not connect to chat server');
			}
		}

		try {
			const messageData = {
				chatId: chat.uuid,
				content,
				senderId: senderUuid,
				recipientId: chat.otherUser?.uuid
			};

			// Emit message via socket
			this.socket.emit('message', messageData);
			console.log('Message sent via socket');

			// Return a temporary message object for immediate UI update
			return {
				uuid: crypto.randomUUID(),
				content: messageData.content,
				sender: messageData.senderId,
				chat: messageData.chatId,
				createdAt: new Date(),
				updatedAt: new Date()
			};
		} catch (error) {
			console.error('Error sending message:', error);
			throw error;
		}
	}

	public static disconnect(): void {
		if (this.socket) {
			console.log('Disconnecting socket...');
			this.socket.disconnect();
			this.socket = null;
			this.messageListeners.clear();
			console.log('Socket disconnected and listeners cleared');
		}
	}

	public static async getChats(): Promise<ChatPreview[]> {
		try {
			const response = await fetch(`${this.AUTH_API_BASE_URL}api/chat`, {
				headers: {
					Authorization: `Bearer ${this.accessToken}`
				}
			});

			if (!response.ok) {
				console.error('Failed to fetch chats, status:', response.status);
				throw new Error('Failed to fetch chats');
			}

			const chats = await response.json();
			console.log('Successfully fetched chats:', chats.length);

			const processedChats = chats.map((chat: any) => {
				const currentUserId = this.getUserIdFromToken();
				const otherUser =
					chat.users?.find((userObj: any) => userObj.user?.uuid !== currentUserId)?.user || {};

				return {
					uuid: chat.uuid,
					otherUser: {
						...otherUser,
						status: otherUser.isOnline ? 'online' : 'offline'
					},
					lastMessage: (chat.messages && chat.messages.length > 0)
						? chat.messages[chat.messages.length - 1]
						: null,
					unreadCount: chat.unreadCount || 0
				};
			});

			console.log('Processed chats for UI:', processedChats.length);
			if (processedChats.length > 0) {
				console.log('First processed chat sample:', JSON.stringify(processedChats[0], null, 2));
			}

			return processedChats;
		} catch (error) {
			console.error('Error fetching chats:', error);
			return [];
		}
	}

	public static async getChat(chatId: string): Promise<Chat | null> {
		console.log(`Fetching chat with ID: ${chatId}`);
		if (!chatId) {
			console.error('Invalid chat ID provided');
			return null;
		}
		try {
			const token = this.accessToken;
			if (!token) {
				console.error('No access token available');
				return null;
			}
			const response = await fetch(`${this.AUTH_API_BASE_URL}api/chat/${chatId}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
			if (!response.ok) {
				console.error(`Failed to fetch chat ${chatId}, status:`, response.status);
				const errorText = await response.text();
				console.error('Error response:', errorText);
				throw new Error(`Failed to fetch chat: ${errorText}`);
			}
			const chat = await response.json();
			if (!chat) {
				console.error(`Retrieved empty chat data for ID: ${chatId}`);
				return null;
			}
			console.log(`Successfully fetched chat with ${chat.messages?.length || 0} messages`);

			if (!chat.messages) {
				chat.messages = [];
			}

			if (chat.users && Array.isArray(chat.users)) {
				const currentUserId = this.getUserIdFromToken();
				console.log(`Current user ID: ${currentUserId}`);
				console.log(`Chat users: ${chat.users.length}`);

				const otherUserObj = chat.users.find(
					(userChat: any) => userChat.user.uuid !== currentUserId
				);

				if (otherUserObj) {
					chat.otherUser = otherUserObj.user;
					console.log(`Other user found: ${chat.otherUser.firstName} ${chat.otherUser.lastName}`);
				} else {
					console.warn('Could not find other user in chat', chat.users);
				}
			} else {
				console.warn('Chat has no users array', chat);
			}
			return chat;
		} catch (error) {
			console.error(`Error fetching chat ${chatId}:`, error);
			return null;
		}
	}

	public static async markAsRead(chatId: string): Promise<boolean> {
		if (!chatId) {
			console.error('Invalid chat ID provided for marking as read');
			return false;
		}
		try {
			const token = this.accessToken;
			if (!token) {
				console.error('No access token available');
				return false;
			}
			console.log(`Marking chat ${chatId} as read`);
			const response = await fetch(`${this.AUTH_API_BASE_URL}api/chat/${chatId}/read`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) {
				console.error(`Failed to mark chat ${chatId} as read, status:`, response.status);
				return false;
			}
			console.log(`Successfully marked chat ${chatId} as read`);
			return true;
		} catch (error) {
			console.error('Error marking messages as read:', error);
			return false;
		}
	}

	// Extract the user ID from the access token.
	private static getUserIdFromToken(): string | null {
		const token = this.accessToken;
		if (!token) {
			console.warn('No access token available for socket authentication');
			return null;
		}
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
					.join('')
			);
			const payload = JSON.parse(jsonPayload);
			return payload.sub || null;
		} catch (e) {
			console.error('Error parsing token:', e);
			return null;
		}
	}

	public static debug(): void {
		const token = this.accessToken;
		console.log('Debug ChatApi:');
		console.log('- Access token exists:', !!token);
		if (token) {
			console.log('- Token length:', token.length);
			try {
				console.log(
					'- Token preview:',
					token.substring(0, 10) + '...' + token.substring(token.length - 10)
				);
				console.log('- User ID from token:', this.getUserIdFromToken());
			} catch (e) {
				console.error('- Error parsing token:', e);
			}
		}
		console.log('- Socket connected:', !!this.socket?.connected);
		console.log('- Connection attempts:', this.connectionAttempts);
		console.log('- Message listeners:', this.messageListeners.size);
	}
}
