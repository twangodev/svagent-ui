<script lang="ts" module>
	import { pulse, snake, wave, type Frame } from "$lib/registry/ui/matrix/index.js";

	const heart: Frame[] = (() => {
		const frames: Frame[] = [];
		const totalFrames = 30;

		const shape = [
			[0, 1, 1, 0, 1, 1, 0],
			[1, 1, 1, 1, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1],
			[0, 1, 1, 1, 1, 1, 0],
			[0, 0, 1, 1, 1, 0, 0],
			[0, 0, 0, 1, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
		];

		for (let f = 0; f < totalFrames; f++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));

			const phase = (f / totalFrames) * Math.PI * 2;
			const intensity = ((Math.sin(phase) + 1) / 2) * 0.3 + 0.7;

			for (let r = 0; r < 7; r++) {
				for (let c = 0; c < 7; c++) {
					if (shape[r][c]) {
						frame[r][c] = intensity;
					}
				}
			}

			frames.push(frame);
		}
		return frames;
	})();

	const sandTimer: Frame[] = (() => {
		const frames: Frame[] = [];
		const totalFrames = 60;

		for (let f = 0; f < totalFrames; f++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));

			frame[0][2] = 1;
			frame[0][3] = 1;
			frame[0][4] = 1;
			frame[1][2] = 1;
			frame[1][4] = 1;
			frame[5][2] = 1;
			frame[5][4] = 1;
			frame[6][2] = 1;
			frame[6][3] = 1;
			frame[6][4] = 1;

			const progress = f / totalFrames;

			const topSand = Math.floor((1 - progress) * 8);
			for (let i = 0; i < topSand; i++) {
				if (i < 3) frame[1][3] = 1;
				if (i >= 3) frame[2][3] = 1;
			}

			const bottomSand = Math.floor(progress * 8);
			for (let i = 0; i < bottomSand; i++) {
				if (i < 3) frame[5][3] = 1;
				if (i >= 3 && i < 6) frame[4][3] = 1;
				if (i >= 6) frame[3][3] = 0.5;
			}

			frames.push(frame);
		}
		return frames;
	})();

	const spinner: Frame[] = (() => {
		const frames: Frame[] = [];
		const segments = 8;

		for (let f = 0; f < segments; f++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));

			const positions = [
				[1, 3],
				[1, 4],
				[2, 5],
				[3, 5],
				[4, 5],
				[5, 4],
				[5, 3],
				[5, 2],
				[4, 1],
				[3, 1],
				[2, 1],
				[1, 2],
			];

			for (let i = 0; i < 3; i++) {
				const idx = (f + i) % positions.length;
				const [r, c] = positions[idx];
				frame[r][c] = 1 - i * 0.3;
			}

			frames.push(frame);
		}
		return frames;
	})();

	const corners: Frame[] = (() => {
		const frames: Frame[] = [];
		for (let i = 0; i < 16; i++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));
			const progress = i / 16;

			for (let r = 0; r < 7; r++) {
				for (let c = 0; c < 7; c++) {
					const distFromCorner = Math.min(
						Math.sqrt(r * r + c * c),
						Math.sqrt(r * r + (6 - c) * (6 - c)),
						Math.sqrt((6 - r) * (6 - r) + c * c),
						Math.sqrt((6 - r) * (6 - r) + (6 - c) * (6 - c))
					);
					const threshold = progress * 8;
					if (distFromCorner <= threshold) {
						frame[r][c] = Math.max(0, 1 - Math.abs(distFromCorner - threshold));
					}
				}
			}
			frames.push(frame);
		}
		return frames;
	})();

	const sweep: Frame[] = (() => {
		const frames: Frame[] = [];
		for (let i = 0; i < 14; i++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));
			for (let r = 0; r < 7; r++) {
				for (let c = 0; c < 7; c++) {
					if (r + c === i) {
						frame[r][c] = 1;
					} else if (r + c === i - 1) {
						frame[r][c] = 0.5;
					} else if (r + c === i + 1) {
						frame[r][c] = 0.5;
					}
				}
			}
			frames.push(frame);
		}
		return frames;
	})();

	const expand: Frame[] = (() => {
		const frames: Frame[] = [];
		for (let i = 0; i <= 6; i++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));
			for (let r = 3 - i; r <= 3 + i; r++) {
				for (let c = 3 - i; c <= 3 + i; c++) {
					if (r >= 0 && r < 7 && c >= 0 && c < 7) {
						if (r === 3 - i || r === 3 + i || c === 3 - i || c === 3 + i) {
							frame[r][c] = 1;
						}
					}
				}
			}
			frames.push(frame);
		}
		for (let i = 5; i >= 0; i--) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));
			for (let r = 3 - i; r <= 3 + i; r++) {
				for (let c = 3 - i; c <= 3 + i; c++) {
					if (r >= 0 && r < 7 && c >= 0 && c < 7) {
						if (r === 3 - i || r === 3 + i || c === 3 - i || c === 3 + i) {
							frame[r][c] = 1;
						}
					}
				}
			}
			frames.push(frame);
		}
		return frames;
	})();

	const burst: Frame[] = (() => {
		const frames: Frame[] = [];
		for (let f = 0; f < 8; f++) {
			const frame: Frame = Array(7)
				.fill(0)
				.map(() => Array(7).fill(0));

			const intensity = f < 4 ? f / 3 : (7 - f) / 3;

			if (f < 6) {
				for (let r = 0; r < 7; r++) {
					for (let c = 0; c < 7; c++) {
						const distance = Math.sqrt(Math.pow(r - 3, 2) + Math.pow(c - 3, 2));
						if (Math.abs(distance - f * 0.8) < 1.2) {
							frame[r][c] = intensity;
						}
					}
				}
			}

			frames.push(frame);
		}
		return frames;
	})();

	function createUnifiedPattern(frameIndex: number): Frame[] {
		const totalRows = 21;
		const totalCols = 21;
		const pattern: number[][] = [];

		for (let row = 0; row < totalRows; row++) {
			pattern[row] = [];
			for (let col = 0; col < totalCols; col++) {
				const centerX = totalCols / 2;
				const centerY = totalRows / 2;
				const distance = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));
				const wave = Math.sin(distance * 0.5 - frameIndex * 0.2);
				const value = (wave + 1) / 2;
				pattern[row][col] = value;
			}
		}

		const matrices: Frame[] = [];
		for (let matrixRow = 0; matrixRow < 3; matrixRow++) {
			for (let matrixCol = 0; matrixCol < 3; matrixCol++) {
				const matrixFrame: Frame = [];
				for (let row = 0; row < 7; row++) {
					matrixFrame[row] = [];
					for (let col = 0; col < 7; col++) {
						const globalRow = matrixRow * 7 + row;
						const globalCol = matrixCol * 7 + col;
						matrixFrame[row][col] = pattern[globalRow][globalCol];
					}
				}
				matrices.push(matrixFrame);
			}
		}

		return matrices;
	}

	const configurations = [
		{ animation: pulse, fps: 16 },
		{ animation: wave, fps: 20 },
		{ animation: spinner, fps: 10 },
		{ animation: snake, fps: 15 },
		{ animation: heart, fps: 12 },
		{ animation: sandTimer, fps: 12 },
		{ animation: corners, fps: 10 },
		{ animation: sweep, fps: 14 },
		{ animation: expand, fps: 12 },
	];
