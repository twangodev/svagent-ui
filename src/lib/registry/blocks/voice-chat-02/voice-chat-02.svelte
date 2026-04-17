<script lang="ts">
	import { fly } from "svelte/transition";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import PhoneIcon from "@lucide/svelte/icons/phone";
	import PhoneOffIcon from "@lucide/svelte/icons/phone-off";
	import { Button } from "$lib/registry/ui/button/index.js";
	import { Card } from "$lib/registry/ui/card/index.js";
	import { Orb } from "$lib/registry/ui/orb/index.js";
	import { ShimmeringText } from "$lib/registry/ui/shimmering-text/index.js";
	import { cn } from "$lib/utils.js";

	const DEFAULT_AGENT = {
		name: "Customer Support",
		description: "Tap to start voice chat",
	};

	type AgentState = "disconnected" | "connecting" | "connected" | "disconnecting" | null;

	let agentState = $state<AgentState>("disconnected");
	let errorMessage = $state<string | null>(null);
	let timers: ReturnType<typeof setTimeout>[] = [];

	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	function startConversation() {
		errorMessage = null;
		agentState = "connecting";
		timers.push(
			setTimeout(() => {
				agentState = "connected";
			}, 1500)
		);
	}

	function endConversation() {
		agentState = "disconnecting";
		timers.push(
			setTimeout(() => {
				agentState = "disconnected";
			}, 1000)
		);
	}

	function handleCall() {
		clearTimers();
		if (agentState === "disconnected" || agentState === null) {
			startConversation();
		} else if (agentState === "connected") {
			endConversation();
		}
	}

	$effect(() => {
		return () => clearTimers();
	});

	const isCallActive = $derived(agentState === "connected");
	const isTransitioning = $derived(agentState === "connecting" || agentState === "disconnecting");

	// Canned volume: smooth sine waves when connected, zero otherwise.
	function getInputVolume(): number {
		if (agentState !== "connected") return 0;
		return 0.3 + 0.25 * Math.sin(performance.now() / 500);
	}

	function getOutputVolume(): number {
		if (agentState !== "connected") return 0;
		return 0.3 + 0.25 * Math.sin(performance.now() / 700 + 1);
	}
</script>

<Card class="flex h-[400px] w-full flex-col items-center justify-center overflow-hidden p-6">
	<div class="flex flex-col items-center gap-6">
		<div class="relative size-32">
			<div
				class="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]"
			>
				<div
					class="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]"
				>
					<Orb class="h-full w-full" volumeMode="manual" {getInputVolume} {getOutputVolume} />
				</div>
			</div>
		</div>

		<div class="flex flex-col items-center gap-2">
			<h2 class="text-xl font-semibold">{DEFAULT_AGENT.name}</h2>
			{#if errorMessage}
				<p
					class="text-destructive text-center text-sm"
					in:fly={{ y: -10, duration: 200 }}
					out:fly={{ y: 10, duration: 200 }}
				>
					{errorMessage}
				</p>
			{:else if agentState === "disconnected" || agentState === null}
				<p
					class="text-muted-foreground text-sm"
					in:fly={{ y: -10, duration: 200 }}
					out:fly={{ y: 10, duration: 200 }}
				>
					{DEFAULT_AGENT.description}
				</p>
			{:else}
				<div
					class="flex items-center gap-2"
					in:fly={{ y: -10, duration: 200 }}
					out:fly={{ y: 10, duration: 200 }}
				>
					<div
						class={cn(
							"h-2 w-2 rounded-full transition-all duration-300",
							agentState === "connected" && "bg-green-500",
							isTransitioning && "bg-primary/60 animate-pulse"
						)}
					></div>
					<span class="text-sm capitalize">
						{#if isTransitioning}
							<ShimmeringText text={agentState} />
						{:else}
							<span class="text-green-600">Connected</span>
						{/if}
					</span>
				</div>
			{/if}
		</div>

		<Button
			onclick={handleCall}
			disabled={isTransitioning}
			size="icon"
			variant={isCallActive ? "secondary" : "default"}
			class="h-12 w-12 rounded-full"
		>
			{#if isTransitioning}
				<Loader2Icon class="h-5 w-5 animate-spin" />
			{:else if isCallActive}
				<PhoneOffIcon class="h-5 w-5" />
			{:else}
				<PhoneIcon class="h-5 w-5" />
			{/if}
		</Button>
	</div>
</Card>
