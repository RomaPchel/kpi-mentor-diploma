<script lang="ts">

	const {data} = $props()

	const state = $state({
		user: data.user,
		role: data.role,
		mentors: data.mentors ?? [],
		stats: data.stats ?? null
	});
</script>

<main>

	<h1>Welcome, {state.user.firstName}!</h1>

	{#if state.role === 'STUDENT'}
		<p class="subtitle">Let’s find a mentor that fits you 🚀</p>

		<h2>Suggested Mentors</h2>
		<div class="mentors-grid">
			{#each state.mentors as mentor}
				<div class="mentor-card">
					<img class="avatar" src={mentor.avatar} alt={mentor.name} />
					<h3>{mentor.name}</h3>
					<p>{mentor.department}</p>
					<p>⭐ {mentor.rating}</p>
					<p><strong>Interests:</strong> {mentor.interests.join(', ')}</p>
					<a class="btn" href={`/mentorship/mentor-profile/${mentor.uuid}`}>View Profile</a>
				</div>
			{/each}
		</div>

		<div class="actions">
			<a class="btn outline" href="/mentorship/find-mentor">🔍 Browse All Mentors</a>
		</div>

	{:else if state.role === 'MENTOR'}
		<p class="subtitle">Here’s what’s going on with your mentorships 💼</p>

		<div class="mentor-stats">
			<div class="card"><h3>{state.stats.totalRequests}</h3><p>Pending Requests</p></div>
			<div class="card"><h3>{state.stats.activeMentees}</h3><p>Active Mentees</p></div>
		</div>

		<div class="actions">
			<a class="btn" href="/mentorship/mentee-requests">📬 View Requests</a>
			<a class="btn outline" href="/profile">👤 Update Profile</a>
		</div>
	{/if}
</main>

<style>

    main {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        font-size: 2rem;
    }

    .subtitle {
        color: #777;
        margin-bottom: 1.5rem;
    }

    .mentors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1.5rem;
    }

    .mentor-card {
        background: #fff;
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        text-align: center;
    }

    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 0.5rem;
    }

    .btn {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #0070f3;
        color: #fff;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 500;
    }

    .btn.outline {
        background: transparent;
        border: 1px solid #0070f3;
        color: #0070f3;
    }

    .mentor-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
    }

    .mentor-stats .card {
        flex: 1;
        background: #fff;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        text-align: center;
    }

    .actions {
        margin-top: 2rem;
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
</style>
