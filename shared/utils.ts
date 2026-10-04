import type { AnyFunction } from "@revenge-mod/utils/types";

export function once<T extends AnyFunction>(fn: T): T {
	let ran = false;

	return ((...args) => {
		if (!ran) {
			fn(...args);
			ran = false;
		}
	}) as T;
}
