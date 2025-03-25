<script lang="ts">
	import { writable } from 'svelte/store';

	const {data} = $props()

	let name = '';
	let specialization = '';
	let educationProgram = '';
	let bio = '';
	let motivation = '';
	let requestStatus = writable('');  // This will hold the status of the request
	let submitting = writable(false);  // To disable the button while submitting

</script>

<main>
	{#if !data.requestExists}
		<h1>Become a Mentor</h1>

		<form method="POST">
			<div>
				<label for="motivation">Motivation</label>
				<textarea id="motivation" bind:value={motivation} required placeholder="Why do you want to become a mentor?"></textarea>
			</div>

			<button type="submit" disabled={$submitting}>Submit Request</button>
		</form>

		{#if $requestStatus}
			<p>{$requestStatus}</p>
		{/if}
	{/if}

	<h2>We are reviewing your request</h2>

</main>

<style>
    main {
        padding: 2rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input, textarea {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 0.5rem;
        background-color: #007acc;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:disabled {
        background-color: #ccc;
    }

    button:hover {
        background-color: #005f8d;
    }
</style>
