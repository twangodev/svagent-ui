<script lang="ts">
	import { VoicePicker, type Voice } from "$lib/registry/ui/voice-picker/index.js";

	const voices: Voice[] = [
		{
			id: "alpha",
			name: "Alpha",
			previewUrl: "https://sv11.ui.twango.dev/audio/alpha.mp3",
			labels: { accent: "american", gender: "male", age: "middle_aged" },
		},
		{
			id: "bravo",
			name: "Bravo",
			previewUrl: "https://sv11.ui.twango.dev/audio/bravo.mp3",
			labels: { accent: "british", gender: "female", age: "young" },
		},
		{
			id: "charlie",
			name: "Charlie",
			previewUrl: "https://sv11.ui.twango.dev/audio/charlie.mp3",
			labels: { accent: "australian", gender: "male", age: "old" },
		},
	];

	let selectedVoice = $state<string>("alpha");
	let open = $state(false);
</script>

<div class="w-full max-w-lg">
	<VoicePicker
		{voices}
		value={selectedVoice}
		onValueChange={(v) => {
			selectedVoice = v;
			open = true;
		}}
		{open}
		onOpenChange={(o) => (open = o)}
		placeholder="Select a voice..."
	/>
</div>
