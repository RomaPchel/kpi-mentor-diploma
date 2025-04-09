<script lang="ts">
	export let data;
</script>

<main>
	<h1>Mentee Requests</h1>

	{#if data.requests.length === 0}
		<p>No new requests</p>
	{:else}
		<div class="requests">
			{#each data.requests as req}
				<div class="card">
					<div class="mentee">
						<img src={req.mentee.avatar} alt="avatar" />
						<div>
							<h3>{req.mentee.name}</h3>
							<p>{req.mentee.email}</p>
						</div>
					</div>
					<p class="motivation">{req.motivation}</p>

					<div class="actions">
						<form method="POST">
							<input type="hidden" name="uuid" value={req.uuid} />
							<button type="submit" formaction="?/approve" class="approve">✅ Approve</button>
						</form>

						<form method="POST">
							<input type="hidden" name="uuid" value={req.uuid} />
							<button type="submit" formaction="?/reject" class="reject">❌ Reject</button>
						</form>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</main>

<style>
    .requests {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    .card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
    }
    .mentee {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .mentee img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        object-fit: cover;
    }
    .motivation {
        font-style: italic;
    }
    .actions {
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
    }
    button {
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
    }
    .approve {
        background-color: #4caf50;
        color: white;
    }
    .reject {
        background-color: #f44336;
        color: white;
    }
</style>
