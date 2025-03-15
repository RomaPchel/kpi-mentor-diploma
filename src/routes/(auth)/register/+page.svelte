<script>
	import { fade } from "svelte/transition";
</script>

<div class="login-container">
	<section class="login-card" out:fade>
		<h1>Please log in</h1>
		<form method="POST">
			<div class="input-group">
				<input  type="email" name="email" placeholder="Email" />
				<input  type="password" name="password"  placeholder="Password" />
				<input  type="text" name="firstName"  placeholder="Імʼя" />
				<input  type="text" name="lastName"  placeholder="Прізвище" />
			</div>
			<button>Register</button>
		</form>
	</section>
</div>

<style>
    .login-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
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

    @keyframes fade-in {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 0;
        }

        100% {
            opacity: 1;
        }
    }
    .login-card {
        animation: blur-serve 0.5s ease-in-out;
        /*> * {*/
        /*    !*animation-fill-mode: both;*!*/
        /*    animation: fade-in 1s;*/
        /*}*/
        border-radius: 0.5rem;
        h1 {
            margin: 0;
            padding: 0;
        }
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.25);
        padding: 4em;
        width: 18.75rem;
        display: flex;
        gap: 2em;
        flex-direction: column;
        /*justify-content: center;*/
        /*align-items: center;*/

        form {
            display: flex;
            flex-direction: column;
            gap: 4em;

            .input-group {
                display: flex;
                flex-direction: column;
                gap: 1em;
            }
        }
    }

    input {
        transition: border 0.2s ease;
        padding: 1rem;
        border-width: 2px;
        border-style: solid;
        border-left-color: var(--text-color);
        border-bottom-color: var(--text-color);
        border-right-color: rgba(255, 255, 255, 0);
        border-top-color: rgba(255, 255, 255, 0);
        border-radius: 4px;

        &:focus {
            border-color: var(--primary-color);
            color: var(--primary-color);
            outline: 0;
        }
    }

    button {
        transition:
                background 0.2s ease,
                border 0.2s ease;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0.625rem;
        font-weight: 600;
        cursor: pointer;
        border: 2px solid rgba(255, 255, 255, 0);
        outline: 0;
				color: var(--text-color-secondary);
        background: var(--primary-color);
        border-radius: 4px;

        &:focus-visible {
            border: 2px dashed var(--primary-color-20);
            border-radius: 4px;
        }

        &:hover {
            background: var(--primary-color-60);
        }

        &:active {
            background: var(--primary-color-20);
            color: var(--primary-color);
        }
    }
</style>