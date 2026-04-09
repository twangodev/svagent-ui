<script lang="ts">
	import { BarVisualizer, type AgentState } from "$lib/registry/ui/bar-visualizer/index.js";
	import { Button } from "$lib/registry/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/registry/ui/card/index.js";

	let state = $state<AgentState>("listening");

	const states: AgentState[] = ["connecting", "initializing", "listening", "speaking", "thinking"];

	function labelFor(s: AgentState): string {
		return s.charAt(0).toUpperCase() + s.slice(1);
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Audio Frequency Visualizer</CardTitle>
		<CardDescription>
			Real-time frequency band visualization with animated state transitions
		</CardDescription>
	</CardHeader>
	<CardContent>
		<div class="space-y-4">
			<BarVisualizer
				{state}
				demo
				barCount={20}
				minHeight={15}
				maxHeight={90}
				class="h-40 max-w-full"
			/>

			<div class="flex flex-wrap gap-2">
				{#each states as s (s)}
					<Button
						size="sm"
						variant={state === s ? "default" : "outline"}
						onclick={() => (state = s)}
					>
						{labelFor(s)}
					</Button>
				{/each}
			</div>
		</div>
	</CardContent>
</Card>
