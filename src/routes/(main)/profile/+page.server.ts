import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/(main)/profile/$types';

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();
	

	const profileData = {
		firstName: 'John',
		lastName: 'Doe',
		bio: 'Computer Science student passionate about web development and artificial intelligence.',
		university: 'Kyiv Polytechnic Institute',
		department: 'Computer Science',
		graduationYear: '2025',
		interests: 'Web Development, Machine Learning, Data Science',
		notifications: {
			email: true,
			mentorMatch: true
		}
	};
	
	return {
		profile: profileData,
		user: { ...parentData.user, ...profileData },
		isLoggedIn: parentData.isLoggedIn
	};
}; 