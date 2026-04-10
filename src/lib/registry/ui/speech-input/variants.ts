import { tv } from "tailwind-variants";

/**
 * Size variants for the speech-input record + cancel buttons. Both buttons
 * read `state.size` from context and apply the same sizing so the compound
 * component looks consistent regardless of which children the user renders.
 */
export const buttonSizeVariants = tv({
	base: "!px-0",
	variants: {
		size: {
			default: "h-9 w-9",
			sm: "h-8 w-8",
			lg: "h-10 w-10",
		},
	},
	defaultVariants: {
		size: "default",
	},
});
