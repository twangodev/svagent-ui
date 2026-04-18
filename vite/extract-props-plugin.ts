/**
 * Vite plugin: invalidates the component-props extractor cache when a
 * source file that feeds it changes during dev, then triggers a full
 * reload so the docs preprocessor runs again with fresh data.
 *
 * The extractor itself (`scripts/extract-props.js`) is shared with
 * `svelte.config.js` and lazy-memoizes internally, so this plugin only
 * handles invalidation + reload, not the extraction work.
 */
import { normalizePath, type Plugin } from "vite";

import { invalidatePropsCache } from "../scripts/extract-props.js";

export function extractPropsPlugin(): Plugin {
	return {
		name: "extract-component-props",
		apply: "serve",
		configureServer(server) {
			const shouldInvalidate = (filePath: string) => {
				const p = normalizePath(filePath);
				// Component sources feed the extractor; doc files enumerate which
				// components appear in the index (see listComponentNames).
				return (
					/\/src\/lib\/registry\/ui\/[^/]+\/[^/]+\.svelte$/.test(p) ||
					/\/content\/components\/[^/]+\.md$/.test(p)
				);
			};
			const handle = (filePath: string) => {
				if (!shouldInvalidate(filePath)) return;
				invalidatePropsCache();
				server.ws.send({ type: "full-reload" });
			};
			server.watcher.on("add", handle);
			server.watcher.on("change", handle);
			server.watcher.on("unlink", handle);
		},
	};
}
