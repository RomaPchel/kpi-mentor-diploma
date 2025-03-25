
<script lang="ts">

	const {data} = $props()

	console.log(data.mentors)
</script>

<main>
	<h1>Find a Mentor</h1>

	{#if data.mentors.length > 0}
		<ul>
			{#each data.mentors as mentor}
				<li>
					<h2>{mentor.name}</h2>
					<p><strong>Specialization:</strong> {mentor.specialization}</p>
					<p><strong>Bio:</strong> {mentor.bio}</p>
					<p><strong>Rating:</strong> {mentor.rating}</p>
					<p><strong>Total reviews:</strong> {mentor.totalReviews}</p>
					<a href={`/mentor/${mentor.uuid}`}>View Profile</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p>Loading mentors...</p>
	{/if}
</main>

<style>
    main {
        padding: 2rem;
    }

    ul {
        list-style-type: none;
    }

    li {
        margin: 1rem 0;
    }

    a {
        color: blue;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>
