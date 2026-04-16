<script lang="ts" module>
	export type VoiceButtonState = "idle" | "recording" | "processing" | "success" | "error";
</script>

<script lang="ts">
	import type { ComponentProps, Snippet } from "svelte";
	import Check from "@lucide/svelte/icons/check";
	import X from "@lucide/svelte/icons/x";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { LiveWaveform } from "$lib/registry/ui/live-waveform/index.js";
	import { cn } from "$lib/utils.js";

	export type VoiceButtonProps = Omit<ComponentProps<typeof Button>, "onclick"> & {
		state?: VoiceButtonState;
		onPress?: () => void;
		onclick?: (e: MouseEvent) => void;
		label?: string | Snippet;
		trailing?: string | Snippet;
		icon?: Snippet;
		waveformClassName?: string;
		feedbackDuration?: number;
	};

	let {
		state: voiceState = "idle",
		onPress,
		label,
		trailing,
		icon,
		variant = "outline",
		size = "default",
		waveformClassName,
		feedbackDuration = 1500,
		disabled = false,
		class: className,
		onclick: externalOnClick,
		...restProps
	}: VoiceButtonProps = $props();

	let showFeedback = $state(false);

	$effect(() => {
		if (voiceState === "success" || voiceState === "error") {
			showFeedback = true;
			const t = setTimeout(() => {
				showFeedback = false;
			}, feedbackDuration);
			return () => clearTimeout(t);
		}
		showFeedback = false;
	});

	const isRecording = $derived(voiceState === "recording");
	const isProcessing = $derived(voiceState === "processing");
	const isSuccess = $derived(voiceState === "success");
	const isError = $derived(voiceState === "error");
	const isDisabled = $derived(disabled || isProcessing);
	const shouldShowWaveform = $derived(isRecording || isProcessing || showFeedback);
	const shouldShowTrailing = $derived(!shouldShowWaveform && trailing != null);
	const shouldShowIcon = $derived(
		!shouldShowWaveform && !shouldShowTrailing && icon != null && size === "icon"
	);
</script>

<Button
	type="button"
	{variant}
	{size}
	disabled={isDisabled}
	aria-label="Voice Button"
	class={cn("gap-2 transition-all duration-200", size === "icon" && "relative", className)}
	onclick={(e) => {
		externalOnClick?.(e);
		onPress?.();
	}}
	{...restProps}
>
	{#if size !== "icon" && label != null}
		<span class="inline-flex shrink-0 items-center justify-start">
			{#if typeof label === "string"}
				{label}
			{:else}
				{@render label()}
			{/if}
		</span>
	{/if}

	<div
		class={cn(
			"relative box-content flex shrink-0 items-center justify-center overflow-hidden transition-all duration-300",
			size === "icon" ? "absolute inset-0 rounded-sm border-0" : "h-5 w-24 rounded-sm border",
			isRecording
				? "bg-primary/10 dark:bg-primary/5"
				: size === "icon"
					? "bg-muted/50 border-0"
					: "border-border bg-muted/50",
			waveformClassName
		)}
	>
		{#if shouldShowWaveform}
			<LiveWaveform
				active={isRecording}
				processing={isProcessing || isSuccess}
				barWidth={2}
				barGap={1}
				barRadius={4}
				fadeEdges={false}
				sensitivity={1.8}
				smoothingTimeConstant={0.85}
				height={20}
				mode="static"
				class="animate-in fade-in absolute inset-0 h-full w-full duration-300"
			/>
		{/if}

		{#if shouldShowTrailing}
			<div
				class="animate-in fade-in absolute inset-0 flex items-center justify-center duration-300"
			>
				{#if typeof trailing === "string"}
					<span class="text-muted-foreground px-1.5 font-mono text-[10px] font-medium select-none">
						{trailing}
					</span>
				{:else if trailing}
					{@render trailing()}
				{/if}
			</div>
		{/if}

		{#if shouldShowIcon && icon}
			<div
				class="animate-in fade-in absolute inset-0 flex items-center justify-center duration-300"
			>
				{@render icon()}
			</div>
		{/if}

		{#if isSuccess && showFeedback}
			<div
				class="animate-in fade-in bg-background/80 absolute inset-0 flex items-center justify-center duration-300"
			>
				<Check class="text-primary size-3.5" />
			</div>
		{/if}

		{#if isError && showFeedback}
			<div
				class="animate-in fade-in bg-background/80 absolute inset-0 flex items-center justify-center duration-300"
			>
				<X class="text-destructive size-3.5" />
			</div>
		{/if}
	</div>
</Button>
