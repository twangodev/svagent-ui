import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import { extractPropsPlugin } from "./vite/extract-props-plugin.js";
import { shadcnRegistryPlugin } from "./vite/shadcn-registry-plugin.js";
import { waveformsPlugin } from "./vite/waveforms-plugin.js";

export default defineConfig({
	plugins: [
		shadcnRegistryPlugin(),
		waveformsPlugin(),
		extractPropsPlugin(),
		tailwindcss(),
		sveltekit(),
		devtoolsJson(),
	],
	server: {
		fs: {
			allow: ["content", ".velite"],
		},
	},
});
