<script lang="ts">
	import Stars from '$lib/components/Stars.svelte';
	import LevelBadge from '$lib/components/LevelBadge.svelte';
	import placeholderAvatar from '../../../../../static/avatar.png';

	const { data } = $props();

	const state = $state({
		search: '',
		department: '',
		specialization: '',
		interest: '',
		minRating: 0,
		minFriendliness: 0,
		minKnowledge: 0,
		minCommunication: 0,
		filteredMentors: data.mentors
	});

	const predefinedInterests = [
		'Програмування',
		'Машинне навчання',
		'Веб-розробка',
		'Мобільні додатки',
		'Бази даних',
		'Штучний інтелект',
		'Кібербезпека',
		'Алгоритми',
		'Дизайн',
		'Тестування'
	];

	const ourPickMentor = data.mentors.find((m) => m.isHighlighted);

	const topMentors = [...data.mentors]
		.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
		.slice(0, 6)
		.filter((m) => m !== ourPickMentor);

	$effect(() => {
		const searchLower = state.search.toLowerCase().trim();
		const interestLower = state.interest.toLowerCase().trim();

		const hasAnyFilter =
			state.search.trim() ||
			state.department.trim() ||
			state.specialization.trim() ||
			state.interest.trim() ||
			state.minRating > 0 ||
			state.minFriendliness > 0 ||
			state.minKnowledge > 0 ||
			state.minCommunication > 0;

		if (!hasAnyFilter) {
			state.filteredMentors = data.mentors.filter((m) => m !== ourPickMentor);
			return;
		}

		state.filteredMentors = data.mentors.filter((mentor) => {
			if (mentor === ourPickMentor) return false;

			const interests = mentor.interests ?? [];
			const department = mentor.department ?? '';
			const specialization = mentor.specialization ?? '';
			const name = mentor.name ?? '';
			const rating = mentor.rating ?? 0;
			const friendliness = mentor.avgFriendliness ?? 0;
			const knowledge = mentor.avgKnowledge ?? 0;
			const communication = mentor.avgCommunication ?? 0;

			return (
				(!state.department || department.toLowerCase().includes(state.department.toLowerCase())) &&
				(!state.specialization || specialization.toLowerCase().includes(state.specialization.toLowerCase())) &&
				(!state.search ||
					name.toLowerCase().includes(searchLower) ||
					interests.some((i) => i.toLowerCase().includes(searchLower))) &&
				(!state.interest || interests.some((i) => i.toLowerCase().includes(interestLower))) &&
				rating >= state.minRating &&
				friendliness >= state.minFriendliness &&
				knowledge >= state.minKnowledge &&
				communication >= state.minCommunication
			);
		});
	});
</script>

