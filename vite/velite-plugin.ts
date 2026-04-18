import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "velite";
import { normalizePath, type Plugin } from "vite";

const CONTENT_DIR = normalizePath(
	path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content")
);
const CONTENT_EXT = /\.(md|mdx|ya?ml|json)$/i;

export function velitePlugin(): Plugin {
	// SvelteKit fires buildStart twice (client + SSR). Share one run.
	let pending: Promise<unknown> | null = null;
	return {
		name: "velite",
		enforce: "pre",
		async buildStart() {
			pending ??= build().catch((err) => {
				pending = null;
				throw err;
			});
			await pending;
		},
		configureServer(server) {
			// Serialize rebuilds: velite writes to .velite/, so overlapping runs
			// could corrupt output. Coalesce in-flight changes into a single rerun.
			let running: Promise<void> | null = null;
			let pendingRerun = false;
			const rebuild = (p: string) => {
				const n = normalizePath(p);
				if (n !== CONTENT_DIR && !n.startsWith(CONTENT_DIR + "/")) return;
				if (!CONTENT_EXT.test(n)) return;
				if (running) {
					pendingRerun = true;
					return;
				}
				running = (async () => {
					do {
						pendingRerun = false;
						try {
							await build();
							server.ws.send({ type: "full-reload" });
						} catch (err) {
							server.config.logger.error(
								`[velite] ${err instanceof Error ? err.message : String(err)}`
							);
						}
					} while (pendingRerun);
				})().finally(() => {
					running = null;
				});
			};
			server.watcher.on("add", rebuild);
			server.watcher.on("change", rebuild);
			server.watcher.on("unlink", rebuild);
		},
	};
}
