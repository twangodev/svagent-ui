import { getContext, setContext } from "svelte";

const CONVERSATION_CONTEXT_KEY = Symbol("conversation");

export interface ConversationContext {
	setContentElement(el: HTMLElement | null): void;
	readonly isAtBottom: boolean;
	scrollToBottom(): void;
}

export function setConversationContext(ctx: ConversationContext): void {
	setContext(CONVERSATION_CONTEXT_KEY, ctx);
}

export function getConversationContext(): ConversationContext {
	const ctx = getContext<ConversationContext | undefined>(CONVERSATION_CONTEXT_KEY);
	if (!ctx) {
		throw new Error("Conversation sub-components must be used within a <Conversation>");
	}
	return ctx;
}
