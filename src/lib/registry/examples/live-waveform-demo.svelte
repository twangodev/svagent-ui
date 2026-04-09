<script lang="ts">
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Card, CardHeader, CardTitle, CardDescription } from "$lib/registry/ui/card/index.js";
	import { LiveWaveform } from "$lib/registry/ui/live-waveform/index.js";

	let active = $state(false);
	let processing = $state(false);
	let mode = $state<"static" | "scrolling">("static");

	function handleToggleActive() {
		active = !active;
		if (active) {
			processing = false;
		}
	}

	function handleToggleProcessing() {
		processing = !processing;
		if (processing) {
			active = false;
		}
	}
</script>

<Card class="w-full p-6">
	<CardHeader class="p-0 pb-4">
		<CardTitle>Live Audio Waveform</CardTitle>
		<CardDescription>
			Real-time microphone input visualization with audio reactivity
		</CardDescription>
	</CardHeader>

	<div class="space-y-4">
		<LiveWaveform
			{active}
			{processing}
			{mode}
			height={80}
			barWidth={3}
			barGap={2}
			fadeEdges
			barColor="gray"
			historySize={120}
		/>

		<div class="flex flex-wrap justify-center gap-2">
			<Button size="sm" variant={active ? "default" : "outline"} onclick={handleToggleActive}>
				{active ? "Stop" : "Start"} Listening
			</Button>
			<Button
				size="sm"
				variant={processing ? "default" : "outline"}
				onclick={handleToggleProcessing}
			>
				{processing ? "Stop" : "Start"} Processing
			</Button>
			<Button
				size="sm"
				variant="outline"
				onclick={() => (mode = mode === "static" ? "scrolling" : "static")}
			>
				Mode: {mode === "static" ? "Static" : "Scrolling"}
			</Button>
		</div>
	</div>
</Card>
