<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ChatApi from '$lib/API/ChatApi';
	let { data, children } = $props();

	console.log(data.user)
	ChatApi.initializeSocket(data.user.uuid)
</script>
<Header user={data.user} isLoggedIn={data.isLoggedIn}/>

<main>
	{@render children()}
</main>

<!--<Footer />-->
