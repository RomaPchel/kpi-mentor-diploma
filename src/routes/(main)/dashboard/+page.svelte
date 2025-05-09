<script lang="ts">
	import LevelBadge from '$lib/components/LevelBadge.svelte';
	import Stars from '$lib/components/Stars.svelte';
	const { data } = $props();

	const state = $state({
		user: data.user,
		role: data.role,
		availableMentors: data.availableMentors ?? [],
		activeMentors: data.activeMentors ?? [],
		stats: data.stats ?? null,
		allRequests: data.allRequests ?? []
	});
</script>

<main>
	<h1>Вітаю, {state.user.firstName}!</h1>

	{#if state.role === 'STUDENT'}
		<p class="subtitle">Знайдемо ментора саме для вас 🚀</p>

		{#if state.activeMentors?.length > 0}
			<h2>Ваші ментори</h2>
			<div class="card-grid">
				{#each state.activeMentors as mentor}
					<div class="card">
						<img class="avatar" src={mentor.avatar} alt="mentor" />
						<div class="card-body">
							<h3>{mentor.name}</h3>
							<p class="badge">{mentor.department}</p>
							<p><strong>Інтереси:</strong> {mentor.interests?.join(', ')}</p>
							<div class="subratings">
								<span>😊 Привітність: {mentor.avgFriendliness?.toFixed(1)}</span>
								<span>🧠 Обізнаність: {mentor.avgKnowledge?.toFixed(1)}</span>
								<span>🗣 Комунікація: {mentor.avgCommunication?.toFixed(1)}</span>
							</div>
							<a class="btn" href={`/mentorship/mentor-profile/${mentor.uuid}`}>Переглянути профіль</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<h2>Рекомендовані ментори</h2>
		<div class="card-grid">
			{#each state.availableMentors as mentor}
				<div class="card">
					<div class="level-badge">
						<LevelBadge levelTitle={mentor.stats.levelTitle} level={mentor.stats.level} />
					</div>
					<img class="avatar" src={mentor.avatar} alt="mentor" />
					<div class="card-body">
						<h3>{mentor.name}</h3>

						<p class="badge">{mentor.department}</p>
						<p><strong>Interests:</strong> {mentor.interests?.join(', ')}</p>
						<Stars
							config={{
                readOnly: true,
                countStars: 5,
                range: { min: 0, max: 5, step: 0.001 },
                score: mentor.rating,
                showScore: true,
                scoreFormat: function () {
                  return `(${this.score.toFixed(1)}/5)`;
                },
                name: '',
                starConfig: {
                  size: 24,
                  fillColor: '#FACC15',
                  strokeColor: '#D97706',
                  unfilledColor: '#E5E7EB',
                  strokeUnfilledColor: '#9CA3AF'
                }
              }}
						/>
						<div class="subratings">
							<span>😊 Привітність: {mentor.avgFriendliness?.toFixed(1)}</span>
							<span>🧠 Обізнаність: {mentor.avgKnowledge?.toFixed(1)}</span>
							<span>🗣 Комунікація: {mentor.avgCommunication?.toFixed(1)}</span>
						</div>
						<a class="btn" href={`/mentorship/mentor-profile/${mentor.mentorUuid}`}>Переглянути профіль</a>
					</div>
				</div>
			{/each}
		</div>

		<div class="actions">
			<a class="btn secondary" href="/mentorship/find-mentor">🔍 Переглянути всіх менторів</a>
		</div>

	{:else if state.role === 'MENTOR'}
		<p class="subtitle">Ваші менторствa💼</p>
		<div class="stats-grid">
			<div class="stat-card"><h3>{state.stats.totalRequests}</h3><p>Запити</p></div>
			<div class="stat-card"><h3>{state.stats.activeMentees}</h3><p>Студенти</p></div>
		</div>
		<div class="actions">
			<a class="btn" href="/mentorship/mentee-requests">📬 Переглянути запити</a>
			<a class="btn secondary" href="/profile">👤 Оновити профіль</a>
		</div>

	{:else if state.role === 'ADMIN'}
		<p class="subtitle">Запити менторів 📊</p>
		<h2>Усі запити</h2>
		{#if state.allRequests.length > 0}
			<div class="request-list">
				{#each state.allRequests as req}
					<div class="card">
						<div class="mentee">
							<img src={req.user.avatar} alt="avatar" />
							<div>
								<h3>{req.user.name}</h3>
								<p>{req.user.email}</p>
							</div>
						</div>
						<p class="motivation"><strong>Мотивація:</strong> {req.motivation}</p>
						<div class="actions">
							<form method="POST">
								<input type="hidden" name="uuid" value={req.uuid} />
								<button type="submit" formaction="?/approve" class="btn approve">✅</button>
							</form>
							<form method="POST">
								<input type="hidden" name="uuid" value={req.uuid} />
								<button type="submit" formaction="?/reject" class="btn reject">❌</button>
							</form>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p>Поки немає запитів.</p>
		{/if}
	{/if}
</main>

<style>
    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 1rem;
        font-family: 'Inter', sans-serif;
    }

    h1 {
        font-size: 2.25rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: #1e293b;
        text-align: center;
    }

    .subtitle {
        color: #64748b;
        margin-bottom: 2rem;
        text-align: center;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .card {
        background: #ffffff;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transition: 0.2s ease-in-out;
        position: relative;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
				margin-top: 50px;
				border: 1px black solid;
    }

    .card-body {
        width: 120%;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .card-body h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
    }

    .card-body p {
        font-size: 0.95rem;
        color: #475569;
        line-height: 1.5;
    }

    .badge {
        background-color: #e0f2fe;
        color: #0369a1;
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
        display: inline-block;
    }

    .badge-secondary {
        background-color: #ede9fe;
        color: #6d28d9;
    }

    .btn {
        background-color: #4f46e5;
        color: #ffffff;
        padding: 0.6rem 1.25rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.1s ease;
        text-align: center;
        margin-top: 0.75rem;
    }

    .btn:hover {
        background-color: #4338ca;
        transform: translateY(-2px);
    }

    .btn.secondary {
        background-color: transparent;
        color: #4f46e5;
        border: 2px solid #4f46e5;
    }

    .btn.secondary:hover {
        background-color: rgba(79, 70, 229, 0.08);
    }

    .subratings {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: #64748b;
        margin-top: 0.5rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .stat-card {
        background-color: #f8fafc;
        padding: 1.5rem;
        border-radius: 0.75rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .stat-card h3 {
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.25rem;
    }

    .stat-card p {
        font-size: 1.125rem;
        color: #475569;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }

    .request-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .request-list .card {
        align-items: stretch;
        text-align: left;
        padding: 1.5rem;
    }

    .mentee {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .mentee img {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .mentee h3 {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.25rem;
    }

    .mentee p {
        font-size: 0.95rem;
        color: #475569;
    }

    .motivation {
        font-style: italic;
        color: #475569;
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }

    .request-list .actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    .request-list .actions button {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 600;
        color: #ffffff;
        border: none;
        cursor: pointer;
    }

    .request-list .actions button:hover {
        opacity: 0.9;
    }

    .approve {
        background-color: #16a34a;
    }

    .reject {
        background-color: #dc2626;
    }

    .level-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    @media (max-width: 768px) {
        .card-grid,
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .actions {
            flex-direction: column;
            align-items: stretch;
        }

        .btn {
            width: 100%;
        }
    }
    .approve {
        background-color: #22c55e;
    }

    .reject {
        background-color: #ef4444;
    }
</style>
