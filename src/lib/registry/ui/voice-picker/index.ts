import Root from "./voice-picker.svelte";
import Item from "./voice-picker-item.svelte";

export {
	Root,
	Item,
	//
	Root as VoicePicker,
	Item as VoicePickerItem,
};

export type { VoicePickerProps } from "./voice-picker.svelte";
export type { Voice, VoiceLabels } from "./types.js";
