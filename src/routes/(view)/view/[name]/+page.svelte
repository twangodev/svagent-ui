<script lang="ts">
	import type { PageProps } from "./$types.js";

	let { data }: PageProps = $props();

	const Component = $derived(data.block.component);
</script>

<svelte:head>
	<title>{data.block.title}</title>
</svelte:head>

<div class="flex min-h-svh items-center justify-center p-6">
	<div class="w-full max-w-4xl">
		<Component />
	</div>
</div>
