<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";

	let {
		class: className,
		title = "No messages yet",
		description = "Start a conversation to see messages here",
		icon,
		children,
		...restProps
	}: Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
		title?: string | Snippet;
		description?: string | Snippet;
		icon?: Snippet;
		children?: Snippet;
	} = $props();
</script>

<div
	data-slot="conversation-empty-state"
	class={cn("flex size-full flex-col items-center justify-center gap-3 p-8 text-center", className)}
	{...restProps}
>
	{#if children}
		{@render children()}
	{:else}
		{#if icon}
			<div class="text-muted-foreground">
				{@render icon()}
			</div>
		{/if}
		<div class="space-y-1">
			<h3 class="text-sm font-medium">
				{#if typeof title === "string"}
					{title}
				{:else if title}
					{@render title()}
				{/if}
			</h3>
			{#if description}
				<p class="text-muted-foreground text-sm">
					{#if typeof description === "string"}
						{description}
					{:else}
						{@render description()}
					{/if}
				</p>
			{/if}
		</div>
	{/if}
</div>
