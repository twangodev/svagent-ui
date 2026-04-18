import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { type Plugin } from "vite";

const run = promisify(execFile);

export function changelogPlugin(): Plugin {
	// configResolved (not buildStart): buildStart runs concurrently across
	// plugins, so can't serialize ahead of velitePlugin's scan.
	let pending: Promise<unknown> | null = null;
	return {
		name: "changelog",
		enforce: "pre",
		async configResolved() {
			pending ??= run("pnpm", [
				"exec",
				"git-cliff",
				"--config",
				"cliff.toml",
				"--output",
				"content/changelog.md",
			]).catch((err) => {
				pending = null;
				throw err;
			});
			await pending;
		},
	};
}
