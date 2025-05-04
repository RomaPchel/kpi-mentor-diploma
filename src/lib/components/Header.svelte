<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { User } from '$lib/interfaces/Interfaces';

	// Get props (isLoggedIn and user)
	const { isLoggedIn, user }: { isLoggedIn: boolean; user: User } = $props();

	// Local state for toggling the dropdown
	let showDropdown = $state(false);
	const toggleDropdown = () => (showDropdown = !showDropdown);
</script>

<header>
	<div class="header-content">
		<a href="/dashboard"> <h1 style="margin: 0;">🎓 SMP</h1></a>

		{#if isLoggedIn}
			<div class="avatar-container">
				{#if user.role !== 'mentor'}
				<a href="/mentorship/become-mentor" class="chat-button">Стати ментором</a>
					{/if}
				<!-- Chat button placed to the left of the avatar -->
				<a href="/chat" class="chat-button">💬 Чат</a>

				<button class="avatar-button" onclick={toggleDropdown}>
					{#if user.avatar}
						<img src={user.avatar} alt="avatar" class="user-avatar" />
					{:else}
						<div class="avatar-placeholder">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<circle cx="12" cy="7" r="4" />
							</svg>
						</div>
					{/if}
				</button>

				{#if showDropdown}
					<div class="dropdown-menu" transition:slide>
						<a href="/profile" class="dropdown-item">👤 Профіль</a>
						<div class="dropdown-divider"></div>
						<a href="/logout" class="dropdown-item">🚪 Вийти</a>
					</div>
				{/if}
			</div>
		{:else}
			<div class="auth-links">
				<a href="/login">Увійти</a>
				<a href="/register">Реєстрація</a>
			</div>
		{/if}
	</div>
</header>

<style>
    header {
        background: #fff;
        border-bottom: 1px solid #eee;
        padding: 0.75rem 2rem;
        position: sticky;
        top: 0;
        z-index: 1000;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        display: flex;
        align-items: center;
    }
    .header-content {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .avatar-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
    }
    .chat-button {
        text-decoration: none;
        padding: 0.5rem 0.8rem;
        background: #0070f3;
        color: #fff;
        border-radius: 4px;
        font-weight: 500;
        transition: background 0.2s ease;
    }
    .chat-button:hover {
        background: #005bb5;
    }
    .avatar-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
    }
    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
    }
    .avatar-placeholder {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e0f2fe;
        color: #0369a1;
    }
    .dropdown-menu {
        position: absolute;
        right: 0;
        top: 45px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        width: 180px;
        z-index: 1010;
        overflow: hidden;
    }
    .dropdown-item {
        padding: 0.75rem 1rem;
        display: block;
        text-decoration: none;
        color: #333;
        transition: background-color 0.2s ease;
    }
    .dropdown-item:hover {
        background-color: #f5f5f5;
    }
    .dropdown-divider {
        height: 1px;
        background-color: #e5e5e5;
        margin: 0.5rem 0;
    }
    .auth-links a {
        margin-left: 1rem;
        text-decoration: none;
        color: #0070f3;
        font-weight: 500;
    }
</style>
