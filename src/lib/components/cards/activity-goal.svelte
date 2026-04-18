<script lang="ts">
	import MinusIcon from "@lucide/svelte/icons/minus";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import { Button } from "$lib/registry/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from "$lib/registry/ui/card/index.js";

	const data = [
		{ goal: 400 },
		{ goal: 300 },
		{ goal: 200 },
		{ goal: 300 },
		{ goal: 200 },
		{ goal: 278 },
		{ goal: 189 },
		{ goal: 239 },
		{ goal: 300 },
		{ goal: 200 },
		{ goal: 278 },
		{ goal: 189 },
		{ goal: 349 },
	];

	let goal = $state(350);

	function onClick(adjustment: number) {
		goal = Math.max(200, Math.min(400, goal + adjustment));
	}

	const max = Math.max(...data.map((d) => d.goal));
</script>

<Card class="h-full gap-5">
	<CardHeader>
		<CardTitle>Move Goal</CardTitle>
		<CardDescription>Set your daily activity goal.</CardDescription>
	</CardHeader>
	<CardContent class="flex flex-1 flex-col">
		<div class="flex items-center justify-center gap-4">
			<Button
				variant="outline"
				size="icon"
				class="size-7 rounded-full"
				onclick={() => onClick(-10)}
				disabled={goal <= 200}
			>
				<MinusIcon />
				<span class="sr-only">Decrease</span>
			</Button>
			<div class="text-center">
				<div class="text-4xl font-bold tracking-tighter tabular-nums">
					{goal}
				</div>
				<div class="text-muted-foreground text-xs uppercase">Calories/day</div>
			</div>
			<Button
				variant="outline"
				size="icon"
				class="size-7 rounded-full"
				onclick={() => onClick(10)}
				disabled={goal >= 400}
			>
				<PlusIcon />
				<span class="sr-only">Increase</span>
			</Button>
		</div>
		<div class="flex-1">
			<svg
				viewBox="0 0 100 40"
				preserveAspectRatio="none"
				class="aspect-auto h-full w-full"
				aria-hidden="true"
			>
				{#each data as d, i (i)}
					{@const barWidth = 100 / data.length}
					{@const gap = 1}
					{@const w = barWidth - gap}
					{@const h = (d.goal / max) * 40}
					<rect
						x={i * barWidth + gap / 2}
						y={40 - h}
						width={w}
						height={h}
						rx={0.5}
						fill="var(--primary)"
					/>
				{/each}
			</svg>
		</div>
	</CardContent>
	<CardFooter>
		<Button class="w-full" variant="secondary">Set Goal</Button>
	</CardFooter>
</Card>
