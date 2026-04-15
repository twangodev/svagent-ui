<script lang="ts">
	import CheckIcon from "@lucide/svelte/icons/check";
	import PauseIcon from "@lucide/svelte/icons/pause";
	import PlayIcon from "@lucide/svelte/icons/play";
	import { useAudioPlayer } from "../audio-player/context.svelte.js";
	import type { AudioPlayerItem } from "../audio-player/context.svelte.js";
	import * as Command from "../command/index.js";
	import { Orb } from "../orb/index.js";
	import { cn } from "$lib/utils.js";
	import type { Voice } from "./types.js";

	type Props = {
		voice: Voice;
		isSelected: boolean;
		onSelect: () => void;
	};

	let { voice, isSelected, onSelect }: Props = $props();

	const player = useAudioPlayer<Voice>();
	let isHovered = $state(false);

	const preview = $derived(voice.previewUrl);
	const audioItem = $derived<AudioPlayerItem<Voice> | null>(
		preview ? { id: voice.id, src: preview, data: voice } : null
	);
	const isPlaying = $derived(!!audioItem && player.isItemActive(audioItem.id) && player.isPlaying);

	const keywords = $derived(
		[
			voice.name,
			voice.labels?.accent,
			voice.labels?.gender,
			voice.labels?.age,
			voice.labels?.description,
			voice.labels?.["use case"],
		].filter((k): k is string => Boolean(k))
	);

	function handlePreview(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (!audioItem) return;
		if (isPlaying) {
			player.pause();
		} else {
			player.play(audioItem);
		}
	}
</script>

<Command.Item
	value={voice.id}
	{keywords}
	onSelect={() => onSelect()}
	class="flex items-center gap-3"
>
	<button
		type="button"
		class="relative z-10 size-8 shrink-0 cursor-pointer overflow-visible border-0 bg-transparent p-0"
		onmouseenter={() => (isHovered = true)}
		onmouseleave={() => (isHovered = false)}
		onclick={handlePreview}
	>
		<Orb agentState={isPlaying ? "talking" : null} class="pointer-events-none absolute inset-0" />
		{#if preview && isHovered}
			<div
				class="pointer-events-none absolute inset-0 flex size-8 shrink-0 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-opacity hover:bg-black/50"
			>
				{#if isPlaying}
					<PauseIcon class="size-3 text-white" />
				{:else}
					<PlayIcon class="size-3 text-white" />
				{/if}
			</div>
		{/if}
	</button>

	<div class="flex flex-1 flex-col gap-0.5">
		<span class="font-medium">{voice.name}</span>
		{#if voice.labels}
			<div class="text-muted-foreground flex items-center gap-1.5 text-xs">
				{#if voice.labels.accent}<span>{voice.labels.accent}</span>{/if}
				{#if voice.labels.gender}<span>•</span><span class="capitalize">{voice.labels.gender}</span
					>{/if}
				{#if voice.labels.age}<span>•</span><span class="capitalize">{voice.labels.age}</span>{/if}
			</div>
		{/if}
	</div>

	<CheckIcon class={cn("ml-auto size-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
</Command.Item>
