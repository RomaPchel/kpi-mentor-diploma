import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { LoginRequest, RegisterRequest, TokenSet } from '$lib/interfaces/Interfaces';
import Cookies from 'js-cookie';
import { redirect } from '@sveltejs/kit';

export class AuthApi {
	private static readonly AUTH_API_BASE_URL = 'http://localhost:3000/';
	private static api: AxiosInstance = this.getHttpClient();
	private static refreshInProgress = false;
	private static refreshPromise: Promise<TokenSet | null> | null = null;

	private static getHttpClient(): AxiosInstance {
		const axiosInstance = axios.create({
			baseURL: this.AUTH_API_BASE_URL,
			headers: { 'Content-Type': 'application/json' }
		});

		axiosInstance.interceptors.request.use((config) => {
			const token = Cookies.get('access_token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});

		return this.addInterceptors(axiosInstance);
	}

	private static addInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
		axiosInstance.interceptors.response.use(
			(response: AxiosResponse) => response,
			async (error) => {
				if (error.response?.status !== 401) return Promise.reject(error);
				if (!error.config) return Promise.reject(error);

				if (this.refreshPromise) {
					await this.refreshPromise;
				} else {
					this.refreshInProgress = true;
					this.refreshPromise = this.refreshAccessToken();
					await this.refreshPromise;
					this.refreshPromise = null;
					this.refreshInProgress = false;
				}

				const token = Cookies.get('access_token');
				if (token) {
					error.config.headers.Authorization = `Bearer ${token}`;
					return axios(error.config);
				}
				return Promise.reject(error);
			}
		);
		return axiosInstance;
	}

	public static async login(body: LoginRequest) {
		const response = await this.api.post('api/auth/login', body);

		return response.data;
	}

	public static async register(body: RegisterRequest) {
		const response = await this.api.post('api/auth/register', body);
		Cookies.set('access_token', response.data.accessToken, {
			expires: 1,
		});
		Cookies.set('refresh_token', response.data.refreshToken, {
			expires: 7,
		});
		return response.data;
	}


	public static async getUserDetails() {
		try {
			console.log("ADASDAAAA")
			console.log(Cookies.get())
			const response = await this.api.get('/api/auth/me', {headers: {Authorization: `Bearer ${Cookies.get('access_token')}`}});
			return response.data;
		} catch (error) {
			// console.error('Failed to fetch user details:', error);
			return null;
		}
	}

	public static async refreshAccessToken(): Promise<TokenSet | null> {
		try {
			const refreshToken = Cookies.get('refresh_token');
			if (!refreshToken) {
				throw new Error('No refresh token available');
			}
			const response = await this.api.get(`refresh/${refreshToken}`);
			Cookies.set('access_token', response.data.accessToken, {
				expires: 1,
				secure: process.env.NODE_ENV === 'production'
			});
			Cookies.set('refresh_token', response.data.refreshToken, {
				expires: 7,
				secure: process.env.NODE_ENV === 'production'
			});
			return response.data;
		} catch (error) {
			console.error('Token refresh failed:', error.response?.data || error.message);
			this.logout();
			return null;
		}
	}

	public static logout() {
		Cookies.remove('access_token');
		Cookies.remove('refresh_token');
		redirect(303, '/login');
	}
}
