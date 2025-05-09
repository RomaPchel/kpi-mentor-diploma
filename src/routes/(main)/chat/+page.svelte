<script lang="ts">
	import { onMount } from 'svelte';
	import type { ChatMessage, ChatPreview } from '$lib/interfaces/Interfaces';
	import ChatOverview from '$lib/components/ChatOverview.svelte';


	let showChat = $state(false);
	const { data } = $props();

	// Set up reactive state
	let chats = $state(data.chats || []);
	let activeChat = $state<ChatPreview | null>(null);
	let searchQuery = $state('');
	let filteredChats = $state(data.chats);
	let mobileView = $state(false);

	// Update filtered chats based on search query
	function updateFilteredChats() {
		if (!searchQuery.trim()) {
			filteredChats = chats;
		} else {
			const query = searchQuery.toLowerCase().trim();
			filteredChats = chats.filter(chat => {
				if (chat.otherUser) {
					const fullName = `${chat.otherUser.firstName} ${chat.otherUser.lastName}`.toLowerCase();
					return fullName.includes(query);
				}
				if (chat.lastMessage?.content) {
					return chat.lastMessage.content.toLowerCase().includes(query);
				}
				return false;
			});
		}
	}

	// Handle chat selection
	async function selectChat(chat: ChatPreview) {
		if (activeChat?.uuid === chat.uuid) {
			return; // Already selected
		}

		activeChat = chat;

		// Reset unread count for this chat and mark as read on server
		const chatIndex = chats.findIndex(c => c.uuid === chat.uuid);
		if (chatIndex >= 0) {
			chats[chatIndex].unreadCount = 0;
			// Force update of filtered chats
			updateFilteredChats();

			// Mark messages as read on the server
		}

		// Show chat on mobile
		showChat = true;

		// Update mobile view state if needed
		if (window.innerWidth < 768) {
			mobileView = true;
		}
	}

	// Handle incoming messages to update chat list

	function backToList() {
		mobileView = false;
	}

	function formatLastMessageTime(date: string | Date): string {
		if (!date) return '';
		const messageDate = new Date(date);
		const now = new Date();
		const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 3600 * 24));

		if (diffDays === 0) {
			return new Intl.DateTimeFormat('en', {
				hour: 'numeric',
				minute: 'numeric',
				hour12: true
			}).format(messageDate);
		} else if (diffDays < 7) {
			return new Intl.DateTimeFormat('en', { weekday: 'short' }).format(messageDate);
		} else {
			return new Intl.DateTimeFormat('en', {
				month: 'short',
				day: 'numeric'
			}).format(messageDate);
		}
	}

	function getInitials(user: any): string {
		if (!user) return '?';
		return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
	}

	$effect(() => {
		updateFilteredChats();
	});

	onMount(async () => {
		// Initialize chat client with user ID

		// Register message listener

		// Select the first chat if available
		if (filteredChats.length > 0 && !activeChat) {
			await selectChat(filteredChats[0]);
		}


		const handleResize = () => {
			if (window.innerWidth >= 768) {
				mobileView = false;
			}
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});


</script>

<div class="chat-container">
	<div class="chat-layout">
		<div class="chat-sidebar" class:hidden={mobileView}>
			<div class="chat-list-header">
				<h1>Повідомлення</h1>
			</div>

			<div class="search-container">
				<div class="search-input-wrapper">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="11" cy="11" r="8"></circle>
						<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
					</svg>
					<input
						type="text"
						placeholder="Пошук бесід..."
						bind:value={searchQuery}
					/>
				</div>
			</div>

			<div class="chat-list">
				{#if filteredChats.length === 0}
					<div class="empty-state">
						<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
						</svg>
						<p>Бесіди не знайдено</p>
					</div>
				{:else}
					{#each filteredChats as chat (chat.uuid)}
						<div
							class="chat-item"
							class:active={activeChat && activeChat.uuid === chat.uuid}
							onclick={() => selectChat(chat)}
						>
							<div class="avatar">
								{#if chat.otherUser?.avatar}
									<img src={chat.otherUser.avatar} alt="Аватар" />
								{:else}
									<div class="avatar-placeholder">{getInitials(chat.otherUser)}</div>
								{/if}
							</div>
							<div class="chat-info">
								<div class="chat-header">
									<h3>{chat.otherUser ? `${chat.otherUser.firstName} ${chat.otherUser.lastName}` : 'Невідомий користувач'}</h3>
									{#if chat.messages && chat.messages.length > 0}
										<span class="timestamp">{formatLastMessageTime(chat.messages[chat.messages.length-1]?.createdAt)}</span>
									{/if}
								</div>
								<p class="preview-message">
									{#if chat.messages && chat.messages.length > 0}
										{chat.messages[chat.messages.length-1]?.content || 'Ще немає повідомлень'}
									{:else}
										Почніть бесіду
									{/if}
								</p>
								{#if chat.unreadCount > 0}
									<span class="unread-badge">{chat.unreadCount}</span>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>

		<div class="chat-main-content" class:hidden={!mobileView && !showChat}>
			{#if showChat && activeChat}
				<ChatOverview activeChat={activeChat} sender={data.user}/>
			{:else}
				<div class="no-chat-selected">
					<div class="empty-chat-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
							<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
							<path d="M9 10h.01M12 10h.01M15 10h.01"></path>
						</svg>					</div>
					<h2>Оберіть бесіду</h2>
					<p>Виберіть розмову зі списку або почніть нову</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.chat-container {
		height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #f8fafc;
	}

	.chat-layout {
		flex: 1;
		display: flex;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		margin: 16px;
		background-color: white;
		height: calc(100vh - 32px);
	}

	.chat-sidebar {
		width: 320px;
		display: flex;
		flex-direction: column;
		border-right: 1px solid #e5e7eb;
		background-color: white;
	}

	.chat-list-header {
		padding: 20px;
		border-bottom: 1px solid #e5e7eb;
	}

	.chat-list-header h1 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #374151;
	}

	.search-container {
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
	}

	.search-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.search-input-wrapper svg {
		position: absolute;
		left: 12px;
		color: #6b7280;
	}

	.search-container input {
		width: 100%;
		padding: 10px 10px 10px 40px;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		font-size: 0.875rem;
		outline: none;
		transition: border-color 0.2s;
		background-color: #f1f5f9;
	}

	.search-container input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
	}

	.chat-list {
		flex: 1;
		overflow-y: auto;
		padding: 8px 0;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		padding: 32px;
		color: #6b7280;
	}

	.empty-state svg {
		margin-bottom: 16px;
		color: #9ca3af;
	}

	.chat-item {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		cursor: pointer;
		border-left: 3px solid transparent;
		transition: background-color 0.2s;
		position: relative;
	}

	.chat-item:hover {
		background-color: #f1f5f9;
	}

	.chat-item.active {
		background-color: #ebf5ff;
		border-left-color: #3b82f6;
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		margin-right: 12px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.avatar-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #3b82f6;
		color: white;
		font-weight: 600;
		font-size: 1rem;
	}

	.chat-info {
		flex: 1;
		min-width: 0;
	}

	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 4px;
	}

	.chat-header h3 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #1f2937;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timestamp {
		font-size: 0.75rem;
		color: #6b7280;
		flex-shrink: 0;
	}

	.preview-message {
		margin: 0;
		font-size: 0.875rem;
		color: #6b7280;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 205px;
	}

	.unread-badge {
		position: absolute;
		top: 12px;
		right: 16px;
		min-width: 20px;
		height: 20px;
		border-radius: 10px;
		background-color: #3b82f6;
		color: white;
		font-size: 0.75rem;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 6px;
	}

	.chat-main-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: white;
		position: relative;
	}

	.mobile-header {
		padding: 12px;
		display: flex;
		align-items: center;
		border-bottom: 1px solid #e5e7eb;
	}

	.back-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 4px;
		color: #374151;
	}

	.no-chat-selected {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 32px;
		color: #6b7280;
		text-align: center;
	}

	.empty-chat-icon {
		margin-bottom: 24px;
		color: #9ca3af;
		background-color: #f1f5f9;
		width: 120px;
		height: 120px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.no-chat-selected h2 {
		margin: 0 0 8px;
		font-size: 1.5rem;
		font-weight: 600;
		color: #374151;
	}

	.no-chat-selected p {
		margin: 0;
		font-size: 1rem;
		color: #6b7280;
		max-width: 300px;
	}

	/* Responsive design */
	@media (max-width: 767px) {
		.chat-layout {
			margin: 0;
			height: 100vh;
			border-radius: 0;
		}

		.chat-sidebar {
			flex: 1;
			width: 100%;
		}

		.chat-main-content {
			flex: 1;
			width: 100%;
		}

		.hidden {
			display: none;
		}
	}
</style>