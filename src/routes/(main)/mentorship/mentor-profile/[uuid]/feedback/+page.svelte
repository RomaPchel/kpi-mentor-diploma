<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let mentorUuid: string = '';
	let reason = $state('');
	let message = $state('');
	let submitted = false;

	onMount(() => {
		const unsubscribe = page.subscribe(($page) => {
			mentorUuid = $page.params.uuid;
		});
	});
</script>

<main>
	<h1>Report Mentor</h1>
	<p class="intro">
		If you believe this mentor has violated community guidelines or behaved inappropriately, please report it here.
		Your report is confidential and will be reviewed by our moderation team.
	</p>

	{#if submitted}
		<p class="submitted">✅ Your report has been submitted. Thank you.</p>
	{:else}
		<form method="POST" transition:fly={{ y: 8, duration: 200 }}>
			<input type="hidden" name="mentorUuid" value={mentorUuid} />

			<div class="form-group">
				<label for="reason">Reason for Reporting</label>
				<select id="reason" name="reason" bind:value={reason} required>
					<option value="" disabled selected>Select a reason</option>
					<option value="inappropriate">Inappropriate behavior</option>
					<option value="spam">Spam or misleading information</option>
					<option value="harassment">Harassment</option>
					<option value="other">Other</option>
				</select>
			</div>

			<div class="form-group">
				<label for="details">Additional Details</label>
				<textarea
					id="message"
					name="message"
					rows="5"
					placeholder="Please describe the issue with as much detail as possible..."
					bind:value={message}
					required
				></textarea>
			</div>

			<button type="submit" formaction="?/report" class="btn">🚨 Submit Report</button>
		</form>
	{/if}
</main>

<style>
    main {
        max-width: 600px;
        margin: 2rem auto;
        padding: 1.5rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    }

    h1 {
        font-size: 1.8rem;
        color: #b91c1c;
        margin-bottom: 1rem;
    }

    .intro {
        font-size: 0.95rem;
        color: #555;
        margin-bottom: 1.5rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        font-weight: 600;
        display: block;
        margin-bottom: 0.5rem;
    }

    select, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    textarea {
        resize: vertical;
    }

    .btn {
        background: #dc2626;
        color: white;
        padding: 0.75rem 1.25rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
    }

    .btn:hover {
        background: #b91c1c;
    }

    .submitted {
        color: green;
        font-weight: bold;
        font-size: 1rem;
    }
</style>
