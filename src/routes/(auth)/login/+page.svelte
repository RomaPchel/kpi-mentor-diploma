<script>
	import { fade } from "svelte/transition";
	import errors from '$lib/locale.json';

	const { form } = $props();
</script>

<div class="login-container">
	<section class="login-card" in:fade>
		<h1>Вхід до акаунту</h1>
		{#if form?.error}<p class="error">{errors[form?.error.message]}</p>{/if}
		<form method="POST">
			<div class="input-group">
				<input type="email" name="email" placeholder="Електронна пошта" required />
				<input type="password" name="password" placeholder="Пароль" required minlength="6" />
			</div>
			<button type="submit">Увійти</button>
		</form>
	</section>
</div>
<footer>
	<p>&copy; {new Date().getFullYear()} SMP. Всі права захищені.</p>
</footer>
<style>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #f0f4f8;
        padding: 2rem;
    }

    .login-card {
        background: white;
        padding: 2.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        animation: blur-serve 0.5s ease-in-out;
    }

    h1 {
        text-align: center;
        font-size: 1.75rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    input {
        padding: 0.75rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        background-color: #f9fafb;
        transition: 0.2s ease;
    }

    button {
        padding: 0.75rem;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s ease;
    }

    button:hover {
        background-color: #1d4ed8;
    }
    .error {
        color: red;
    }
    footer {
        position: absolute;
        width: 100%;
        background-color: #f0f0f0;
        color: #555;
        text-align: center;
        padding: 1rem;
        border-top: 1px solid #ddd;
        font-size: 0.9rem;
    }
    @keyframes blur-serve {
        0% {
            filter: blur(0.5rem);
            translate: 0 3em;
        }
        100% {
            translate: 0 0;
        }
    }
</style>
