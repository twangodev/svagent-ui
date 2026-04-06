/**
 * Returns a debounced value that updates after the specified delay.
 */
export function useDebounce<T>(getValue: () => T, delay: number): { readonly current: T } {
	let debounced = $state<T>(getValue());

	$effect(() => {
		const value = getValue();
		const handler = setTimeout(() => {
			debounced = value;
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	});

	return {
		get current() {
			return debounced;
		},
	};
}
