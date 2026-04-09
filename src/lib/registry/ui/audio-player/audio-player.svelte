<script lang="ts">
	import type { Snippet } from "svelte";
	import { setAudioPlayer } from "./context.svelte.js";

	let { children }: { children?: Snippet } = $props();

	const player = setAudioPlayer();

	let audioEl: HTMLAudioElement | null = $state(null);

	$effect(() => {
		player.audio = audioEl;
	});

	$effect(() => {
		let raf: number | null = null;
		const tick = () => {
			const el = player.audio;
			if (el) player.time = el.currentTime;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => {
			if (raf !== null) cancelAnimationFrame(raf);
		};
	});
</script>

<audio
	bind:this={audioEl}
	ondurationchange={(e) => {
		const d = e.currentTarget.duration;
		player.duration = Number.isFinite(d) ? d : undefined;
	}}
	onloadedmetadata={(e) => {
		const d = e.currentTarget.duration;
		player.duration = Number.isFinite(d) ? d : undefined;
	}}
	onplay={() => (player.paused = false)}
	onpause={() => (player.paused = true)}
	onplaying={() => {
		player.paused = false;
		player.isBuffering = false;
	}}
	onwaiting={() => (player.isBuffering = true)}
	oncanplay={() => (player.isBuffering = false)}
	onratechange={(e) => (player.playbackRate = e.currentTarget.playbackRate)}
	onerror={() => (player.error = audioEl?.error ?? null)}
	class="hidden"
	crossorigin="anonymous"
></audio>
{@render children?.()}
