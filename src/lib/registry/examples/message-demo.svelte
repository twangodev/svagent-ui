<script lang="ts">
	import { Message, MessageContent } from "$lib/registry/ui/message/index.js";
	import { Response } from "$lib/registry/ui/response/index.js";

	const assistantMessage = `To create a new agent with **ElevenLabs Agents**, head to this link: [https://elevenlabs.io/app/agents](https://elevenlabs.io/app/agents).

1. Sign in to your ElevenLabs account.
2. Click **New Agent** to start.
3. Give your agent a name and description.
4. Configure its behavior, knowledge sources, and voice.
5. Save it — and your agent is ready to use.`;

	let content = $state("\u200B");

	$effect(() => {
		let index = 0;
		const step = 2;
		const interval = setInterval(() => {
			if (index < assistantMessage.length) {
				index = Math.min(index + step, assistantMessage.length);
				content = assistantMessage.slice(0, index);
			} else {
				clearInterval(interval);
			}
		}, 40);
		return () => clearInterval(interval);
	});
</script>

<div class="flex h-full max-h-[400px] w-full max-w-2xl flex-col overflow-hidden">
	<div class="flex flex-col gap-4 overflow-y-auto px-4 py-4">
		<div class="flex-shrink-0">
			<Message from="user">
				<MessageContent>
					<Response content="How do I create an agent?" />
				</MessageContent>
			</Message>
		</div>
		<div class="flex-shrink-0">
			<Message from="assistant">
				<MessageContent>
					<Response {content} />
				</MessageContent>
			</Message>
		</div>
	</div>
</div>
