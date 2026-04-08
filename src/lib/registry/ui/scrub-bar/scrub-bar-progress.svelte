<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { cn } from "$lib/utils.js";
	import { Progress } from "$lib/registry/ui/progress/index.js";
	import { getScrubBarContext } from "./context.js";

	let { class: className, ...restProps }: Omit<ComponentProps<typeof Progress>, "value"> = $props();

	const ctx = getScrubBarContext();
</script>

<Progress
	data-slot="scrub-bar-progress"
	value={ctx.progress}
	class={cn("absolute h-full [&>div]:transition-none", className)}
	{...restProps}
/>
