<script lang="ts">
	import locale from '$lib/locale.json';
	import { PUBLIC_SERVER_URL } from '$env/static/public';

	const { data } = $props();

	const state = $state({
		user: data.user,
		role: data.role,
		events: data.events ?? [],
		users: data.users ?? [],
		showCreateEventForm: false,
		showEditEventForm: false,
		selectedParticipants: [],
		editingEvent: null,
		filters: {
			status: '',
			minTimestamp: '',
			maxTimestamp: '',
			minCreatedAt: '',
			maxCreatedAt: '',
		},
		sortBy: 'createdAt',
		sortOrder: 'desc',
		token: data.token,
	});

	function createEvent() {
		state.showCreateEventForm = true;
	}

	function closeCreateModal() {
		state.showCreateEventForm = false;
	}

	function editEvent(event) {
		state.editingEvent = JSON.parse(JSON.stringify(event));
		state.showEditEventForm = true;
	}


	function closeEditModal() {
		state.editingEvent = null;
		state.showEditEventForm = false;
	}

	function formatLocalDate(timestamp: number | string) {
		const date = new Date(timestamp);
		const tzOffset = date.getTimezoneOffset() * 60000;
		return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
	}

	async function applyFilters() {
		const params = new URLSearchParams();
		console.log(state.filters);
		if (state.filters.status) params.append('status', state.filters.status);
		if (state.filters.minTimestamp) params.append('minTimestamp', new Date(state.filters.minTimestamp).getTime().toString());
		if (state.filters.maxTimestamp) params.append('maxTimestamp', new Date(state.filters.maxTimestamp).getTime().toString());
		if (state.filters.minCreatedAt) params.append('minCreatedAt', new Date(state.filters.minCreatedAt).getTime().toString());
		if (state.filters.maxCreatedAt) params.append('maxCreatedAt', new Date(state.filters.maxCreatedAt).getTime().toString());

		params.append('sortBy', state.sortBy);
		params.append('sortOrder', state.sortOrder);
		if (state.user.role === 'mentor') {
			params.set('owner', state.user.uuid);
		} else {
			params.set('users', JSON.stringify([state.user.uuid]));
		}
		const response = await fetch(`${PUBLIC_SERVER_URL}/api/events?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${state.token}`,
			}
		})
		const json = await response.json();
		state.events = json;
	}

	function toggleSort(property: string) {
		if (state.sortBy === property) {
			state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			state.sortBy = property;
			state.sortOrder = 'desc';
		}
		applyFilters();
	}
</script>

