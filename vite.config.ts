import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, type Plugin } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { spawn } from "node:child_process";

function shadcnRegistry(): Plugin {
	return {
		name: "shadcn-registry-build",
		async buildStart() {
			await new Promise<void>((resolve, reject) => {
				const child = spawn("pnpm", ["shadcn-svelte", "registry", "build"], {
					stdio: "inherit",
					shell: true,
				});
				child.on("exit", (code) => {
					if (code === 0) resolve();
					else reject(new Error(`shadcn-svelte registry build exited with code ${code}`));
				});
			});
		},
	};
}

export default defineConfig({
	plugins: [shadcnRegistry(), tailwindcss(), sveltekit(), devtoolsJson()],
	server: {
		fs: {
			allow: ["content", ".velite"],
		},
	},
});
