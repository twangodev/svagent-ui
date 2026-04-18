/**
 * Vite plugin: precomputes waveform JSONs for every audio file in
 * `static/audio/` and writes them to `static/audio/waveforms/`. The
 * Speaker-01 block fetches those JSONs at runtime instead of decoding
 * mp3s in the browser, cutting cold-start from ~500ms/track to ~5ms.
 *
 * ffmpeg handles the decode (mp3/wav/flac/ogg/m4a/aac). No npm audio dep.
 * Outputs are mtime-cached so unchanged sources are skipped.
 *
 * Dev: watches `static/audio/*` and regenerates + full-reloads when a
 * source file changes.
 */
import { spawn } from "node:child_process";
import { readdir, stat, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizePath, type Plugin } from "vite";

import {
	DEFAULT_BARS_PER_SECOND,
	sampleWaveform,
} from "../src/lib/registry/ui/audio-player/waveform-sampler.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const INPUT_DIR = path.join(ROOT, "static/audio");
const OUTPUT_DIR = path.join(ROOT, "static/audio/waveforms");
const BARS_PER_SECOND = DEFAULT_BARS_PER_SECOND;
const SAMPLE_RATE = 44100;

const AUDIO_EXTENSIONS = new Set([".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac"]);

function decodeToFloat32(inputPath: string): Promise<Float32Array> {
	return new Promise((resolve, reject) => {
		const ff = spawn(
			"ffmpeg",
			[
				"-i",
				inputPath,
				"-f",
				"f32le",
				"-ac",
				"1",
				"-ar",
				String(SAMPLE_RATE),
				"-hide_banner",
				"-loglevel",
				"error",
				"pipe:1",
			],
			{ stdio: ["ignore", "pipe", "pipe"] }
		);

		const chunks: Buffer[] = [];
		let stderr = "";
		ff.stdout.on("data", (chunk) => chunks.push(chunk));
		ff.stderr.on("data", (chunk) => {
			stderr += chunk.toString();
		});
		ff.on("error", reject);
		ff.on("close", (code) => {
			if (code !== 0) {
				reject(new Error(`ffmpeg exited ${code} for ${inputPath}\n${stderr}`));
				return;
			}
			const buf = Buffer.concat(chunks);
			const pcm = new Float32Array(buf.buffer, buf.byteOffset, Math.floor(buf.byteLength / 4));
			// Copy so GC can free the Buffer backing store.
			resolve(new Float32Array(pcm));
		});
	});
}

async function mtimeOrZero(filePath: string): Promise<number> {
	try {
		return (await stat(filePath)).mtimeMs;
	} catch {
		return 0;
	}
}

async function generateAll(): Promise<{ generated: number; skipped: number }> {
	await mkdir(OUTPUT_DIR, { recursive: true });

	const entries = await readdir(INPUT_DIR, { withFileTypes: true });
	const audioFiles = entries
		.filter((e) => e.isFile() && AUDIO_EXTENSIONS.has(path.extname(e.name).toLowerCase()))
		.map((e) => e.name)
		.sort();

	let generated = 0;
	let skipped = 0;

	for (const file of audioFiles) {
		const inputPath = path.join(INPUT_DIR, file);
		const baseName = path.basename(file, path.extname(file));
		const outputPath = path.join(OUTPUT_DIR, `${baseName}.json`);

		const [inputMtime, outputMtime] = await Promise.all([
			mtimeOrZero(inputPath),
			mtimeOrZero(outputPath),
		]);

		if (outputMtime > 0 && outputMtime >= inputMtime) {
			skipped++;
			continue;
		}

		const t0 = Date.now();
		const channelData = await decodeToFloat32(inputPath);
		const duration = channelData.length / SAMPLE_RATE;
		const barCount = Math.max(1, Math.round(duration * BARS_PER_SECOND));
		const bars = sampleWaveform(channelData, barCount);
		await writeFile(outputPath, JSON.stringify(bars));
		console.log(
			`waveforms: ${file} → ${path.relative(ROOT, outputPath)} (${Date.now() - t0}ms, ${bars.length} bars @ ${BARS_PER_SECOND}/s)`
		);
		generated++;
	}

	return { generated, skipped };
}

export function waveformsPlugin(): Plugin {
	// SvelteKit drives client + SSR builds in the same Vite run, so buildStart
	// fires twice per build. Share a single Promise so decoding only happens
	// once.
	let pending: Promise<void> | null = null;
	const run = async () => {
		const { generated, skipped } = await generateAll();
		if (generated > 0) {
			console.log(`waveforms: ${generated} generated, ${skipped} up-to-date.`);
		}
	};
	return {
		name: "waveforms",
		enforce: "pre",
		async buildStart() {
			pending ??= run();
			await pending;
		},
		configureServer(server) {
			const inputDir = normalizePath(INPUT_DIR);
			const handle = async (changedPath: string) => {
				const p = normalizePath(changedPath);
				if (path.dirname(p) !== inputDir) return; // only direct children, skip waveforms/ subdir
				if (!AUDIO_EXTENSIONS.has(path.extname(p).toLowerCase())) return;
				await generateAll();
				server.ws.send({ type: "full-reload" });
			};
			server.watcher.on("add", handle);
			server.watcher.on("change", handle);
		},
	};
}
