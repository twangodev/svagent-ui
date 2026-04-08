<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";
	import { getScrubBarContext } from "./context.js";

	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
	} = $props();

	const ctx = getScrubBarContext();
</script>

<div
	data-slot="scrub-bar-thumb"
	class={cn(
		"bg-primary absolute top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors disabled:pointer-events-none disabled:opacity-50",
		className
	)}
	style="left: {ctx.progress}%"
	{...restProps}
>
	{@render children?.()}
</div>
