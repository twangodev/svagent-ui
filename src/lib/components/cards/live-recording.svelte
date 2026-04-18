<script lang="ts">
	import { Card, CardContent } from "$lib/registry/ui/card/index.js";
	import { ScrollingWaveform } from "$lib/registry/ui/waveform/index.js";

	let remountKey = $state(0);

	$effect(() => {
		const handleResize = () => {
			remountKey += 1;
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	});
</script>

<Card class="hidden h-full w-full p-0 sm:flex">
	<CardContent class="m-0! flex h-full w-full flex-col p-1!">
		<div class="flex h-full min-h-0 flex-1 flex-col justify-center">
			<div
				class="bg-background relative min-h-0 flex-1 overflow-hidden rounded-t-lg bg-gradient-to-r transition-opacity duration-1000 ease-out"
			>
				{#key remountKey}
					<ScrollingWaveform
						height="100%"
						barWidth={4}
						barGap={2}
						speed={50}
						fadeEdges={true}
						barCount={25}
						class="h-full opacity-90"
					/>
				{/key}
			</div>
			<div class="flex items-center justify-between p-3">
				<div class="flex items-center gap-2">
					<div class="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
					<span class="text-muted-foreground text-xs">Live</span>
				</div>
				<span class="text-muted-foreground text-xs">128 kbps</span>
			</div>
		</div>
	</CardContent>
</Card>
