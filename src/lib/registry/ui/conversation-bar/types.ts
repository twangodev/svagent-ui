export type AgentConnectionState = "disconnected" | "connecting" | "connected" | "disconnecting";

export type ConversationMode = "speaking" | "listening";

export interface ConversationMessage {
	source: "user" | "ai";
	message: string;
}

export interface ConversationConfig {
	onConnect: () => void;
	onDisconnect: () => void;
	onMessage: (message: ConversationMessage) => void;
	onError: (error: Error) => void;
	onStatusChange: (status: AgentConnectionState) => void;
	onModeChange?: (mode: ConversationMode) => void;
}

export interface ConversationAdapter {
	connect(config: ConversationConfig): Promise<void>;
	disconnect(): void;
	sendMessage(text: string): void;
	sendContextualUpdate(text: string): void;
	setMuted(muted: boolean): void;
}
