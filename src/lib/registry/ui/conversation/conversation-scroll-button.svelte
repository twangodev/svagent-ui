<script lang="ts">
	import ArrowDownIcon from "@lucide/svelte/icons/arrow-down";
	import { Button, type ButtonProps } from "$lib/registry/ui/button/index.js";
	import { cn } from "$lib/utils.js";
	import { getConversationContext } from "./context.js";

	let { class: className, ...restProps }: ButtonProps = $props();

	const ctx = getConversationContext();
</script>

{#if !ctx.isAtBottom}
	<Button
		class={cn(
			"bg-background dark:bg-background absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full shadow-md",
			className
		)}
		onclick={() => ctx.scrollToBottom()}
		size="icon"
		type="button"
		variant="outline"
		{...restProps}
	>
		<ArrowDownIcon class="size-4" />
	</Button>
{/if}
