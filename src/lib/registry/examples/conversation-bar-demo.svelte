<script lang="ts">
	import InfoIcon from "@lucide/svelte/icons/info";
	import {
		ConversationBar,
		type ConversationAdapter,
	} from "$lib/registry/ui/conversation-bar/index.js";

	let toastMessage = $state<string | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;

	function showToast(message: string) {
		if (toastTimer !== null) clearTimeout(toastTimer);
		toastMessage = message;
		toastTimer = setTimeout(() => {
			toastMessage = null;
			toastTimer = null;
		}, 3500);
	}

	const demoAdapter: ConversationAdapter = {
		async connect() {
			throw new Error("This is a demo — no conversation backend is wired up.");
		},
		disconnect() {},
		sendMessage() {},
		sendContextualUpdate() {},
		setMuted() {},
	};
</script>

<div class="flex w-full flex-col gap-3">
	<div class="relative mx-auto w-full max-w-md">
		<ConversationBar adapter={demoAdapter} onError={(err) => showToast(err.message)} />

		{#if toastMessage}
			<div
				class="bg-foreground text-background animate-in fade-in slide-in-from-bottom-2 pointer-events-none absolute -top-2 right-0 -translate-y-full rounded-md px-3 py-2 text-xs shadow-lg duration-200"
				role="status"
			>
				{toastMessage}
			</div>
		{/if}
	</div>

	<div
		class="border-border bg-muted/40 text-muted-foreground mx-auto flex max-w-md items-start gap-3 rounded-md border p-3 text-xs"
		role="note"
	>
		<InfoIcon class="text-foreground mt-0.5 size-3.5 shrink-0" />
		<p>
			<code class="bg-muted rounded px-1 py-0.5">ConversationBar</code> is provider-agnostic — pass
			a <code class="bg-muted rounded px-1 py-0.5">ConversationAdapter</code> wired to ElevenLabs, OpenAI
			Realtime, or any other voice/chat backend. This demo has no backend hooked up.
		</p>
	</div>
</div>
