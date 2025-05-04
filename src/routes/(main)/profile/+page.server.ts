import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/(main)/profile/$types';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import { type Actions, fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	return {
		profile: parentData.user,
		user: parentData.user ,
		isLoggedIn: parentData.isLoggedIn
	};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		try {
			// Clone the request to read form data
			const clonedRequest = request.clone();
			const data = await clonedRequest.formData();

			// Extract all form data at once
			const formData = Object.fromEntries(data.entries());
			const interests = data.getAll('interests') as string[];

			const profileData = {
				firstName: formData.firstName as string,
				lastName: formData.lastName as string,
				email: formData.email as string,
				avatar: formData.avatar as string,
				bio: formData.bio as string,
				specializationTitle: formData.specializationTitle as string,
				specializationCode: formData.specializationCode as string,
				formOfEducation: formData.formOfEducation as string,
				groupCode: formData.groupCode as string,
				department: formData.department as string,
				interests: interests.length > 0 ? interests : [],
			};


			const response = await fetch(`${PUBLIC_SERVER_URL}/api/users`, {
				method: 'PUT',
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${cookies.get('access_token')}`,
				},
				body: JSON.stringify(profileData)
			});

			if (!response.ok) {
				const error = await response.json();
				return fail(response.status, {
					message: error.message || 'Failed to update profile',
					error: true
				});
			}

			return { success: true };
		} catch (error) {
			console.error('Profile update error:', error);
			return fail(500, {
				message: 'Internal server error',
				error: true
			});
		}
	}
};