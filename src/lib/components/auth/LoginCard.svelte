<script lang="ts">
import TextInput from '$lib/components/TextInput.svelte';
import Card from '$lib/components/Card.svelte';

</script>

<Card>
	<div class="login-card-content">
		<form method="POST" action="?/login" class="login-card-form">
			<TextInput name="email" label="Email" type="email" placeholder="Write your email"/>
			<TextInput name="password" label="Password" type="password" placeholder="Write your password"/>
			<button type="submit">Login</button>
		</form>
	</div>
</Card>


<style>

	.login-card-content{
			display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
			border: 1px solid black;
			width: 30%;
			border-radius: 5px;
	}
</style>