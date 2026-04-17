---
title: Transcript Viewer
description: Synchronized transcript with audio playback. Highlights each word as it's spoken, supports seeking via scrub bar, and exposes a compound-component API with provider-agnostic character-alignment data.
component: true
links:
  source: https://github.com/twangodev/svagent-ui/tree/main/src/lib/registry/ui/transcript-viewer
---

<ComponentPreview name="transcript-viewer-demo" />

## Installation

<Install component="transcript-viewer" />

## Usage

<Usage component="transcript-viewer" />

```svelte
<script lang="ts">
	import {
		TranscriptViewer,
		TranscriptViewerAudio,
		TranscriptViewerWords,
		TranscriptViewerPlayPauseButton,
		TranscriptViewerScrubBar,
	} from "$lib/registry/ui/transcript-viewer";
	import type { CharacterAlignment } from "$lib/registry/ui/transcript-viewer";

	let {
		audioSrc,
		alignment,
	}: {
		audioSrc: string;
		alignment: CharacterAlignment;
	} = $props();
</script>

<TranscriptViewer {audioSrc} {alignment}>
	<TranscriptViewerAudio />
	<TranscriptViewerWords />
	<div class="flex items-center gap-3">
		<TranscriptViewerPlayPauseButton />
		<TranscriptViewerScrubBar />
	</div>
</TranscriptViewer>
```

## Examples

### Custom Audio Type

Pass `audioType` when the source is not MP3 so the browser picks the right decoder.

```svelte
<TranscriptViewer {audioSrc} {alignment} audioType="audio/wav">
	<TranscriptViewerAudio />
	<TranscriptViewerWords />
	<TranscriptViewerScrubBar />
</TranscriptViewer>
```

### Custom Word and Gap Rendering

`TranscriptViewerWords` accepts `renderWord` and `renderGap` snippets for per-segment overrides. Each receives the segment and its `status` — `"spoken"`, `"current"`, or `"unspoken"`.

```svelte
<script lang="ts">
	import {
		TranscriptViewer,
		TranscriptViewerAudio,
		TranscriptViewerWords,
		TranscriptViewerScrubBar,
	} from "$lib/registry/ui/transcript-viewer";
	import type { CharacterAlignment } from "$lib/registry/ui/transcript-viewer";

	let {
		audioSrc,
		alignment,
	}: {
		audioSrc: string;
		alignment: CharacterAlignment;
	} = $props();
</script>

<TranscriptViewer {audioSrc} {alignment}>
	<TranscriptViewerAudio />
	<TranscriptViewerWords>
		{#snippet renderWord({ word, status })}
			<span
				class:font-semibold={status === "current"}
				class:text-primary={status === "spoken"}
				class:text-muted-foreground={status === "unspoken"}
			>
				{word.text}
			</span>
		{/snippet}
	</TranscriptViewerWords>
	<TranscriptViewerScrubBar />
</TranscriptViewer>
```

### Playback Callbacks

The root forwards the underlying `<audio>` lifecycle via `onPlay`, `onPause`, `onTimeUpdate`, `onEnded`, and `onDurationChange` — useful for analytics or syncing external state.

```svelte
<script lang="ts">
	import {
		TranscriptViewer,
		TranscriptViewerAudio,
		TranscriptViewerWords,
		TranscriptViewerScrubBar,
	} from "$lib/registry/ui/transcript-viewer";
	import type { CharacterAlignment } from "$lib/registry/ui/transcript-viewer";

	let {
		audioSrc,
		alignment,
	}: {
		audioSrc: string;
		alignment: CharacterAlignment;
	} = $props();

	let currentTime = $state(0);
</script>

<TranscriptViewer
	{audioSrc}
	{alignment}
	onPlay={() => console.log("Playing")}
	onPause={() => console.log("Paused")}
	onTimeUpdate={(t) => (currentTime = t)}
	onEnded={() => console.log("Ended")}
>
	<TranscriptViewerAudio />
	<TranscriptViewerWords />
	<TranscriptViewerScrubBar />
</TranscriptViewer>
```

### Custom Play/Pause Button

`TranscriptViewerPlayPauseButton` accepts a children snippet that receives `{ isPlaying }`, so you can render your own label and icons while keeping the shared click behavior.

```svelte
<script lang="ts">
	import PauseIcon from "@lucide/svelte/icons/pause";
	import PlayIcon from "@lucide/svelte/icons/play";
	import {
		TranscriptViewer,
		TranscriptViewerAudio,
		TranscriptViewerPlayPauseButton,
		TranscriptViewerWords,
	} from "$lib/registry/ui/transcript-viewer";
	import type { CharacterAlignment } from "$lib/registry/ui/transcript-viewer";

	let {
		audioSrc,
		alignment,
	}: {
		audioSrc: string;
		alignment: CharacterAlignment;
	} = $props();
</script>

<TranscriptViewer {audioSrc} {alignment}>
	<TranscriptViewerAudio />
	<TranscriptViewerWords />
	<TranscriptViewerPlayPauseButton>
		{#snippet children({ isPlaying })}
			{#if isPlaying}
				<PauseIcon class="size-4" /> Pause
			{:else}
				<PlayIcon class="size-4" /> Play
			{/if}
		{/snippet}
	</TranscriptViewerPlayPauseButton>
</TranscriptViewer>
```

### Accessing Viewer State

