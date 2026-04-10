export interface TranscriptionAdapterCallbacks {
	onPartialTranscript?: (text: string) => void;
	onCommittedTranscript?: (text: string) => void;
	onConnect?: () => void;
	onDisconnect?: () => void;
	onError?: (error: Error) => void;
}

export interface TranscriptionAdapter {
	/**
	 * Open connection and start capturing audio. Resolves when ready
	 * (i.e. when `onConnect` has fired or the connection is established).
	 * Rejects on authentication, permission, or initialization errors.
	 */
	start(callbacks: TranscriptionAdapterCallbacks): Promise<void>;
	/**
	 * Close the connection cleanly. Any in-flight partial transcript is
	 * preserved by the component and passed to the user's `onStop` callback.
	 */
	stop(): void;
	/**
	 * Close the connection AND discard any in-flight partial transcript.
	 * The component clears partial + committed state before firing `onCancel`.
	 */
	cancel(): void;
}
