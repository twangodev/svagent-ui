/**
 * Vite plugin: runs `shadcn-svelte registry build` on every build so
 * `static/r/*.json` exists before `adapter-static` copies `static/` into
 * the output.
 */
import { spawn } from "node:child_process";
import { type Plugin } from "vite";

export function shadcnRegistryPlugin(): Plugin {
	// SvelteKit drives client + SSR builds in the same Vite run, so buildStart
	// fires twice per `pnpm build`. Share a single Promise so the second call
	// awaits the first spawn instead of returning early while the CLI is still
	// writing `static/r/*.json`.
	let pending: Promise<void> | null = null;
	const runCli = () =>
		new Promise<void>((resolve, reject) => {
			const child = spawn("pnpm", ["shadcn-svelte", "registry", "build"], {
				stdio: "inherit",
				shell: true,
			});
			child.on("error", (err) => {
				reject(new Error(`failed to spawn shadcn-svelte: ${err.message}`));
			});
			child.on("exit", (code, signal) => {
				if (code === 0) resolve();
				else if (signal) reject(new Error(`shadcn-svelte registry build killed by ${signal}`));
				else reject(new Error(`shadcn-svelte registry build exited with code ${code}`));
			});
		});
	return {
		name: "shadcn-registry-build",
		// Force this plugin's buildStart to run before SvelteKit's so the
		// registry JSON exists in `static/r/` before adapter-static copies
		// `static/` into the build output.
		enforce: "pre",
		async buildStart() {
			pending ??= runCli();
			await pending;
		},
	};
}
