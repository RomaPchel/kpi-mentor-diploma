export interface Mentor {
	uuid: string
	name: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
}


export interface User {
	uuid: string;
	role: string;
	email: string;
	avatar: string;
	firstName?: string;
	lastName?: string;
}

export interface TokenSet {
	accessToken: string;
	refreshToken: string;
}

export interface Chat {
	uuid: string;
	privateName?: string;
	users: ChatUser[];
	messages: ChatMessage[];
	createdAt: Date;
	updatedAt: Date;
	otherUser?: User;
}

export interface ChatUser {
	uuid: string;
	user: User;
	chat: Chat;
	lastReadAt?: Date;
}

export interface ChatMessage {
	uuid: string
	content: string;
	sender: {
		uuid: string;
	};
	chat: Chat;
	createdAt: Date;
	updatedAt: Date;
}

export interface SendMessageRequest {
	senderId: string;
	recipientId: string;
	content: string;
}

export interface ChatPreview {
	uuid: string;
	otherUser: User;
	lastMessage?: ChatMessage;
	messages: ChatMessage[];
	unreadCount: number;
}

