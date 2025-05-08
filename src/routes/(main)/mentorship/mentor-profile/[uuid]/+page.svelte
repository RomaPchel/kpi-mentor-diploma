<script lang="ts">
	import Stars from '$lib/components/Stars.svelte';
	import { fly } from 'svelte/transition';
	import CustomStar from '$lib/components/CustomStar.svelte';

	const { data } = $props();

	let interestsArray: string[] = data.mentor.interests;
	let showMotivationForm = $state(false);

	const config = {
		readOnly: true,
		countStars: 5,
		range: {
			min: 0,
			max: 5,
			step: 0.001
		},
		score: data.mentor.rating,
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
	};

	const alreadyRequested = data.alreadyRequested;
	const alreadyMyMentor = data.alreadyMyMentor;

	let showRatingForm = $state(false); // ⭐

	let friendliness = $state(0);
	let knowledge =  $state(0);
	let communication =  $state(0);
	let comment =  $state('');

	console.log(friendliness);

	function updateScore(type: 'friendliness' | 'knowledge' | 'communication', value: number) {
		switch (type) {
			case 'friendliness':
				friendliness = value;
				break;
			case 'knowledge':
				knowledge = value;
				break;
			case 'communication':
				communication = value;
				break;
		}
		console.log(`${type} updated to`, value);
	}
</script>

<main>
	<div class="profile-header">
		<a class="back-btn" href="/mentorship/find-mentor">&larr; Back to Mentors</a>
		<h1>{data.mentor.name}</h1>
	</div>

	<div class="mentor-profile-card">
		<img class="mentor-avatar" src={data.mentor.avatar} alt="{data.mentor.name} Avatar" />
		<div class="mentor-details">
			<h2>Specialization: {data.mentor.specialization}</h2>

			{#if data.mentor.department}
				<p><strong>Department:</strong> {data.mentor.department}</p>
			{/if}

			{#if interestsArray?.length > 0}
				<p>
					<strong>Interests:</strong> {interestsArray.join(', ')}
				</p>
			{/if}

			<p class="mentor-bio">{data.mentor.bio}</p>
			<p><strong>Rating:</strong> {data.mentor.rating}</p>

			<Stars {config} />
			<p><strong>Кількість відгуків:</strong> {data.mentor.totalReviews}</p>

			{#if !alreadyRequested}
				{#if !showMotivationForm}
					<button class="btn" onclick={() => (showMotivationForm = true)}>
						Request Mentorship
					</button>
				{:else}
					<div class="motivation-form" transition:fly={{ y: 10, duration: 250 }}>
						<form method="POST">
							<input type="hidden" name="mentorUuid" value={data.mentor.mentorUuid} />
							<label for="motivation"><strong>Your Motivation</strong></label>
							<textarea
								name="motivation"
								id="motivation"
								placeholder="Tell the mentor why you want to connect..."
								required
							></textarea>
							<button type="submit" formaction="?/become" class="approve">✅ Approve</button>
						</form>
					</div>
				{/if}
			{:else if alreadyMyMentor && !data.alreadyRated}
				{#if !showRatingForm}
					<button class="btn" onclick={() => (showRatingForm = true)}>
						Rate Mentor
					</button>
				{:else}
					<div class="motivation-form" transition:fly={{ y: 10, duration: 250 }}>
						<form method="POST" >
							<input type="hidden" name="mentorUuid" value={data.mentor.mentorUuid} />

							<label><strong>Friendliness</strong></label>
							<CustomStar
								bind:value={friendliness}
								readOnly={false}
							/>

							<label><strong>Knowledge</strong></label>
							<CustomStar bind:value={knowledge} readOnly={false} />

							<label><strong>Communication</strong></label>
							<CustomStar bind:value={communication} readOnly={false} />

							<label for="comment"><strong>Comment</strong></label>
							<textarea
								id="comment"
								name="comment"
								bind:value={comment}
								placeholder="Your thoughts..."
								rows="4"
							></textarea>

							<input type="hidden" name="friendliness" value={friendliness} />
							<input type="hidden" name="knowledge" value={knowledge} />
							<input type="hidden" name="communication" value={communication} />

							<button type="submit" formaction="?/rate" class="approve">✅ Approve</button>
						</form>
					</div>
				{/if}
				{:else if data.alreadyRated}
				<p class="already-requested">You already rated this mentor ✅</p>
			{:else}
				<p class="already-requested">You’ve already requested mentorship from this mentor ✅</p>
			{/if}
		</div>
		<hr style="margin: 3rem 0; width: 100%;" />

		<h2 style="margin-bottom: 1rem;">Reviews</h2>

		{#if data.mentor.reviews?.length > 0}
			{#each data.mentor.reviews as review}
				<div class="review-card">
					<h3>{review.reviewer?.firstName} {review.reviewer?.lastName}</h3>

					<div class="review-ratings">
						<div>
							<p><strong>Friendliness:</strong></p>
							<CustomStar value={review.friendliness} readOnly={true} />
						</div>
						<div>
							<p><strong>Knowledge:</strong></p>
							<CustomStar value={review.knowledge} readOnly={true} />
						</div>
						<div>
							<p><strong>Communication:</strong></p>
							<CustomStar value={review.communication} readOnly={true} />
						</div>
					</div>

					{#if review.comment}
						<p class="review-comment">"{review.comment}"</p>
					{/if}
				</div>
			{/each}
		{:else}
			<p>No reviews yet.</p>
		{/if}
	</div>
</main>
<footer>
	<p>&copy; {new Date().getFullYear()} MentorConnect. All rights reserved.</p>
</footer>

<style>
    textarea {
        width: 100%;
        height: 150px;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        resize: none;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        margin-top: 0.5rem;
    }

    .motivation-form {
        width: 100%;
        margin-top: 1.5rem;
        text-align: left;
    }

    .motivation-form label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #333;
    }

    .submit-btn {
        margin-top: 1rem;
        width: 100%;
    }

    :global(body) {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
    }

    main {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
    }

    .profile-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .back-btn {
        display: inline-block;
        margin-bottom: 1rem;
        text-decoration: none;
        color: #0070f3;
        font-size: 0.9rem;
    }

    .mentor-profile-card {
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .mentor-avatar {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: 50%;
        margin-bottom: 1.5rem;
        border: 2px solid #0070f3;
    }

    .mentor-details {
        max-width: 600px;
    }

    h1, h2 {
        color: #222;
        margin: 0.5rem 0;
    }

    p {
        color: #555;
        margin: 0.5rem 0;
    }

    .mentor-bio {
        font-style: italic;
    }

    .contact {
        margin-top: 1.5rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        background: #0070f3;
        color: #fff;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        transition: background 0.3s ease;
    }

    .btn:hover {
        background: #005bb5;
    }

    .review-card {
        background: #f1f5f9;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        text-align: left;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .review-ratings {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 0.5rem;
        gap: 1rem;
    }

    .review-comment {
        font-style: italic;
        color: #374151;
        margin-top: 0.5rem;
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
