export type VoiceLabels = {
	accent?: string;
	gender?: string;
	age?: string;
	description?: string;
	descriptive?: string;
	"use case"?: string;
	use_case?: string;
	[key: string]: string | undefined;
};

export type Voice = {
	id: string;
	name: string;
	previewUrl?: string;
	description?: string;
	labels?: VoiceLabels;
};
