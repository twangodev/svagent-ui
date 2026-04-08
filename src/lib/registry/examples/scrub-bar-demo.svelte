<script lang="ts">
	import * as ScrubBar from "$lib/registry/ui/scrub-bar/index.js";

	let value = $state(30);
	let isScrubbing = $state(false);
	const duration = 100;
</script>

<div class="flex w-full max-w-sm flex-col items-center gap-4 p-4">
	<ScrubBar.Root
		{duration}
		{value}
		onScrub={(t) => (value = t)}
		onScrubStart={() => (isScrubbing = true)}
		onScrubEnd={() => (isScrubbing = false)}
		class="w-full"
	>
		<ScrubBar.TimeLabel time={value} class="w-10 text-center" />
		<ScrubBar.Track class="mx-2">
			<ScrubBar.Progress />
			<ScrubBar.Thumb class="bg-primary" data-scrubbing={isScrubbing} />
		</ScrubBar.Track>
		<ScrubBar.TimeLabel time={duration} class="w-10 text-center" />
	</ScrubBar.Root>
</div>
