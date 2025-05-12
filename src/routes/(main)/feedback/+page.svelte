<script lang="ts">
	import { fly } from 'svelte/transition';
	let message = $state('');
	let submitted = false;

</script>

<main>
	<h1>Залишити відгук</h1>
	<p class="intro">
		Ваш відгук допоможе покращити платформу. Всі повідомлення читаються командою модераторів.
	</p>

	{#if submitted}
		<p class="submitted">✅ Дякуємо за ваш відгук!</p>
	{:else}
		<form method="POST" transition:fly={{ y: 8, duration: 200 }}>
			<div class="form-group">
				<label for="message">Ваш відгук</label>
				<textarea
					id="message"
					name="message"
					rows="6"
					placeholder="Поділіться враженнями, проблемами або побажаннями..."
					bind:value={message}
					required
				></textarea>
			</div>

			<button type="submit" formaction="?/feedback" class="btn">📩 Надіслати</button>
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
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    h1 {
        font-size: 1.8rem;
        color: #2563eb;
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

    textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        resize: vertical;
    }

    .btn {
        background: #2563eb;
        color: white;
        padding: 0.75rem 1.25rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
    }

    .btn:hover {
        background: #1e40af;
    }

    .submitted {
        color: green;
        font-weight: bold;
        font-size: 1rem;
    }
</style>
