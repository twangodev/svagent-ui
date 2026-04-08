<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { cn } from "$lib/utils.js";
	import { setScrubBarContext } from "./context.js";

	let {
		class: className,
		duration,
		value,
		onScrub,
		onScrubStart,
		onScrubEnd,
		children,
		...restProps
	}: HTMLAttributes<HTMLDivElement> & {
		duration: number;
		value: number;
		onScrub?: (time: number) => void;
		onScrubStart?: () => void;
		onScrubEnd?: () => void;
		children?: Snippet;
	} = $props();

	const progress = $derived(duration > 0 ? (value / duration) * 100 : 0);

	setScrubBarContext({
		get duration() {
			return duration;
		},
		get value() {
			return value;
		},
		get progress() {
			return progress;
		},
		get onScrub() {
			return onScrub;
		},
		get onScrubStart() {
			return onScrubStart;
		},
		get onScrubEnd() {
			return onScrubEnd;
		},
	});
</script>

<div data-slot="scrub-bar-root" class={cn("flex w-full items-center", className)} {...restProps}>
	{@render children?.()}
</div>
