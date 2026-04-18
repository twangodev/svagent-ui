import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "velite";
import { normalizePath, type Plugin } from "vite";

const CONTENT_DIR = normalizePath(
	path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "content")
);

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
			let timer: NodeJS.Timeout | null = null;
			const rebuild = (p: string) => {
				const n = normalizePath(p);
				if (n !== CONTENT_DIR && !n.startsWith(CONTENT_DIR + "/")) return;
				if (timer) clearTimeout(timer);
				timer = setTimeout(async () => {
					try {
						await build();
						server.ws.send({ type: "full-reload" });
					} catch (err) {
						server.config.logger.error(
							`[velite] ${err instanceof Error ? err.message : String(err)}`
						);
					}
				}, 50);
			};
			server.watcher.on("add", rebuild);
			server.watcher.on("change", rebuild);
			server.watcher.on("unlink", rebuild);
		},
	};
}