`useTranscriptViewer()` returns the shared reactive state inside any descendant — useful for custom transport UI that needs to observe `currentWord`, `currentTime`, `isPlaying`, or jump to a specific word via `seekToWord`.

```svelte
<script lang="ts">
	import { useTranscriptViewer } from "$lib/registry/ui/transcript-viewer";

	const state = useTranscriptViewer();
</script>

<div>
	Current word: {state.currentWord?.text ?? "—"}
	<button onclick={() => state.seekToWord(0)}>Restart transcript</button>
</div>
```

## API Reference

### `TranscriptViewer` (root)

<ComponentAPI component="transcript-viewer" />

Each row below also accepts the standard `HTMLAttributes` for its host element (e.g. `class`, `style`, `data-*`, event handlers) unless otherwise noted.

### `TranscriptViewerAudio`

Renders the underlying `<audio>` element driven by the root's state. Extends `Omit<HTMLAudioAttributes, "src" | "children">` — `src` comes from the root's `audioSrc`.

| Prop   | Type                       | Default | Description                                             |
| ------ | -------------------------- | ------- | ------------------------------------------------------- |
| `ref?` | `HTMLAudioElement \| null` | `null`  | Bindable reference to the underlying `<audio>` element. |

### `TranscriptViewerWords`

Renders the word/gap segments. Extends `HTMLAttributes<HTMLDivElement>`.

| Prop              | Type                                                                      | Default | Description                                                                 |
| ----------------- | ------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------- |
| `renderWord?`     | `Snippet<[{ word: TranscriptWord; status: TranscriptViewerWordStatus }]>` | —       | Custom snippet for a single word. Receives the word and its current status. |
| `renderGap?`      | `Snippet<[{ segment: GapSegment; status: TranscriptViewerWordStatus }]>`  | —       | Custom snippet for inter-word gaps.                                         |
| `wordClassNames?` | `string`                                                                  | —       | Extra classes applied to each word span.                                    |
| `gapClassNames?`  | `string`                                                                  | —       | Extra classes applied to each gap span.                                     |

### `TranscriptViewerWord`

The span rendered per word when no custom `renderWord` is supplied. Extends `Omit<HTMLAttributes<HTMLSpanElement>, "children">`.

| Prop        | Type                         | Default | Description                                   |
| ----------- | ---------------------------- | ------- | --------------------------------------------- |
| `word`      | `TranscriptWord`             | —       | The word segment to render.                   |
| `status`    | `TranscriptViewerWordStatus` | —       | One of `"spoken"`, `"current"`, `"unspoken"`. |
| `children?` | `Snippet`                    | —       | Override the default text with custom markup. |

### `TranscriptViewerPlayPauseButton`

Play/pause toggle wired to the root's `isPlaying` state. Extends `Omit<ButtonProps, "children">`, so it inherits `variant`, `size`, etc. from the button primitive.

| Prop        | Type                                | Default | Description                                                               |
| ----------- | ----------------------------------- | ------- | ------------------------------------------------------------------------- |
| `children?` | `Snippet<[{ isPlaying: boolean }]>` | —       | Override the default play/pause icon. Receives the live `isPlaying` flag. |

### `TranscriptViewerScrubBar`

Time-aware scrub bar composed over the standalone `ScrubBar` primitive. Extends `Omit<HTMLAttributes<HTMLDivElement>, "children">`.

| Prop                 | Type      | Default | Description                                       |
| -------------------- | --------- | ------- | ------------------------------------------------- |
| `showTimeLabels?`    | `boolean` | `true`  | Render the leading/trailing time labels.          |
| `labelsClassName?`   | `string`  | —       | Classes forwarded to the time-label row.          |
| `trackClassName?`    | `string`  | —       | Classes forwarded to the inner `ScrubBarTrack`.   |
| `progressClassName?` | `string`  | —       | Classes forwarded to the `ScrubBarProgress` fill. |
| `thumbClassName?`    | `string`  | —       | Classes forwarded to the `ScrubBarThumb`.         |

## Notes

- `alignment` shape mirrors ElevenLabs' `CharacterAlignmentResponseModel` — three parallel arrays (`characters`, `characterStartTimesSeconds`, `characterEndTimesSeconds`) indexed per character. Reshape data from other providers (OpenAI, Deepgram, custom) to the same structure.
- The root composes character alignment into word and gap segments internally via `composeSegments`, or a custom `segmentComposer` when provided. Recomposition runs whenever `alignment` changes.
- When `hideAudioTags` is `true` (default), anything inside `[...]` brackets — e.g. ElevenLabs' `[excited]` style tags — is stripped from the rendered transcript.
- The audio element is owned by `TranscriptViewerAudio`. The root wires up `play`, `pause`, `timeupdate`, `seeked`, `durationchange`, and `loadedmetadata` listeners plus a `requestAnimationFrame` loop to drive `currentTime` and the active word index.
- The active-word walk is incremental: normal playback advances via a forward scan, and seeks fall back to a binary search over the word list.
- `TranscriptViewerScrubBar` composes the standalone `ScrubBar` primitive with time labels and suspends `timeupdate`-driven UI updates while the user is scrubbing so the thumb doesn't fight the pointer.
- Words take one of three statuses — `"spoken"`, `"current"`, `"unspoken"` — which you can target via the built-in Tailwind classes on `TranscriptViewerWord` or render yourself through `renderWord` / `renderGap` snippets.
