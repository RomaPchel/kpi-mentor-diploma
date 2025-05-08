<script lang="ts">
	import Stars from '$lib/components/Stars.svelte';

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
			// No filters applied — show all mentors
			state.filteredMentors = data.mentors;
			return;
		}

		state.filteredMentors = data.mentors.filter((mentor) => {
			console.log(mentor)
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
	<h1>Find a Mentor</h1>

	<div class="layout">
		<form class="filter-panel">
			<div class="form-group">
				<label>Search</label>
				<input type="text" placeholder="Name" bind:value={state.search} />
			</div>


			<div class="form-group">
				<label>Department</label>
				<input type="text" placeholder="e.g. Computer Science" bind:value={state.department} />
			</div>

			<div class="form-group">
				<label>Specialization</label>
				<input type="text" placeholder="e.g. AI, Cybersecurity" bind:value={state.specialization} />
			</div>

			<div class="form-group">
				<label>Interest</label>
				<select bind:value={state.interest}>
					<option value="">-- Select interest --</option>
					{#each predefinedInterests as interest}
						<option value={interest}>{interest}</option>
					{/each}
				</select>
			</div>


			<div class="form-group">
				<label>Min Rating</label>
				<input type="range" min="0" max="5" step="0.5" bind:value={state.minRating} />
				<small>{state.minRating} stars</small>
			</div>

			<hr />

			<div class="form-group">
				<label>Min Friendliness</label>
				<input type="range" min="0" max="5" step="0.5" bind:value={state.minFriendliness} />
				<small>{state.minFriendliness} / 5</small>
			</div>

			<div class="form-group">
				<label>Min Knowledge</label>
				<input type="range" min="0" max="5" step="0.5" bind:value={state.minKnowledge} />
				<small>{state.minKnowledge} / 5</small>
			</div>

			<div class="form-group">
				<label>Min Communication</label>
				<input type="range" min="0" max="5" step="0.5" bind:value={state.minCommunication} />
				<small>{state.minCommunication} / 5</small>
			</div>
		</form>

		{#if state.filteredMentors.length > 0}
			<div class="mentors-grid">
				{#each state.filteredMentors as mentor}
					<div class="mentor-card">
						<img class="mentor-avatar" src={mentor.avatar} alt="{mentor.name} avatar" />
						<h2>{mentor.name}</h2>
						<p class="badge">{mentor.department}</p>
						<p class="badge badge-secondary">{mentor.specialization}</p>
						<p><strong>Interests:</strong> {mentor.interests?.join(', ')}</p>
						<p><strong>Bio:</strong> {mentor.bio}</p>

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
							<span>😊 Friendliness: {mentor.avgFriendliness?.toFixed(1)}</span>
							<span>🧠 Knowledge: {mentor.avgKnowledge?.toFixed(1)}</span>
							<span>🗣 Communication: {mentor.avgCommunication?.toFixed(1)}</span>
						</div>

						<a href={`/mentorship/mentor-profile/${mentor.mentorUuid}`} class="btn">View Profile</a>
					</div>
				{/each}
			</div>
		{:else}
			<div class="no-results">
				<p>No mentors match your filters.</p>
				<p>Try adjusting filters or broadening your search.</p>
			</div>
		{/if}
	</div>
</main>
<footer>
	<p>&copy; {new Date().getFullYear()} SMP. Всі права захищені.</p>
</footer>
<style>
    h1 {
        font-size: 2.5rem;
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

    input[type="text"],
    input[type="range"] {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 0.5rem;
    }

    small {
        color: #6b7280;
        font-size: 0.875rem;
    }

    hr {
        margin: 1rem 0;
        border-color: #e5e7eb;
    }

    .mentors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
    }

    .mentor-card {
        background: white;
        padding: 1rem;
        border-radius: 0.75rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
				height: 65%;
    }

    .mentor-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
    }

    .mentor-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 0.75rem;
    }

    h2 {
        margin: 0.25rem 0;
        font-size: 1.1rem;
        color: #111827;
        font-weight: 600;
    }

    .badge {
        display: inline-block;
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.2rem 0.4rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        margin: 0.15rem;
    }

    .badge-secondary {
        background: #ede9fe;
        color: #6d28d9;
    }

    .subratings {
        margin-top: 0.5rem;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 0.75rem;
        color: #374151;
    }

    h2 {
        margin-bottom: 0.5rem;
        font-size: 1.25rem;
        color: #111827;
    }

    .badge {
        display: inline-block;
        background: #e0f2fe;
        color: #0369a1;
        padding: 0.25rem 0.5rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        margin-right: 0.25rem;
    }

    .badge-secondary {
        background: #ede9fe;
        color: #6d28d9;
    }

    .subratings {
        margin-top: 0.75rem;
        display: flex;
        flex-direction: column;
        font-size: 0.875rem;
        color: #374151;
        gap: 0.25rem;
    }

    select {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        padding: 0.5rem;
        background-color: white;
        font-size: 1rem;
    }

    .btn {
        margin-top: 1rem;
        display: inline-block;
        background-color: #3b82f6;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        text-align: center;
        text-decoration: none;
        font-weight: 500;
        transition: background-color 0.2s ease;
    }

    .btn:hover {
        background-color: #2563eb;
    }

    .no-results {
        text-align: center;
        color: #6b7280;
        font-size: 1.1rem;
    }
    footer {
        position: absolute;
        width: 100%;
        background-color: #f0f0f0;
        color: #555;
        text-align: center;
        padding: 1rem;
        border-top: 1px solid #ddd;
        font-size: 0.9rem;
    }
</style>