</script>

<script lang="ts">
	import { Matrix } from "$lib/registry/ui/matrix/index.js";

	type Mode = "individual" | "unified" | "burst";

	let mode = $state<Mode>("individual");
	let unifiedFrame = $state(0);

	// Mode sequencing — timeout chain
	$effect(() => {
		const delays: Record<Mode, number> = {
			individual: 6000,
			unified: 5000,
			burst: 1000,
		};
		const next: Record<Mode, Mode> = {
			individual: "unified",
			unified: "burst",
			burst: "individual",
		};
		const currentMode = mode;
		const timeout = setTimeout(() => {
			mode = next[currentMode];
		}, delays[currentMode]);
		return () => clearTimeout(timeout);
	});

	// Unified mode frame tick
	$effect(() => {
		if (mode !== "unified") return;
		let frame = 0;
		const animate = setInterval(() => {
			frame += 1;
			unifiedFrame = frame;
		}, 50);
		return () => clearInterval(animate);
	});

	const unifiedPatterns = $derived(mode === "unified" ? createUnifiedPattern(unifiedFrame) : []);

	function getPatternForMatrix(index: number): Frame | undefined {
		if (mode === "unified") return unifiedPatterns[index];
		return undefined;
	}

	function getFramesForMatrix(index: number): Frame[] | undefined {
		if (mode === "individual") return configurations[index].animation;
		if (mode === "burst") return burst;
		return undefined;
	}

	function getFps(index: number): number {
		if (mode === "burst") return 30;
		return configurations[index].fps;
	}
</script>

<div class="flex min-h-[600px] w-full flex-col items-center justify-center p-8">
	<div
		class="grid gap-1.5 transition-all duration-1000"
		style="grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, 1fr);"
	>
		{#each [0, 1, 2, 3, 4, 5, 6, 7, 8] as index (index)}
			<div class="flex items-center justify-center transition-all duration-1000">
				<Matrix
					rows={7}
					cols={7}
					frames={getFramesForMatrix(index)}
					pattern={getPatternForMatrix(index)}
					fps={getFps(index)}
					size={10}
					gap={2}
					ariaLabel={`Matrix ${index + 1}`}
				/>
			</div>
		{/each}
	</div>
</div>
