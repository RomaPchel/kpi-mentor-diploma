<script lang="ts">
	import Stars from '$lib/components/Stars.svelte';

	const { data } = $props();

	const state = $state({
		search: '',
		department: '',
		specialization: '',
		interest: '',
		minRating: 0,
		filteredMentors: data.mentors
	});

	$effect(() => {
		const searchLower = state.search.toLowerCase();
		const interestLower = state.interest.toLowerCase();

		state.filteredMentors = data.mentors.filter((mentor) => {
			return (
				(!state.department || mentor.department?.toLowerCase().includes(state.department.toLowerCase())) &&
				(!state.specialization || mentor.specialization?.toLowerCase().includes(state.specialization.toLowerCase())) &&
				(!state.search ||
					mentor.name.toLowerCase().includes(searchLower) ||
					mentor.interests?.some((i) => i.toLowerCase().includes(searchLower))) &&
				(!state.interest || mentor.interests?.some((i) => i.toLowerCase().includes(interestLower))) &&
				mentor.rating >= state.minRating
			);
		});
	});
</script>


<main>
	<form class="filter-form">
		<input type="text" placeholder="Search name or interest" bind:value={state.search} />
		<input type="text" placeholder="Department" bind:value={state.department} />
		<input type="text" placeholder="Specialization" bind:value={state.specialization} />
		<input type="text" placeholder="Interest (e.g. AI, Web)" bind:value={state.interest} />

		<div class="rating-range">
			<label for="minRating">Min Rating: {state.minRating}</label>
			<input type="range" min="0" max="5" step="0.5" id="minRating" bind:value={state.minRating} />
		</div>
	</form>

	{#if state.filteredMentors.length > 0}
		<div class="mentors-grid">
			{#each state.filteredMentors as mentor}
				<div class="mentor-card">
					<img class="mentor-avatar" src={mentor.avatar} alt="{mentor.name} avatar" />
					<h2>{mentor.name}</h2>
					{#if mentor.department}
						<p><strong>Department:</strong> {mentor.department}</p>
					{/if}
					<p><strong>Specialization:</strong> {mentor.specialization}</p>
					<p><strong>Interests:</strong> {mentor.interests.join(', ')}</p>
					<p><strong>Bio:</strong> {mentor.bio}</p>
					<Stars
						config={{
						readOnly: true,
						countStars: 5,
						range: { min: 0, max: 5, step: 0.001 },
						score: mentor.rating,
						showScore: true,
						scoreFormat: function () {
							return `(${this.score}/${this.countStars})`;
						},
						name: '',
						starConfig: {
							size: 30,
							fillColor: '#F9ED4F',
							strokeColor: '#BB8511',
							unfilledColor: '#FFF',
							strokeUnfilledColor: '#000'
						}
					}}
					/>
					<p><strong>Total reviews:</strong> {mentor.totalReviews}</p>
					<a href={`/mentorship/mentor-profile/${mentor.uuid}`} class="btn">View Profile</a>
				</div>
			{/each}
		</div>
	{:else}
		<p>No mentors match your criteria.</p>
	{/if}
</main>
<style>
    :global(body) {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #333;
    }

    .mentors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
    }

    .mentor-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        text-align: center;
    }

    .mentor-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    .mentor-avatar {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    h2 {
        margin: 0.5rem 0;
        color: #222;
    }

    p {
        margin: 0.5rem 0;
        color: #555;
    }

    .btn {
        display: inline-block;
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: #0070f3;
        color: #fff;
        border-radius: 4px;
        text-decoration: none;
        transition: background 0.3s ease;
    }

    .btn:hover {
        background: #005bb5;
    }
</style>
