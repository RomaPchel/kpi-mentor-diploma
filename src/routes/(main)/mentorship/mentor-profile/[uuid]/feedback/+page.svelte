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
	<h1>Скарга на ментора</h1>
	<p class="intro">
		Якщо ви вважаєте, що цей ментор порушив правила спільноти або поводився неналежно — повідомте про це тут.
		Ваша скарга є конфіденційною та буде розглянута модераційною командою.
	</p>

	{#if submitted}
		<p class="submitted">✅ Вашу скаргу надіслано. Дякуємо.</p>
	{:else}
		<form method="POST" transition:fly={{ y: 8, duration: 200 }}>
			<input type="hidden" name="mentorUuid" value={mentorUuid} />

			<div class="form-group">
				<label for="reason">Причина скарги</label>
				<select id="reason" name="reason" bind:value={reason} required>
					<option value="" disabled selected>Оберіть причину</option>
					<option value="inappropriate">Неприйнятна поведінка</option>
					<option value="spam">Спам або оманлива інформація</option>
					<option value="other">Інше</option>
				</select>
			</div>

			<div class="form-group">
				<label for="details">Деталі</label>
				<textarea
					id="message"
					name="message"
					rows="5"
					placeholder="Опишіть ситуацію якомога детальніше..."
					bind:value={message}
					required
				></textarea>
			</div>

			<button type="submit" formaction="?/report" class="btn">🚨 Надіслати скаргу</button>
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
