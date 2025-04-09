<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { User } from '$lib/interfaces/Interfaces';
	
	const {isLoggedIn, user}: {isLoggedIn: boolean, user: User} = $props()

	let showDropdown = $state(false);
	const toggleDropdown = () => showDropdown = !showDropdown;
	console.log(user)
</script>

<header>
	<div class="header-content">
		<a href="/dashboard" style="text-decoration: none; color: black"><h1>Student Mentor Platform</h1></a>
		<div class="navigation-container">
			<nav>
				<a href="/dashboard">Home</a>
				{#if !isLoggedIn}
					<a href="/login">Login</a>
					<a href="/register">Register</a>
				{/if}
				{#if user.role !== 'mentor'}
					<a href="/mentorship/become-mentor">Become a Mentor</a>
					<a href="/mentorship/find-mentor">Find a Mentor</a>
				{:else }
					<a href="/mentorship/mentee-requests">Mentee requests</a>
				{/if}
				<a href="/chat">Chat</a>
			</nav>
			
			{#if isLoggedIn}
				<div class="avatar-container">
					<button class="avatar-button" onclick={toggleDropdown}>
						{#if user.avatar}
							<img src={user.avatar} alt="User avatar" class="user-avatar" />
						{:else}
							<div class="avatar-placeholder">
								<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</div>
						{/if}
					</button>
					
					{#if showDropdown}
						<div class="dropdown-menu" transition:slide={{ duration: 200 }}>
							<a href="/profile" class="dropdown-item">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
								Profile
							</a>
							<a href="/settings" class="dropdown-item">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="12" cy="12" r="3"></circle>
									<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
								</svg>
								Settings
							</a>
							<div class="dropdown-divider"></div>
							<a href="/logout" class="dropdown-item">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
									<polyline points="16 17 21 12 16 7"></polyline>
									<line x1="21" y1="12" x2="9" y2="12"></line>
								</svg>
								Logout
							</a>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
    header {
        background-color: #f8f8f8;
        padding: 0.5rem 3rem;
        width: 100%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        position: sticky;
        top: 0;
        height: 64px;
        display: flex;
        align-items: center;
    }
    
    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        width: 100%;
    }

    h1 {
        margin: 0;
        font-size: 1.5rem;
        white-space: nowrap;
    }
    
    .navigation-container {
        display: flex;
        align-items: center;
    }

    nav {
        display: flex;
        align-items: center;
    }

    nav a {
        margin-right: 1.5rem;
        text-decoration: none;
        color: #333;
        font-weight: 500;
        transition: color 0.2s ease;
    }

    nav a:hover {
        color: #007acc;
    }
    
    .avatar-container {
        position: relative;
    }
    
    .avatar-button {
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    
    .user-avatar, .avatar-placeholder {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e0f2fe;
        color: #0369a1;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .avatar-placeholder svg {
        width: 20px;
        height: 20px;
    }
    
    .user-avatar:hover, .avatar-placeholder:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .dropdown-menu {
        position: absolute;
        top: 45px;
        right: 0;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 200px;
        z-index: 1010;
        overflow: hidden;
    }
    
    .dropdown-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 16px;
        color: #333;
        text-decoration: none;
        transition: background-color 0.2s ease;
    }
    
    .dropdown-item:hover {
        background-color: #f1f5f9;
    }
    
    .dropdown-divider {
        height: 1px;
        background-color: #e5e7eb;
        margin: 4px 0;
    }
    
    @media (max-width: 768px) {
        header {
            padding: 0.5rem 1rem;
        }
        
        h1 {
            font-size: 1.2rem;
        }
        
        nav a {
            margin-right: 1rem;
            font-size: 0.9rem;
        }
    }
</style>