<main>
	<h1>Зустрічі</h1>

	<div class="filters">
		<label>
			<strong>Статус:</strong>
			<select bind:value={state.filters.status} on:change={applyFilters}>
				<option value="">Усі</option>
				<option value="planned">Заплановано</option>
				<option value="completed">Виконано</option>
				<option value="canceled">Скасовано</option>
			</select>
		</label>

		<label>
			<strong>Дата створення від:</strong>
			<input type="datetime-local" bind:value={state.filters.minCreatedAt} on:change={applyFilters} />
		</label>

		<label>
			<strong>Дата створення до:</strong>
			<input type="datetime-local" bind:value={state.filters.maxCreatedAt} on:change={applyFilters} />
		</label>

		<label>
			<strong>Дата зустрічі від:</strong>
			<input type="datetime-local" bind:value={state.filters.minTimestamp} on:change={applyFilters} />
		</label>

		<label>
			<strong>Дата зустрічі до:</strong>
			<input type="datetime-local" bind:value={state.filters.maxTimestamp} on:change={applyFilters} />
		</label>
		<div class="sort">
			<button on:click={() => toggleSort('status')}>Cтатус ({state.sortOrder === 'asc' ? '↑' : '↓'})</button>
			<button on:click={() => toggleSort('timestamp')}>Дата зустрічі ({state.sortOrder === 'asc' ? '↑' : '↓'})</button>
			<button on:click={() => toggleSort('createdAt')}>Дата створення ({state.sortOrder === 'asc' ? '↑' : '↓'})</button>
		</div>
	</div>
	{#if state.events.length > 0}
		<div class="card-container">
			{#each state.events as event}
				<div class="card">
					<p><strong>Посилання:</strong> <a href={event.url} target="_blank">{event.url}</a></p>
					<p><strong>Коли:</strong> {new Date(event.timestamp).toLocaleString()}</p>
					<p>
						<strong>Статус:</strong>
						<span class={event.status === 'canceled' ? 'status-canceled' :event.status === 'completed' ? 'status-completed' :'status-other'}>{locale[event.status]}</span>
					</p>
					<p><strong>Організатор:</strong> {event.owner.name}</p>
					<p><strong>Учасники:</strong></p>
					<ul>
						{#each event.participants as participant}
							<li>{participant.name}</li>
						{/each}
					</ul>
					<p><strong>Створено:</strong> {new Date(event.createdAt).toLocaleString()}</p>
					{#if state.role === 'MENTOR'}
						<button on:click={() => editEvent(event)} class="update-button">Оновити</button>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<p>Івентів не знайдено</p>
	{/if}
	{#if state.role === 'MENTOR'}
		<button on:click={createEvent} class="create-button">Створити зустріч</button>
	{/if}
</main>

{#if state.showCreateEventForm}
	<div class="modal-backdrop" on:click={closeCreateModal}></div>
	<div class="modal">
		<h2>Нова зустріч</h2>
		<form method="POST" >
			<label>
				<strong>Посилання:</strong>
				<input name="url" type="text" required />
			</label>
			<label>
				<strong>Коли:</strong>
				<input name="timestamp" type="datetime-local" required />
			</label>
			<label><strong>Учасники:</strong></label>
			{#each state.users as participant}
				<label class="participant-option">
					<input
						type="checkbox"
						name="participants"
						value={participant.id}
					/>
					{participant.firstName} {participant.lastName}
				</label>
			{/each}
			<br />
			<div class="actions">
				<button class="create-form-button" type="submit" formaction="?/create">Створити</button>
				<button class="cancel-form-button" type="button" on:click={closeCreateModal}>Назад</button>
			</div>
		</form>
	</div>
{/if}

{#if state.showEditEventForm}
	<div class="modal-backdrop" on:click={closeEditModal}></div>
	<div class="modal">
		<h2>Редагувати зустріч</h2>
		<form method="POST">
			<input type="hidden" name="id" value={state.editingEvent.id} />
			<label>
				<strong>Посилання:</strong>
				<input
					name="url"
					type="text"
					required
					value={state.editingEvent.url}
				/>
			</label>
			<label>
				<strong>Коли:</strong>
				<input
					name="timestamp"
					type="datetime-local"
					required
					value={formatLocalDate(state.editingEvent.timestamp)}
				/>
			</label>
			<label>
				<strong>Статус:</strong>
				<select name="status" required>
					<option value="planned" selected={state.editingEvent.status === 'planned'}>Заплановано</option>
					<option value="completed" selected={state.editingEvent.status === 'completed'}>Виконано</option>
					<option value="canceled" selected={state.editingEvent.status === 'canceled'}>Скасовано</option>
				</select>
			</label>
			<label><strong>Учасники:</strong></label>
			{#each state.users as participant}
				<label class="participant-option">
					<input
						type="checkbox"
						name="participants"
						value={participant.id}
						checked={state.editingEvent.participants.some(p => p.id === participant.id)}
					/>
					{participant.firstName} {participant.lastName}
				</label>
			{/each}
			<br />
			<div class="actions">
				<button class="edit-form-button" type="submit" formaction="?/update">Update</button>
				<button class="cancel-form-button" type="button" on:click={closeEditModal}>Cancel</button>
			</div>
		</form>
	</div>
{/if}


<style>
    main {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2rem;
    }

    .create-button {
        background-color: #0077cc;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 1.5rem;
        margin-top: 1.5rem;
    }
    .sort button {
        background-color: #0077cc;
        color: white;
        border: none;
        padding: 0.3rem 1.0rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 1.5rem;
    }
    .update-button {
        background-color: #0077cc;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
        margin-bottom: 1.5rem;
        margin-top: 1.5rem;
    }
    .status-canceled {
        color: red;
        font-weight: bold;
    }
    .status-completed {
        color: green;
        font-weight: bold;
    }
    .status-other {
        color: #0077cc; /* blue */
        font-weight: bold;
    }
    .create-form-button {
        background-color: #0077cc;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .edit-form-button {
        background-color: #0077cc;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .cancel-form-button {
        background-color: red;
        color: white;
        border: none;
        padding: 0.6rem 1.2rem;
        font-size: 1rem;
        border-radius: 6px;
        cursor: pointer;
    }

    .card-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .card {
        padding: 1.5rem;
        border-radius: 8px;
        background-color: #f0f4f8;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .card a {
        color: #0077cc;
        text-decoration: none;
    }

    .card a:hover {
        text-decoration: underline;
    }

    .card ul {
        margin-top: 0.5rem;
        padding-left: 1.25rem;
    }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    }

    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        width: 90%;
        max-width: 500px;
    }

    .modal h2 {
        margin-top: 0;
    }

    .modal label {
        display: block;
        margin-top: 1rem;
    }

    .participant-option {
        display: block;
        margin-left: 1rem;
    }

    .actions {
        margin-top: 1.5rem;
        display: flex;
        gap: 1rem;
    }

		.filters {
				display: flex;
				flex-direction: column;
		}

		.filters label {
				margin-bottom: 1rem;
		}
</style>
