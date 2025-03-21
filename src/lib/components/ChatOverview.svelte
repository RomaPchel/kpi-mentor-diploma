<script lang="ts">
	import type { ChatMessage, User } from '$lib/interfaces/Interfaces';
	import ChatApi from '$lib/API/ChatApi';
	import { onMount } from 'svelte';

	let {activeChat, sender} = $props()

	let messageInput = $state('')
	let messages = $state(activeChat.messages)
	let messagesContainer;
	let currentUser = $state<User | null>(null);
	
	onMount(async () => {
		try {
			scrollToBottom();
			const response = await fetch('/api/me', {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			if (response.ok) {
				currentUser = await response.json();
			}
		} catch (error) {
			console.error('Error fetching current user:', error);
		}
	});

	function formatTime(date: Date | string): string {
		if (!date) return '';
		const messageDate = new Date(date);
		return new Intl.DateTimeFormat('en', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		}).format(messageDate);
	}
	
	function formatMessageDate(date: Date | string): string {
		if (!date) return '';
		const messageDate = new Date(date);
		return new Intl.DateTimeFormat('en', {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		}).format(messageDate);
	}
	
	function getInitials(user: any): string {
		if (!user) return '?';
		return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;
	}
	
	function isCurrentUser(message: ChatMessage): boolean {
		if (!currentUser) return false;
		return message.sender.uuid === currentUser.uuid;
	}
	
	function shouldShowDate(index: number): boolean {
		if (index === 0) return true;
		
		const currentDate = new Date(messages[index].createdAt);
		const prevDate = new Date(messages[index - 1].createdAt);
		
		return currentDate.toDateString() !== prevDate.toDateString();
	}
	
	function scrollToBottom() {
		if (messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 100);
		}
	}

	async function sendMessage() {
		if (!messageInput.trim() || !activeChat) return;
		const tempMessage: ChatMessage = {
			uuid: crypto.randomUUID(),
			content: messageInput.trim(),
			sender: sender,
			chat: activeChat,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		messages = [...messages, tempMessage];
		messageInput = '';
		scrollToBottom();

		try {
			const sentMessage = await ChatApi.sendMessage(activeChat, tempMessage.content, sender.uuid);
			messages = messages.map(m => m.uuid === tempMessage.uuid ? sentMessage : m);
		} catch (error) {
			console.error('Error sending message:', error);
			messages = messages.map(m =>
				m.uuid === tempMessage.uuid ? { ...m, content: m.content + ' (Failed to send)' } : m
			);
		}
	}
</script>

<div class="chat-content">
	{#if activeChat}
		<div class="chat-detail-container">
			<div class="chat-detail-header">
				<div class="chat-user-info">
					<div class="avatar">
						{#if activeChat.otherUser?.avatar}
							<img src={activeChat.otherUser.avatar} alt="Profile" />
						{:else}
							<div class="avatar-placeholder">{getInitials(activeChat.otherUser)}</div>
						{/if}
					</div>
					<div class="user-details">
						<h2>
							{activeChat.otherUser ? `${activeChat.otherUser.firstName} ${activeChat.otherUser.lastName}` : 'Chat'}
						</h2>
						<span class="user-status">Online</span>
					</div>
				</div>
				<div class="chat-actions">
					<button class="action-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12 21.21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.21z"/>
						</svg>
					</button>
					<button class="action-button">
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="1"></circle>
							<circle cx="19" cy="12" r="1"></circle>
							<circle cx="5" cy="12" r="1"></circle>
						</svg>
					</button>
				</div>
			</div>

			<div class="messages-container" bind:this={messagesContainer}>
				{#if messages.length === 0}
					<div class="empty-chat">
						<div class="empty-chat-icon">
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
								<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
								<path d="M9 10h.01M12 10h.01M15 10h.01"></path>
							</svg>
						</div>
						<p>No messages yet. Start the conversation!</p>
					</div>
				{:else}
					{#each messages as message, index (message.uuid)}
						{#if shouldShowDate(index)}
							<div class="date-separator">
								<span>{formatMessageDate(message.createdAt)}</span>
							</div>
						{/if}
						<div class="message-wrapper {isCurrentUser(message) ? 'outgoing' : 'incoming'}">
							{#if !isCurrentUser(message)}
								<div class="message-avatar">
									{#if message.sender?.avatar}
										<img src={message.sender.avatar} alt="Avatar" />
									{:else}
										<div class="avatar-placeholder small">{getInitials(message.sender)}</div>
									{/if}
								</div>
							{/if}
							<div class="message {isCurrentUser(message) ? 'sent' : 'received'}">
								<div class="message-content">
									<p>{message.content}</p>
								</div>
								<span class="message-time">{formatTime(message.createdAt)}</span>
								{#if isCurrentUser(message)}
									<span class="message-status">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
											<polyline points="20 6 9 17 4 12"></polyline>
										</svg>
									</span>
								{/if}
							</div>
						</div>
					{/each}
				{/if}
			</div>

			<div class="message-input-container">
				<button class="attachment-button">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
					</svg>
				</button>
				<div class="input-wrapper">
					<textarea
						placeholder="Type a message..."
						bind:value={messageInput}
						onkeydown={(e) => { if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); sendMessage(); } }}
					></textarea>
				</div>
				<button 
					class="send-button" 
					onclick={sendMessage}
					disabled={!messageInput.trim()}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="22" y1="2" x2="11" y2="13"></line>
						<polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
					</svg>
				</button>
			</div>
		</div>
	{:else}
		<div class="no-chat-selected">
			<p>Select a chat from the list to view messages.</p>
		</div>
	{/if}
</div>

<style>
	.chat-content {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}

	.chat-detail-container {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.chat-detail-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		border-bottom: 1px solid #e5e7eb;
	}
	
	.chat-user-info {
		display: flex;
		align-items: center;
	}
	
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 12px;
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
	
	.avatar-placeholder.small {
		font-size: 0.75rem;
	}
	
	.user-details h2 {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
		color: #1f2937;
	}
	
	.user-status {
		font-size: 0.75rem;
		color: #10b981;
	}
	
	.chat-actions {
		display: flex;
		gap: 8px;
	}
	
	.action-button {
		background: none;
		border: none;
		color: #6b7280;
		padding: 6px;
		border-radius: 50%;
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.action-button:hover {
		background-color: #f3f4f6;
		color: #3b82f6;
	}

	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 16px;
		background-color: #f8fafc;
		display: flex;
		flex-direction: column;
	}
	
	.empty-chat {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #6b7280;
	}
	
	.empty-chat-icon {
		margin-bottom: 16px;
		color: #9ca3af;
		background-color: #f1f5f9;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.date-separator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 16px 0;
	}
	
	.date-separator span {
		padding: 4px 12px;
		background-color: #e5e7eb;
		border-radius: 16px;
		font-size: 0.75rem;
		color: #4b5563;
	}
	
	.message-wrapper {
		display: flex;
		margin-bottom: 8px;
		align-items: flex-end;
	}
	
	.message-wrapper.outgoing {
		justify-content: flex-end;
	}
	
	.message-avatar {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 8px;
		flex-shrink: 0;
	}
	
	.message {
		max-width: 65%;
		border-radius: 16px;
		padding: 8px 12px;
		position: relative;
	}
	
	.message.sent {
		background-color: #3b82f6;
		color: white;
		border-bottom-right-radius: 4px;
		margin-left: 32px;
	}
	
	.message.received {
		background-color: white;
		color: #1f2937;
		border-bottom-left-radius: 4px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
	
	.message-content p {
		margin: 0;
		word-wrap: break-word;
	}
	
	.message-time {
		font-size: 0.7rem;
		opacity: 0.8;
		display: block;
		text-align: right;
		margin-top: 2px;
	}
	
	.sent .message-time {
		color: rgba(255, 255, 255, 0.9);
	}
	
	.message-status {
		position: absolute;
		right: 2px;
		bottom: -14px;
		font-size: 0.7rem;
		color: #3b82f6;
	}

	.message-input-container {
		display: flex;
		align-items: center;
		padding: 12px 16px;
		background-color: white;
		border-top: 1px solid #e5e7eb;
	}
	
	.attachment-button, .send-button {
		background: none;
		border: none;
		padding: 8px;
		cursor: pointer;
		color: #6b7280;
		border-radius: 50%;
		transition: background-color 0.2s;
	}
	
	.attachment-button:hover, .send-button:hover {
		background-color: #f3f4f6;
	}
	
	.send-button {
		color: #3b82f6;
	}
	
	.send-button:disabled {
		color: #d1d5db;
		cursor: not-allowed;
	}
	
	.input-wrapper {
		flex: 1;
		background-color: #f1f5f9;
		border-radius: 24px;
		padding: 8px 12px;
		margin: 0 12px;
	}
	
	.input-wrapper textarea {
		width: 100%;
		resize: none;
		border: none;
		outline: none;
		background: transparent;
		max-height: 100px;
		min-height: 24px;
		padding: 0;
		font-family: inherit;
		font-size: 0.9375rem;
	}

	.no-chat-selected {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		font-size: 1.2rem;
		color: #6b7280;
	}
</style>