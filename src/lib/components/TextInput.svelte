<script lang="ts">
	const {name, label, type, placeholder} = $props()
</script>

<div class="text-input-container">
	<label for={name}>{label}</label>
	<input id={name} name={name} type={type} placeholder={placeholder} class="text-input"/>
</div>

<style>
		.text-input-container{
				display: flex;
				flex-direction: column;
				margin: 1em;
		}
	.text-input{
			border: 1px solid #297045;
			background-color: #efefef;
			border-radius: 5px;
			width: 80%;
			height: 2rem;
	}
</style>