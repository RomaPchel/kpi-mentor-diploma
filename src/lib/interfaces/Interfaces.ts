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
}

export interface TokenSet {
	accessToken: string;
	refreshToken: string;
}

