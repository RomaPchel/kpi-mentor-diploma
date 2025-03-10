import { writable } from 'svelte/store';

export type AuthState = {
	isAuthenticated: boolean;
	accessToken: string | null;
	refreshToken: string | null;
};

export const authState = writable<AuthState>({
	isAuthenticated: false,
	accessToken: null,
	refreshToken: null
});

export function setAuthState(accessToken: string, refreshToken: string) {
	authState.set({
		isAuthenticated: true,
		accessToken,
		refreshToken
	});
}

export function logout() {
	authState.set({
		isAuthenticated: false,
		accessToken: null,
		refreshToken: null
	});

}
