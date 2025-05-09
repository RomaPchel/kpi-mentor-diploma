<script lang="ts">
	import { enhance } from '$app/forms';
	import { writable } from 'svelte/store';

	const { data } = $props();

	let motivation = $state('');
	let requestStatus = writable('');
	let submitting = writable(false);
	let formError = writable('');

</script>

<main class="mentor-request">
	<div class="container">
		{#if !data.requestExists}
			<div class="header">
				<h1>Стати ментором</h1>
				<p class="subtitle">Поділіться своїми знаннями та допоможіть студентам у навчанні</p>
			</div>

			<form method="POST" class="mentor-form">
				<div class="form-group">
					<label for="motivation" class="form-label">Ваша мотивація</label>
					<textarea
						id="motivation"
						name="motivation"
						bind:value={motivation}
						required
						placeholder="Розкажіть, чому ви хочете стати ментором і чим можете допомогти..."
						rows="5"
						class="form-input"
					></textarea>
					<p class="hint">Мінімум 50 символів</p>
				</div>

				<button type="submit" disabled={$submitting} class="submit-btn">
					{#if $submitting}
						<span class="spinner"></span>
						Надсилання...
					{:else}
						Надіслати заявку
					{/if}
				</button>

				{#if $formError}
					<div class="error-message">
						{$formError}
					</div>
				{/if}
			</form>

			{#if $requestStatus}
				<div class="status-message success">
					{$requestStatus}
				</div>
			{/if}
		{:else}
			<div class="pending-approval">
				<div class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
						<polyline points="22 4 12 14.01 9 11.01"></polyline>
					</svg>
				</div>
				<h2>Ваш запит на розгляді</h2>
				<p>Ми отримали вашу заявку на участь у програмі менторства. Наша команда перегляне її найближчим часом.</p>
				<p class="contact">Якщо у вас є запитання, напишіть на <a href="mailto:mentors@university.edu">mentors@university.edu</a></p>
			</div>
		{/if}
	</div>
</main>


<style>
    .mentor-request {
        background-color: #f8fafc;
        min-height: 100vh;
        padding: 2rem 0;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1.5rem;
    }

    .header {
        text-align: center;
        margin-bottom: 2.5rem;
    }

    h1 {
        font-size: 2.25rem;
        color: #1e293b;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        font-size: 1.125rem;
        color: #64748b;
        max-width: 600px;
        margin: 0 auto;
    }

    .mentor-form {
        background-color: white;
        border-radius: 0.5rem;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        font-weight: 500;
        color: #1e293b;
        margin-bottom: 0.5rem;
    }

    .form-input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        font-size: 1rem;
        transition: all 0.2s ease;
    }

    .form-input:focus {
        outline: none;
        border-color: #60a5fa;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }

    textarea.form-input {
        min-height: 150px;
        resize: vertical;
    }

    .hint {
        font-size: 0.875rem;
        color: #64748b;
        margin-top: 0.25rem;
    }

    .submit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        background-color: #2563eb;
        color: white;
        font-weight: 500;
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
    }

    .submit-btn:hover:not(:disabled) {
        background-color: #1d4ed8;
    }

    .submit-btn:disabled {
        background-color: #bfdbfe;
        cursor: not-allowed;
    }

    .spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .error-message {
        color: #dc2626;
        background-color: #fee2e2;
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-top: 1rem;
        font-size: 0.875rem;
    }

    .status-message {
        padding: 0.75rem;
        border-radius: 0.375rem;
        margin-top: 1rem;
        font-size: 0.875rem;
    }

    .status-message.success {
        color: #166534;
        background-color: #dcfce7;
    }

    .pending-approval {
        text-align: center;
        background-color: white;
        border-radius: 0.5rem;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .pending-approval .icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 1.5rem;
        color: #2563eb;
    }

    .pending-approval h2 {
        font-size: 1.5rem;
        color: #1e293b;
        margin-bottom: 1rem;
    }

    .pending-approval p {
        color: #64748b;
        margin-bottom: 1rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .pending-approval .contact {
        margin-top: 2rem;
    }

    .pending-approval a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;
    }

    .pending-approval a:hover {
        text-decoration: underline;
    }

    @media (max-width: 640px) {
        .container {
            padding: 0 1rem;
        }

        h1 {
            font-size: 1.75rem;
        }

        .mentor-form {
            padding: 1.5rem;
        }
    }
</style>