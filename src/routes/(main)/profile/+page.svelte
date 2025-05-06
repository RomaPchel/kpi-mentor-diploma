<script lang="ts">
	let { data, form } = $props();
	let profile = data.user;

	let formChanged = $state(false);
	let saving = false;
	let errorMessage = '';
	let successMessage = '';

	let avatarPreview = $state(profile.avatar);
	let fileInput: HTMLInputElement;
	let mainForm: HTMLFormElement;

	const formsOfEducation = [
		{ value: 'part-time', label: 'part-time' },
		{ value: 'full-time', label: 'full-time' },
	];

	const groupCodes = [
		'ІПЗ-21-1', 'ІПЗ-21-2', 'ІПЗ-21-3',
		'КН-21-1', 'КН-21-2',
		'ПМ-21-1', 'ПМ-21-2'
	];

	const specializations = [
		'ІПЗ-21-1', 'ІПЗ-21-2', 'ІПЗ-21-3',
		'КН-21-1', 'КН-21-2',
		'ПМ-21-1', 'ПМ-21-2'
	];

	const departments = [
		'Кафедра інформатики',
		'Кафедра математики',
		'Кафедра програмної інженерії',
		'Кафедра кібербезпеки'
	];

	const predefinedInterests = [
		'Програмування',
		'Машинне навчання',
		'Веб-розробка',
		'Мобільні додатки',
		'Бази даних',
		'Штучний інтелект',
		'Кібербезпека',
		'Алгоритми',
		'Дизайн',
		'Тестування'
	];

	let selectedInterests = $state([] as string[]);

	selectedInterests = Array.isArray(profile.interests)
		? profile.interests
		: (typeof profile.interests === 'string' ? profile.interests.split(',').map(s => s.trim()) : []);

	function toggleInterest(interest: string) {
		if (selectedInterests.includes(interest)) {
			selectedInterests = selectedInterests.filter(i => i !== interest);
		} else {
			selectedInterests = [...selectedInterests, interest];
		}
		profile.interests = selectedInterests;
		updateFormState();
	}

	function updateFormState() {
		formChanged = true;
	}

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			if (!file.type.startsWith("image/")) {
				alert("Please upload a valid image.");
				return;
			}
			if (file.size > 1024 * 1024) {
				alert("Image is too large. Max 1MB.");
				return;
			}
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				avatarPreview = result;
				profile.avatar = result;
				// hidden input will get updated automatically
			};
			reader.readAsDataURL(file);
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
					<div class="avatar-upload">

						<form method="POST">
							{#if avatarPreview}
								<img class="avatar" src={avatarPreview} alt="Avatar Preview" />
							{:else}
								<div class="avatar-placeholder">No avatar</div>
							{/if}
							<label class="upload-label" for="avatar-upload">Upload Photo</label>
							<input
								id="avatar-upload"
								type="file"
								accept="image/*"
								bind:this={fileInput}
								onchange={handleFileSelect}
							/>
							<input type="hidden" name="avatar" value={avatarPreview} />
							<button type="submit" formaction="?/updateAvatar" class="approve">✅ Approve</button>

						</form>

					</div>
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
				<form method="POST">
					<section id="personal-info" class="form-section">
						<h2>Personal Information</h2>
						{#if form?.success}

							<p>Successfully updated!</p>
						{/if}
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
								formaction="?/update"
							>
								{saving ? 'Saving...' : 'Save Changes'}
							</button>
						</div>
						<div class="form-row">
							<div class="form-group">
								<label for="firstName">First Name</label>
								<input
									type="text"
									id="firstName"
									name="firstName"
									value={data.user.firstName}
									oninput={updateFormState}
									placeholder="Enter your first name"
								/>
							</div>

							<div class="form-group">
								<label for="lastName">Last Name</label>
								<input
									type="text"
									id="lastName"
									name="lastName"
									value={data.user.lastName}
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
								name="email"
								value={data.user.email}
								oninput={updateFormState}
								placeholder="Enter your email address"
							/>
							<small>This email is used for login and notifications</small>
						</div>

						<div class="form-group">
							<label for="bio">Bio</label>
							<textarea
								id="bio"
								name="bio"
								value={data.user.bio}
								oninput={updateFormState}
								placeholder="Tell us about yourself"
								rows="4"
							></textarea>
						</div>
					</section>

					<section id="academic-info" class="form-section">
						<h2>Academic Information</h2>

						<div class="form-group">
							<label for="specializationTitle">Спеціальність</label>
							<div class="custom-select">
								<select id="specializationTitle" name="specializationTitle" bind:value={profile.specializationTitle} onchange={updateFormState}>
									{#each specializations as option}
										<option value={option} selected={option === profile.specializationTitle}>
											{option}
										</option>
									{/each}
								</select>
							</div>
						</div>

						<div class="form-group">
							<label for="formOfEducation">Форма навчання</label>
							<div class="custom-select">
								<select id="formOfEducation" name="formOfEducation" bind:value={profile.formOfEducation} onchange={updateFormState}>
									{#each formsOfEducation as option}
										<option value={option.value} selected={option.value === profile.formOfEducation}>
											{option.label}
										</option>
									{/each}
								</select>
								<span class="select-arrow">▼</span>
							</div>
						</div>

						<div class="form-row">
							<div class="form-group">
								<label for="groupCode">Group Code</label>
								<div class="custom-select">
									<select id="groupCode" name="groupCode" bind:value={profile.groupCode} onchange={updateFormState}>
										<option value="">Select your group</option>
										{#each groupCodes as code}
											<option value={code} selected={code === profile.groupCode}>
												{code}
											</option>
										{/each}
									</select>
									<span class="select-arrow">▼</span>
								</div>
							</div>

							<div class="form-group">
								<label for="department">Department</label>
								<div class="custom-select">
									<select id="department" name="department" bind:value={profile.department} onchange={updateFormState}>
										{#each departments as dept}
											<option value={dept} selected={dept === profile.department}>
												{dept}
											</option>
										{/each}
									</select>
									<span class="select-arrow">▼</span>
								</div>
							</div>

						<div class="form-group">
							<p>Academic Interests</p>
							<div class="interests-container">
								{#each predefinedInterests as interest}
									<button
										type="button"
										class="interest-tag {selectedInterests.includes(interest) ? 'selected' : ''}"
										onclick={() => toggleInterest(interest)}
									>
										{interest}
									</button>
								{/each}
								{#each selectedInterests as interest}
									<input type="hidden" name="interests" value={interest} />
								{/each}
							</div>
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
					</section>
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

    .custom-select {
        position: relative;
    }

    .custom-select select {
        appearance: none;
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: var(--border-radius);
        padding: 0.75rem 2.5rem 0.75rem 1rem;
        width: 100%;
        font-size: 1rem;
        cursor: pointer;
        transition: var(--transition);
    }

    .custom-select select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(3, 105, 161, 0.1);
    }

    .select-arrow {
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--text-light);
        font-size: 0.75rem;
    }

    .interests-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .interest-tag {
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        background-color: #f1f5f9;
        color: var(--text-color);
        border: 1px solid #e2e8f0;
        font-size: 0.875rem;
        cursor: pointer;
        transition: var(--transition);
    }

    .interest-tag:hover {
        background-color: #e2e8f0;
    }

    .interest-tag.selected {
        background-color: var(--primary-light);
        color: var(--primary-color);
        border-color: var(--primary-color);
        font-weight: 500;
    }
    .notifications-section h3 {
        font-size: 1rem;
        margin-bottom: 1rem;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
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
