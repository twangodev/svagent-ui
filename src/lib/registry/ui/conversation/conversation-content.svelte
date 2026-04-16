<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";
	import { getConversationContext } from "./context.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
	} = $props();

	const ctx = getConversationContext();

	let el: HTMLDivElement | null = $state(null);

	$effect(() => {
		ctx.setContentElement(el);
		return () => ctx.setContentElement(null);
	});
</script>

<div
	bind:this={el}
	data-slot="conversation-content"
	class={cn("flex min-h-full flex-col p-4", className)}
	{...restProps}
>
	{@render children?.()}
</div>
