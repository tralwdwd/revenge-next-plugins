import { proxify } from "@revenge-mod/utils/proxy";
import type { ProxifyOptions } from "@revenge-mod/utils/proxy";

export function lazy<T>(factory: () => T, options?: ProxifyOptions): T {
    let result: T;
    let accessed = false;

    return proxify(() => {
        if (!accessed) {
            result = factory();
            accessed = true;
        }
        return result;
    }, options) as T;
}
