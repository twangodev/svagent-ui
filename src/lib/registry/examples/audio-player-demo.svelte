<script lang="ts">
	import { Card } from "$lib/registry/ui/card/index.js";
	import * as AudioPlayer from "$lib/registry/ui/audio-player/index.js";
	import { exampleTracks } from "$lib/registry/ui/audio-player/index.js";
	import { ScrollArea } from "$lib/registry/ui/scroll-area/index.js";
	import AudioPlayerDemoPlayer from "./audio-player-demo-player.svelte";
	import AudioPlayerDemoSong from "./audio-player-demo-song.svelte";
</script>

<Card class="w-full overflow-hidden p-0">
	<AudioPlayer.Root>
		<div class="flex flex-col lg:h-[180px] lg:flex-row">
			<div class="bg-muted/50 flex flex-col overflow-hidden lg:h-full lg:w-64">
				<ScrollArea class="h-48 w-full lg:h-full">
					<div class="space-y-1 p-3">
						{#each exampleTracks as song, index (song.id)}
							<AudioPlayerDemoSong {song} trackNumber={index + 1} />
						{/each}
					</div>
				</ScrollArea>
			</div>
			<AudioPlayerDemoPlayer />
		</div>
	</AudioPlayer.Root>
</Card>
