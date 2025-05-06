<script lang="ts">
	export let value = 0; // bind:value support
	export let readOnly = false;
	export let count = 5;
	export let size = 30;
	export let fillColor = '#F9ED4F';
	export let strokeColor = '#BB8511';

	let hover = 0;

	function handleClick(index: number) {
		if (!readOnly) value = index;
	}

	function handleMouseEnter(index: number) {
		if (!readOnly) hover = index;
	}

	function handleMouseLeave() {
		if (!readOnly) hover = 0;
	}
</script>

<div class="stars" on:mouseleave={handleMouseLeave}>
	{#each Array(count) as _, i}
		<svg
			on:mouseenter={() => handleMouseEnter(i + 1)}
			on:click={() => handleClick(i + 1)}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={(hover || value) > i ? fillColor : 'none'}
			stroke={strokeColor}
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="star"
			style="cursor: {readOnly ? 'default' : 'pointer'}"
		>
			<polygon points="12 2 15 8.5 22 9.3 17 14.2 18.3 21 12 17.8 5.7 21 7 14.2 2 9.3 9 8.5 12 2" />
		</svg>
	{/each}
</div>

<style>
    .stars {
        display: flex;
        gap: 0.25rem;
        justify-content: center;
        align-items: center;
    }

    .star {
        transition: fill 0.2s;
    }
</style>
