<script lang="ts">
	import Stars from '$lib/components/Stars.svelte';
	import { fly } from 'svelte/transition';
	import CustomStar from '$lib/components/CustomStar.svelte';
	import LevelBadge from '$lib/components/LevelBadge.svelte';

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
	<a class="back-btn" href="/mentorship/find-mentor">&larr; Назад до менторів</a>

	<div class="mentor-profile-card">
		<div class="profile-header">
			<div class="header-top">
				<h1>{data.mentor.name}</h1>

				{#if alreadyMyMentor}
					<a class="feedback-btn" href={`/mentorship/mentor-profile/${data.mentor.mentorUuid}/feedback`}>
						Поскаржитися
					</a>
				{/if}
			</div>
		</div>
		<img class="mentor-avatar" src={data.mentor.avatar} alt="{data.mentor.name} Аватар" />

		<div class="mentor-details">
			<h2>
				Спеціалізація: {data.mentor.specialization}
				{#if data.mentor.stats.level}
					<LevelBadge levelTitle={data.mentor.stats.levelTitle} level={data.mentor.stats.level} />
				{/if}
			</h2>

			{#if data.mentor.department}
				<p><strong>Факультет:</strong> {data.mentor.department}</p>
			{/if}

			{#if interestsArray?.length > 0}
				<p><strong>Інтереси:</strong> {interestsArray.join(', ')}</p>
			{/if}

			<h2 style="margin-top: 2rem;">📈 Панель ментора</h2>
			<div class="mentor-dashboard">
				<div class="stat-box"><h3>{data.mentor.stats.totalMentees}</h3><p>Активні підопічні</p></div>
				<div class="stat-box"><h3>{data.mentor.stats.totalSessions}</h3><p>Всього сесій</p></div>
				<div class="stat-box"><h3>{data.mentor.avgFriendliness?.toFixed(1)}</h3><p>😊 Привітність</p></div>
				<div class="stat-box"><h3>{data.mentor.avgKnowledge?.toFixed(1)}</h3><p>🧠 Знання</p></div>
				<div class="stat-box"><h3>{data.mentor.avgCommunication?.toFixed(1)}</h3><p>🗣 Комунікація</p></div>
			</div>

			<p class="mentor-bio">{data.mentor.bio}</p>
			<p><strong>Рейтинг:</strong> {data.mentor.rating}</p>

			<div class="rating-tooltip-wrapper">
				<Stars config={config} />
				<span class="tooltip-icon" tabindex="0">❓
					<div class="tooltip-content">
						<p><strong>Як формується рейтинг?</strong></p>
						<p>
							Рейтинг розраховується на основі оцінок з відгуків, активності ментора, залученості у спілкування, стабільності оцінок і досвіду на платформі.
						</p>
					</div>
				</span>
			</div>

			<p><strong>Кількість відгуків:</strong> {data.mentor.totalReviews}</p>

			{#if !alreadyRequested}
				{#if !showMotivationForm}
					<button class="btn" on:click={() => (showMotivationForm = true)}>
						Надіслати запит на менторство
					</button>
				{:else}
					<div class="motivation-form" transition:fly={{ y: 10, duration: 250 }}>
						<form method="POST">
							<input type="hidden" name="mentorUuid" value={data.mentor.mentorUuid} />
							<label for="motivation"><strong>Мотивація</strong></label>
							<textarea
								name="motivation"
								id="motivation"
								placeholder="Розкажіть ментору, чому хочете приєднатися..."
								required
							></textarea>
							<button type="submit" formaction="?/become" class="approve">✅ Підтвердити</button>
						</form>
					</div>
				{/if}
			{:else if alreadyMyMentor && !data.alreadyRated}
				{#if !showRatingForm}
					<button class="btn" on:click={() => (showRatingForm = true)}>
						Оцінити ментора
					</button>
				{:else}
					<div class="motivation-form" transition:fly={{ y: 10, duration: 250 }}>
						<form method="POST">
							<input type="hidden" name="mentorUuid" value={data.mentor.mentorUuid} />

							<label><strong>Привітність</strong></label>
							<CustomStar bind:value={friendliness} readOnly={false} />

							<label><strong>Знання</strong></label>
							<CustomStar bind:value={knowledge} readOnly={false} />

							<label><strong>Комунікація</strong></label>
							<CustomStar bind:value={communication} readOnly={false} />

							<label for="comment"><strong>Коментар</strong></label>
							<textarea
								id="comment"
								name="comment"
								bind:value={comment}
								placeholder="Ваші враження..."
								rows="4"
							></textarea>

							<input type="hidden" name="friendliness" value={friendliness} />
							<input type="hidden" name="knowledge" value={knowledge} />
							<input type="hidden" name="communication" value={communication} />

							<button type="submit" formaction="?/rate" class="approve">✅ Підтвердити</button>
						</form>
					</div>
				{/if}
			{:else if data.alreadyRated}
				<p class="already-requested">Ви вже оцінили цього ментора ✅</p>
			{:else}
				<p class="already-requested">Ви вже надіслали запит цьому ментору ✅</p>
			{/if}
		</div>

		<hr style="margin: 3rem 0; width: 100%;" />

		<h2 style="margin-bottom: 1rem;">Відгуки</h2>

		{#if data.mentor.reviews?.length > 0}
			{#each data.mentor.reviews as review}
				<div class="review-card">
					<h3>{review.reviewer?.firstName} {review.reviewer?.lastName}</h3>

					<div class="review-ratings">
						<div>
							<p><strong>Привітність:</strong></p>
							<CustomStar value={review.friendliness} readOnly={true} />
						</div>
						<div>
							<p><strong>Знання:</strong></p>
							<CustomStar value={review.knowledge} readOnly={true} />
						</div>
						<div>
							<p><strong>Комунікація:</strong></p>
							<CustomStar value={review.communication} readOnly={true} />
						</div>
					</div>

					{#if review.comment}
						<p class="review-comment">"{review.comment}"</p>
					{/if}
				</div>
			{/each}
		{:else}
			<p>Відгуків поки немає.</p>
		{/if}
	</div>
</main>
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
        position: relative;
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

    .mentor-dashboard {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1rem 0 2rem;
        justify-content: center;
    }

    .mentor-level-badge {
        background: linear-gradient(135deg, #4ade80, #22c55e);
        color: white;
        padding: 0.3rem 0.75rem;
        font-size: 0.75rem;
        border-radius: 9999px;
        margin-left: 1rem;
        font-weight: 600;
        text-transform: uppercase;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }


    .stat-box {
        background-color: #fff;
        border: 1px solid #e5e7eb;
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        width: 150px;
        text-align: center;
    }

    .stat-box h3 {
        margin: 0;
        font-size: 1.5rem;
        color: #2563eb;
    }

    .stat-box p {
        margin: 0.25rem 0 0;
        font-size: 0.9rem;
        color: #555;
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


    .header-top {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        margin-top: 1rem;
    }

    @media (min-width: 640px) {
        .header-top {
            flex-direction: row;
            justify-content: space-between;
            width: 100%;
        }
    }


    .feedback-btn {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: #f85757;
        color: #fff;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border-radius: 8px;
        text-decoration: none;
        transition: background 0.2s ease;
        font-size: 0.85rem;
    }

    .feedback-btn:hover {
        background: #fd7b7b;
    }

    .rating-tooltip-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
    }

    .tooltip-icon {
        cursor: pointer;
        position: relative;
        font-size: 0.875rem;
        color: #6b7280;
        user-select: none;
    }

    .tooltip-icon:hover .tooltip-content,
    .tooltip-icon:focus .tooltip-content {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .tooltip-content {
        position: absolute;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: white;
        color: #1f2937;
        border: 1px solid #d1d5db;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        width: 260px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        z-index: 10;
        font-size: 0.85rem;
        line-height: 1.4;
    }
</style>
