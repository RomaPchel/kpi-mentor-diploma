<script lang="ts">
	const { data } = $props();

	console.log(data.mentors);
</script>

<main>
	<h1>Find a Mentor</h1>

	{#if data.mentors.length > 0}
		<div class="mentors-grid">
			{#each data.mentors as mentor}
				<div class="mentor-card">
					<img class="mentor-avatar" src={mentor.avatar} alt="{mentor.name} avatar" />
					<h2>{mentor.name}</h2>
					<p><strong>Specialization:</strong> {mentor.specialization}</p>
					<p><strong>Bio:</strong> {mentor.bio}</p>
					<p><strong>Rating:</strong> {mentor.rating}</p>
					<p><strong>Total reviews:</strong> {mentor.totalReviews}</p>
					<a href={`/mentorship/mentor-profile/${mentor.uuid}`} class="btn">View Profile</a>
				</div>
			{/each}
		</div>
	{:else}
		<p>Loading mentors...</p>
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
