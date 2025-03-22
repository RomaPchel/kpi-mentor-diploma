<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ChatApi from '$lib/API/ChatApi';
	import AuthProvider from '$lib/components/AuthProvider.svelte';
	let { data, children } = $props();

	ChatApi.initializeSocket(data.user.uuid)
</script>

<AuthProvider>
	<Header user={data.user} isLoggedIn={data.isLoggedIn}/>

	<main>
		{@render children()}
	</main>

	<!--<Footer />-->
</AuthProvider>
