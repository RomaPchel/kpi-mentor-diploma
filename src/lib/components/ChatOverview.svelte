<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type {ChatMessage } from '$lib/interfaces/Interfaces';
	import ChatApi from '$lib/API/ChatApi';

	let {activeChat, sender} = $props()

	// Reactive state
	let messages: ChatMessage[] = activeChat?.messages ?? [];
	let messageInput = '';
	let messagesContainer: HTMLElement;
	let removeMessageListener: () => void;

	// Format timestamp for display
	function formatTime(date: Date | string): string {
		const dt = new Date(date);
		return new Intl.DateTimeFormat('en', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		}).format(dt);
	}

	// Scroll to bottom of the messages container
	function scrollToBottom() {
		if (messagesContainer) {
			setTimeout(() => {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}, 100);
		}
	}

	// Handler for incoming socket messages
	function handleIncomingMessage(data: any) {
		console.log('Received live message:', data);
		// Only process if this message belongs to the active chat
		if (activeChat && data.chatId === activeChat.uuid) {
			// Normalize the sender to an object (if it’s a string)
			const transformedMessage: ChatMessage = {
				uuid: data.uuid,
				content: data.content,
				sender: typeof data.sender === 'string' ? { uuid: data.sender } : data.sender,
				chat: activeChat,
				createdAt: new Date(data.createdAt || Date.now()),
				updatedAt: new Date(data.updatedAt || Date.now())
			};

			// Avoid adding duplicate messages
			if (!messages.some(m => m.uuid === transformedMessage.uuid)) {
				messages = [...messages, transformedMessage];
				scrollToBottom();
			}
		}
	}

	// Send a message: add a temporary message then call ChatApi.sendMessage
	async function sendMessage() {
		if (!messageInput.trim() || !activeChat || !sender) return;
		const content = messageInput.trim();
		messageInput = '';

		const tempMessage: ChatMessage = {
			uuid: crypto.randomUUID(),
			content,
			sender,
			chat: activeChat,
			createdAt: new Date(),
			updatedAt: new Date()
		};

		messages = [...messages, tempMessage];
		scrollToBottom();

		try {
			const sentMessage = await ChatApi.sendMessage(activeChat, content, sender.uuid);
			console.log('Sent message:', sentMessage);
			if (sentMessage) {
				// Replace the temporary message with the confirmed message
				messages = messages.map(m => m.uuid === tempMessage.uuid ? sentMessage : m);
			}
		} catch (error) {
			console.error('Error sending message:', error);
			// Optionally, mark the temporary message as failed
			messages = messages.map(m =>
				m.uuid === tempMessage.uuid ? { ...m, content: m.content + ' (Failed to send)' } : m
			);
		}
	}

	// Update messages when activeChat changes
	$effect(() => {
		if (activeChat && activeChat.messages) {
			messages = [...activeChat.messages];
			scrollToBottom();
		}
	});

	onMount(() => {
		removeMessageListener = ChatApi.addMessageListener(handleIncomingMessage);
		scrollToBottom();
	});

	onDestroy(() => {
		if (removeMessageListener) removeMessageListener();
	});
</script>

<div class="chat-overview">
	{#if activeChat}
		<div class="chat-detail-container">
			<div class="chat-detail-header">
				<h2>
					{activeChat.otherUser
						? `${activeChat.otherUser.firstName} ${activeChat.otherUser.lastName}`
						: 'Chat'}
				</h2>
			</div>
			<div class="messages-container" bind:this={messagesContainer}>
				{#if messages.length === 0}
					<p class="empty-chat">No messages in this chat. Start the conversation!</p>
				{:else}
					{#each messages as message (message.uuid)}
						<div class="message-wrapper {message.sender.uuid === sender.uuid ? 'sent' : 'received'}">
							<div class="message">
								<p>{message.content}</p>
								<span class="message-time">{formatTime(message.createdAt)}</span>
							</div>
						</div>
					{/each}
				{/if}
			</div>
			<div class="message-input-container">
				<textarea
					placeholder="Type a message..."
					bind:value={messageInput}
					on:keydown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
				></textarea>
				<button on:click={sendMessage} disabled={!messageInput.trim()}>
					Send
				</button>
			</div>
		</div>
	{:else}
		<div class="no-chat-selected">
			<p>Select a chat to view messages.</p>
		</div>
	{/if}
</div>

<style>
    .chat-overview {
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
        padding: 12px 16px;
        border-bottom: 1px solid #ddd;
    }
    .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        background-color: #f9f9f9;
    }
    .empty-chat {
        text-align: center;
        color: #888;
        padding: 20px;
    }
    .message-wrapper {
        margin-bottom: 12px;
        display: flex;
        align-items: flex-end;
    }
    .message-wrapper.sent {
        justify-content: flex-end;
    }
    .message-wrapper.received {
        justify-content: flex-start;
    }
    .message {
        max-width: 65%;
        padding: 8px 12px;
        border-radius: 16px;
        background-color: #e0e0e0;
        position: relative;
    }
    .sent .message {
        background-color: #3b82f6;
        color: white;
        border-bottom-right-radius: 4px;
        margin-left: 32px;
    }
    .message-time {
        font-size: 0.75rem;
        color: #555;
        text-align: right;
        margin-top: 4px;
        display: block;
    }
    .message-input-container {
        display: flex;
        align-items: center;
        border-top: 1px solid #ddd;
        padding: 12px 16px;
        background-color: #fff;
    }
    .message-input-container textarea {
        flex: 1;
        padding: 8px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        resize: none;
    }
    .message-input-container button {
        margin-left: 12px;
        padding: 8px 16px;
        background-color: #2979ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }
    .message-input-container button:disabled {
        background-color: #aaa;
        cursor: not-allowed;
    }
    .no-chat-selected {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 1.2rem;
        color: #666;
    }
</style>
