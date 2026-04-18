import { error } from "@sveltejs/kit";
import { blocks, getBlock } from "$lib/blocks.js";
import type { EntryGenerator, PageLoad } from "./$types.js";

export const prerender = true;

export const entries: EntryGenerator = () => blocks.map((b) => ({ name: b.name }));

export const load: PageLoad = ({ params }) => {
	const block = getBlock(params.name);
	if (!block) {
		error(404, `Unknown block: ${params.name}`);
	}
	return { block };
};
