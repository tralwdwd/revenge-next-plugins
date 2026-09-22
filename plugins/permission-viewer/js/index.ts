import { patchActionSheet } from "./patches/actionsheet";

export default plugin({
    start(api) {
        patchActionSheet(api);
    },
});