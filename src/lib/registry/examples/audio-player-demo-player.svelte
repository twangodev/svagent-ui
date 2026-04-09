<script lang="ts">
	import * as AudioPlayer from "$lib/registry/ui/audio-player/index.js";
	import { useAudioPlayer } from "$lib/registry/ui/audio-player/index.js";

	type Track = { id: string; name: string; url: string };

	const player = useAudioPlayer<Track>();
</script>

<div class="flex flex-1 items-center p-4 sm:p-6">
	<div class="mx-auto w-full max-w-2xl">
		<div class="mb-4">
			<h3 class="text-base font-semibold sm:text-lg">
				{player.activeItem?.data?.name ?? "No track selected"}
			</h3>
		</div>
		<div class="flex items-center gap-3 sm:gap-4">
			<AudioPlayer.Button
				variant="outline"
				size="default"
				class="h-12 w-12 shrink-0 sm:h-10 sm:w-10"
				disabled={!player.activeItem}
			/>
			<div class="flex flex-1 items-center gap-2 sm:gap-3">
				<AudioPlayer.Time class="text-xs tabular-nums" />
				<AudioPlayer.Progress class="flex-1" />
				<AudioPlayer.Duration class="text-xs tabular-nums" />
				<AudioPlayer.Speed variant="ghost" size="icon" />
			</div>
		</div>
	</div>
</div>