<main>
	<h1>Знайти ментора</h1>
	<div class="layout">
		<aside class="left-panel">

			<form class="filter-panel">
				<div class="form-group">
					<label>Пошук</label>
					<input type="text" placeholder="Ім'я" bind:value={state.search} />
				</div>

				<div class="form-group">
					<label>Факультет</label>
					<input type="text" placeholder="наприклад, Комп'ютерні науки" bind:value={state.department} />
				</div>

				<div class="form-group">
					<label>Інтерес</label>
					<select bind:value={state.interest}>
						<option value="">-- Оберіть інтерес --</option>
						{#each predefinedInterests as interest}
							<option value={interest}>{interest}</option>
						{/each}
					</select>
				</div>

				<div class="form-group">
					<label>Мінімальний рейтинг</label>
					<input type="range" min="0" max="5" step="0.5" bind:value={state.minRating} />
					<small>{state.minRating} зірок</small>
				</div>

				<hr />

				<div class="form-group">
					<label>Мінімальна привітність</label>
					<input type="range" min="0" max="5" step="0.5" bind:value={state.minFriendliness} />
					<small>{state.minFriendliness} / 5</small>
				</div>

				<div class="form-group">
					<label>Мінімальні знання</label>
					<input type="range" min="0" max="5" step="0.5" bind:value={state.minKnowledge} />
					<small>{state.minKnowledge} / 5</small>
				</div>

				<div class="form-group">
					<label>Мінімальна комунікація</label>
					<input type="range" min="0" max="5" step="0.5" bind:value={state.minCommunication} />
					<small>{state.minCommunication} / 5</small>
				</div>
			</form>

		</aside>

		<div class="right-panel">
			{#if ourPickMentor}
				<h2>👑 Наш вибір</h2>

				<section class="highlight-and-leaderboard">

					<div class="card-pick highlight">

						<div class="level-badge">
							<LevelBadge levelTitle={ourPickMentor.stats.levelTitle} level={ourPickMentor.stats.level} />
						</div>
						<img class="avatar" src={ourPickMentor.avatar || placeholderAvatar} alt="mentor" />
						<div class="card-body">
							<h3>{ourPickMentor.name}</h3>
							<p class="badge">{ourPickMentor.department}</p>
							<p><strong>Інтереси:</strong> {ourPickMentor.interests?.join(', ')}</p>
							<Stars config={{
								readOnly: true,
								countStars: 5,
								range: { min: 0, max: 5, step: 0.001 },
								score: ourPickMentor.rating,
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
							}} />
							<a class="btn" href={`/mentorship/mentor-profile/${ourPickMentor.mentorUuid}`}>Переглянути профіль</a>
						</div>
					</div>

					{#if topMentors.length > 0}
						<section class="leaderboard">
							<h2>🏆 Топ ментори</h2>
							<ul>
								{#each topMentors as m, i}
									<li class="leaderboard-item">
										<span class="rank">#{i + 1}</span>
										<img src={m.avatar || placeholderAvatar} alt="avatar" />
										<div>
											<a href="/mentorship/mentor-profile/{m.mentorUuid}" style="text-decoration:none;color: black"> <strong>{m.name}</strong></a>
											<div class="score">{m.rating?.toFixed(2)} ★</div>
										</div>
									</li>
								{/each}
							</ul>
						</section>
					{/if}
				</section>
			{/if}

			{#if state.filteredMentors.length > 0}
				<div class="card-grid">
					{#each state.filteredMentors as mentor}
						<div class="card">
							<div class="level-badge">
								<LevelBadge levelTitle={mentor.stats.levelTitle} level={mentor.stats.level} />
							</div>
							<img class="avatar" src={mentor.avatar} alt="mentor" />
							<div class="card-body">
								<h3>{mentor.name}</h3>

								<p class="badge">{mentor.department}</p>
								<p><strong>Інтереси:</strong> {mentor.interests?.join(', ')}</p>
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
									<span>🧠 Знання: {mentor.avgKnowledge?.toFixed(1)}</span>
									<span>🗣 Комунікація: {mentor.avgCommunication?.toFixed(1)}</span>
								</div>
								<a class="btn" href={`/mentorship/mentor-profile/${mentor.mentorUuid}`}>Переглянути профіль</a>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="no-results">
					<p>Ментори не знайдені за заданими фільтрами.</p>
					<p>Спробуйте змінити фільтри або розширити пошук.</p>
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
    .layout {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
    }

    .left-panel {
        width: 280px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .right-panel {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    @media (max-width: 768px) {
        .layout {
            flex-direction: column;
        }

        .left-panel {
            width: 100%;
        }

        .right-panel {
            width: 100%;
        }
    }


    .card-pick.highlight {
        border: 2px solid #facc15;
        background-color: #fefce8;
    }

    .leaderboard {
        background: #f8fafc;
        border: 1px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 2rem;
    }

    .leaderboard h2 {
        font-size: 1.25rem;
        margin-bottom: 1rem;
    }

    .leaderboard ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .leaderboard-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .leaderboard-item img {
        width: 40px;
        height: 40px;
        border-radius: 9999px;
        object-fit: cover;
        border: 1px solid #d1d5db;
    }

    .leaderboard-item .rank {
        font-weight: bold;
        color: #facc15;
        font-size: 1.1rem;
    }

    .leaderboard-item .score {
        font-size: 0.9rem;
        color: #475569;
    }
    h1 {
        font-size: 2.25rem;
        text-align: center;
        margin-bottom: 2rem;
        color: #1e293b;
    }

    .layout {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 2rem;
    }

    .filter-panel {
        background: white;
        padding: 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        position: sticky;
        top: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }

    label {
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    input[type='text'],
    input[type='range'],
    select {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 0.5rem;
        font-size: 1rem;
        background: white;
    }

    small {
        color: #6b7280;
        font-size: 0.875rem;
    }

    hr {
        margin: 1.5rem 0;
        border: none;
        border-top: 1px solid #e5e7eb;
    }

    .no-results {
        text-align: center;
        color: #6b7280;
        font-size: 1rem;
        padding: 2rem 1rem;
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
        justify-content: space-between;
        text-align: center;
        transition: 0.2s ease-in-out;
        position: relative;
        min-height: 400px;
    }

    .card-pick {
        background: #ffffff;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        text-align: center;
        transition: 0.2s ease-in-out;
        position: relative;
        min-height: 400px;
    }

    .card:hover {
        transform: translateY(-4px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .level-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
    }

    .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        object-fit: cover;
        margin: 2rem auto 1rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
        border: 1px black solid;
    }

    .card-body {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex: 1;
    }

    .card-body h3 {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
    }

    .card-body p {
        font-size: 0.95rem;
        color: #475569;
        line-height: 1.4;
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

    .subratings {
        display: flex;
        flex-direction: column;
        font-size: 0.85rem;
        color: #64748b;
        margin-top: 0.5rem;
        gap: 0.2rem;
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
        margin-top: auto;
    }

    .btn:hover {
        background-color: #4338ca;
        transform: translateY(-2px);
    }

    @media (max-width: 768px) {
        .layout {
            grid-template-columns: 1fr;
        }
    }

    .highlight-and-leaderboard {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        align-items: flex-start;
    }




</style>
