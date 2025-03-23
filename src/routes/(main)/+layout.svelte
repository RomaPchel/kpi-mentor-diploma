<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	let { data, children } = $props();

</script>

	<Header user={data.user} isLoggedIn={data.isLoggedIn}/>

	<main>
		{@render children()}
	</main>

	<!--<Footer />-->
