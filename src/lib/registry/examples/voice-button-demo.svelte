<script lang="ts">
	import { VoiceButton, type VoiceButtonState } from "$lib/registry/ui/voice-button/index.js";

	let state = $state<VoiceButtonState>("idle");

	function handlePress() {
		if (state === "idle") {
			state = "recording";
		} else if (state === "recording") {
			state = "processing";
			setTimeout(() => {
				state = "success";
				setTimeout(() => {
					state = "idle";
				}, 1500);
			}, 1000);
		}
	}

	$effect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.altKey && e.code === "Space") {
				e.preventDefault();
				handlePress();
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	});
</script>

<VoiceButton label="Voice" trailing="⌥Space" {state} onPress={handlePress} class="min-w-[180px]" />
