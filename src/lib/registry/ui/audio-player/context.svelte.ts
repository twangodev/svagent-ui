import { getContext, setContext } from "svelte";

const AUDIO_PLAYER_CONTEXT_KEY = Symbol("svagent-audio-player");

export interface AudioPlayerItem<TData = unknown> {
	id: string | number;
	src: string;
	data?: TData;
}

export class AudioPlayerState<TData = unknown> {
	audio: HTMLAudioElement | null = $state(null);
	activeItem: AudioPlayerItem<TData> | null = $state(null);
	time = $state(0);
	duration = $state<number | undefined>(undefined);
	paused = $state(true);
	playbackRate = $state(1);
	isBuffering = $state(false);
	error: MediaError | null = $state(null);

	isPlaying = $derived(!this.paused);

	#playPromise: Promise<void> | null = null;

	isItemActive = (id: string | number | null): boolean => {
		if (id === null) return this.activeItem === null;
		return this.activeItem?.id === id;
	};

	#swapTrack = (item: AudioPlayerItem<TData> | null): void => {
		const audio = this.audio;
		if (!audio) return;
		this.activeItem = item;
		const currentRate = audio.playbackRate;
		if (!audio.paused) audio.pause();
		audio.currentTime = 0;
		if (item === null) {
			audio.removeAttribute("src");
		} else {
			audio.src = item.src;
		}
		audio.load();
		audio.playbackRate = currentRate;
	};

	setActiveItem = async (item: AudioPlayerItem<TData> | null): Promise<void> => {
		if (!this.audio) return;
		if ((item?.id ?? null) === (this.activeItem?.id ?? null)) return;
		this.#swapTrack(item);
	};

	play = async (item?: AudioPlayerItem<TData> | null): Promise<void> => {
		const audio = this.audio;
		if (!audio) return;

		if (this.#playPromise) {
			try {
				await this.#playPromise;
			} catch (error) {
				console.error("Play promise error:", error);
			}
		}

		if (item === undefined) {
			const playPromise = audio.play();
			this.#playPromise = playPromise;
			return playPromise;
		}
		if ((item?.id ?? null) === (this.activeItem?.id ?? null)) {
			const playPromise = audio.play();
			this.#playPromise = playPromise;
			return playPromise;
		}

		this.#swapTrack(item);
		const playPromise = audio.play();
		this.#playPromise = playPromise;
		return playPromise;
	};

	pause = async (): Promise<void> => {
		const audio = this.audio;
		if (!audio) return;

		if (this.#playPromise) {
			try {
				await this.#playPromise;
			} catch (e) {
				console.error(e);
			}
		}

		audio.pause();
		this.#playPromise = null;
	};

	seek = (time: number): void => {
		if (!this.audio) return;
		this.audio.currentTime = time;
	};

	setPlaybackRate = (rate: number): void => {
		if (!this.audio) return;
		this.audio.playbackRate = rate;
		// The `ratechange` event listener on the audio element will sync
		// `this.playbackRate` — no manual assignment needed here.
	};
}

export function setAudioPlayer<TData = unknown>(): AudioPlayerState<TData> {
	const state = new AudioPlayerState<TData>();
	setContext(AUDIO_PLAYER_CONTEXT_KEY, state);
	return state;
}

export function useAudioPlayer<TData = unknown>(): AudioPlayerState<TData> {
	const ctx = getContext<AudioPlayerState<TData> | undefined>(AUDIO_PLAYER_CONTEXT_KEY);
	if (!ctx) {
		throw new Error("useAudioPlayer cannot be called outside of an <AudioPlayer>");
	}
	return ctx;
}
