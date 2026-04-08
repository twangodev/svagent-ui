import { getContext, setContext } from "svelte";

const SCRUB_BAR_CONTEXT_KEY = Symbol("scrub-bar");

export interface ScrubBarContext {
	readonly duration: number;
	readonly value: number;
	readonly progress: number;
	readonly onScrub?: (time: number) => void;
	readonly onScrubStart?: () => void;
	readonly onScrubEnd?: () => void;
}

export function setScrubBarContext(ctx: ScrubBarContext): void {
	setContext(SCRUB_BAR_CONTEXT_KEY, ctx);
}

export function getScrubBarContext(): ScrubBarContext {
	const ctx = getContext<ScrubBarContext | undefined>(SCRUB_BAR_CONTEXT_KEY);
	if (!ctx) {
		throw new Error("ScrubBar sub-components must be used within a <ScrubBar.Root>");
	}
	return ctx;
}
