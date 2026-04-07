<script lang="ts">
	import { ShimmeringText } from "$lib/registry/ui/shimmering-text/index.js";

	const phrases = [
		"Agent is thinking...",
		"Processing your request...",
		"Analyzing the data...",
		"Generating response...",
		"Almost there...",
	];

	let currentIndex = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			currentIndex = (currentIndex + 1) % phrases.length;
		}, 3000);
		return () => clearInterval(interval);
	});
</script>

<div class="bg-card w-full rounded-lg border p-6">
	<div class="mb-4">
		<h3 class="text-lg font-semibold">Text Shimmer Effect</h3>
		<p class="text-muted-foreground text-sm">Animated gradient text with automatic cycling</p>
	</div>

	<div class="space-y-4">
		<div class="bg-muted/10 flex items-center justify-center rounded-lg py-8">
			{#key currentIndex}
				<ShimmeringText text={phrases[currentIndex]} />
			{/key}
		</div>
	</div>
</div>