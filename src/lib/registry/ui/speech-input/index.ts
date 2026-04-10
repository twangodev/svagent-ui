import Root from "./speech-input.svelte";
import RecordButton from "./speech-input-record-button.svelte";
import Preview from "./speech-input-preview.svelte";
import CancelButton from "./speech-input-cancel-button.svelte";

export {
	Root,
	RecordButton,
	Preview,
	CancelButton,
	//
	Root as SpeechInput,
	RecordButton as SpeechInputRecordButton,
	Preview as SpeechInputPreview,
	CancelButton as SpeechInputCancelButton,
};

export { setSpeechInput, useSpeechInput, SpeechInputState } from "./context.svelte.js";

export type {
	SpeechInputStatus,
	SpeechInputData,
	SpeechInputCallbacks,
	ButtonSize,
} from "./context.svelte.js";

export type { TranscriptionAdapter, TranscriptionAdapterCallbacks } from "./types.js";

export type { SpeechInputProps } from "./speech-input.svelte";
export type { SpeechInputRecordButtonProps } from "./speech-input-record-button.svelte";
export type { SpeechInputPreviewProps } from "./speech-input-preview.svelte";
export type { SpeechInputCancelButtonProps } from "./speech-input-cancel-button.svelte";
