<script lang="ts">

	let { data } = $props();

	let profile = data.user;
	
	let formChanged = $state(false);
	let saving = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');
	
	let avatarPreview = $state(profile.avatar);
	let fileInput: HTMLInputElement;
	
	function updateFormState() {
		formChanged = true;
	}
	
	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			const reader = new FileReader();
			
			reader.onload = (e) => {
				avatarPreview = e.target?.result as string;
				formChanged = true;
			};
			
			reader.readAsDataURL(file);
		}
	}
	
	// Save profile changes
	async function saveProfile() {
		saving = true;
		errorMessage = '';
		successMessage = '';
		
		try {
			// In a real app, you would send the data to your API
			// const response = await fetch('/api/profile', {
			//   method: 'POST',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(profile)
			// });
			
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			// if (response.ok) {
			successMessage = 'Profile updated successfully!';
			formChanged = false;
			// } else {
			//   throw new Error('Failed to update profile');
			// }
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Profile | Student Mentor Platform</title>
</svelte:head>

<main class="profile-page">
	<div class="container">
		<h1>My Profile</h1>
		
		{#if errorMessage}
			<div class="alert alert-error">
				{errorMessage}
			</div>
		{/if}
		
		{#if successMessage}
			<div class="alert alert-success">
				{successMessage}
			</div>
		{/if}
		
		<div class="profile-content">
			<div class="sidebar">
				<div class="avatar-section">
					<div class="avatar-container">
						{#if avatarPreview}
							<img src={avatarPreview} alt="Profile avatar" class="avatar" />
						{:else}
							<div class="avatar-placeholder">
								<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</div>
						{/if}
					</div>
					<label for="avatar-upload" class="avatar-upload-btn">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
							<polyline points="17 8 12 3 7 8"></polyline>
							<line x1="12" y1="3" x2="12" y2="15"></line>
						</svg>
						Upload Photo
					</label>
					<input 
						type="file" 
						id="avatar-upload" 
						accept="image/*" 
						bind:this={fileInput}
						onchange={handleFileSelect}
						style="display: none;"
					/>
				</div>
				
				<div class="profile-nav">
					<a href="#personal-info" class="nav-item active">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
							<circle cx="12" cy="7" r="4"></circle>
						</svg>
						Personal Information
					</a>
					<a href="#academic-info" class="nav-item">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
							<path d="M6 12v5c3 3 9 3 12 0v-5"></path>
						</svg>
						Academic Information
					</a>
					<a href="#account-settings" class="nav-item">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="3"></circle>
							<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
						</svg>
						Account Settings
					</a>
				</div>
			</div>
			
			<div class="profile-form">
				<form onsubmit={saveProfile}>
					<section id="personal-info" class="form-section">
						<h2>Personal Information</h2>
						
						<div class="form-row">
							<div class="form-group">
								<label for="firstName">First Name</label>
								<input 
									type="text" 
									id="firstName" 
									bind:value={profile.firstName}
									oninput={updateFormState}
									placeholder="Enter your first name"
								/>
							</div>
							
							<div class="form-group">
								<label for="lastName">Last Name</label>
								<input 
									type="text" 
									id="lastName" 
									bind:value={profile.lastName} 
									oninput={updateFormState}
									placeholder="Enter your last name"
								/>
							</div>
						</div>
						
						<div class="form-group">
							<label for="email">Email Address</label>
							<input 
								type="email" 
								id="email" 
								bind:value={profile.email} 
								oninput={updateFormState}
								placeholder="Enter your email address"
							/>
							<small>This email is used for login and notifications</small>
						</div>
						
						<div class="form-group">
							<label for="bio">Bio</label>
							<textarea 
								id="bio" 
								bind:value={profile.bio} 
								oninput={updateFormState}
								placeholder="Tell us about yourself"
								rows="4"
							></textarea>
						</div>
					</section>
					
					<section id="academic-info" class="form-section">
						<h2>Academic Information</h2>
						
						<div class="form-group">
							<label for="university">University/Institution</label>
							<input 
								type="text" 
								id="university" 
								bind:value={profile.university} 
								oninput={updateFormState}
								placeholder="Enter your university or institution"
							/>
						</div>
						
						<div class="form-row">
							<div class="form-group">
								<label for="department">Department/Major</label>
								<input 
									type="text" 
									id="department" 
									bind:value={profile.department} 
									oninput={updateFormState}
									placeholder="Enter your department or major"
								/>
							</div>
							
							<div class="form-group">
								<label for="graduationYear">Graduation Year</label>
								<input 
									type="text" 
									id="graduationYear" 
									bind:value={profile.graduationYear} 
									oninput={updateFormState}
									placeholder="Expected graduation year"
								/>
							</div>
						</div>
						
						<div class="form-group">
							<label for="interests">Academic Interests</label>
							<textarea 
								id="interests" 
								bind:value={profile.interests} 
								oninput={updateFormState}
								placeholder="Share your academic interests and areas of expertise"
								rows="3"
							></textarea>
							<small>This helps in matching you with suitable mentors or mentees</small>
						</div>
					</section>
					
					<section id="account-settings" class="form-section">
						<h2>Account Settings</h2>
						
						<div class="form-group">
							<label for="change-password" class="password-label">
								Password
								<button type="button" class="btn-link">Change Password</button>
							</label>
							<input 
								type="password" 
								id="change-password" 
								value="••••••••" 
								disabled 
							/>
						</div>
						
						<div class="notifications-section">
							<h3>Notification Preferences</h3>
							
							<div class="switch-group">
								<label class="switch-label">
									<span>Email Notifications</span>
									<div class="toggle-switch">
										<input type="checkbox" checked />
										<span class="slider"></span>
									</div>
								</label>
								<p class="switch-desc">Receive email notifications about new messages and updates</p>
							</div>
							
							<div class="switch-group">
								<label class="switch-label">
									<span>Mentor Match Alerts</span>
									<div class="toggle-switch">
										<input type="checkbox" checked />
										<span class="slider"></span>
									</div>
								</label>
								<p class="switch-desc">Get notified when you're matched with a new mentor or mentee</p>
							</div>
						</div>
					</section>
					
					<div class="form-actions">
						<button 
							type="button" 
							class="btn btn-secondary"
							disabled={saving || !formChanged}
						>
							Cancel
						</button>
						<button 
							type="submit" 
							class="btn btn-primary"
							disabled={saving || !formChanged}
						>
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</main>

<style>
	.profile-page {
		padding: 2rem 0;
	}
	
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}
	
	h1 {
		margin-bottom: 2rem;
		color: var(--text-color);
	}
	
	.alert {
		padding: 0.75rem 1rem;
		border-radius: var(--border-radius);
		margin-bottom: 1.5rem;
	}
	
	.alert-error {
		background-color: #fee2e2;
		color: #b91c1c;
		border: 1px solid #fecaca;
	}
	
	.alert-success {
		background-color: #dcfce7;
		color: #166534;
		border: 1px solid #bbf7d0;
	}
	
	.profile-content {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 2rem;
	}
	
	.sidebar {
		background-color: white;
		border-radius: var(--border-radius);
		padding: 1.5rem;
		box-shadow: var(--shadow-sm);
		height: fit-content;
	}
	
	.avatar-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 2rem;
	}
	
	.avatar-container {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--primary-light);
		color: var(--primary-color);
	}
	
	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	
	.avatar-placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	
	.avatar-upload-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--primary-color);
		font-size: 0.875rem;
		cursor: pointer;
		padding: 0.5rem 1rem;
		border-radius: var(--border-radius);
		background-color: var(--primary-light);
		transition: var(--transition);
	}
	
	.avatar-upload-btn:hover {
		background-color: #bfdbfe;
	}
	
	.profile-nav {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1rem;
		border-radius: var(--border-radius);
		color: var(--text-color);
		text-decoration: none;
		transition: var(--transition);
	}
	
	.nav-item:hover {
		background-color: var(--secondary-light);
		text-decoration: none;
	}
	
	.nav-item.active {
		background-color: var(--primary-light);
		color: var(--primary-color);
		font-weight: 500;
	}
	
	.profile-form {
		background-color: white;
		border-radius: var(--border-radius);
		padding: 2rem;
		box-shadow: var(--shadow-sm);
	}
	
	.form-section {
		margin-bottom: 2.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--secondary-light);
	}
	
	.form-section:last-of-type {
		border-bottom: none;
		margin-bottom: 1.5rem;
		padding-bottom: 0;
	}
	
	.form-section h2 {
		margin-bottom: 1.5rem;
		color: var(--text-color);
		font-size: 1.25rem;
	}
	
	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	
	.form-group {
		margin-bottom: 1.25rem;
	}
	
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text-color);
	}
	
	input, textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: var(--border-radius);
		background-color: #f8fafc;
		font-size: 1rem;
		transition: var(--transition);
	}
	
	input:focus, textarea:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
	}
	
	small {
		display: block;
		color: var(--text-light);
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}
	
	.password-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.btn-link {
		background: none;
		border: none;
		color: var(--primary-color);
		font-size: 0.875rem;
		cursor: pointer;
		text-decoration: underline;
		padding: 0;
	}
	
	.notifications-section {
		margin-top: 1.5rem;
	}
	
	.notifications-section h3 {
		font-size: 1rem;
		margin-bottom: 1rem;
	}
	
	.switch-group {
		margin-bottom: 1rem;
	}
	
	.switch-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.25rem;
	}
	
	.toggle-switch {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
	}
	
	.toggle-switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}
	
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #cbd5e1;
		transition: var(--transition);
		border-radius: 34px;
	}
	
	.slider:before {
		position: absolute;
		content: "";
		height: 18px;
		width: 18px;
		left: 3px;
		bottom: 3px;
		background-color: white;
		transition: var(--transition);
		border-radius: 50%;
	}
	
	input:checked + .slider {
		background-color: var(--primary-color);
	}
	
	input:checked + .slider:before {
		transform: translateX(24px);
	}
	
	.switch-desc {
		color: var(--text-light);
		font-size: 0.875rem;
		margin: 0;
	}
	
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 2rem;
	}
	
	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: var(--border-radius);
		font-weight: 500;
		cursor: pointer;
		transition: var(--transition);
		border: none;
	}
	
	.btn-primary {
		background-color: var(--primary-color);
		color: white;
	}
	
	.btn-secondary {
		background-color: var(--secondary-light);
		color: var(--secondary-color);
	}
	
	.btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}
	
	.btn-primary:hover:not(:disabled) {
		background-color: #0284c7;
	}
	
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	@media (max-width: 768px) {
		.profile-content {
			grid-template-columns: 1fr;
		}
		
		.form-row {
			grid-template-columns: 1fr;
		}
	}
</style> 