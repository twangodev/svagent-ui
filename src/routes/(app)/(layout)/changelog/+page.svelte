<script lang="ts">
	import Metadata from "$lib/components/metadata.svelte";

	let { data } = $props();

	const Markdown = $derived(data.component);
	const doc = $derived(data.metadata);
</script>

<Metadata title={doc.title} description={doc.description} ogType="article" />

<div class="container-wrapper flex flex-1 flex-col px-2" data-slot="changelog">
	<div
		class="mx-auto flex w-full max-w-2xl min-w-0 flex-1 flex-col px-4 py-6 text-neutral-800 md:px-0 lg:py-8 dark:text-neutral-300"
	>
		<div class="flex flex-col gap-2 pb-6">
			<h1 class="scroll-m-20 text-4xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
				{doc.title}
			</h1>
			{#if doc.description}
				<p class="text-muted-foreground text-[1.05rem] text-balance sm:text-base">
					{doc.description}
				</p>
			{/if}
		</div>
		<div class="w-full flex-1">
			<Markdown />
		</div>
	</div>
</div>
