<script>
	import Star from '$lib/components/Star.svelte';

	export let config = {
		readOnly: false,
		countStars: 5,
		range: { min: 0, max: 5, step: 0.001 },
		score: 0.0,
		showScore: true,
		name: "stars",
		scoreFormat: function(){ return `(${this.score.toFixed(0)}/${this.countStars})` },
		starConfig: {
			size: 30,
			fillColor: '#F9ED4F',
			strokeColor: "#BB8511",
			unfilledColor: '#FFF',
			strokeUnfilledColor: '#000'
		}
	}
</script>

<section class="stars-container">
	<div class="range-stars">
		<div class="stars">
			{#each Array(config.countStars) as star, id}
				{#if parseInt(config.score) == id}
					<Star id={config.name + id} readOnly={config.readOnly} starConfig={config.starConfig} fillPercentage={config.score - parseInt(config.score)}/>
				{:else if parseInt(config.score) > id}
					<Star id={config.name + id} readOnly={config.readOnly} starConfig={config.starConfig} fillPercentage={1}/>
				{:else}
					<Star id={config.name + id} readOnly={config.readOnly} starConfig={config.starConfig} fillPercentage={0}/>
				{/if}
			{/each}
		</div>
		<input  name={config.name}
						class="slider"
						type="range"
						min={config.readOnly ? config.score : config.range.min}
						max={config.readOnly ? config.score : config.range.max}
						step="{config.range.step}" bind:value={config.score}
						on:change
						on:click
		>
	</div>
	{#if config.showScore}
    <span class="show-score" style="font-size: {config.starConfig.size/2}px;">
      {#if config.scoreFormat}
        {config.scoreFormat()}
      {:else}
        ({parseFloat((config.score/config.countStars)*100).toFixed(2)}%)
      {/if}
    </span>
	{/if}
</section>

<style>
    .stars-container{ position: relative; display: flex; align-items: center; justify-content: center; gap: .5rem; }
    .range-stars{ position: relative; }
    .stars{ display: flex; align-items: center; justify-content: center; gap: .5rem; }
    .slider{ opacity: 0; cursor: pointer; position: absolute; top: 0; left: 0; right: 0; left: 0; height: 100%; }
    .show-score{ user-select: none; color: #888 }
</style>
