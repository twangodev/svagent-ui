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

	let trackEl: HTMLDivElement | null = $state(null);

	function getTimeFromClientX(clientX: number): number | null {
		if (!trackEl || !ctx.duration) return null;
		const rect = trackEl.getBoundingClientRect();
		const ratio = (clientX - rect.left) / rect.width;
		const clamped = Math.min(Math.max(ratio, 0), 1);
		return ctx.duration * clamped;
	}

	function handlePointerDown(event: PointerEvent) {
		if (!ctx.duration) return;
		event.preventDefault();
		ctx.onScrubStart?.();
		const time = getTimeFromClientX(event.clientX);
		if (time != null) ctx.onScrub?.(time);

		const handleMove = (moveEvent: PointerEvent) => {
			const next = getTimeFromClientX(moveEvent.clientX);
			if (next != null) ctx.onScrub?.(next);
		};

		const handleUp = () => {
			ctx.onScrubEnd?.();
			window.removeEventListener("pointermove", handleMove);
			window.removeEventListener("pointerup", handleUp);
		};

		window.addEventListener("pointermove", handleMove);
		window.addEventListener("pointerup", handleUp, { once: true });
	}

	const clampedValue = $derived(Math.min(Math.max(ctx.value, 0), ctx.duration || 0));
</script>

<div
	bind:this={trackEl}
	data-slot="scrub-bar-track"
	class={cn(
		"bg-secondary relative h-2 w-full grow cursor-pointer touch-none rounded-full transition-none select-none",
		className
	)}
	onpointerdown={handlePointerDown}
	role="slider"
	tabindex={0}
	aria-valuemin={0}
	aria-valuemax={ctx.duration || 0}
	aria-valuenow={clampedValue}
	{...restProps}
>
	{@render children?.()}
</div>
