import { getDoc } from "$lib/docs.js";
import type { PageLoad } from "./$types.js";

export const prerender = true;

export const load: PageLoad = async () => {
	const doc = await getDoc("changelog");
	return { ...doc };
};
