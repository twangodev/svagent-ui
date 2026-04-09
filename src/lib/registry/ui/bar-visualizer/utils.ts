export interface AudioAnalyserOptions {
	fftSize?: number;
	smoothingTimeConstant?: number;
	minDecibels?: number;
	maxDecibels?: number;
}

export interface MultiBandVolumeOptions {
	bands?: number;
	loPass?: number;
	hiPass?: number;
	updateInterval?: number;
	analyserOptions?: AudioAnalyserOptions;
}

export function createAudioAnalyser(
	mediaStream: MediaStream,
	options: AudioAnalyserOptions = {}
): { analyser: AnalyserNode; audioContext: AudioContext; cleanup: () => void } {
	const AudioContextCtor =
		window.AudioContext ||
		(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
	const audioContext = new AudioContextCtor();
	const source = audioContext.createMediaStreamSource(mediaStream);
	const analyser = audioContext.createAnalyser();

	if (options.fftSize) analyser.fftSize = options.fftSize;
	if (options.smoothingTimeConstant !== undefined) {
		analyser.smoothingTimeConstant = options.smoothingTimeConstant;
	}
	if (options.minDecibels !== undefined) analyser.minDecibels = options.minDecibels;
	if (options.maxDecibels !== undefined) analyser.maxDecibels = options.maxDecibels;

	source.connect(analyser);

	const cleanup = () => {
		source.disconnect();
		if (audioContext.state !== "closed") audioContext.close();
	};

	return { analyser, audioContext, cleanup };
}

export function normalizeDb(value: number): number {
	if (value === -Infinity) return 0;
	const minDb = -100;
	const maxDb = -10;
	const db = 1 - (Math.max(minDb, Math.min(maxDb, value)) * -1) / 100;
	return Math.sqrt(db);
}

export function generateConnectingSequenceBar(columns: number): number[][] {
	const seq: number[][] = [];
	for (let x = 0; x < columns; x++) {
		seq.push([x, columns - 1 - x]);
	}
	return seq;
}

export function generateListeningSequenceBar(columns: number): number[][] {
	const center = Math.floor(columns / 2);
	return [[center], [-1]];
}
