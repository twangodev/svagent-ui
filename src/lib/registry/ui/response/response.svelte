<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Streamdown, type StreamdownProps } from "svelte-streamdown";
	import Code from "svelte-streamdown/code";
	import Mermaid from "svelte-streamdown/mermaid";
	import Math from "svelte-streamdown/math";

	let { class: className, ...restProps }: StreamdownProps & { class?: string } = $props();
</script>

<Streamdown
	baseTheme="shadcn"
	shikiTheme="github-dark"
	components={{ code: Code, mermaid: Mermaid, math: Math }}
	class={cn(
		"size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
		"[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:ps-6 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-6",
		"[&_li]:my-0 [&_li]:ps-1 [&_li>p]:my-0",
		className
	)}
	{...restProps}
/>
