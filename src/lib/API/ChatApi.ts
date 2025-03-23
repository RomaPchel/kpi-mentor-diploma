import type { Chat, ChatMessage, ChatPreview } from '$lib/interfaces/Interfaces';
import { io, Socket } from 'socket.io-client';
import { PUBLIC_SERVER_URL } from '$env/static/public';

export enum SocketEvents {
	CONNECT = "connect",
	DISCONNECT = "disconnect",
	CONNECT_ERROR = "connect_error",
	AUTHENTICATE = "authenticate",
	CHAT_MESSAGE = "chat:message",
	MESSAGE_RECEIVED = "message:received",
	USER_ONLINE = "user:online",
	USER_OFFLINE = "user:offline",
	TYPING_START = "typing:start",
	TYPING_STOP = "typing:stop",
}

export default class ChatApi {
	private static readonly AUTH_API_BASE_URL = PUBLIC_SERVER_URL;
	private static socket: Socket | null = null;
	private static messageListeners: Map<string, (message: any) => void> = new Map();
	private static connectionAttempts = 0;
	private static readonly MAX_RECONNECT_ATTEMPTS = 5;
	private static isConnecting = false;
	private static accessToken = "";

	/**
	 * Initialize the Socket.IO connection.
	 * If already connected, reuse the existing connection.
	 */
	public static initializeSocket(userId: string, accessToken: string): void {
		this.accessToken = accessToken;
		if (this.socket && this.socket.connected) {
			this.socket.emit(SocketEvents.AUTHENTICATE, { userId });
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
					userId
				}
			});

			this.socket.on(SocketEvents.CONNECT, () => {
				console.log('Socket connected with ID:', this.socket?.id);
				this.connectionAttempts = 0;
				this.isConnecting = false;
				if (userId) {
					this.socket?.emit(SocketEvents.AUTHENTICATE, { userId });
				}
			});

			this.socket.on(SocketEvents.CONNECT_ERROR, (error) => {
				console.error('Socket connection error:', error);
				this.isConnecting = false;
			});

			this.socket.on(SocketEvents.DISCONNECT, (reason) => {
				console.log('Socket disconnected:', reason);
				this.isConnecting = false;
			});

			this.socket.on('error', (error) => {
				console.error('Socket error:', error);
				this.isConnecting = false;
			});

			this.socket.on(SocketEvents.CHAT_MESSAGE, (data: any) => {
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

	/**
	 * Returns a promise that resolves when the socket is connected.
	 */
	private static waitForConnection(timeout = 5000): Promise<void> {
		return new Promise((resolve, reject) => {
			if (this.socket && this.socket.connected) {
				resolve();
			} else {
				const timer = setTimeout(() => {
					reject(new Error("Socket connection timeout"));
				}, timeout);
				this.socket?.once(SocketEvents.CONNECT, () => {
					clearTimeout(timer);
					resolve();
				});
			}
		});
	}

	/**
	 * Registers a message listener.
	 * Returns an unsubscribe function.
	 */
	public static addMessageListener(callback: (message: any) => void): () => void {
		const id = Date.now().toString();
		this.messageListeners.set(id, callback);
		console.log(`Added message listener with ID: ${id}`);
		return () => {
			this.messageListeners.delete(id);
			console.log(`Removed message listener with ID: ${id}`);
		};
	}

	/**
	 * Remove a specific message listener.
	 */
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

			this.socket.emit(SocketEvents.CHAT_MESSAGE, messageData);
			console.log('Message sent via socket');

			// Create and return a temporary message.
			return {
				uuid: crypto.randomUUID(),
				content: messageData.content,
				sender: { uuid: messageData.senderId },
				chat: messageData.chatId,
				createdAt: new Date(),
				updatedAt: new Date()
			};
		} catch (error) {
			console.error('Error sending message:', error);
			throw error;
		}
	}

	/**
	 * Disconnects the socket and clears listeners.
	 */
	public static disconnect(): void {
		if (this.socket) {
			console.log('Disconnecting socket...');
			this.socket.disconnect();
			this.socket = null;
			this.messageListeners.clear();
			console.log('Socket disconnected and listeners cleared');
		}
	}

	// Additional helper functions (e.g., getChats, getChat, markAsRead, getUserIdFromToken, debug)
	// remain similar to your original implementation.
	// ...

	/**
	 * Extract the user ID from the JWT access token.
	 */
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
